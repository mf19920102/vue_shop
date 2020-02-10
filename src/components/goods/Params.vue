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
            @change="categorySelected"
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- tab标签组件 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" :disabled="isDisabled" @click="dialogVisible=true">添加参数</el-button>
          <el-table :data="manyTabData" border stripe>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template>
                <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" :disabled="isDisabled" @click="dialogVisible=true">添加属性</el-button>
          <el-table :data="onlyTabData" border stripe>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template>
                <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加参数对话框 -->
    <el-dialog
      @close="addDialogClosed"
      :title="'添加'+titleName"
      :visible.sync="dialogVisible"
      width="50%"
    >
      <el-form label-width="100px" :model="addParamForm" :rules="addParamsRules" ref="addParamsRef">
        <el-form-item :label="titleName" prop="attr_name">
          <el-input v-model="addParamForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 当前选中的标签的name
      activeName: 'many',
      // 动态参数数据
      manyTabData: [],
      // 静态参数数据
      onlyTabData: [],
      // 商品分类
      categoryList: [],
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 选中的父级分类的Id数组
      selectedKeys: [],
      dialogVisible: false,
      addParamForm: {
        attr_name: ''
      },
      // 校验规则
      addParamsRules: {
        attr_name: [
          {
            required: true,
            message: '请输入参数名称',
            trigger: 'blur'
          }
        ]
      }
    };
  },
  methods: {
    // 商品分类列表
    async getCategoryList() {
      const { data: resp } = await this.$http.get('categories', {
        params: { type: 3 }
      });
      if (resp.meta.status != 200) {
        return this.$message.error('商品分类数据获取失败');
      }
      this.categoryList = resp.data;
    },
    // 标签lab点击处理事件
    handleTabClick() {
      this.getParamsList();
    },
    // 分类选择处理事件
    categorySelected() {
      this.getParamsList();
    },

    // 获取参数数据
    async getParamsList() {
      // 只能选择到三级分类
      if (this.selectedKeys.length != 3) {
        this.selectedKeys = [];
        return;
      }
      // 根据分类id和当前参数类别获取属性
      const { data: res } = await this.$http.get(
        `categories/${this.categoryId}/attributes`,
        {
          params: { sel: this.activeName }
        }
      );
      if (res.meta.status != 200) {
        return this.$message.error('获取参数列表失败');
      }
      // 判断数据类型
      if (this.activeName == 'many') {
        this.manyTabData = res.data;
      } else {
        this.onlyTabData = res.data;
      }
    },
    // 添加对话框关闭事件
    addDialogClosed() {
      this.$refs.addParamsRef.resetFields();
    },
    // 添加参数
    addParams() {
      // 表单校验
      this.$refs.addParamsRef.validate(async valid => {
        if (!valid) {
          return;
        }
        const { data: resp } = await this.$http.post(
          `categories/${this.categoryId}/attributes`,
          {
            attr_name: this.addParamForm.attr_name,
            attr_sel: this.activeName
          }
        );
        if (resp.meta.status != 201) {
          return this.$message.error('添加参数失败');
        }
        this.$message.success('添加参数成功');
        // 关闭对话框
        this.dialogVisible = false;
        // 重新加载数据
        this.getParamsList();
      });
    }
  },
  computed: {
    // 如果没有选择到第三级参数菜单，那么按钮被禁用
    isDisabled() {
      if (this.selectedKeys.length != 3) {
        return true;
      }
      return false;
    },
    // 当前选中的三级分类的id
    categoryId() {
      if (this.selectedKeys.length == 3) {
        return this.selectedKeys[2];
      }
      return null;
    },
    titleName() {
      return this.activeName == 'many' ? '动态参数' : '静态属性';
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