import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import FastClick from 'fastclick';
import VueLazyload from "vue-lazyload";

import toast from 'components/common/toast';

Vue.config.productionTip = false;

// 1.添加事件总线对象，Vue实例可以作为事件总线
Vue.prototype.$bus = new Vue();

// 2.安装toast插件
Vue.use(toast);

// 3.解决移动端的300ms的延迟
FastClick.attach(document.body);

// 使用懒加载的插件
Vue.use(VueLazyload, {
  preLoad: 1,
  loading: require('./assets/img/common/placeholder1.png'),
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
