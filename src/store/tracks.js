export default {
  state: {
    tracks: []
  },
  actions: {
    loadTrackList ({ commit }) {
      let list = []
      for (let i = 1; i < 60; i++) {
        list.push({
          id: i,
          title: Math.random().toString(36).substring(7),
          album: {
            title: Math.random().toString(36).substring(7)
          },
          duration: '00:00'
        })
      }
      commit('setTrackList', list)
    }
  },
  mutations: {
    setTrackList (state, list) {
      state.tracks = list
    }
  }
}
