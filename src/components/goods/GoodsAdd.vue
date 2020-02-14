<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 提示区域 -->
      <el-alert show-icon :closable="false" center title="添加商品信息" type="warning"></el-alert>
      <!-- 进度条 -->
      <el-steps align-center :space="250" :active="activeIndex-0" finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-divider></el-divider>
      <!-- tab拦区域 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-position="top">
        <el-tabs v-model="activeIndex" tab-position="left" style="height: 200px;">
          <el-tab-pane label="基本信息" namne="0">用户管理</el-tab-pane>
          <el-tab-pane label="商品参数" namne="1">配置管理</el-tab-pane>
          <el-tab-pane label="商品属性" namne="2">角色管理</el-tab-pane>
          <el-tab-pane label="商品图片" namne="3">定时任务补偿</el-tab-pane>
          <el-tab-pane label="商品内容" namne="4">定时任务补偿</el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeIndex: 0,
      addForm: {},
      addFormRules: {}
    };
  },
  methods: {}
};
</script>

<style lang="less" scoped>
</style>