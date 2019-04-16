export default {
  state: {
    albums: [],
    currentAlbum: null
  },
  actions: {
    loadAlbumList ({ commit }, artistId) {
      if (process.env.VUE_APP_TEST > 0) {
        commit('setTestAlbums', artistId)
      } else {
        this._vm.$axios.get(
          artistId
            ? `artists/${artistId}/albums`
            : 'albums'
        )
          .then(d => {
            commit('setAlbumList', d.data.albums)
          })
      }
    }
  },
  mutations: {
    setAlbumList (state, list) {
      state.albums = list
    },
    setCurrentAlbum (state, albumId) {
      state.currentAlbum = state.albums.find(item => item.id === albumId)
    },
    clearCurrentAlbum (state) {
      state.currentAlbum = null
    },
    setTestAlbums (state, artistId) {
      let list = []
      for (let i = 1; i < 60; i++) {
        list.push({
          id: i,
          year: (parseInt(Math.random() * 100) % 2 === 0) ? 2019 - parseInt(Math.random() * 50) : '',
          title: Math.random().toString(36).repeat(1 + Math.random() * 3),
          artist: {
            id: i,
            title: (artistId) ? null : Math.random().toString(36).substring(7)
          },
          trackCount: parseInt(Math.random() * 30)
        })
      }
      state.albums = list
    }
  }
}
