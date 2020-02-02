import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import User from '../components/user/User.vue'
import Right from '../components/power/Right.vue'
import Role from '../components/power/Role.vue'
Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect:'/welcome',
    children: [
      {
        path: '/welcome',
        component: Welcome
      },
      {
        path: '/users',
        component: User
      },
      {
        path:'/rights',
        component:Right
      },
      {
        path:'/roles',
        component:Role
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 挂载路由导航守卫，保护需要登录后才能访问的url
router.beforeEach((to, from, next) => {

  /**
   * to:将要访问的url
   * from：表示从哪个路径访问过来的
   * next：是一个函数，表示放行
   */
  // 登录页直接放行
  if (to.path == '/login') {
    return next();
  }
  // 非登录页判断是否有token,正常应该需要到后台去校验token是否过期
  const token = window.sessionStorage.getItem('token');
  if (!token) {
    // token为空跳转到登录页
    return next('/login')
  }
  // 否则放行
  next();
})

export default router
