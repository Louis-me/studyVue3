<template>
  <div>
    <el-dialog :model-value="showOrderDetail" title="订单详情" width="30%"
     :before-close="handleOrderViewClose" :modal="false">
      <el-table :data="orderList">
            <el-table-column prop="name" label="订单名称" width="120" />
            <el-table-column prop="price" label="价格" width="120" />
            <!-- <el-table-column prop="created_at" label="创建日期" width="200" /> -->
            <!-- <el-table-column prop="updated_at" label="更新日期" width="200" /> -->
        </el-table>
        <span style="margin-left: 80px;">
          <el-button type="primary" @click="handleOrderViewClose">取消</el-button>
          <el-button type="primary" @click="handleOrderViewClose">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { reactive, ref ,toRefs} from 'vue'
import { ElMessage, FormInstance, FormRules } from 'element-plus'

import { OrderDetailGet } from "../../../utils/html.js"


const OrderListR = reactive({
  name: '',
  desc: '',
  price: '1',
  id: 0,
})
// 把OrderListR转换为数组，只有数组才能el-table 进行访问
let orderList = ref<any>()

// props 接收父组件传过来的变量，控制展示查看弹框变量
defineProps<{
  showOrderDetail: Boolean,
}>()

// 调用父组件的函数，子传父方法
const emits = defineEmits(["set-order-view-show"]);


function handleOrderViewClose() {
  //关闭对话框，调用的父方法
  emits("set-order-view-show", false);
}

//注意：使用defineExpose()暴露方法，父组件才能调用
defineExpose({ initOrderDetailData });
// 接受父组件传来的id,查询订单详情
 function initOrderDetailData(id: number) {
   OrderDetailGet({ "id": id }).then(res => {
    if (res["data"]["code"] == 1) {
      OrderListR.name = res["data"]["data"]["name"]
      OrderListR.desc = res["data"]["data"]["desc"]
      OrderListR.id = id
      OrderListR.price = res["data"]["data"]["price"]
      console.log(OrderListR)

    } else {
      ElMessage({
        message: res.data.msg,
        type: 'error',
      })
    }
  })
// 把OrderListR转换为数组，只有数组才能el-table 进行访问
  orderList = ref([toRefs(OrderListR)]);
}

</script>
<style scoped>
</style>