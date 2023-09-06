<template>
  <el-breadcrumb>
    <!-- <el-breadcrumb-item :to="{ path: '/' }">homepage</el-breadcrumb-item> -->
    <el-breadcrumb-item>用例管理</el-breadcrumb-item>
    <el-breadcrumb-item>套件管理</el-breadcrumb-item>
  </el-breadcrumb>
  <el-card class="box-card" style="margin-top: 10px">
    <el-row :gutter="20">
      <el-col :span="7">
        <el-input placeholder="请输入内容" v-model="queryFormR.query">
        </el-input>
      </el-col>
      <el-col :span="6">
        <el-button type="primary" @click="getSuites">查询</el-button>
        <el-button type="primary" @click="orderReset">重置</el-button>
        <el-button type="primary" @click="showAddServerDialog = true">添加</el-button>
        <suiteAdd  :show="showAddServerDialog"
          @set-show="setShow"
          @get-suite="getSuites">
        </suiteAdd>
      </el-col>
    </el-row>
    <el-table :data="SuiteListR.list" style="width: 100%">
      <el-table-column label="序号" width="80px">
        <template v-slot="{ row, $index }">
          <span>{{ $index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="套件名称" width="120" />
      <el-table-column prop="is_fuzz" label="模糊测试" width="120">
            <template v-slot="scope">
              <span v-if="scope.row.is_fuzz === true">是</span>
              <span v-else>否</span>
            </template>

      </el-table-column>
      <el-table-column fixed="right" label="操作" width="300">
        <template #default="{ row }">
          <el-row :gutter="21">
            <el-col :span="5">
              <el-button
                link
                type="primary"
                size="small"
                @click="contactCaseEvent(row)"
                >关联用例</el-button>
            </el-col>
            <el-col :span="3">
              <el-button link type="primary" size="small" @click="edit(row)"
                >编辑</el-button
              >
       
             
            </el-col>
            <el-col :span="3">
              <el-button link type="primary" size="small" @click="delEvent(row)"
                >删除</el-button
              >
            </el-col>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
    <suiteEdit :showEdit="showEditServerDialog"
                @set-edit-show="setEditShow"
                @get-suite="getSuites"
                ref="editDialog">
              </suiteEdit>
    <suiteContactCase :showContact="showContactServerDialog"
                @set-edit-show-contact="setContactShow"
                @get-suite="getSuites"
                ref="contactDialog">

    </suiteContactCase>
    <el-pagination
      @size-change="SuiteChangeSize"
      @current-change="SuiteChangeNum"
      :current-page="PageSuiteR.pagenum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="PageSuiteR.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="SuiteListR.total"
    >
    </el-pagination>
  </el-card>
</template>

<script lang="ts" setup>
// 引入子组件
import suiteAdd from "./suite-add.vue";
import suiteEdit from "./suite-edit.vue";
import suiteContactCase from "./suite-contact-case.vue";

import { ref, onMounted, reactive } from "vue";
// 引用请求
import { SuitesGet, SuiteDelPost} from "../../../../utils/html.js";
import { ElMessage, ElMessageBox } from "element-plus";
// 删除按钮
import { InfoFilled } from "@element-plus/icons-vue";

// 查询条件
const queryFormR = reactive({
  query: "",
});
//分页
const PageSuiteR = reactive({
  pagesize: 10,
  pagenum: 1, //当前页码
  query: "",
});
// 列表
const SuiteListR = reactive({
  list: [],
  total: 0, //列表数据总数
});
const SuiteChangeSize = (newSize) => {
  PageSuiteR.pagesize = newSize;
  getSuites();
};

const SuiteChangeNum = (newPage) => {
  PageSuiteR.pagenum = newPage;
  getSuites();
};

const orderReset = () => {
  queryFormR.query = "";
};

//处理子组件传回的参数-新增弹框
let showAddServerDialog = ref(false);
function setShow(val) {
  showAddServerDialog.value = val;
}
// 处理子组件传回的参数-编辑弹框, 子组件调用这里控制弹框
let showEditServerDialog = ref(false);
function setEditShow(val) {
  showEditServerDialog.value = val;
}

// 这了的变量名称必须和EditOrder的ref值一样
const editDialog = ref<any>();
// 点击编辑
function edit(row) {
  showEditServerDialog.value = true;
  editDialog.value.initEditData(row.id);
}

// 关联用例
let showContactServerDialog = ref(false);
function setContactShow(val) {
  showContactServerDialog.value = val;
}
const contactDialog = ref<any>();
// 点击关联用例
function contactCaseEvent(row) {
  showContactServerDialog.value = true;
  // 调用子组件函数
  contactDialog.value.initEditData(row.id);
}

// 套件列表
function getSuites() {
  SuitesGet({
    query: queryFormR.query,
    pagesize: PageSuiteR.pagesize,
    pagenum: PageSuiteR.pagenum,
  }).then((res) => {
    if (res["data"]["code"] == 1) {
      SuiteListR.list = res["data"]["data"]["list"];
      SuiteListR.total = res["data"]["data"]["total_count"];
    } else {
      ElMessage({
        message: res.data.msg,
        type: "error",
      });
    }
  });
}
// 确定删除
const delEvent = (row) => {
  ElMessageBox.confirm("确定需要删除吗?", "注意", {
    confirmButtonText: "OK",
    cancelButtonText: "Cancel",
    type: "warning",
  })
    .then(() => {
      SuiteDelPost({ id: row.id }).then((res) => {
        if (res["data"]["code"] == 1) {
          ElMessage({
            message: "删除成功",
            type: "success",
          });
          getSuites();
        } else {
          ElMessage({
            message: res.data.msg,
            type: "error",
          });
        }
      });
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "Delete canceled",
      });
    });
};

onMounted(() => {
  getSuites();
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
