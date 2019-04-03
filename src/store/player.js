export default {
  state: {
    currentTrack: null,
    playing: false,
    trackEnd: false,
    currentTime: 0,
    timeInterval: null
  },
  actions: {
  },
  mutations: {
    playerSetTrack (state, track) {
      state.currentTrack = track
      state.currentTime = 0
      clearInterval(state.timeInterval)
    },
    playerPlay (state) {
      state.trackEnd = false
      if (!state.currentTrack) {
        throw new Error('no track')
      }
      state.timeInterval = setInterval(() => {
        state.currentTime++
        if (state.currentTime >= state.currentTrack.duration) {
          state.currentTime = 0
          state.trackEnd = true
        }
      }, 1000)
      state.playing = true
    },
    playerStop (state) {
      state.playing = false
      state.currentTime = 0
    },
    playerPause (state) {
      state.playing = false
      clearInterval(state.timeInterval)
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
