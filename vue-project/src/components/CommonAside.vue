<template>
    <el-menu class="el-menu-vertical-demo" background-color="#545c64" text-color="#fff" :collapse-transition="false"
         active-text-color="#ffd04b" :router="true"  >
               <el-sub-menu index="1">
                 <template #title>
                   <el-icon>
                     <Menu />
                   </el-icon>
                   <span>用例管理</span>
                 </template>
                  <el-menu-item index="/case">用例管理</el-menu-item>
                   <el-menu-item index="/suite">套件管理</el-menu-item>
                   <el-menu-item index="/fuzz">模糊用例规则</el-menu-item>
               </el-sub-menu>
               <el-sub-menu index="2">
                 <template #title>
                   <el-icon>
                     <Menu />
                   </el-icon>
                   <span>配置管理</span>
                 </template>
                   <el-menu-item index="/ApiLogin">登录配置</el-menu-item>
                   <el-menu-item index="/ApiTest">单接口测试</el-menu-item>
               </el-sub-menu>
               <el-sub-menu index="3">
                 <template #title>
                   <el-icon>
                     <Menu />
                   </el-icon>
                   <span>任务管理</span>
                 </template>
                   <el-menu-item index="/RealTimeTask">实时任务管理</el-menu-item>
                   <el-menu-item index="/TimingTask">定时任务管理</el-menu-item>
               </el-sub-menu>
               <el-sub-menu index="4">
                 <template #title>
                   <el-icon>
                     <Menu />
                   </el-icon>
                   <span>报告管理</span>
                 </template>
                   <el-menu-item index="/Report">报告列表</el-menu-item>
                   <el-menu-item index="/GrapReport">图形报告</el-menu-item>
               </el-sub-menu>
               <el-sub-menu index="5">
                 <template #title>
                   <el-icon>
                     <Menu />
                   </el-icon>
                   <span>日志管理</span>
                 </template>
                   <el-menu-item index="/ServerLog">日志列表</el-menu-item>
               </el-sub-menu>
   </el-menu>
 </template>
 
 
 
 
 <style lang="less" scoped>
 .icons {
   width: 18px;
   height: 18px;
   margin-right: 4px;
 }
 .el-menu-vertical-demo {
   width: 100%;
   border-right: none;
   h3 {
       color: #fff;
       text-align: center;
       margin-top: 10px;
   }
 }
 </style>
 