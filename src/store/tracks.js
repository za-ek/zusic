export default {
  state: {
    tracks: []
  },
  actions: {
    loadTrackList ({ commit }, filter) {
      filter = filter || {}
      let list = []
      for (let i = 1; i < 60; i++) {
        list.push({
          id: i,
          title: Math.random().toString(36).substring(7),
          artist: {
            id: i,
            title: ('artistId' in filter && filter.artistId) ? filter.artistId : Math.random().toString(36).substring(7)
          },
          album: {
            id: i,
            title: ('albumId' in filter && filter.albumId) ? filter.albumId : Math.random().toString(36).substring(7),
            year: (parseInt(Math.random() * 100) % 2 === 0) ? 2019 - parseInt(Math.random() * 50) : ''
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
