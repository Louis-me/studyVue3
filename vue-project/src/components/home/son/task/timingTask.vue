<template>
    <el-breadcrumb>
      <el-breadcrumb-item>任务管理</el-breadcrumb-item>
      <el-breadcrumb-item>定时任务</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card" style="margin-top: 10px">
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容" v-model="queryFormR.query">
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="getTimingTasks">查询</el-button>
          <el-button type="primary" @click="timingReset">重置</el-button>
          <el-button type="primary" @click="showAddServerDialog = true">添加</el-button>
  
        <timingAdd :show="showAddServerDialog" @set-show="setShow" @get-timing-task="getTimingTasks" />
        </el-col>
      </el-row>
      <el-table :data="timingListR.list" style="width: 100%">
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
      
      <el-pagination @size-change="timingChangeSize" @current-change="timingChangeNum" :current-page="pageTimingR.pagenum"
        :page-sizes="[5, 10, 15, 20]" :page-size="pageTimingR.pagesize" layout="total, sizes, prev, pager, next, jumper"
        :total="timingListR.total">
      </el-pagination>
    </el-card>
  </template>
  
  <script lang="ts" setup>
    
    import { ref, onMounted, reactive } from "vue";
    import { useRouter } from 'vue-router';
    const router = useRouter();


      // 引入子组件
    import timingAdd from "./timing-add.vue";
  
  // 引用请求
  import { TimingTasksGet,TimingTaskDelPost} from "../../../../utils/html.js";
  import { ElMessage, ElMessageBox } from "element-plus";
  // 查询条件
  const queryFormR = reactive({
    query: "",
  });
  //分页
  const pageTimingR = reactive({
    pagesize: 10,
    pagenum: 1, //当前页码
    query: "",
  });
  // 列表
  const timingListR = reactive({
    list: [],
    total: 0, //列表数据总数
  });
  const timingChangeSize = (newSize) => {
    pageTimingR.pagesize = newSize;
  }
  const timingChangeNum = (newPage) => {
    pageTimingR.pagenum = newPage;
    getTimingTasks();
  };
  
  const timingReset = () => {
    queryFormR.query = "";
  };
  
  // 处理子组件传回的参数-新增弹框
  let showAddServerDialog = ref(false);
  function setShow(val) {
    showAddServerDialog.value = val;
  }

  
  // 点击编辑
  function detail(row) {
    router.push('/TimingTaskView/'+row.id);

  }
  // 列表
  function getTimingTasks() {
    TimingTasksGet({
      query: queryFormR.query,
      pagesize: pageTimingR.pagesize,
      pagenum: pageTimingR.pagenum,
    }).then((res) => {
      if (res["data"]["code"] == 1) {
        timingListR.list = res["data"]["data"]["list"];
        timingListR.total = res["data"]["data"]["total_count"];
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
        TimingTaskDelPost({ id: row.id }).then((res) => {
          if (res["data"]["code"] == 1) {
            ElMessage({message: "删除成功",type: "success",});
            getTimingTasks();
          } else {
            ElMessage({message: res.data.msg,type: "error",});
          }
        });
      })
      .catch(() => {
        ElMessage({type: "info",message: "Delete canceled"});});
  };
  
  onMounted(() => {
    getTimingTasks();
  });
  </script>
  <style scoped>
  </style>
  