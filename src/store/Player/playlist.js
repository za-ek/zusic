import Vue from 'vue'
export default {
  state: {
    playlist: [],
    currentTrack: null,
    currentTrackN: -1
  },
  actions: {
    loadPlaylist ({ commit }) {
    },
    loadRandomPlaylist ({ commit }, {api}) {
      api.get('tracks/random')
        .then(d => {
          commit('setPlaylist', d.data.tracks)
        })
        .catch(e => {
          if(process.env.VUE_APP_DEVELOPMENT > 0) {
            console.log(e)
          } else {
            alert(this._vm.i18n.t('all_apologies'))
          }
        })
    }
  },
  mutations: {
    shufflePlaylist (state) {
      let id = state.currentTrack.id
      for (let i = state.playlist.length - 1, j; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        [state.playlist[i], state.playlist[j]] = [state.playlist[j], state.playlist[i]];
      }
      /**
       * Trigger update
       * @see https://vuejs.org/v2/guide/reactivity.html#Change-Detection-Caveats
       */
      Vue.set(state.playlist, 0, state.playlist[0])
      state.currentTrackN = state.playlist.findIndex(i => i.id === id)
    },
    playlistPrevious (state) {
      if (state.currentTrackN > 0) {
        state.currentTrackN = state.currentTrackN - 1
      } else if (state.playlist.length > 0) {
        state.currentTrackN = state.playlist.length - 1
      }

      if (state.currentTrackN in state.playlist) {
        state.currentTrack = state.playlist[state.currentTrackN]
      } else {
        state.currentTrack = null
      }
    },
    playlistNext (state) {
      if (state.currentTrackN + 1 >= state.playlist.length) {
        state.currentTrackN = 0
      } else {
        state.currentTrackN = state.currentTrackN + 1
      }
      state.currentTrack = Object.assign(state.playlist[state.currentTrackN], {
        url: (process.env.VUE_APP_BACKEND ?? '') + '/tracks/' + state.playlist[state.currentTrackN].id
      })
    },
    setPlaylist (state, playlist) {
      state.playlist = playlist || []
      state.currentTrackN = -1
    },
    addTrackToPlaylist (state, track) {
      state.playlist.push(track)
    },
    removeTrackFromPlaylist (state, n) {
      state.playlist.splice(n, 1)
      if (n < state.currentTrackN) {
        state.currentTrackN--
      } else if (n === state.currentTrackN) {
        state.currentTrack = Object.assign(state.playlist[state.currentTrackN], {
          url: (process.env.VUE_APP_BACKEND ?? '') + '/tracks/' + state.playlist[state.currentTrackN].id
        })
      }
    },
    setPlaylistTrack (state, n) {
      if(state.playlist.length > n) {
        state.currentTrackN = n
        state.currentTrack = Object.assign(state.playlist[n], {
          url: (process.env.VUE_APP_BACKEND ?? '') + '/tracks/' + state.playlist[n].id
        })
      }
    },
    playlistMove (state, changes) {
      state.playlist.splice(changes.m, 0, state.playlist.splice(changes.n, 1)[0])
      if(state.currentTrackN === changes.n) {
        state.currentTrackN = changes.m
      } else if (state.currentTrackN < changes.n && state.currentTrackN >= changes.m) {
        state.currentTrackN++
      } else if (state.currentTrackN > changes.n && state.currentTrackN <= changes.m) {
        state.currentTrackN--
      }
    }
  }
}
