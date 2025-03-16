<template>
  <el-container class="app-wrapper">
    <el-aside width="200px">
      <el-menu
        :router="true"
        class="sidebar-menu"
        default-active="/orders"
      >
        <el-menu-item index="/orders">
          <el-icon><Document /></el-icon>
          <span>订单管理</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    
    <el-container>
      <el-header>
        <div class="header-title">订单管理系统</div>
      </el-header>
      
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { Document } from '@element-plus/icons-vue'
</script>

<style scoped>
.app-wrapper {
  height: 100vh;
}

.sidebar-menu {
  height: 100%;
  border-right: solid 1px #e6e6e6;
}

.el-header {
  background-color: #fff;
  border-bottom: solid 1px #e6e6e6;
  display: flex;
  align-items: center;
}

.header-title {
  font-size: 18px;
  font-weight: bold;
}
</style>