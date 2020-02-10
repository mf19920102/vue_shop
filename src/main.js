import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式表
import './assets/css/global.css'
// 导入字体图标
import './assets/fonts/iconfont.css'
// 导入axios
import axios from 'axios'
// table-tree插件
import ZkTable from 'vue-table-with-tree-grid'

// 设置根路径
axios.defaults.baseURL = 'http://106.13.51.15:8888/api/private/v1/'
// axios请求拦截器，用于设置header
axios.interceptors.request.use(config => {
  // Authorization对应header中的key Authorization:jhasdonddaa
  config.headers.Authorization = window.sessionStorage.getItem('token');
  return config;
})
// 挂载axios到vue组件
Vue.prototype.$http = axios

Vue.config.productionTip = false
// 注册table-tree插件
Vue.component('tree-table', ZkTable)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
