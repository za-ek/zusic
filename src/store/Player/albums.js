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
    },
    loadPlaylists ({ commit }, {api, title}) {
      return api.get(`playlists/${title}`)
        .then(d => {
          commit('setAlbumList', d.data.playlists)
        })
    },
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
    setCurrentPlaylist(state, {playlistId, api}) {
      return api.get('/playlists/' + playlistId)
          .then(({data}) => {
            state.currentAlbum = data.album;
          });
    },
    clearCurrentAlbum (state) {
      state.currentAlbum = null
    }
  }
}
