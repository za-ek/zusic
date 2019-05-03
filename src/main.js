import Vue from 'vue'
import App from './App.vue'
import feather from 'vue-icon'
import axios from 'axios'
import i18n from './i18n'
import store from './store'
import './directives/order-btn'

Vue.prototype.$eventHub = new Vue();

Vue.use(i18n)
Vue.use(feather, 'v-icon')

Vue.prototype.$axios = axios.create({
  baseURL: process.env.VUE_APP_BACKEND,
  headers: {
    Accept: 'application/json'
  }
})

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  store
}).$mount('#app')
