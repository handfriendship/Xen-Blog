// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
// import Vuex from 'vuex';
import App from './App'
import router from './router'
import store from '@/store'
import * as firebase from 'firebase/app';
import VueCookies from 'vue-cookies';
import vanilla from './vanilla.js';
import Algolia from './Algolia.js';
import Cookies from 'js-cookie';
import {BootstrapVue, IconsPlugin, DropdownPlugin, TablePlugin } from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import 'firebase/auth';
import 'firebase/firestore';
const firebaseConfig = {
  apiKey: "AIzaSyCgR1l7id55IcT_JWpEu4roO-9mp2eHmb0",
  authDomain: "xenmedia-blog.firebaseapp.com",
  databaseURL: "https://xenmedia-blog.firebaseio.com",
  projectId: "xenmedia-blog",
  storageBucket: "xenmedia-blog.appspot.com",
  messagingSenderId: "457537964682",
  appId: "1:457537964682:web:bb404cd10b8d43d9543b73"
};
Vue.config.productionTip = false
Vue.prototype.$Cookie = Cookies;
Vue.prototype.$Algolia = Algolia;
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
Vue.use(DropdownPlugin);
Vue.use(TablePlugin);

firebase.initializeApp(firebaseConfig);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  VueCookies,
  components: { App },
  template: '<App/>'
})
