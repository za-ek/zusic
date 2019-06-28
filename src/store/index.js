import Vue from 'vue'
import Vuex from 'vuex'

import Playlist from './Player/playlist'
import Artists from './Player/artists'
import Albums from './Player/albums'
import Tracks from './Player/tracks'
import Player from './Player/player'

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