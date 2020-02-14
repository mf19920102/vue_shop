<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
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
            @clear="getGoodsList"
          >
            <el-button slot="append" @click="getGoodsList" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- 表格区域 -->
      <el-table :data="goodsList" stripe border>
        <el-table-column label="序号" type="index"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column label="商品价格(元)" prop="goods_price" width="100px"></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight" width="100px"></el-table-column>
        <el-table-column label="创建时间" width="180px">
          <!-- 使用自定义时间过滤器格式化时间 -->
          <template slot-scope="scope">{{scope.row.add_time|dateFormat}}</template>
        </el-table-column>
        <el-table-column label="操作" width="200px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="removeById(scope.row.goods_id)"
            >删除</el-button>
            <el-button type="danger" icon="el-icon-edit" size="mini">修改</el-button>
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
      total: 0,
      queryInfo: {
        query: '',
        // 当前页
        pagenum: 1,
        // 每页显示条数
        pagesize: 5
      },
      goodsList: []
    };
  },
  methods: {
    async getGoodsList() {
      const { data: res } = await this.$http.get('goods', {
        params: this.queryInfo
      });

      if (res.meta.status != 200) {
        return this.$message.error('商品列表获取失败');
      }
      this.goodsList = res.data.goods;
      this.total = res.data.total;
    },
    async removeById(id){
        const confirmResult = await this.$confirm('是否确定删除', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(`goods/${id}`);
          if (res.meta.status != 200) {
            return this.$message.error('删除失败');
          }
          this.queryInfo.pagenum = 1;
          this.getGoodsList();
          return this.$message.success('删除成功');
        })
        .catch(() => {
          return this.$message.info('删除已取消');
        });
    },
    goAddPage(){
       // 路由导航到添加页面
       this.$router.push('/goods/add'); 
    },
    // 选择每页显示数据条数回调
    handleSizeChange(newSize) {
      // 重新获取用户列表
      this.queryInfo.pagesize = newSize;
      this.getGoodsList();
    },
    // 当前页码改变回调
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getGoodsList();
    }
  },
  created() {
    this.getGoodsList();
  }
};
</script>

<style lang="less" scoped>
</style>