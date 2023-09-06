<template>
  <div>
    <el-dialog :model-value="showContact" title="关联用例" width="50%" :before-close="handleEditClose" :modal="false">
      <el-transfer v-model="suiteToCaseIds" :data="transformedCaseList" filterable :titles="['用例', '已关联']"></el-transfer>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleEditClose()">取 消</el-button>
        <el-button type="primary" @click="editSuiteCaseEvent()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { SuiteToCaseGet, CaseAllGet, SuiteSetCasePost } from "../../../../utils/html.js"
// 已关联的用例id
const suiteToCaseIds = ref([] as number[]);
// 套件id
var suiteId = 0
// 用例列表
const CaseListR = ref<Map<any, any>[]>([]);
// props 接收父组件传过来的变量，控制展示编辑弹框变量
defineProps<{
  showContact: Boolean,
}>()
// 引用后父组件的函数
const emits = defineEmits(["set-edit-show-contact", "get-suite"]);
// 关闭窗口
function handleEditClose() {
  suiteToCaseIds.value = []
  //关闭对话框,调用的父方法
  emits("set-edit-show-contact", false);
}
// 提交修改
function editSuiteCaseEvent() {
  if (suiteToCaseIds.value.length == 0) {
    ElMessage({
      message: "请选择需要关联的用例",
      type: 'error',
    })
    return
  }
  // 拼接请求参数
  var params = {}
  params["suite_id"] = suiteId
  params["case_ids"] = suiteToCaseIds.value
  SuiteSetCasePost(JSON.stringify(params)).then(res => {
    if (res["data"]["code"] == 1) {
      ElMessage({
        message: '关联用例成功.',
        type: 'success',
      })
      suiteToCaseIds.value = []
      //关闭关联弹框
      emits("set-edit-show-contact", false);
      // 请求套件列表
      emits("get-suite");
    } else {
      ElMessage({
        message: res.data.msg,
        type: 'error',
      })
    }
  })
}
//注意：使用defineExpose()暴露方法，父组件才能调用。
defineExpose({ initEditData });
// 接受父组件传来的id,查询已经关联的用例数据
function initEditData(id: number) {
  // 赋值套件id
  suiteId = id
  SuiteToCaseGet({ "id": id }).then(res => {
    if (res["data"]["code"] == 1) {
      for (var i = 0; i < res.data.data.length; i++) {
        suiteToCaseIds.value.push(res.data.data[i].case_id)
      }
    } else {
      ElMessage({
        message: res.data.msg,
        type: 'error',
      })
    }
  })
}
// 获取用例列表
function getCaseList() {
  CaseAllGet().then((res) => {
    if (res["data"]["code"] == 1) {
      for (var i = 0; i < res.data.data.length; i++) {
        const newItem = new Map();
        newItem.set('key', res.data.data[i]["id"]);
        newItem.set('label', res.data.data[i].name);
        CaseListR.value.push(newItem);
      }
    } else {
      ElMessage({
        message: res.data.msg,
        type: "error",
      });
    }
  });
}
// 得到用例后，需要转换为el-transfer 可接受的格式内容
const transformedCaseList = computed(() => {
  return CaseListR.value.map(item => ({
    key: item.get('key'),
    label: item.get('label')
  }));
});

onMounted(() => {
  getCaseList()
});
</script>
<style scoped></style>