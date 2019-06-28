export default {
  state: {
    albums: [],
    currentAlbum: null
  },
  actions: {
    loadAlbumList ({ commit }, artistId) {
      this._vm.$axios.get(
        artistId
          ? `artists/${artistId}/albums`
          : 'albums'
      )
        .then(d => {
          commit('setAlbumList', d.data.albums)
        })
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
    }
  }
}
