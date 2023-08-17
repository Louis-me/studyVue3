<script setup>
 
</script>
 
<template>
<el-config-provider>

 <router-view></router-view>
</el-config-provider>

</template>
 
<style  scoped>
  .globalLoading{
    position: absolute;
    left:0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: rgba(248, 247, 247,.5);
    z-index: 9999999999999999999999999999999999;
   
  }

</style>
