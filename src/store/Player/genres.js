export default {
  state: {
    genres: [],
    currentGenre: null
  },
  actions: {
    loadGenreList ({ commit }, { api }) {
      api.get('genres')
        .then(d => {
          commit('setGenreList', d.data.genres)
        })
    }
  },
  mutations: {
    setGenreList (state, list) {
      state.genres = list
    },
    setCurrentGenre (state, artistId) {
      state.currentGenre = state.genres.find(item => item.id === artistId)
    },
    clearCurrentGenre (state) {
      state.currentGenre = null
    }
  }
}
