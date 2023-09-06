<template>
  <el-breadcrumb>
    <el-breadcrumb-item>任务管理</el-breadcrumb-item>
    <el-breadcrumb-item :to="{ path: '/RealTimeTask' }">实时任务</el-breadcrumb-item>
    <el-breadcrumb-item>详情</el-breadcrumb-item>
  </el-breadcrumb>
  <el-card class="box-card" style="margin-top: 10px">
    <el-table :data="rtTimeListR.list" style="width: 100%">
      <el-table-column type="expand">
        <template #default="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-row>
              <el-col >
                <el-form-item label="用例名称:" style="width:600px">
                  <div>{{ props.row.name }}</div>
                </el-form-item>
              </el-col>
              <el-col>
                <el-form-item label="请求方法:">
                  <span>{{ props.row.method }}</span>
                </el-form-item>
              </el-col>

              <el-col>
                <el-form-item label="入参:">
                  <div>
                    <json-viewer :value="props.row.params" style="width: 500px"></json-viewer>
                  </div>
                </el-form-item>
              </el-col>
              <el-col>
                <el-form-item label="期望结果:">
                  <span>{{ props.row.hope }}</span>
                </el-form-item>
              </el-col>
              <el-col>
                <el-form-item label="实际结果" style="width: 500px">
                  <div>响应结果:{{ props.row.fact.status_code }}</div>
                  <div>
                    <json-viewer :value="JSON.parse(props.row.fact.text)" style="width: 500px"
                      :expand-depth=5></json-viewer>

                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="url:">
                  <span>{{ props.row.url }}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="序号" width="80px">
        <template v-slot="{ row, $index }">
          <span>{{ $index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="用例名称" width="300" />
      <el-table-column prop="result" label="是否通过" width="100" />
      <el-table-column prop="sum_time" label="耗时" width="100" />
    </el-table>

  </el-card>
</template>
  
<script lang="ts" setup>
// 引入子组件
import { ref, onMounted, reactive } from "vue";
// 引用请求
import { RealTimesDetail } from "../../../../utils/html.js";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter, useRoute } from 'vue-router'
import 'vue-json-viewer/style.css'

const route = useRoute()
// 接受其他路由（realTime）传送的参数
const queryParam = reactive({
  "id": route.params.id
})

// 列表
const rtTimeListR = reactive({ "list": [] });
function getRealTime() {
  RealTimesDetail(queryParam).then((res) => {
    if (res["data"]["code"] == 1) {
      rtTimeListR.list = res["data"]["data"]

    } else {
      ElMessage({
        message: res.data.msg,
        type: "error",
      });
    }
  });
}

onMounted(() => {
  getRealTime();
});
</script>
<style scoped>
.demo-table-expand {
  font-size: 0;
}

.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}

.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 20%;
}
</style>
  