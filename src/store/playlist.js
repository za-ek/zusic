export default {
  state: {
    playlist: [],
    currentTrack: 0
  },
  actions: {
    loadPlaylist ({ commit }) {
      let playlist = []
      for (let i = 1; i < 60; i++) {
        playlist.push({
          id: i,
          title: Math.random().toString(36).substring(7),
          info: Math.random().toString(36).substring(7),
          subInfo: '00:00'
        })
      }
      commit('setPlaylist', playlist)
    }
  },
  mutations: {
    setPlaylist (state, playlist) {
      state.playlist = playlist
    }
  }
}
