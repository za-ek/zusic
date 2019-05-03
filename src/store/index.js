import Vue from 'vue'
import Vuex from 'vuex'

import Playlist from './playlist'
import Artists from './artists'
import Albums from './albums'
import Tracks from './tracks'
import Player from './player'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    Player: {
      namespaced: true,
      modules: {
        Playlist,
        Artists,
        Albums,
        Tracks,
        Player
      }
    }
  }
})