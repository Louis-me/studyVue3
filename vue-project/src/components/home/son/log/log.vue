<template>
    <el-breadcrumb>
      <el-breadcrumb-item>日志管理</el-breadcrumb-item>
      <el-breadcrumb-item>报告查看</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card" style="margin-top: 10px">
         <el-row>
                <el-col :span="4">
                    <div class="grid-content bg-purple" style="border:1px solid #ccc;min-height: 500px">
                        <el-tree :data="logs_file.files" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
                    </div>
                </el-col>
                <el-col :span="20">
                    <div class="grid-content bg-purple-light">
                        <div style="background-color: black;color: azure; min-height: 500px; overflow: auto; padding-left: 10px;">
                            <div  v-for="item in logs_content.content">
                                {{item}}
                            </div>
                        </div>
                    </div>
                </el-col>
            </el-row>
           
    </el-card>
</template>
<script lang="ts" setup>
    import { ref, onMounted, reactive } from "vue";
  // 引用请求
  import { LogsGet, LogContontPost} from "../../../../utils/html.js";
  import { ElMessage, ElMessageBox } from "element-plus";
  const defaultProps = {
        children: 'children',
        label: 'label',
    }
    // 文件列表
    const logs_file = reactive({
        files: [],
  });
  // 得到文件内容
  const logs_content = reactive({
    content: [],
  });
  // 查询文件条件
  const queryLogR = reactive({
    name: "",
    root: ""
  });
  // 点击文件获取内容
  const handleNodeClick =(obj) => {
    queryLogR.name = obj.label
    LogContontPost(JSON.stringify(queryLogR)).then((res) => {
      if (res["data"]["code"] == 1) {
        logs_content.content = res["data"]["data"]["content"];
      } else {
        ElMessage({message: res.data.msg,type: "error" });
      }
    });

  }
  const getLogs = () => {
    LogsGet().then((res) => {
      if (res["data"]["code"] == 1) {
        logs_file.files = res["data"]["data"]["files"];
        queryLogR.root = res["data"]["data"]["root"];
      } else {
        ElMessage({message: res.data.msg,type: "error" });
      }
    });
  }
  onMounted(() => {
    getLogs();
  });
</script>