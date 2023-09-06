<template>
  <el-breadcrumb>
    <el-breadcrumb-item>用例管理</el-breadcrumb-item>
    <el-breadcrumb-item>用例列表</el-breadcrumb-item>
  </el-breadcrumb>
  <el-card class="box-card" style="margin-top: 10px">
    <el-row :gutter="20">
      <el-col :span="7">
        <el-input placeholder="请输入内容" v-model="queryFormR.query">
        </el-input>
      </el-col>
      <el-col :span="6">
        <el-button type="primary" @click="getCases">查询</el-button>
        <el-button type="primary" @click="caseReset">重置</el-button>
        <el-button type="primary" @click="showAddServerDialog = true">添加</el-button>

        <caseAdd :show="showAddServerDialog" @set-show="setShow" @get-case="getCases">
        </caseAdd>
      </el-col>
    </el-row>
    <el-table :data="CaseListR.list" style="width: 100%">
      <el-table-column type="expand">
        <template #default="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-row>
              <el-col>
                <el-form-item label="用例名称:">
                  <span>{{ props.row.name }}</span>
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
                    <json-viewer :value="JSON.parse(props.row.params)" style="width: 500px"></json-viewer>
                  </div>
                </el-form-item>
              </el-col>
              <el-col>
                <el-form-item label="期望结果:">
                  <span>{{ props.row.hope }}</span>
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
      <el-table-column prop="name" label="用例名称" width="120" />
      <el-table-column prop="url" label="url" width="350" />
      <el-table-column fixed="right" label="操作" width="300">
        <template #default="{ row }">
          <el-row :gutter="21">
            <el-col :span="3">
              <el-button link type="primary" size="small" @click="edit(row);">编辑</el-button>
            </el-col>
            <el-col :span="3">
              <el-button link type="primary" size="small" @click="delEvent(row)">删除</el-button>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
    <caseEdit :showCaseEdit="showEditServerDialog" @set-edit-show="setEditShow" ref="editDialog" @get-case="getCases" />
    <el-pagination @size-change="caseChangeSize" @current-change="caseChangeNum" :current-page="PageCaseR.pagenum"
      :page-sizes="[5, 10, 15, 20]" :page-size="PageCaseR.pagesize" layout="total, sizes, prev, pager, next, jumper"
      :total="CaseListR.total">
    </el-pagination>
  </el-card>
</template>

<script lang="ts" setup>
// 引入子组件
import { ref, onMounted, reactive } from "vue";
import caseAdd from "./case-add.vue";
import caseEdit from "./case-edit.vue"

// 引用请求
import { CasesGet, CaseDelPost } from "../../../../utils/html.js";
import { ElMessage, ElMessageBox } from "element-plus";
// 删除按钮
import { InfoFilled } from "@element-plus/icons-vue";

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
const CaseListR = reactive({
  list: [],
  total: 0, //列表数据总数
});
const caseChangeSize = (newSize) => {
  PageCaseR.pagesize = newSize;
  getCases();
};

const caseChangeNum = (newPage) => {
  PageCaseR.pagenum = newPage;
  getCases();
};

const caseReset = () => {
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
  showEditServerDialog.value = true;
  editDialog.value.initEditData(row.id);
}
// 列表
function getCases() {
  CasesGet({
    query: queryFormR.query,
    pagesize: PageCaseR.pagesize,
    pagenum: PageCaseR.pagenum,
  }).then((res) => {
    if (res["data"]["code"] == 1) {
      CaseListR.list = res["data"]["data"]["list"];
      CaseListR.total = res["data"]["data"]["total_count"];
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
      CaseDelPost({ id: row.id }).then((res) => {
        if (res["data"]["code"] == 1) {
          ElMessage({
            message: "删除成功",
            type: "success",
          });
          getCases();
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
  getCases();
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
