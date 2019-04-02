export default {
  state: {
    artists: [],
    currentArtist: null
  },
  actions: {
    loadArtistList ({ commit }) {
      let list = []
      for (let i = 1; i < 60; i++) {
        list.push({
          id: i,
          title: Math.random().toString(36).substring(7),
          trackCount: parseInt(Math.random() * 800),
          genre: {
            title: [
              'rock', 'reggae', 'pop', 'indie', 'goa'
            ][parseInt(Math.random() * 5)]
          }
        })
      }
      commit('setArtistList', list)
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
