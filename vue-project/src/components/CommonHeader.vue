<template>
    <el-header>
        <div class="l-content">
            <!-- 这个button本来应该是有用途的，但是与本笔记主体内容无关，所以去除了，只保留样式 -->
            <el-button size="small" plain>
                <el-icon :size="20">
                    <Menu />
                </el-icon>
            </el-button>
        </div>
        <div class="r-content">
            <el-dropdown>
                <span class="el-dropdown-link">
                    <img class="user" src="../assets/images/user.jpeg" alt="头像" />
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item>我的</el-dropdown-item>
                        <el-dropdown-item  @click="loginOut">退出</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </el-header>
</template>




<style lang="less" scoped>
header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    background: #333;
}
.l-content {
    display: flex;
    align-items: center;
    .el-button {
        margin-right: 16px;
        margin-left: 10px;
    }
    h3 {
        color: #fff;
    }
}
.r-content {
    .user {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin-right: 10px;
    }
}
</style>
<script lang="ts" setup>
import { ElMessage } from 'element-plus'
//引入路由函数
import { useRouter } from "vue-router";
const router = useRouter()
// 引用登录请求
import { LoginOutPost } from "../utils/html.js"
function loginOut() {
    LoginOutPost().then(res => {
        console.log(res)
        if (res["data"]["code"] == 1) {
          console.log("退出")
          console.log(res)
          ElMessage({
            message: '退出登录成功.',
            type: 'success',
          })
          localStorage.setItem("username", "")
          router.push("/login")
        } else {
            ElMessage({
            message: res.data.msg,
            type: 'error',
          })
        }
        
    })
}
</script>