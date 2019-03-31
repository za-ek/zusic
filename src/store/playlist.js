export default {
  state: {
    playlist: [],
    currentTrack: {}
  },
  actions: {
    loadPlaylist ({ commit }) {
      let playlist = []
      for (let i = 1; i < 60; i++) {
        playlist.push({
          id: i,
          title: Math.random().toString(36).substring(7),
          artist: {
            title: Math.random().toString(36).substring(7)
          },
          album: {
            title: Math.random().toString(36).substring(7)
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
    }
  }
}
