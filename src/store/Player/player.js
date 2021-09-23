export default {
  state: {
    currentTrack: null,
    playing: false,
    trackEnd: false,
    currentTime: 0,
    player: null,
    loaded: 0
  },
  actions: {
  },
  mutations: {
    setAudioDOM (state, DOM) {
      if (!DOM) {
        return
      }
      state.player = DOM
      state.playing = !state.player.paused
      state.player.ontimeupdate = () => {
        state.currentTime = state.player.currentTime
      }
      state.player.onended = () => {
        state.trackEnd = true
      }
      state.player.onpause = () => {
        state.playing = false
      }
      state.player.onplay = () => {
        state.playing = true
      }
      state.player.onplaying = () => {
        state.playing = true
      }
      state.player.canPlayMP3 = (typeof DOM.canPlayType === "function" && DOM.canPlayType("audio/mpeg;codecs=mp3") !== "");
      if(!state.player.canPlayMP3) {
        // request aac
      }
    },
    playerSetTrack (state, track) {
      state.currentTrack = track
      state.currentTime = 0
      state.loaded = 0
      if (state.player) {
        state.player.pause()

        let canPlayMP3 = navigator.userAgent.toLowerCase().indexOf('firefox') === -1;
        let codec = 'audio/mpeg';
        if(!canPlayMP3) {
          codec = 'audio/aac';
        }

        let source = Array.prototype.find.call(
          state.player.getElementsByTagName('source'),
            v => v.type === codec
        )
        if (!source) {
          source = document.createElement('source')
          source.type = codec
          state.player.appendChild(source)
        }

        source.src = state.currentTrack.url + "?codec=" + codec;
        state.player.load()
        state.player.onprogress = () => {

          if(state.player.buffered.length) {
            let end = 0
            for(let i = 0; i < state.player.buffered.length; i++) {
              if (state.player.buffered.end(i) > end) {
                end = state.player.buffered.end(i)
              }
            }
            state.loaded = 100 * end / state.player.duration
            if (state.loaded >= 100) {
              state.loaded = 100
            }
          }
        }
      }
    },
    playerPlay (state) {
      state.trackEnd = false
      if (!state.currentTrack) {
        throw new Error('no track')
      }
      if (state.player) {
        let playPromise = state.player.play()

        if (playPromise !== undefined) {
          playPromise.then(_ => {
            // Automatic playback started!
            // Show playing UI.
            console.log('Start :)' + _);
          })
              .catch(error => {
                // Auto-play was prevented
                // Show paused UI.
                console.log('Error :(' + error);
              });
        }

        document.title = [
          (state.currentTrack.artist) ? state.currentTrack.artist.title : this._vm.i18n.t('unknown_artist'),
          state.currentTrack.title,
          state.currentTrack.album ? state.currentTrack.album.year : '...'
        ].join(' - ')
      }
    },
    playerStop (state) {
      state.currentTime = 0
    },
    playerPause (state) {
      if (state.player) {
        state.player.pause()
      }
    },
    playerSetPercent (state, p) {
      if (state.player) {
        state.player.currentTime = p * state.currentTrack.duration
      }
    },
    playerSetTime (state, t) {
      if (state.player) {
        state.player.currentTime = t
      }
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
