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
      const result = state.albums.find(item => item.id === albumId);
      if(result) {
        state.currentAlbum =result;
      } else {
        api.get('/albums/' + albumId)
            .then(({data}) => {
              state.currentAlbum = data.album;
            });
      }
    },
    clearCurrentAlbum (state) {
      state.currentAlbum = null
    }
  }
}
