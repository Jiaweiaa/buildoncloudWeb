import Vue from 'vue';
import App from './App';
import router from './router';
import ElementUI from 'element-ui';
import scroll from 'vue-seamless-scroll'
import Vuex from 'vuex';
import axios from 'axios'

Vue.config.silent = true;
axios.defaults.withCredentials = true;
Vue.prototype.$http = axios;
import 'element-ui/lib/theme-chalk/index.css';    // 默认主题
import "babel-polyfill";
import animate from 'animate.css';
import VueQuillEditor from 'vue-quill-editor'
// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

// 人脸识别
import infiniteScroll from 'vue-infinite-scroll';
import VueQrcode from '@xkeshi/vue-qrcode'

import echarts from 'echarts';
import 'echarts/map/js/china.js';

import VueAMap from 'vue-amap'

Vue.use(VueAMap);
VueAMap.initAMapApiLoader({
  key: '382aecfb47b3d683b8ba684719a0dde6',
  plugin: ['AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'Geocoder', 'AMap.Geolocation'],
  v: '1.4.4'
});


Vue.use(scroll);

//or you can set componentName default componentName is vue-seamless-scroll
Vue.use(scroll, {componentName: 'scroll-seamless'});
Vue.prototype.$echarts = echarts;
Vue.use(VueQuillEditor);
Vue.use(infiniteScroll);
Vue.use(ElementUI);
Vue.use(Vuex);
Vue.use(animate);
Vue.component('qrcode', VueQrcode);


new Vue({
  router,
  data: {
    eventHub: new Vue()
  },
  render: h => h(App)
}).$mount('#app');

// 过滤器
Vue.filter('upReplace', function (value) {
  if (!value) return '';
  value = value.replace(/,,/g, "");
  return value;
});

//POST传参序列化
axios.interceptors.request.use((config) => {
  if (config.method === 'get') {
    var querystring = require('querystring');
    if (window.sessionStorage.getItem('tokenId') && window.sessionStorage.getItem('tokenStr')) {
      // config.headers = {
      //   tokenId:window.sessionStorage.getItem('tokenId'),
      //   tokenStr:window.sessionStorage.getItem('tokenStr'),
      //   ...config.params
      // }
      config.headers['tokenId'] = window.sessionStorage.getItem('tokenId');
      config.headers['tokenStr'] = window.sessionStorage.getItem('tokenStr');
    }
    config.data = querystring.encode(config.data);
  }
  if (config.method === 'post') {
    var querystring = require('querystring');
    if (window.sessionStorage.getItem('tokenId') && window.sessionStorage.getItem('tokenStr')) {
      // config.headers = {
      //   tokenId:window.sessionStorage.getItem('tokenId'),
      //   tokenStr:window.sessionStorage.getItem('tokenStr'),
      //   ...config.data
      // }
      config.headers['tokenId'] = window.sessionStorage.getItem('tokenId');
      config.headers['tokenStr'] = window.sessionStorage.getItem('tokenStr');
    }
    config.data = querystring.encode(config.data);
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// 检查session
axios.interceptors.response.use((response) => {
  // Do something with response data
  if (response.data.code == -99 || response.data.code == -88) {
    router.replace({ // 跳转到登录页面
      path: '/login'
    });

    return;
  } else {
    return response;
  }
}, function (error) {
  // Do something with response error
  return Promise.reject(error);
});

