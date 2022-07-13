import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import { postRequest } from "./utils/api";
import { putRequest } from "./utils/api";
import { getRequest } from "./utils/api";
import { deleteRequest } from "./utils/api";
import axios from 'axios'
import echarts from 'echarts'
import mavonEditor from 'mavon-editor';
import 'mavon-editor/dist/css/index.css';
//使用插件的方式来进行请求 可以在所有的路由所有的Vue实例中使用
Vue.prototype.postRequest = postRequest;
Vue.prototype.putRequest = putRequest;
Vue.prototype.getRequest = getRequest;
Vue.prototype.deleteRequest = deleteRequest;

//生产环境，略去警告以减少应用开销
Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.use(mavonEditor);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')


