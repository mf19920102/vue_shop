<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片布局 -->
    <el-card>
      <el-alert show-icon :closable="false" title="注意:只允许为第三极分类设置相关参数!" type="warning"></el-alert>
      <el-row class="cat_opt">
        <el-col>
          <span>商品分类:</span>
          <el-cascader
            expand-trigger="hover"
            :options="categoryList"
            v-model="selectedKeys"
            :props="cascaderProps"
            clearable
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- tab标签组件 -->
      <el-tabs>
        <el-tab-pane label="动态参数">
          <el-button type="primary">添加参数</el-button>
        </el-tab-pane>
        <el-tab-pane label="静态属性">
           <el-button type="primary">添加属性</el-button>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 商品分类
      categoryList: [],
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 选中的父级分类的Id数组
      selectedKeys: []
    };
  },
  methods: {
    async getCategoryList() {
      const { data: resp } = await this.$http.get('categories',{
        params:{type:3}
      });
      if (resp.meta.status != 200) {
        return this.$message.error('商品分类数据获取失败');
      }
      this.categoryList = resp.data;
    }
  },
  created() {
    this.getCategoryList();
  }
};
</script>
<style lang="less" scoped>
.cat_opt {
  margin: 15px 0;
}
</style>