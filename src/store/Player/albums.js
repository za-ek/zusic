export default {
  state: {
    albums: [],
    currentAlbum: null
  },
  actions: {
    loadAlbumList ({ commit }, {api, artistId}) {
      return api.get(
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
    setCurrentAlbum (state, {albumId, api}) {
      return api.get('/albums/' + albumId)
          .then(({data}) => {
            state.currentAlbum = data.album;
          });
    },
    clearCurrentAlbum (state) {
      state.currentAlbum = null
    }
  }
}
