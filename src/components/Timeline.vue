<template>
  <div id="main-layout--timeline">
    <div ref="timeLoaded" id="main-layout--time-loaded"></div>
    <div ref="timeElapsed" id="main-layout--time-elapsed"></div>
    <div ref="timePoint" id="main-layout--time-point"></div>
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
      'playerPlay'
    ])
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
      this.$refs.timeElapsed.style.width = (v) + '%'
      this.$refs.timePoint.style.marginLeft = (v) + '%'
    }
  }
}
</script>

<style>
#main-layout--timeline {
  background: lightpink;
  height:8px;
  width:100%;
  position:absolute;
  z-index:5;
}
#main-layout--time-loaded {
  background-color: #df00df;
  height:8px;
  position:absolute;
  z-index:6;
}
#main-layout--time-elapsed {
  background-color: purple;
  height:8px;
  width:0%;
  position:absolute;
  z-index:7;
  /* 100% -> 0 */
  /* transition: width 5s linear; */
}
#main-layout--time-point {
  position: absolute;
  left:0%;
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
</style>