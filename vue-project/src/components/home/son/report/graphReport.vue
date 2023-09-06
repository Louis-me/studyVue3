<template>
  <el-breadcrumb>
    <el-breadcrumb-item>报告管理</el-breadcrumb-item>
    <el-breadcrumb-item>报告列表</el-breadcrumb-item>
  </el-breadcrumb>
  <el-card class="box-card" style="margin-top: 10px">
    <div id="echarts-module" style="min-height:400px;"></div>
    <div id="ec-repor-task" style="min-height:400px;"></div>
    <div id="echarts_top_10_slow">
      <el-row>

        <el-col style="padding:10px">
          响应时间最慢的top10
          <el-button type="primary" @click="reportExport()">导出</el-button>
        </el-col>
      </el-row>
      <el-table :data="top10ListR.list">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="用例名词" prop="name"></el-table-column>
        <el-table-column label="结果" prop="result"></el-table-column>
        <el-table-column label="耗时" prop="sum_time"></el-table-column>
      </el-table>
    </div>
  </el-card>
</template>
  
<script lang="ts" setup>
import * as echarts from 'echarts'
import { onMounted, reactive } from "vue";
// 引用请求
import { GrapReportModuleCase, GraptReportTask, GraptTop10Show, GraptTop10ShowExport } from "../../../../utils/html.js";
import { ElMessage, ElMessageBox } from "element-plus";

// 列表
const top10ListR = reactive({
  list: [],
});

const top10SlowListEvent = () => {
  GraptTop10Show({}).then((res) => {
    if (res["data"]["code"] == 1) {
      top10ListR.list = res.data.data

    } else {
      ElMessage({ message: res.data.msg, type: "error" });
    }
  })
}
const dataURLtoBlob = (encoded) => {
  const dataBlob = new Blob([encoded]);
  return window.URL.createObjectURL(dataBlob);
}


const reportExport = () => {
  GraptTop10ShowExport().then((res) => {
    console.log(res)
    if (res.statusText == "OK") {
      let downloadURL = dataURLtoBlob(res.data)
      let anchor = document.createElement("a")
      //下载时显示的文件名（自定义）
      anchor.download = 'top10最慢接口.xlsx'
      anchor.href = downloadURL
      anchor.click()
    } else {
      ElMessage({ message: "下载失败", type: "error" });
    }

  })
}

const moduleCase = () => {
  GrapReportModuleCase({}).then((res) => {
    if (res["data"]["code"] == 1) {
      let myChart = echarts.init(document.getElementById("echarts-module"));
      myChart.setOption({
        title: {
          text: res["data"]["data"]["title"]["text"]
        },
        tooltip: {},
        xAxis: {
          data: res["data"]["data"]["xAxis"]["data"],

        },
        yAxis: {},
        series: [
          {
            name: res["data"]["data"]["series"].name,
            type: res["data"]["data"]["series"].type,
            data: res["data"]["data"]["series"]["data"],
            barWidth: 30,
          }
        ]
      });

    } else {
      // ElMessage({message: res.data.msg,type: "error" });
      console.log("GrapReportModuleCase无数据")
    }
  });
};

const reporTask = () => {
  GraptReportTask().then((res) => {
    if (res["data"]["code"] == 1) {
      let myChart = echarts.init(document.getElementById("ec-repor-task"));
      myChart.setOption({
        title: {
          text: "任务执行统计",
        },
        xAxis: {
          data: res.data.data.xAxis_data,
          boundaryGap: true,
          axisLabel: {
            rotate: 20,
            color: '#333',
          }
        },
        yAxis: {},
        tooltip: { "show": true },
        legend: {
          data: ['成功', '失败'],
        },
        series: [
          {
            data: res.data.data.sum_pass,
            type: 'bar',
            barWidth: 30,
            name: '成功',
            stack: 'x',
            label: {
              show: true,
              position: 'inside',
              color: 'black',
              formatter: function (params) {
                return params.value
              }
            }
          },
          {
            color: "red",
            name: '失败',
            data: res.data.data.sum_fail,
            type: 'bar',
            stack: 'x',
            label: {
              show: true,
              position: 'inside',
              color: 'black',
              formatter: function (params) {
                return params.value
              }

            }
          },

        ]
      });

    } else {
      console.log("GraptReportTask无数据")
    }

  })
}
onMounted(() => {
  moduleCase()
  reporTask()
  top10SlowListEvent()
});
</script>
<style scoped></style>
  