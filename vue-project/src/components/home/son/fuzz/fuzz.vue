<template>
    <el-breadcrumb>
      <el-breadcrumb-item>用例管理</el-breadcrumb-item>
      <el-breadcrumb-item>模糊用例规则</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card" style="margin-top: 10px">
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容" v-model="queryFormR.query">
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="getFuzzs">查询</el-button>
          <el-button type="primary" @click="fuzzReset">重置</el-button>
          <el-button type="primary" @click="showAddServerDialog = true">添加</el-button>
  
          <!-- <caseAdd :show="showAddServerDialog" @set-show="setShow" @get-case="getCases">
          </caseAdd> -->
          <fuzzAdd :show="showAddServerDialog" @set-show="setShow" @get-fuzz="getFuzzs">

          </fuzzAdd>
        </el-col>
      </el-row>
      <el-table :data="FuzzListR.list" style="width: 100%">
        <el-table-column label="序号" width="80px">
          <template v-slot="{ row, $index }">
            <span>{{ $index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="规则名称" width="120" />
        <el-table-column prop="fuzz_content" label="规则内容" width="300" />
        <el-table-column fixed="right" label="操作" width="300">
          <template #default="{ row }">
            <el-row :gutter="21">
              <el-col :span="3">
                <el-button link type="primary" size="small" @click="edit(row);" :disabled="row.fuzz_type != 0">编辑</el-button>
              </el-col>
              <el-col :span="3">
                <el-button link type="primary" size="small" @click="delEvent(row)" :disabled="row.fuzz_type != 0">删除</el-button>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
      <fuzzEdit :showEdit="showEditServerDialog" @set-edit-show="setEditShow" ref="editDialog" @get-fuzz="getFuzzs" />
      
      <el-pagination @size-change="fuzzChangeSize" @current-change="fuzzChangeNum" :current-page="PageCaseR.pagenum"
        :page-sizes="[5, 10, 15, 20]" :page-size="PageCaseR.pagesize" layout="total, sizes, prev, pager, next, jumper"
        :total="FuzzListR.total">
      </el-pagination>
    </el-card>
  </template>
  
  <script lang="ts" setup>
    
    import { ref, onMounted, reactive } from "vue";
      // 引入子组件
    import fuzzAdd from "./fuzz-add.vue";
    import fuzzEdit from "./fuzz-edit.vue";
  
  // 引用请求
  import { FuzzsGet, FuzzDelPost } from "../../../../utils/html.js";
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
  const FuzzListR = reactive({
    list: [],
    total: 0, //列表数据总数
  });
  const fuzzChangeSize = (newSize) => {
    PageCaseR.pagesize = newSize;
    getFuzzs();
  };
  
  const fuzzChangeNum = (newPage) => {
    PageCaseR.pagenum = newPage;
    getFuzzs();
  };
  
  const fuzzReset = () => {
    queryFormR.query = "";
  };
  
  // 处理子组件传回的参数-新增弹框
  let showAddServerDialog = ref(false);
  function setShow(val) {
    showAddServerDialog.value = val;
  }
  // 处理子组件传回的参数-编辑弹框, 子组件调用这里控制弹框
  let showEditServerDialog = ref(false);
  function setEditShow(val) {
    showEditServerDialog.value = val;
  }
  
  //这了的变量名称必须和EditOrder的ref值一样
  const editDialog = ref<any>();
  // 点击编辑
  function edit(row) {
    console.log(row.fuzz_type)
    showEditServerDialog.value = true;
    editDialog.value.initEditData(row.id);
  }
  // 列表
  function getFuzzs() {
    FuzzsGet({
      query: queryFormR.query,
      pagesize: PageCaseR.pagesize,
      pagenum: PageCaseR.pagenum,
    }).then((res) => {
      if (res["data"]["code"] == 1) {
        FuzzListR.list = res["data"]["data"]["list"];
        FuzzListR.total = res["data"]["data"]["total_count"];
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
        FuzzDelPost({ id: row.id }).then((res) => {
          if (res["data"]["code"] == 1) {
            ElMessage({message: "删除成功",type: "success",});
            getFuzzs();
          } else {
            ElMessage({message: res.data.msg,type: "error",});
          }
        });
      })
      .catch(() => {
        ElMessage({type: "info",message: "Delete canceled"});});
  };
  
  onMounted(() => {
    getFuzzs();
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
  