<template>
    <div>
      <!-- :model-value="props.show"  调用下方js中props-->
      <el-dialog :model-value="props.show" title="套件新增" width="30%" :before-close="handleClose">
        <el-form ref="suiteFormRef" :model="suiteFormR" :rules="rules">
          <!-- prop="name" 必须加这个，才能让自定义规则生效 -->
          <el-form-item label="套件名称" :label-width="formLabelWidth" prop="name">
            <el-input v-model="suiteFormR.name" autocomplete="off" />
          </el-form-item>
          <el-form-item label="模糊测试" :label-width="formLabelWidth" prop="is_fuzz">
            <el-switch v-model="suiteFormR.is_fuzz"
                                active-color="#13ce66"
                                inactive-color="#C0CCDA"
                                :active-value="true" :inactive-value="false">
                            </el-switch>
          </el-form-item>
         
          <el-form-item>
            <span style="margin-left: 80px;">
              <el-button type="primary" @click="handleClose()">取消</el-button>
              <el-button type="primary" @click="submitForm(suiteFormRef)">确定</el-button>
            </span>
          </el-form-item>
  
        </el-form>
  
      </el-dialog>
    </div>
  </template>
  <script lang="ts" setup>
  import { reactive, ref } from 'vue'
  import { ElMessage, FormInstance, FormRules } from 'element-plus'
  
  import { SuiteAddPost } from "../../../../utils/html.js"
  interface suiteForm {
    name: string,
    is_fuzz: Boolean,
  }
  // 定义表单绑定的model
  const suiteFormR = reactive({
    name: '',
    is_fuzz: false,
  })
  
  const suiteFormRef = ref<FormInstance>()
  
  // 定义规则
  const rules = reactive<FormRules<suiteForm>>({
    name: [
      { required: true, message: '请输入套件名称', trigger: 'blur' },
    ],
  });
  // props 接收父组件传过来的，父传子属性值
  const props = defineProps({
    show: Boolean,
  });
  
  // 引用父组件的函数，子传父方法
  const emits = defineEmits(["set-show","get-suite"]);
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
        SuiteAddPost(JSON.stringify(suiteFormR)).then(res => {
          if (res["data"]["code"] == 1) {
            ElMessage({
              message: '新增成功.',
              type: 'success',
            })
            // 调用父组件方法，关闭编辑弹框
            emits("set-show", false);
            // 调用父组件方法，查询订单列表数据
            emits("get-suite");
  
  
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