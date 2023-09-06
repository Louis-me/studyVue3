<template>
    <el-breadcrumb>
      <el-breadcrumb-item>任务管理</el-breadcrumb-item>
      <el-breadcrumb-item>实时任务</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card" style="margin-top: 10px">
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容" v-model="queryFormR.query">
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="getRealTimes">查询</el-button>
          <el-button type="primary" @click="realTimeReset">重置</el-button>
          <el-button type="primary" @click="showAddServerDialog = true">添加</el-button>
  
        <realTimeAdd :show="showAddServerDialog" @set-show="setShow" @get-realtime-task="getRealTimes"></realTimeAdd>
        </el-col>
      </el-row>
      <el-table :data="RealTimeListR.list" style="width: 100%">
        <el-table-column label="序号" width="80px">
          <template v-slot="{ row, $index }">
            <span>{{ $index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="任务名称" width="120" />
        <el-table-column prop="suite_name" label="关联套件" width="120" />
        <el-table-column prop="task_state_name" label="任务状态" width="120" />
        <el-table-column label="用例通过" prop="sum_pass"></el-table-column>
        <el-table-column label="用例失败" prop="sum_fail"></el-table-column>
        <el-table-column label="耗时" prop="sum_time"></el-table-column>

        <el-table-column fixed="right" label="操作" width="300">
          <template #default="{ row }">
            <el-row :gutter="21">
              <el-col :span="3">
                <el-button link type="primary" size="small" @click="detail(row);">详情</el-button>
              </el-col>
              <el-col :span="3">
                <el-button link type="primary" size="small" @click="delEvent(row)" >删除</el-button>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
      
      <el-pagination @size-change="realTimeChangeSize" @current-change="realTimeChangeNum" :current-page="PageCaseR.pagenum"
        :page-sizes="[5, 10, 15, 20]" :page-size="PageCaseR.pagesize" layout="total, sizes, prev, pager, next, jumper"
        :total="RealTimeListR.total">
      </el-pagination>
    </el-card>
  </template>
  
  <script lang="ts" setup>
    
    import { ref, onMounted, reactive } from "vue";
    import { useRouter } from 'vue-router';
    const router = useRouter();


      // 引入子组件
    import realTimeAdd from "./realTime-add.vue";
  
  // 引用请求
  import { RealTimesGet,RealTimeDelPost} from "../../../../utils/html.js";
  import { ElMessage, ElMessageBox } from "element-plus";
  // 查询条件
  const queryFormR = reactive({
    query: "",
  });
  //分页
  const PageCaseR = reactive({
    pagesize: 10,
    pagenum: 1, //当前页码
    query: "",
  });
  // 列表
  const RealTimeListR = reactive({
    list: [],
    total: 0, //列表数据总数
  });
  const realTimeChangeSize = (newSize) => {
    PageCaseR.pagesize = newSize;
  }
  const realTimeChangeNum = (newPage) => {
    PageCaseR.pagenum = newPage;
    getRealTimes();
  };
  
  const realTimeReset = () => {
    queryFormR.query = "";
  };
  
  // 处理子组件传回的参数-新增弹框
  let showAddServerDialog = ref(false);
  function setShow(val) {
    showAddServerDialog.value = val;
  }

  
  // 点击编辑
  function detail(row) {
    router.push('/RealtimeView/'+row.id);

  }
  // 列表
  function getRealTimes() {
    RealTimesGet({
      query: queryFormR.query,
      pagesize: PageCaseR.pagesize,
      pagenum: PageCaseR.pagenum,
    }).then((res) => {
      if (res["data"]["code"] == 1) {
        RealTimeListR.list = res["data"]["data"]["list"];
        RealTimeListR.total = res["data"]["data"]["total_count"];
      } else {
        ElMessage({message: res.data.msg,type: "error" });
      }
    });
  }
  // 确定删除
  const delEvent = (row) => {
    ElMessageBox.confirm("确定需要删除吗?", "注意", {
      confirmButtonText: "OK",cancelButtonText: "Cancel",type: "warning",
    })
      .then(() => {
        RealTimeDelPost({ id: row.id }).then((res) => {
          if (res["data"]["code"] == 1) {
            ElMessage({message: "删除成功",type: "success",});
            getRealTimes();
          } else {
            ElMessage({message: res.data.msg,type: "error",});
          }
        });
      })
      .catch(() => {
        ElMessage({type: "info",message: "Delete canceled"});});
  };
  
  onMounted(() => {
    getRealTimes();
  });
  </script>
  <style scoped>
  </style>
  