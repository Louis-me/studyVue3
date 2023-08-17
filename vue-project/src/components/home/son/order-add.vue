<template>
  <div>
    <!-- :model-value="props.show"  调用下方js中props-->
    <el-dialog :model-value="props.show" title="订单新增" width="30%" :before-close="handleClose">
      <el-form ref="orderFormRef" :model="orderFormR" :rules="rules">
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

            <el-button type="primary" @click="handleClose()">取消</el-button>
            <el-button type="primary" @click="submitForm(orderFormRef)">确定</el-button>
          </span>
        </el-form-item>

      </el-form>

    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { ElMessage, FormInstance, FormRules } from 'element-plus'

import { OrderAddPost } from "../../../utils/html.js"
interface orderForm {
  name: string,
  desc: string,
  price: string,
}
// 定义表单绑定的model
const orderFormR = reactive({
  name: '',
  desc: '',
  price: '',
})

const orderFormRef = ref<FormInstance>()

// 定义规则
const rules = reactive<FormRules<orderForm>>({
  name: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
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
// props 接收父组件传过来的，父传子属性值
const props = defineProps({
  show: Boolean,
});

// 引用父组件的函数，子传父方法
const emits = defineEmits(["set-show","get-order"]);
const formLabelWidth = '120px'

function handleClose() {
  //关闭对话框，调用了父组件的setShow方法，此时因为传递flase表示关闭弹框
  emits("set-show", false);
}
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async (valid, fields) => {
    if (valid) {
      console.log('submit12121!')
      OrderAddPost(JSON.stringify(orderFormR)).then(res => {
        if (res["data"]["code"] == 1) {
          ElMessage({
            message: '新增成功.',
            type: 'success',
          })
          // 调用父组件方法，关闭编辑弹框
          emits("set-show", false);
          // 调用父组件方法，查询订单列表数据
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
</script>
<style scoped></style>