<template>
  <div @click="setPlaylistTrack(index)">
    <div class="list-item--pre" v-if="isCurrent" v-order-btn>&#9724;</div>
    <div class="list-item--pre" v-else v-order-btn>&#9723;</div>
    <div class="list-item--title">{{track.title}}</div>
    <div class="list-item--info">{{(track.album) ? track.album.title : ''}}</div>
    <div class="list-item--sub-info">{{formatTrackTime(track.duration)}}</div>
    <div class="list-item--controls">
      <v-icon
              @click.native.stop="removeTrackFromPlaylist(index)"
              name="x"></v-icon>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  props: ['track', 'index'],
  computed: {
    ...mapState({
      currentPlaylistKey: state => state.Player.Playlist.currentTrackN
    }),
    isCurrent () {
      return this.index === this.currentPlaylistKey
    }
  },
  methods: {
    ...mapMutations('Player', [
      'setPlaylistTrack'
    ])
  }
}
</script>