export default {
  state: {
    tracks: []
  },
  actions: {
    loadTrackList ({ commit }, filter) {
      filter = filter || {}
      if (process.env.VUE_APP_TEST > 0) {
        commit('setTestTracks', filter)
      } else if(('albumId' in filter) && filter.albumId) {
        this._vm.$axios.get(`albums/${filter.albumId}`)
          .then(d => {
            commit('setTrackList', d.data.tracks)
          })
        // @todo
        // commit('setTrackList', list)
      }
    }
  },
  mutations: {
    setTrackList (state, list) {
      state.tracks = list
    },
    setTestTracks (state) {
      let list = []
      for (let i = 1; i < 60; i++) {
        list.push({
          id: i,
          title: Math.random().toString(36).repeat(1 + Math.random() * 3),
          duration: 100 + parseInt(Math.random() * 50)
        })
      }
      state.tracks = list
    }
  }
}
