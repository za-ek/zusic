export default {
  state: {
    playlist: [],
    currentTrack: null,
    currentTrackN: -1
  },
  actions: {
    loadPlaylist ({ commit }) {
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
          duration: '00:00'
        })
      }
      commit('setPlaylist', playlist)
    }
  },
  mutations: {
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
    }
  }
}
