<template>
  <!-- 面包屑导航区 -->
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card class="box-card">
      <!-- 搜索区 -->
      <!-- el-row为layout布局 span：指定栅格占据的列数 gutter：栅格间隔 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            class="input-with-select"
            clearable
            @clear="getUserList"
          >
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
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
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="修改" placement="top-start" :enterable="false">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="showEditDialog(scope.row)"
              ></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="删除" placement="top-start" :enterable="false">
              <el-button
                type="danger"
                icon="el-icon-delete"
                @click="removeUser(scope.row.id)"
                size="mini"
              ></el-button>
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
    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="35%" @close="addDialogClose">
      <!-- 对话框主体区表单 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>

      <!-- 对话框底部按钮区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户对话框 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="35%">
      <el-form :model="userInfo" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userInfo.username" disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userInfo.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="userInfo.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    // 自定义邮箱校验规则
    var emailCheck = (rule, value, callback) => {
      // 校验通过
      if (value.indexOf('@qq.com') > 0 || value.indexOf('@163.com') > 0) {
        return callback();
      }
      // 校验不通过
      callback(new Error('邮箱格式不正确'));
    };
    return {
      // 控制添加用户对话框的显示与隐藏
      addDialogVisible: false,
      editDialogVisible: false,
      userList: [],
      userInfo: {},
      total: 0,
      // 获取用户列表请求参数
      queryInfo: {
        query: '',
        // 当前页
        pagenum: 1,
        // 每页显示条数
        pagesize: 2
      },
      // 添加用户表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      breadcrumbList:[],
      // 表单验证规则
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          // 使用自定义邮箱校验规则
          { validator: emailCheck, trigger: 'blur' }
        ],
        mobile: [{ required: true, message: '请输入手机号', trigger: 'blur' }]
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
    async getUserInfo(id) {
      const { data: res } = await this.$http.get('users/' + id);
      this.userInfo = res.data;
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
    },
    // 添加用户
    addUser() {
      // 表单校验
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return;
        }
        // 调用后台添加接口
        const { data: resp } = await this.$http.post('users', this.addForm);
        if (resp.meta.status != 201) {
          return this.$message.error('添加用户失败');
        }
        this.$message.success('添加成功');
        // 隐藏添加用户对话框
        this.addDialogVisible = false;
        // 刷新用户列表
        this.getUserList();
      });
    },
    // 修改对话框
    showEditDialog(userInfo) {
      this.editDialogVisible = true;
      this.getUserInfo(userInfo.id);
    },
    // 关闭添加用户对话框重置添加表单数据
    addDialogClose() {
      this.$refs.addFormRef.resetFields();
    },
    async updateUser() {
      const { data: res } = await this.$http.put('users/' + this.userInfo.id, {
        email: this.userInfo.email,
        mobile: this.userInfo.mobile
      });
      if (res.meta.status != 200) {
        return this.$message.error('用户信息更新失败');
      }
      // 关闭对话框
      this.editDialogVisible = false;
      this.getUserList();
      this.$message.success('用户信息更新成功');
    },
    // 删除之前提示弹窗，取消时会执行catch中的代码
    async removeUser(id) {
      const confirmResult = await this.$confirm('是否确定删除', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await this.$http.delete('users/' + id);
          if (res.meta.status != 200) {
            return this.$message.error('删除失败');
          }
          this.queryInfo.pagenum=1;
          this.getUserList();
          return this.$message.success('删除成功');;
        })
        .catch(() => {
          return this.$message.info('删除已取消');
        });
    }
  },
  created() {
    this.getUserList();
  }
};
</script>>