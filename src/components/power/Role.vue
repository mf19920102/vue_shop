<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <!-- 添加角色按钮 -->
      <!-- el-row为栅格布局 -->
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表 -->
      <el-table :data="roleList" border strap>
        <!-- 展开列 -->
        <el-table-column type="expand" label="序号">
          <template slot-scope="scope">
            <el-row
              :class="['bdbottom',i1==0?'bdtop':'','vcenter']"
              v-for="(item1,i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <el-row
                  :class="[i2==0?'':'bdtop','vcenter']"
                  v-for="(item2,i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row,item2.id)"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      closable
                      type="warning"
                      v-for="(item3) in item2.children"
                      :key="item3.id"
                      @close="removeRightById(scope.row,item3.id)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
            <el-button
              type="warning"
              size="mini"
              @click="showRightSettingDialog(scope.row)"
              icon="el-icon-setting"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分配权限弹窗 -->
    <el-dialog
      title="分配权限"
      :visible.sync="settingRightDialogVisible"
      width="50%"
      @close="rightDialogClose"
    >
      <!-- 树形组件 -->
      <el-tree
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="selectedKeys"
        :data="rightsList"
        :props="treeProps"
        ref="treeRef"
      ></el-tree>
      <span>
        <el-button @click="settingRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      settingRightDialogVisible: false,
      // 角色数据
      roleList: [],
      // 所有权限数据
      rightsList: [],
      // 树形控件属性绑定数据
      treeProps: {
        // 显示名称
        label: 'authName',
        // 父子关系关联字段
        children: 'children'
      },
      // 树形组件中默认选中的节点的id值
      selectedKeys: [],
      // 当前编辑的权限的角色id
      roleId: ''
    };
  },
  methods: {
    async getRolesList() {
      const { data: res } = await this.$http.get('roles');
      if (res.meta.status != 200) {
        this.$message.error('角色列表获取失败');
      }
      this.roleList = res.data;
      console.log(this.roleList);
    },
    removeRightById(role, rightId) {
      const confirmResult = this.$confirm('是否确定删除', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(
            `roles/${role.id}/rights/${rightId}`
          );
          if (res.meta.status != 200) {
            return this.$message.error('删除失败');
          }
          // 更新角色数据而不是重新获取
          role.children = res.data;
          return this.$message.success('删除成功');
        })
        .catch(() => {
          return this.$message.info('删除已取消');
        });
    },
    // 分配权限
    async showRightSettingDialog(role) {
      this.roleId = role.id;
      const { data: res } = await this.$http.get('rights/tree');
      if (res.meta.status != 200) {
        return this.$$message.error('数据获取失败');
      }
      this.rightsList = res.data;
      // 递归获取最自己节点的id
      this.getLeafNodeKey(role, this.selectedKeys);
      this.settingRightDialogVisible = true;
    },
    // 获取最子级节点的id
    getLeafNodeKey(node, arr) {
      if (!node.children) {
        return arr.push(node.id);
      }

      node.children.forEach(item => {
        this.getLeafNodeKey(item, arr);
      });
    },
    // 分配权限对话框关闭调用函数
    rightDialogClose() {
      // 清空已选择的权限的数据
      this.selectedKeys = [];
    },
    // 更新权限
    async updateRights() {
      // 获取树形组件中选中和版选中的node的key
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ];
      const ids = keys.join(',');

      // 调用更新方法
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        {
          rids: ids
        }
      );
      if(res.meta.status!=200){
        return this.$message.error('权限更新失败');
      }
      this.$message.success('权限更新成功');
      // 关闭对话框
      this.settingRightDialogVisible = false;
      // 更新权限数据
      this.getRolesList();

    }
  },
  created() {
    this.getRolesList();
  }
};
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>