<template>
    <div>
      <!-- :model-value="props.show"  调用下方js中props-->
      <el-dialog :model-value="props.show" title="新增" width="50%" :before-close="handleClose">
        <el-form ref="realTimeFormRef" :model="realTimeFormR" :rules="rules">
          <!-- prop="name" 必须加这个，才能让自定义规则生效 -->
          <el-form-item label="任务名称" :label-width="formLabelWidth" prop="name">
            <el-input v-model="realTimeFormR.name" autocomplete="off" />
          </el-form-item>
            <el-form-item label="关联套件" :label-width="formLabelWidth" prop="suite_id">
                            <el-select v-model="realTimeFormR.suite_id" placeholder="请选择">
                                <el-option
                                    v-for="item in suitListR.list"
                                    :key="item.id"
                                    :id="item.id"
                                    :label="item.name"
                                    :value="item.id">
                                </el-option>
                            </el-select>                        
                        </el-form-item>
        
          <el-form-item>
            <span style="margin-left: 80px;">
  
              <el-button type="primary" @click="handleClose()">取消</el-button>
              <el-button type="primary" @click="submitForm(realTimeFormRef)">确定</el-button>
            </span>
          </el-form-item>
  
        </el-form>
  
      </el-dialog>
    </div>
  </template>
  <script lang="ts" setup>
  import { reactive, ref,onMounted } from 'vue'
  import { ElMessage, FormInstance, FormRules } from 'element-plus'
  
  import { SuiteAllGet,RealTimeAddPost } from "../../../../utils/html.js"

// 声明套件列表的格式
  const suitListR = reactive({
    list: [] as { name: string, id: number }[]
  })
  interface realTimeForm {
    name: string,
    suite_id: number,
  }
  // 定义表单绑定的model
  const realTimeFormR = reactive({
    name: '',
    suite_id: null,
  })
  
  const realTimeFormRef = ref<FormInstance>()
  
  // 定义规则
  const rules = reactive<FormRules<realTimeForm>>({
    name: [{ required: true, message: '请输入用户名', trigger: 'blur' },],
    suite_id: [{required: true,message: '请选择套件',},],

  });
  // props 接收父组件传过来的，父传子属性值
  const props = defineProps({
    show: Boolean,
  });
  
  // 引用父组件的函数，子传父方法
  const emits = defineEmits(["set-show","get-realtime-task"]);
  const formLabelWidth = '120px'
  
  function handleClose() {
    //关闭对话框，调用了父组件的setShow方法，此时因为传递flase表示关闭弹框
    emits("set-show", false);
  }
  const submitForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.validate(async (valid, fields) => {
      if (valid) {
        RealTimeAddPost(JSON.stringify(realTimeFormR)).then(res => {
          if (res["data"]["code"] == 1) {
            ElMessage({
              message: '新增成功.',
              type: 'success',
            })
            // 调用父组件方法，关闭编辑弹框
            emits("set-show", false);
            // 调用父组件方法，查询订单列表数据
            emits("get-realtime-task");
  
  
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

  const getSuites=() => {
    SuiteAllGet({}).then((res) => {
    if (res["data"]["code"] == 1) {
      suitListR.list = res["data"]["data"];
    } else {
      ElMessage({
        message: res.data.msg,
        type: "error",
      });
    }
  });
  }
  onMounted(() => {
   getSuites()
});
  </script>
  <style scoped></style>