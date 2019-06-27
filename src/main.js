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

Vue.mixin({
  methods: {
    formatTrackTime (v) {
      var sec_num = parseInt(v, 10);
      var hours   = Math.floor(sec_num / 3600);
      var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
      var seconds = sec_num - (hours * 3600) - (minutes * 60);

      if (hours && hours   < 10) {hours   = "0"+hours;}
      if (minutes < 10) {minutes = "0"+minutes;}
      if (seconds < 10) {seconds = "0"+seconds;}
      return (hours ? hours+':' : '')+minutes+':'+seconds;
    }
  }
})

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  store
}).$mount('#app')
