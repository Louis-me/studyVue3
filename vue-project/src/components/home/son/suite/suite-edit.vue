<template>
    <div>
      <el-dialog :model-value="showEdit" title="编辑" width="50%" :before-close="handleEditClose" :modal="false">
        <el-form ref="suiteEditFormRef" :model="suiteFormR" :rules="rules">
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
  
              <el-button type="primary" @click="handleEditClose()">取消</el-button>
              <el-button type="primary" @click="submitForm(suiteEditFormRef)">确定</el-button>
            </span>
          </el-form-item>
  
        </el-form>
  
      </el-dialog>
    </div>
  </template>
  <script lang="ts" setup>
  import { reactive, ref, inject } from 'vue'
  import { ElMessage, FormInstance, FormRules } from 'element-plus'
  
  import {  SuiteEditPost, SuiteDetailGet } from "../../../../utils/html.js"
  
  interface suiteForm {
    name: string,
    is_fuzz: boolean,
    id: number
  }
  // 定义表单绑定的model
  const suiteFormR = reactive({
    name: '',
    is_fuzz: false,
    id: 0,
  })
  
  
  const suiteEditFormRef = ref<FormInstance>()
  
  // 定义规则
  const rules = reactive<FormRules<suiteForm>>({
    name: [
      { required: true, message: '请输入名称', trigger: 'blur' },
    ],

  });
  
  // props 接收父组件传过来的变量，控制展示编辑弹框变量
  defineProps<{
    showEdit: Boolean,
  }>()
  
  // 调用父组件的函数，子传父方法
  const emits = defineEmits(["set-edit-show", "get-suite"]);
  
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
        SuiteEditPost(JSON.stringify(suiteFormR)).then(res => {
          console.log(res)
          if (res["data"]["code"] == 1) {
            ElMessage({
              message: '编辑成功.',
              type: 'success',
            })
            emits("set-edit-show", false);
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
  //注意：使用defineExpose()暴露方法，父组件才能调用
  defineExpose({ initEditData });
  // 接受父组件传来的id,查询订单详情
  function initEditData(id: number) {
    SuiteDetailGet({ "id": id }).then(res => {
      if (res["data"]["code"] == 1) {
        suiteFormR.name = res["data"]["data"]["name"]
        suiteFormR.id = id
        suiteFormR.is_fuzz = res["data"]["data"]["is_fuzz"]
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