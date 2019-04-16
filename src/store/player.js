export default {
  state: {
    currentTrack: null,
    playing: false,
    trackEnd: false,
    currentTime: 0,
    timeInterval: null,
    player: null
  },
  actions: {
  },
  mutations: {
    setAudioDOM (state, DOM) {
      state.player = DOM
      state.player = new Audio()
      state.player.ontimeupdate = e => {
        state.currentTime = state.player.currentTime
      }
    },
    playerSetTrack (state, track) {
      state.currentTrack = track
      state.currentTime = 0
      clearInterval(state.timeInterval)
      if (state.player) {
        let source = Array.prototype.filter.call(
          state.player.getElementsByTagName('source'),
            v => v.type === 'audio/mpeg'
        )
        if (source.length === 0) {
          source = document.createElement('source')
          source.type = 'audio/mpeg'
          state.player.appendChild(source)
        } else {
          source = source[0]
        }

        if(!state.player.paused) {
          state.player.pause()
        }

        source.src = state.currentTrack.url
        state.player.load()
        state.player.play()
      }
    },
    playerPlay (state) {
      state.trackEnd = false
      if (!state.currentTrack) {
        throw new Error('no track')
      }
      if (state.player) {
        state.player.play()
      }
      state.playing = true
    },
    playerStop (state) {
      state.playing = false
      state.currentTime = 0
    },
    playerPause (state) {
      state.playing = false
      state.player.pause()
      clearInterval(state.timeInterval)
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
