<template>
    <el-breadcrumb>
        <!-- <el-breadcrumb-item :to="{ path: '/' }">homepage</el-breadcrumb-item> -->
        <el-breadcrumb-item>配置管理</el-breadcrumb-item>
        <el-breadcrumb-item>登录接口</el-breadcrumb-item>
        <el-tooltip
        class="box-item"
        effect="dark"
        content="这里的登录应该为接口测试的登录地址,暂时填写的问本平台的测试登录地址"
        placement="right-start"
      >
      <el-icon><Warning /></el-icon>
    </el-tooltip>
    </el-breadcrumb>
    <el-card class="box-card" style="margin-top: 10px">
        <el-form ref="loginFormRef" :model="loginFormR" :rules="rules">
            <!-- prop="name" 必须加这个，才能让自定义规则生效 -->
            <el-form-item label="url" label-width="100" prop="url">
                <el-input v-model="loginFormR.url" autocomplete="off" style="width:400px" />
            </el-form-item>
            <el-form-item label="登录参数" label-width="100" prop="name">
                <json-editor-vue class="editor" v-model="loginFormR.params" currentMode="text"
                    :modeList='["text", "view", "tree", "code", "form"]'  style="width: 400px"   />
            </el-form-item>
            <el-form-item>
                <span style="margin-left: 80px;">
                    <el-button type="primary" @click="testForm(loginFormRef)">测试</el-button>
                    <el-button type="primary" @click="submitForm(loginFormRef)">保存</el-button>
                </span>
            </el-form-item>
        </el-form>
    </el-card>
</template>
  
<script lang="ts" setup>


import { ref, onMounted, reactive } from "vue";
import JsonEditorVue from 'json-editor-vue3'
// 引用请求
import { LoginApiGet, LoginSavePost, LoginTestPost } from "../../../../utils/html.js";
import { ElMessage, ElMessageBox, FormInstance, FormRules } from "element-plus";
const loginFormRef = ref<FormInstance>()

interface loginForm {
    url: string,
    params: string,
}

const loginFormR = reactive({
    params: reactive({}),
    url: '',

})

const rules = reactive<FormRules<loginForm>>({
    url: [{ required: true, message: '请输入url', trigger: 'blur' },],
    params: [{ required: true, message: '请输入入参', trigger: 'blur' }]
});
function getLoginApi() {
    LoginApiGet({}).then((res) => {
        if (res["data"]["code"] == 1) {
            loginFormR.params = JSON.parse(res["data"]["data"]["params"]);
            // loginFormR.params = res["data"]["data"]["params"];

            loginFormR.url = res["data"]["data"]["url"];
        } else {
            ElMessage({
                message: res.data.msg,
                type: "error",
            });
        }
    });
}
const testForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.validate(async (valid, fields) => {
        if (valid) {
            LoginTestPost(JSON.stringify(loginFormR)).then(res => {
                console.log(res)
                if (res["data"]["code"] == 1) {
                    ElMessage({
                        message: '登录成功.',
                        type: 'success',
                    })
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

const submitForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.validate(async (valid, fields) => {
        if (valid) {
            LoginSavePost(JSON.stringify(loginFormR)).then(res => {
                console.log(res)
                if (res["data"]["code"] == 1) {
                    ElMessage({
                        message: '保存成功1.',
                        type: 'success',
                    })
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
onMounted(() => {
    getLoginApi();
});
</script>
<style scoped>
</style>
  