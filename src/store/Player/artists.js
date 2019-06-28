export default {
  state: {
    artists: [],
    currentArtist: null
  },
  actions: {
    loadArtistList ({ commit }, { api }) {
      api.get('artists')
        .then(d => {
          commit('setArtistList', d.data.artists)
        })
    }
  },
  mutations: {
    setArtistList (state, list) {
      state.artists = list
    },
    setCurrentArtist (state, artistId) {
      state.currentArtist = state.artists.find(item => item.id === artistId)
    },
    clearCurrentArtist (state) {
      state.currentArtist = null
    }
  }
}
