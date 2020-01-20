<template>
  <!-- 面包屑导航区 -->
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>活动管理</el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
      <el-breadcrumb-item>活动详情</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card class="box-card">
      <!-- 搜索区 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" class="input-with-select" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search"  @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表区 -->
      <el-table :data="userList" border stripe>
        <el-table-column label="序号" type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="changeUserState(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template>
            <el-tooltip effect="dark" content="修改" placement="top-start" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="删除" placement="top-start" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="权限" placement="top-start" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userList: [],
      total: 0,
      // 获取用户列表请求参数
      queryInfo: {
        query: '',
        // 当前页
        pagenum: 1,
        // 每页显示条数
        pagesize: 2
      }
    };
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo
      });
      if (res.meta.status != 200) {
        return this.$message.error('用户列表获取失败');
      }
      this.userList = res.data.users;
      this.total = res.data.total;
    },
    // 选择每页显示数据条数回调
    handleSizeChange(newSize) {
      // 重新获取用户列表
      this.queryInfo.pagesize = newSize;
      this.getUserList();
    },
    // 当前页码改变回调
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getUserList();
    },
    // 修改用户状态
    async changeUserState(userInfo) {
      const { data: resp } = await this.$http.put(
        `users/${userInfo.id}/state/${userInfo.mg_state}`
      );
      if (resp.meta.status != 200) {
        // 保证页面状态没有变化
        this.userInfo.mg_state = !this.userInfo.mg_state;
        return this.$message.error('用户状态修改失败');
      }
    }
  },
  created() {
    this.getUserList();
  }
};
</script>>