<template>
    <div>
      <el-dialog :model-value="showEdit" title="订单编辑" width="50%" :before-close="handleEditClose" :modal="false">
        <el-form ref="fuzzEditFormRef" :model="fuzzFormR" :rules="rules">
          <!-- prop="name" 必须加这个，才能让自定义规则生效 -->
          <el-form-item label="规则名称" :label-width="formLabelWidth" prop="name">
            <el-input v-model="fuzzFormR.name" autocomplete="off" />
          </el-form-item>
          <el-form-item label="规则内容" :label-width="formLabelWidth" prop="fuzz_content">
            <el-input type="textarea" v-model="fuzzFormR.fuzz_content" autocomplete="off" />
          </el-form-item>
          <el-form-item>
            <span style="margin-left: 80px;">
              <el-button type="primary" @click="handleEditClose()">取消</el-button>
              <el-button type="primary" @click="submitForm(fuzzEditFormRef)">确定</el-button>
            </span>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </template>
  <script lang="ts" setup>
  import { reactive, ref, inject } from 'vue'
  import { ElMessage, FormInstance, FormRules } from 'element-plus'
  import { FuzzDetailGet, FuzzEditPost } from "../../../../utils/html.js"
  
  interface fuzzForm {
    name: string,
    fuzz_type: number,
    fuzz_content: string,
    id: number
  }
  // 定义表单绑定的model
  const fuzzFormR = reactive({
    name: '',
    fuzz_type: 0,
    fuzz_content: '',
    id: 0,
  })
  
  
  const fuzzEditFormRef = ref<FormInstance>()
  
  // 定义规则
  const rules = reactive<FormRules<fuzzForm>>({
    name: [{ required: true, message: '请输入名称', trigger: 'blur' },],
    fuzz_content: [{required: true,message: '请输入内容', trigger: 'blur'}],
  });
  
  // props 接收父组件传过来的变量，控制展示编辑弹框变量
  defineProps<{
    showEdit: Boolean,
  }>()
  
  // 调用父组件的函数，子传父方法
  const emits = defineEmits(["set-edit-show", "get-fuzz"]);
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
        FuzzEditPost(JSON.stringify(fuzzFormR)).then(res => {
          if (res["data"]["code"] == 1) {
            ElMessage({message: '编辑成功.',type: 'success',})
            emits("set-edit-show", false);
            emits("get-fuzz");
          } else {
            ElMessage({message: res.data.msg,type: 'error',})
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
    FuzzDetailGet({ "id": id }).then(res => {
      if (res["data"]["code"] == 1) {
        fuzzFormR.name = res["data"]["data"]["name"]
        fuzzFormR.fuzz_content = res["data"]["data"]["fuzz_content"]
        fuzzFormR.id = id
      } else {
        ElMessage({message: res.data.msg, type: 'error'})
      }
    })
  }
  
  </script>
  <style scoped>
  </style>