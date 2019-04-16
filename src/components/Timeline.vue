<template>
  <div id="timeline" @click="onClick">
    <div ref="timeLoaded" id="timeline--loaded"></div>
    <div ref="timeElapsed" id="timeline--elapsed"></div>
    <div ref="timePoint" id="timeline--point"></div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'
export default {
  created () {
    // this.playerPlay()
  },
  methods: {
    ...mapMutations([
      'playerPlay',
      'playerSetPercent'
    ]),
    onClick (e) {
      if(e.target.id !== 'timeline--point') {
        this.playerSetPercent(e.clientX / e.target.offsetWidth)
      }
    }
  },
  computed: {
    ...mapState({
      currentTrack: state => state.Playlist.playlist.currentTrack,
      currentTrackTime: state => state.Player.currentTime
    }),
    ...mapGetters({
      playerPercent: 'playerPercent'
    })
  },
  watch: {
    playerPercent (v) {
      this.$refs.timeElapsed.style.width = (v < 100 ? v : 100) + '%'
      this.$refs.timePoint.style.marginLeft = (v < 100 ? v : 100) + '%'
    }
  }
}
</script>

<style lang="scss">
#timeline {
  height:8px;
  width:100%;
  position:absolute;
  z-index:5;

  &--loaded {
    height:8px;
    position:absolute;
    z-index:6;
  }
  &--elapsed {
    height:8px;
    width:0%;
    position:absolute;
    z-index:7;
    /* 100% -> 0 */
    /* transition: width 5s linear; */
  }
  &--point {
    position: absolute;
    left:-14px;
    width:12px;
    height:12px;
    margin-top:-2px;
    background-color: #fff;
    border:1px solid #000;
    border-radius:10px;
    -webkit-box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.75);
    -moz-box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.75);
    box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.75);
    z-index: 8;
    /* transition: width 5s linear; */
  }
}
</style>