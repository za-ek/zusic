import Vue from 'vue'
import App from './App.vue'
import feather from 'vue-icon'
import axios from 'axios'
import i18n from './i18n'
import store from './store'

Vue.prototype.$eventHub = new Vue();

Vue.use(i18n)
Vue.use(feather, 'v-icon')

Vue.directive('order-btn', {
  bind: function (el, binding, vnode) {
    let clone
    const
      onDown = e => {
        // console.log('mouse down')
        clone = el.parentNode.cloneNode(true)
        clone.style.backgroundColor = '#fff'
        clone.style.position = 'absolute'
        clone.style.top = e.clientY + 'px'
        clone.style.left = e.clientX + 'px'
        document.body.appendChild(clone)
        dragStart()
      },
      onUp = e => {
        if (clone) {
          clone.parentNode.removeChild(clone)
          clone = null
          dragEnd()
        }
      },
      onMove = e => {
        if (clone) {
          clone.style.top = (e.clientY + 1) + 'px'
          clone.style.left = (e.clientX + 1) + 'px'

          let items = document.getElementsByClassName('drag-item-next')
          for (let i = 0; i < items.length; i++) {
            items[i].classList.remove('drag-item-next')
          }

          if ((e.target.className.split(' ').indexOf('playlist-item') > -1)) {
            e.target.classList.add('drag-item-next')
          } else if (e.target.parentNode.className.split(' ').indexOf('playlist-item') > -1) {
            e.target.parentNode.classList.add('drag-item-next')
          }
        }
      },
      disableSelect = evt => {
        evt.preventDefault()
      },
      dragEnd = () => {
        el.parentNode.style.visibility = 'visible'
        window.removeEventListener('selectstart', disableSelect)
        document.body.style.overflow = 'auto'

        let items = document.getElementsByClassName('drag-item-next')
        if (items.length > 0) {
          let n = Array.prototype.slice.call(el.parentNode.parentNode.children).indexOf(el.parentNode)
          let m = Array.prototype.slice.call(items[0].parentNode.children).indexOf(items[0])
          items[0].classList.remove('drag-item-next')
          Vue.prototype.$eventHub.$emit('playlist-move', {n, m})
        }
      },
      dragStart = () => {
        el.parentNode.style.visibility = 'hidden'
        window.addEventListener('selectstart', disableSelect)
        document.body.style.overflow = 'hidden'
      }

    el.addEventListener('mousedown', onDown)
    document.addEventListener('mouseup', onUp)
    document.addEventListener('mousemove', onMove)
    /*
    var s = JSON.stringify
    console.log(
      'name: '       + s(binding.name) + '<br>' +
      'value: '      + s(binding.value) + '<br>' +
      'expression: ' + s(binding.expression) + '<br>' +
      'argument: '   + s(binding.arg) + '<br>' +
      'modifiers: '  + s(binding.modifiers) + '<br>' +
      'vnode keys: ' + Object.keys(vnode).join(', ')
    )
     */
  }
})

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
