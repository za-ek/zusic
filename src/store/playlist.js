export default {
  state: {
    playlist: [],
    currentTrack: null,
    currentTrackN: -1
  },
  actions: {
    loadPlaylist ({ commit }) {
      if (process.env.NODE_ENV === 'development') {
        commit('setTestPlaylist')
      } else {
        // @todo
        // commit('setPlaylist', playlist)
      }
    }
  },
  mutations: {
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
      state.currentTrack = state.playlist[state.currentTrackN]
    },
    setPlaylist (state, playlist) {
      state.playlist = playlist
    },
    addTrackToPlaylist (state, track) {
      state.playlist.push(track)
    },
    removeTrackFromPlaylist (state, n) {
      state.playlist.splice(n, 1)
    },
    setPlaylistTrack (state, n) {
      state.currentTrackN = n
      state.currentTrack = state.playlist[n]
    },
    setTestPlaylist (state) {
      let playlist = []
      for (let i = 1; i < 60; i++) {
        playlist.push({
          id: i,
          title: Math.random().toString(36).substring(7),
          artist: {
            id: i,
            title: Math.random().toString(36).substring(7)
          },
          album: {
            id: i,
            title: Math.random().toString(36).substring(7),
            year: (parseInt(Math.random() * 100) % 2 === 0) ? 2019 - parseInt(Math.random() * 50) : ''
          },
          duration: 100 + parseInt(Math.random() * 50)
        })
      }
      state.playlist = playlist
    }
  }
}
