<template>
  <el-breadcrumb>
    <!-- <el-breadcrumb-item :to="{ path: '/' }">homepage</el-breadcrumb-item> -->
    <el-breadcrumb-item>订单管理</el-breadcrumb-item>
    <el-breadcrumb-item>订单列表</el-breadcrumb-item>
  </el-breadcrumb>
  <el-card class="box-card" style="margin-top: 10px">
    <el-row :gutter="20">
      <el-col :span="7">
        <el-input placeholder="请输入内容" v-model="queryFormR.query">
        </el-input>
      </el-col>
      <el-col :span="6">
        <el-button type="primary" @click="getOrders1">查询</el-button>
        <el-button type="primary" @click="orderReset">重置</el-button>
        <el-button type="primary" @click="showAddServerDialog = true"
          >添加</el-button
        >

        <AddOrder
          :show="showAddServerDialog"
          @set-show="setShow"
          @get-order="getOrders1"
        />
      </el-col>
    </el-row>
    <el-table :data="OrderListR.list" style="width: 100%">
      <el-table-column type="expand">
        <template #default="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="订单名称">
              <span>{{ props.row.name }}</span>
            </el-form-item>
            <el-form-item label="价格">
              <span>{{ props.row.price }}</span>
            </el-form-item>
            <el-form-item label="描述">
              <span>{{ props.row.desc }}</span>
            </el-form-item>
            <el-form-item label="创建时间">
              <span>{{ props.row.created_at }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="序号" width="80px">
        <template v-slot="{ row, $index }">
          <span>{{ $index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="订单名称" width="120" />
      <el-table-column prop="price" label="价格" width="120" />
      <el-table-column prop="created_at" label="创建日期" width="200" />
      <el-table-column prop="updated_at" label="更新日期" width="200" />
      <el-table-column fixed="right" label="操作" width="300">
        <template #default="{ row }">
          <el-row :gutter="21">
            <el-col :span="3">
              <el-button
                link
                type="primary"
                size="small"
                @click="detailOrder(row)"
                >查看</el-button
              >
              <ViewOrder
                :showOrderDetail="showOrderDetailDialog"
                @set-order-view-show="setOrderViewShow"
                ref="orderViewDialog"
              />
            </el-col>
            <el-col :span="3">
              <el-button link type="primary" size="small" @click="edit(row)"
                >编辑</el-button
              >
              <EditOrder
                :showEdit="showEditServerDialog"
                @set-edit-show="setEditShow"
                @get-order="getOrders1"
                ref="editDialog"
              />
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
    <el-pagination
      @size-change="orderChangeSize"
      @current-change="orderChangeNum"
      :current-page="PageOrderR.pagenum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="PageOrderR.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="OrderListR.total"
    >
    </el-pagination>
  </el-card>
</template>

<script lang="ts" setup>
// 引入子组件
import AddOrder from "../../home/son/order-add.vue";
import EditOrder from "../../home/son/order-edit.vue";
import ViewOrder from "../../home/son/order-view.vue";

import { ref, onMounted, reactive } from "vue";
// 引用请求
import { GetOrders, OrderDelPost } from "../../../utils/html.js";
import { ElMessage, ElMessageBox } from "element-plus";
// 删除按钮
import { InfoFilled } from "@element-plus/icons-vue";

// 查询条件
const queryFormR = reactive({
  query: "",
});
//分页
const PageOrderR = reactive({
  pagesize: 10,
  pagenum: 1, //当前页码
  query: "",
});
// 列表
const OrderListR = reactive({
  list: [],
  total: 0, //列表数据总数
});
const orderChangeSize = (newSize) => {
  PageOrderR.pagesize = newSize;
  getOrders();
};

const orderChangeNum = (newPage) => {
  PageOrderR.pagenum = newPage;
  getOrders();
};

const orderReset = () => {
  queryFormR.query = "";
};
const getOrders1 = () => {
  getOrders();
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

// 处理子组件传回的参数-查看弹框, 子组件调用这里控制弹框
let showOrderDetailDialog = ref(false);
function setOrderViewShow(val) {
  showOrderDetailDialog.value = val;
}
//这了的变量名称必须和查看子组件的ref值一样
const orderViewDialog = ref<any>();
// 点击查看按钮
function detailOrder(row) {
  console.log("查看");
  showOrderDetailDialog.value = true;
  orderViewDialog.value.initOrderDetailData(row.id);
}

// 订单列表
function getOrders() {
  GetOrders({
    query: queryFormR.query,
    pagesize: PageOrderR.pagesize,
    pagenum: PageOrderR.pagenum,
  }).then((res) => {
    if (res["data"]["code"] == 1) {
      OrderListR.list = res["data"]["data"]["list"];
      OrderListR.total = res["data"]["data"]["total_count"];
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
      OrderDelPost({ id: row.id }).then((res) => {
        if (res["data"]["code"] == 1) {
          ElMessage({
            message: "删除成功",
            type: "success",
          });
          getOrders();
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
  getOrders();
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
