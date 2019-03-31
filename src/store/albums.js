export default {
  state: {
    albums: [],
    currentAlbum: {}
  },
  actions: {
    loadAlbumList ({ commit }) {
      let list = []
      for (let i = 1; i < 60; i++) {
        list.push({
          id: i,
          year: (parseInt(Math.random() * 100) % 2 === 0) ? 2019 - parseInt(Math.random() * 50) : '',
          title: Math.random().toString(36).substring(7),
          artist: {
            title: Math.random().toString(36).substring(7)
          },
          trackCount: parseInt(Math.random() * 30)
        })
      }
      commit('setAlbumList', list)
    }
  },
  mutations: {
    setAlbumList (state, list) {
      state.albums = list
    }
  }
}
