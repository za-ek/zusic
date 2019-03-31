import Vue from 'vue'
import Vuex from 'vuex'
import Playlist from './playlist'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    Playlist
  }
})