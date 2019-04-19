export default {
  state: {
    currentTrack: null,
    playing: false,
    trackEnd: false,
    currentTime: 0,
    player: null
  },
  actions: {
  },
  mutations: {
    setAudioDOM (state, DOM) {
      state.player = DOM
      state.playing = !state.player.paused
      state.player.ontimeupdate = e => {
        state.currentTime = state.player.currentTime
      }
      state.player.onended = e => {
        state.trackEnd = true
      }
      state.player.onpause = e => {
        state.playing = false
      }
      state.player.onplay = e => {
        state.playing = true
      }
      state.player.onplaying = e => {
        state.playing = true
      }
    },
    playerSetTrack (state, track) {
      state.currentTrack = track
      state.currentTime = 0
      if (state.player) {
        state.player.pause()
        let source = Array.prototype.find.call(
          state.player.getElementsByTagName('source'),
            v => v.type === 'audio/mpeg'
        )
        if (!source) {
          source = document.createElement('source')
          source.type = 'audio/mpeg'
          state.player.appendChild(source)
        }

        source.src = state.currentTrack.url
        state.player.load()
      }
    },
    playerPlay (state) {
      state.trackEnd = false
      if (!state.currentTrack) {
        throw new Error('no track')
      }
      if (state.player) {
        state.player.play()

        document.title = [
          state.currentTrack.artist.title,
          state.currentTrack.title,
          state.currentTrack.album.year
        ].join(' - ')
      }
    },
    playerStop (state) {
      state.currentTime = 0
    },
    playerPause (state) {
      state.player.pause()
    },
    playerSetPercent (state, p) {
      state.player.currentTime = p * state.currentTrack.duration
    }
  },
  getters: {
    playerPercent (state) {
      return (!state.currentTrack || state.currentTrack.duration === 0) ? 0 : 100 * state.currentTime / state.currentTrack.duration
    },
    playerDuration (state) {
      return state.currentTrack ? state.currentTrack.duration : 0
    }
  }
}
