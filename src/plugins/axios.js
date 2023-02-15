import axios from 'axios'
import https from 'https'

export default {
  install (Vue, options) {
    const conf = {
      baseURL: process.env.VUE_APP_BACKEND,
      headers: {
        Accept: 'application/json'
      }
    }
    if (process.env.VUE_APP_DEVELOPMENT > 0) {
      // Use unauthorized certificate at development
      // conf.httpsAgent = new https.Agent({rejectUnauthorized: false})
    }
    const axiosHTTP = axios.create(conf)
    Vue.mixin({
      methods: {
        isLoggedIn: () => {
          return false;
          // return 'Authorization' in axiosHTTP.defaults.headers
        }
      }
    })

    // axiosHTTP.$_authToken = ''
    // axiosHTTP.setAuth = function (auth) {
    //   localStorage.removeItem('token')
    //   delete axiosHTTP.defaults.headers.Authorization
    //   if (auth) {
    //     localStorage.setItem('token', auth)
    //     axiosHTTP.$_authToken = auth
    //     axiosHTTP.defaults.headers.Authorization = `Bearer ${auth}`
    //   }
    // }

    // axiosHTTP.interceptors.response.use((response) => {
    //     Vue.prototype.$eventHub.$emit('network-success')
    //     return response
    //   },
    //   (error) => {
    //     if (error.response) {
    //       if (error.response.status === 401) {
    //         axiosHTTP.setAuth(null)
    //         // logout
    //       }
    //
    //       if (error.response.status === 500) {
    //         // router.push({ name: '500' })
    //       }
    //       if (error.response.status === 404) {
    //         // router.push({ name: '404' })
    //       }
    //     } else if (!error.status) {
    //       // Network error
    //       console.log('network error')
    //       Vue.prototype.$eventHub.$emit('network-error', error)
    //     }
    //     return Promise.reject(error)
    //   })

    // axiosHTTP.setAuth(localStorage.getItem('token'))
    Vue.prototype.$axios = axiosHTTP
  }
}