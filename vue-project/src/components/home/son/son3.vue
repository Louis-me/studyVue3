<template>
    <div @click="getOrders">点击我</div>
    </template>
    
    <script setup lang="ts">
        import { ElMessage } from 'element-plus'
//引入路由函数
import { useRouter } from "vue-router";
const router = useRouter()
// 引用登录请求
import { GetOrders } from "../../../utils/html.js"
function getOrders() {
    GetOrders().then(res => {
        console.log(res)
        if (res["data"]["code"] == 1) {
          console.log("退出")
          console.log(res)
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