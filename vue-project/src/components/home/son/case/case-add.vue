<template>
  <div>
    <!-- :model-value="props.show"  调用下方js中props-->
    <el-dialog :model-value="props.show" title="新增" width="50%"
    :before-close="handleClose" :draggable="true">
      <el-form ref="caseFormRef" :model="caseFormR" :rules="rules">
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

            <el-button type="primary" @click="handleClose()">取消</el-button>
            <el-button type="primary" @click="submitForm(caseFormRef)">确定</el-button>
          </span>
        </el-form-item>

      </el-form>

    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import JsonEditorVue from 'json-editor-vue3'

import { CaseAddPost } from "../../../../utils/html.js"
interface caseForm {
  name: string,
  method: string,
  url: string,
  params: string,
  hope: string,
}
// 定义表单绑定的model
const caseFormR = reactive({
  name: '',
  method: '',
  url: '',
  params: reactive({}),
  hope: ""
})
const caseFormRef = ref<FormInstance>()

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
// props 接收父组件传过来的，父传子属性值
const props = defineProps({
  show: Boolean,
});

// 引用父组件的函数，子传父方法
const emits = defineEmits(["set-show","get-case"]);
const formLabelWidth = '120px'

function handleClose() {
  //关闭对话框，调用了父组件的setShow方法，此时因为传递flase表示关闭弹框
  emits("set-show", false);
}
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async (valid, fields) => {
    if (valid) {
      CaseAddPost(JSON.stringify(caseFormR)).then(res => {
        if (res["data"]["code"] == 1) {
          ElMessage({
            message: '新增成功.',
            type: 'success',
          })
          // 调用父组件方法，关闭编辑弹框
          emits("set-show", false);
          // 调用父组件方法，查询订单列表数据
          emits("get-case");
          // 清空弹框内容
          Object.keys(caseFormR).forEach((key) => {
            caseFormR[key] = '';
          });


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