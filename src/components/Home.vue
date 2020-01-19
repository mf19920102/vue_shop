<template>
  <!--主页容器-->
  <el-container class="homeContainer">
    <!--header区-->
    <el-header>
      <div>
        <img src="../assets/heima.png" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="loginout">退出</el-button>
    </el-header>
    <!--main区域-->
    <el-container>
      <!--左侧导航栏区-->
      <el-aside width="260px">
        <el-menu active-text-color="#409EFF" :unique-opened="true">
          <!--一级菜单-->
          <el-submenu :index="item.id+''" :key="item.id" v-for="item in menuList">
            <template slot="title">
              <!--图片-->
              <i :class="item.iconImg"></i>
              <span>{{item.authName}}</span>
            </template>
            <!--二级菜单-->
            <el-menu-item :index="subItem.id+''" :key="subItem.id" v-for="subItem in item.children">
              <template slot="title">
                <!--图片-->
                <i class="el-icon-menu"></i>
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!--右侧主页区域-->
      <el-main>
        <!-- 主页组件路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data(){
      return{
          // 左侧菜单数据
          menuList:[]
      }
  },
  methods: {
    loginout() {
      // 清空sessionstorage并跳转到login页面
      window.sessionStorage.clear();
      this.$router.push('/login');
    },
    // 设置菜单项图标
    initMenuIcon(){
      this.menuList.forEach(item=>{
        if(item.id=='125'){
          item.iconImg = 'iconfont icon-user';
        }
        if(item.id=='103'){
          item.iconImg = 'iconfont icon-tijikongjian';
        }
        if(item.id=='101'){
          item.iconImg = 'iconfont icon-shangpin';
        }
        if(item.id=='102'){
          item.iconImg = 'iconfont icon-danju';
        }
        if(item.id=='145'){
          item.iconImg = 'iconfont icon-baobiao';
        }
        // this.iconList.push(icon);
      })

    },
    // 获取左侧菜单
    async getMenuList() {
      const { data: resp } =await this.$http.get('menus');
      if(resp.meta.status!=200){
        return this.$message.error(resp.meta.msg);
      }
      this.menuList = resp.data;
      this.initMenuIcon();
    }
  },
  // 页面加载时获取左侧菜单
  created() {
      this.getMenuList();
  }
};
</script>

<style lang="less" scoped>
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  // 字体颜色大小
  color: #fff;
  font-size: 20px;
  // 控制文本位置
  div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}

.el-aside {
  //   background-color: #333744;
  background-color: #fff;
  .el-menu{
    border-right: none;
  }
}
.el-main {
  background-color: #eaedf1;
}
.homeContainer {
  height: 100%;
}
.iconfont{
  margin-right: 10px;
}
</style>