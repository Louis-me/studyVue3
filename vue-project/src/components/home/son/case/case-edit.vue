<template>
  <div>
    <el-dialog :model-value="showCaseEdit" title="编辑" width="50%" :before-close="handleEditClose" 
    :modal="false" :draggable="true">
      <el-form ref="caseEditFormRef" :model="caseFormR" :rules="rules" >
        <!-- prop="name" 必须加这个，才能让自定义规则生效 -->
        <el-form-item label="用例名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model="caseFormR.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="方法" :label-width="formLabelWidth" prop="method">
          <el-select v-model="caseFormR.method" placeholder="请选择">
                                <el-option 
                                    label="get"
                                    value="get">
                                </el-option>
                                 <el-option 
                                    label="post"
                                    value="post">
                                </el-option>
                             </el-select>
        </el-form-item>
        <el-form-item label="url" :label-width="formLabelWidth" prop="url">
          <el-input v-model="caseFormR.url" autocomplete="off" />
        </el-form-item>
        <el-form-item label="入参" :label-width="formLabelWidth" prop="params">
          <!-- <el-input v-model="caseFormR.params" autocomplete="off" /> -->
          <json-editor-vue class="editor" v-model="caseFormR.params"  currentMode="text" :modeList='["text", "view", "tree", "code", "form"]' />
        </el-form-item>
        <el-form-item label="期望结果" :label-width="formLabelWidth" prop="hope">
          <el-input v-model="caseFormR.hope"  placeholder="code:1|msg:success"></el-input>
        </el-form-item>
        <el-form-item>
          <span style="margin-left: 80px;">

            <el-button type="primary" @click="handleEditClose()">取消</el-button>
            <el-button type="primary" @click="submitForm(caseEditFormRef)">确定</el-button>
          </span>
        </el-form-item>

      </el-form>

    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { reactive, ref, inject } from 'vue'
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import JsonEditorVue from 'json-editor-vue3'

import { CaseDetailGet, CaseEditPost } from "../../../../utils/html.js"

interface caseForm {
  name: string,
  method: string,
  url: string,
  params: string,
  hope: string,
  id: number
}
// 定义表单绑定的model
const caseFormR = reactive({
  name: '',
  method: '',
  url: '',
  params: reactive({}),
  hope: "",
  id: 0,
})

let editParams = reactive({})

const caseEditFormRef = ref<FormInstance>()

// 定义规则
const rules = reactive<FormRules<caseForm>>({
  name: [
    { required: true, message: '请输入用例名', trigger: 'blur' },
  ],

  url: [
    {
      required: true,
      message: '请输入url',
    },
  ],
  hope: [
    {
      required: true,
      message: '请输入期望值',
    },
  ],
});

// props 接收父组件传过来的变量，控制展示编辑弹框变量
defineProps<{
  showCaseEdit: Boolean,
}>()

// 调用父组件的函数，子传父方法
const emits = defineEmits(["set-edit-show", "get-case"]);

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
      CaseEditPost(JSON.stringify(caseFormR)).then(res => {
        console.log(res)
        if (res["data"]["code"] == 1) {
          ElMessage({
            message: '编辑成功.',
            type: 'success',
          })
          emits("set-edit-show", false);
          emits("get-case");

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
  CaseDetailGet({ "id": id }).then(res => {
    if (res["data"]["code"] == 1) {
      caseFormR.name = res["data"]["data"]["name"]
      caseFormR.method = res["data"]["data"]["method"]
      caseFormR.id = id
      caseFormR.url = res["data"]["data"]["url"]
      caseFormR.hope = res["data"]["data"]["hope"]
      caseFormR.params = JSON.parse(res["data"]["data"]["params"])
      // editParams = JSON.parse(res["data"]["data"]["params"])
      console.log(caseFormR.params)

      
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