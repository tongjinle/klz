
import Vue from 'vue'
import App from './App'
import Vuex from 'vuex'
// import axios from 'axios'
// import VueAxios from 'vue-axios'
import router from './router/index.js'
import ElementUI from 'element-ui'
import "element-ui/lib/theme-chalk/index.css";
import "./publicStyle/index.less";
import store from './vuex/index.js';
import wx from 'weixin-js-sdk';
// Vue.use(VueAxios, axios);
// Vue.prototype.axios = axios;
Vue.use(ElementUI);
Vue.use(Vuex);
Vue.prototype.$msgbox = ElementUI.MessageBox
Vue.prototype.$alert = ElementUI.MessageBox.alert
Vue.prototype.$confirm = ElementUI.MessageBox.confirm
Vue.prototype.$prompt = ElementUI.MessageBox.prompt
Vue.prototype.$message = ElementUI.Message
Vue.prototype.$wx = wx


Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store:store,
  components: { App },
  template: '<App/>'
})
