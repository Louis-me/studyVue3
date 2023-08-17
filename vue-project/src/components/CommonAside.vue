<template>
    <el-menu class="el-menu-vertical-demo" background-color="#545c64" text-color="#fff" :collapse-transition="false"
         active-text-color="#ffd04b" :router="true"  >
               <el-sub-menu index="1">
                 <template #title>
                   <el-icon>
                     <Menu />
                   </el-icon>
                   <span>用户管理</span>
                 </template>
                   <el-menu-item index="/son1">用户列表</el-menu-item>
                   <el-menu-item index="/son2">角色列表</el-menu-item>
               </el-sub-menu>
               <el-sub-menu index="2">
                 <template #title>
                   <el-icon>
                     <Menu />
                   </el-icon>
                   <span>商品管理</span>
                 </template>
                   <el-menu-item index="/order">订单管理</el-menu-item>
                   <el-menu-item index="/son3">套件管理</el-menu-item>
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
 