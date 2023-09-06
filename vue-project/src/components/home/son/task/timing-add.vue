<template>
    <div>
      <!-- :model-value="props.show"  调用下方js中props-->
      <el-dialog :model-value="props.show" title="新增" width="50%" :before-close="handleClose">
        <el-form ref="timingFormRef" :model="timingFormR" :rules="rules">
          <!-- prop="name" 必须加这个，才能让自定义规则生效 -->
          <el-form-item label="任务名称" :label-width="formLabelWidth" prop="name">
            <el-input v-model="timingFormR.name" autocomplete="off" />
          </el-form-item>
            <el-form-item label="关联套件" :label-width="formLabelWidth" prop="suite_id">
                            <el-select v-model="timingFormR.suite_id" placeholder="请选择">
                                <el-option
                                    v-for="item in suitListR.list"
                                    :key="item.id"
                                    :id="item.id"
                                    :label="item.name"
                                    :value="item.id">
                                </el-option>
                            </el-select>                        
                        </el-form-item>
                        <el-form-item label="选择开始时间" prop="start_time">
                            <el-time-select 
                                v-model="timingFormR.start_time"
                                start="11:29"
                                step="00:01"
                                end="18:30"
                                format="HH:mm:ss"
                                placeholder="选择时间">
                            </el-time-select>

                        
                        </el-form-item>
        
          <el-form-item>
            <span style="margin-left: 80px;">
  
              <el-button type="primary" @click="handleClose()">取消</el-button>
              <el-button type="primary" @click="submitForm(timingFormRef)">确定</el-button>
            </span>
          </el-form-item>
  
        </el-form>
  
      </el-dialog>
    </div>
  </template>
  <script lang="ts" setup>
  import { reactive, ref,onMounted } from 'vue'
  import { ElMessage, FormInstance, FormRules } from 'element-plus'
  
  import { SuiteAllGet,TimingTaskAddPost } from "../../../../utils/html.js"

// 声明套件列表的格式
  const suitListR = reactive({
    list: [] as { name: string, id: number }[]
  })
  interface timingForm {
    name: string,
    suite_id: number,
    start_time: string
  }
  // 定义表单绑定的model
  const timingFormR = reactive({
    name: '',
    suite_id: null,
    start_time : ""
  })
  
  const timingFormRef = ref<FormInstance>()
  
  // 定义规则
  const rules = reactive<FormRules<timingForm>>({
    name: [{ required: true, message: '请输入用户名', trigger: 'blur' },],
    suite_id: [{required: true,message: '请选择套件',},],
    start_time: [{required: true,message: '请选择时间',},],


  });
  // props 接收父组件传过来的，父传子属性值
  const props = defineProps({
    show: Boolean,
  });
  
  // 引用父组件的函数，子传父方法
  const emits = defineEmits(["set-show","get-timing-task"]);
  const formLabelWidth = '120px'
  
  function handleClose() {
    //关闭对话框，调用了父组件的setShow方法，此时因为传递flase表示关闭弹框
    emits("set-show", false);
  }
  const submitForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.validate(async (valid, fields) => {
      if (valid) {
        TimingTaskAddPost(JSON.stringify(timingFormR)).then(res => {
          if (res["data"]["code"] == 1) {
            ElMessage({
              message: '新增成功.',
              type: 'success',
            })
            // 调用父组件方法，关闭编辑弹框
            emits("set-show", false);
            // 调用父组件方法，查询订单列表数据
            emits("get-timing-task");
  
  
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