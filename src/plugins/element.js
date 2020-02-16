import Vue from 'vue'
import { Button, Upload } from 'element-ui'
// 导入element-ui需要的组件
import { Form,FormItem} from 'element-ui'
import { Input} from 'element-ui'
// 导入弹框提示组件
import { Message} from 'element-ui'
// container 布局需要的组件
import 
{
    Container,
    Header,
    Aside,
    Main,
    Menu,
    Submenu,
    MenuItemGroup,
    MenuItem,
    Breadcrumb,
    BreadcrumbItem,
    Card,
    Row,
    Col,
    Table,
    TableColumn,
    Switch,
    Tooltip,
    Pagination,
    Dialog,
    MessageBox,
    Tag,
    Tree,
    Select,
    Option,
    Cascader,
    Alert,
    Tabs,
    TabPane,
    Step,
    Steps,
    Divider,
    Checkbox,
    CheckboxGroup
} from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
Vue.use(Submenu)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
Vue.use(Cascader)
Vue.use(Alert)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Step)
Vue.use(Steps)
Vue.use(Divider)
Vue.use(Checkbox)
Vue.use(CheckboxGroup)
Vue.use(Upload)
// 把弹框组件挂架在vue原型上,挂载后可以使用this.$message来使用
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
