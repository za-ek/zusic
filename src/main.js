import Vue from 'vue'
import App from './App.vue'
import feather from 'vue-icon'
import i18n from './i18n'
import store from './store'

Vue.use(i18n)
Vue.use(feather, 'v-icon')

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  store
}).$mount('#app')
