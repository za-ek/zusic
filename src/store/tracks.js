export default {
  state: {
    tracks: []
  },
  actions: {
    loadTrackList ({ commit }, filter) {
      filter = filter || {}
      if (process.env.NODE_ENV === 'development') {
        commit('setTestTracks', filter)
      } else {
        // @todo
        // commit('setTrackList', list)
      }
    }
  },
  mutations: {
    setTrackList (state, list) {
      state.tracks = list
    },
    setTestTracks (state, filter) {
      let list = []
      for (let i = 1; i < 60; i++) {
        list.push({
          id: i,
          title: Math.random().toString(36).repeat(1 + Math.random() * 3),
          artist: {
            id: i,
            title: ('artistId' in filter && filter.artistId) ? filter.artistId : Math.random().toString(36).substring(7)
          },
          album: {
            id: i,
            title: ('albumId' in filter && filter.albumId) ? filter.albumId : Math.random().toString(36).substring(7),
            year: (parseInt(Math.random() * 100) % 2 === 0) ? 2019 - parseInt(Math.random() * 50) : ''
          },
          duration: 100 + parseInt(Math.random() * 50)
        })
      }
      state.tracks = list
    }
  }
}
