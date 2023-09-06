<template>
    <el-breadcrumb>
        <!-- <el-breadcrumb-item :to="{ path: '/' }">homepage</el-breadcrumb-item> -->
        <el-breadcrumb-item>配置管理</el-breadcrumb-item>
        <el-breadcrumb-item>接口测试</el-breadcrumb-item>
        <el-tooltip
        class="box-item"
        effect="dark"
        content="1.需要确认登录配置数据正确<br>2.登录配置中登录成功后调用这里的测试接口"
        placement="right-start"
        raw-content
      >
      <el-icon><Warning /></el-icon>
    </el-tooltip>
    </el-breadcrumb>
    
    <el-card class="box-card" style="margin-top: 10px">
        <el-form ref="testFormRef" :model="testFormR" :rules="rules">
            <!-- prop="name" 必须加这个，才能让自定义规则生效 -->
            <el-form-item label="url" label-width="100" prop="url">
                <el-input v-model="testFormR.url" autocomplete="off" style="width:400px" />
            </el-form-item>
            <el-form-item label="方法" label-width="100" prop="method">
          <el-select v-model="testFormR.method" placeholder="请选择">
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
            <el-form-item label="入参" label-width="100" prop="name">
                <json-editor-vue class="editor" v-model="testFormR.params" currentMode="text"
                    :modeList='["text", "view", "tree", "code", "form"]'  style="width: 400px"   />
            </el-form-item>
            <el-form-item label="出参" label-width="100" prop="name">
                <json-viewer :value="testResp" style="width: 500px"></json-viewer>

            </el-form-item>
            <el-form-item>
                <span style="margin-left: 80px;">
                    <el-button type="primary" @click="submitForm(testFormRef)">测试</el-button>
                </span>
            </el-form-item>
        </el-form>
    </el-card>
</template>
  
<script lang="ts" setup>


import { ref, onMounted, reactive } from "vue";
import JsonEditorVue from 'json-editor-vue3'
// 引用请求
import { ApiTestPost } from "../../../../utils/html.js";
import { FormInstance, FormRules } from "element-plus";
const testFormRef = ref<FormInstance>()

interface testnForm {
    url: string,
    params: string,
    method: string
}
const testResp = ref({})
const testFormR = reactive({
    params: reactive({}),
    url: '',
    method: ""
})

const rules = reactive<FormRules<testnForm>>({
    url: [{ required: true, message: '请输入url', trigger: 'blur' },],
    params: [{ required: true, message: '请输入入参', trigger: 'blur' }]
});

const submitForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.validate(async (valid, fields) => {
        if (valid) {
            ApiTestPost(JSON.stringify(testFormR)).then(res => {
                console.log(res)
                testResp.value = res["data"] 
            })
        } else {
            console.log('error submit!', fields)
        }
    })

}

</script>
<style scoped>
</style>
  