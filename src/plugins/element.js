import Vue from 'vue'
import { Button } from 'element-ui'
// 导入element-ui需要的组件
import { Form,FormItem} from 'element-ui'
import { Input} from 'element-ui'
// 导入弹框提示组件
import { Message} from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
// 把弹框组件挂架在vue原型上,挂载后可以使用this.$message来使用
Vue.prototype.$message = Message
