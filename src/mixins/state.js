import Vue from 'vue'
import store from '../store'

Vue.mixin({
  methods: {
    restoreState () {
      if(process.env.VUE_APP_TEST > 0) {
        let list = []
        for (let i = 1; i < 60; i++) {
          list.push({
            id: i,
            title: Math.random().toString(36).repeat(1 + Math.random() * 2),
            trackCount: parseInt(Math.random() * 800),
            genre: {
              title: [
                'rock', 'reggae', 'pop', 'indie', 'goa'
              ][parseInt(Math.random() * 5)]
            }
          })
        }
        store.commit('Player/setArtistList', list)

        list = []
        for (let i = 1; i < 60; i++) {
          list.push({
            id: i,
            year: (parseInt(Math.random() * 100) % 2 === 0) ? 2019 - parseInt(Math.random() * 50) : '',
            title: Math.random().toString(36).repeat(1 + Math.random() * 3),
            artist: {
              id: i,
              title: Math.random().toString(36).substring(7)
            },
            trackCount: parseInt(Math.random() * 30)
          })
        }
        store.commit('Player/setAlbumList', list)

        list = []
        for (let i = 1; i < 60; i++) {
          list.push({
            id: i,
            title: Math.random().toString(36).repeat(1 + Math.random() * 3),
            duration: 100 + parseInt(Math.random() * 50),
            artist: {
              id: i,
              title: Math.random().toString(36).repeat(1 + Math.random() * 2)
            },
            album: {
              id: i,
              title: Math.random().toString(36).repeat(1 + Math.random() * 2),
              year: (parseInt(Math.random() * 100) % 2 === 0) ? 2019 - parseInt(Math.random() * 50) : ''
            }
          })
        }
        store.commit('Player/setTrackList', list)

        list = []
        for (let i = 1; i < 60; i++) {
          list.push({
            id: i,
            title: Math.random().toString(36).repeat(1 + Math.random() * 2),
            artist: {
              id: i,
              title: Math.random().toString(36).repeat(1 + Math.random() * 2)
            },
            album: {
              id: i,
              title: Math.random().toString(36).repeat(1 + Math.random() * 2),
              year: (parseInt(Math.random() * 100) % 2 === 0) ? 2019 - parseInt(Math.random() * 50) : ''
            },
            duration: 100 + parseInt(Math.random() * 50)
          })
        }
        store.commit('Player/setPlaylist', list)

      } else {
        store.dispatch('Player/loadPlaylist')
        store.dispatch('Player/loadArtistList')
        store.dispatch('Player/loadTrackList')
        store.dispatch('Player/loadAlbumList')

        try {
          store.commit('Player/setPlaylist', JSON.parse(localStorage.getItem('playlist')))
          let currentTrack = JSON.parse(localStorage.getItem('currentTrack'))
          this.setPlaylistTrack(this.playlist.findIndex(i => i.id === currentTrack.id))
        } catch (e) {
        }
      }
    }
  }
})