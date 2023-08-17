<template>
  <div>
    <el-dialog :model-value="showEdit" title="订单编辑" width="30%" :before-close="handleEditClose" :modal="false">
      <el-form ref="orderEditFormRef" :model="orderFormR" :rules="rules">
        <!-- prop="name" 必须加这个，才能让自定义规则生效 -->
        <el-form-item label="订单名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model="orderFormR.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="订单描述" :label-width="formLabelWidth" prop="desc">
          <el-input v-model="orderFormR.desc" autocomplete="off" />
        </el-form-item>
        <el-form-item label="订单价格" :label-width="formLabelWidth" prop="price">
          <el-input v-model="orderFormR.price" autocomplete="off" />
        </el-form-item>
        <el-form-item>
          <span style="margin-left: 80px;">

            <el-button type="primary" @click="handleEditClose()">取消</el-button>
            <el-button type="primary" @click="submitForm(orderEditFormRef)">确定</el-button>
          </span>
        </el-form-item>

      </el-form>

    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { reactive, ref, inject } from 'vue'
import { ElMessage, FormInstance, FormRules } from 'element-plus'

import { OrderDetailGet, OrderEditPost } from "../../../utils/html.js"

interface orderForm {
  name: string,
  desc: string,
  price: string,
  id: number
}
// 定义表单绑定的model
const orderFormR = reactive({
  name: '',
  desc: '',
  price: '',
  id: 0,
})


const orderEditFormRef = ref<FormInstance>()

// 定义规则
const rules = reactive<FormRules<orderForm>>({
  name: [
    { required: true, message: '请输入名称', trigger: 'blur' },
  ],

  desc: [
    {
      required: true,
      message: '请输入订单描述',
    },
  ],
  price: [
    {
      required: true,
      message: '请输入订单价格',
    },
  ],
});

// props 接收父组件传过来的变量，控制展示编辑弹框变量
defineProps<{
  showEdit: Boolean,
}>()

// 调用父组件的函数，子传父方法
const emits = defineEmits(["set-edit-show", "get-order"]);

const formLabelWidth = '120px'

function handleEditClose() {
  //关闭对话框,调用的父方法
  emits("set-edit-show", false);
}
// 提交修改
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async (valid, fields) => {
    if (valid) {
      OrderEditPost(JSON.stringify(orderFormR)).then(res => {
        console.log(res)
        if (res["data"]["code"] == 1) {
          ElMessage({
            message: '编辑成功.',
            type: 'success',
          })
          emits("set-edit-show", false);
          emits("get-order");

        } else {
          ElMessage({
            message: res.data.msg,
            type: 'error',
          })
        }
      })
    } else {
      console.log('error submit!', fields)

    }
  })

}
//注意：使用defineExpose()暴露方法，父组件才能调用
defineExpose({ initEditData });
// 接受父组件传来的id,查询订单详情
function initEditData(id: number) {
  OrderDetailGet({ "id": id }).then(res => {
    if (res["data"]["code"] == 1) {
      orderFormR.name = res["data"]["data"]["name"]
      orderFormR.desc = res["data"]["data"]["desc"]
      orderFormR.id = id
      orderFormR.price = res["data"]["data"]["price"]
    } else {
      ElMessage({
        message: res.data.msg,
        type: 'error',
      })
    }
  })
}

</script>
<style scoped>
</style>