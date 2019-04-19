<template>
  <div id="app" :class="'skin-' + skin">
    <Layout ref="layout">
      <div slot="menu-line">
        <div id="menu-switchers">
          <select v-model="skin">
            <option
                v-for="skinName in ['purple', 'green']"
                :value="skinName"
                :key="skinName"
            >
              {{i18n.t('skin_' + skinName)}}
            </option>
          </select>
          <LanguagePicker></LanguagePicker>
        </div>
      </div>
      <div slot="artist-list">
        <div
          v-for="(artist) in artists"
          :key="artist.id"
          class="list-item"
          @click="setCurrentArtist(artist.id)"
        >
          <div class="list-item--title">{{artist.title}}</div>
          <div class="list-item--info">{{artist.genre.title}}</div>
          <div class="list-item--sub-info">{{artist.track_count}}</div>
          <div class="list-item--controls">
            <v-icon name="list"></v-icon>
          </div>
        </div>
      </div>
      <div slot="albums-title">
        {{i18n.t('albums')}}
        <span v-if="currentArtist" @click="clearCurrentArtist">
          - {{currentArtist.title}}
        </span>
      </div>
      <div slot="albums-list">
        <div
                v-for="(album) in albums"
                :key="album.id"
                class="list-item"
                @click="setCurrentAlbum(album.id)"
        >
          <div class="list-item--title">{{album.title}}</div>
          <div class="list-item--info">
            {{album.artist.title}}
            <span v-if="album.year">- {{album.year}}</span>
          </div>
          <div class="list-item--sub-info">{{album.track_count}}</div>
          <div class="list-item--controls">
            <!--
            <v-icon name="play" class="filled"></v-icon>
            <v-icon name="plus"></v-icon>
            -->
          </div>
        </div>
      </div>
      <div slot="tracks-title">
        <v-icon name="plus" @click.native="addAlbum" class="group-control"></v-icon>
        <v-icon name="play" @click.native="playAlbum" class="group-control"></v-icon>
        <span v-if="currentAlbum">
          {{currentAlbum.artist.title}}
        </span>
        <span v-if="currentAlbum" @click="clearCurrentAlbum">
          - {{currentAlbum.title}}
        </span>
      </div>
      <div slot="track-list">
        <div
                v-for="(track) in tracks"
                :key="track.id"
                class="list-item"
                @click="trackToPlaylist(track)"
        >
          <div class="list-item--title">{{track.title}}</div>
          <div class="list-item--info">{{track.artist.title}} - {{track.album.title}}</div>
          <div class="list-item--sub-info">{{formatTrackTime(track.duration)}}</div>
          <div class="list-item--controls">
            <!--
            <v-icon name="play" class="filled"></v-icon>
            <v-icon name="plus"></v-icon>
            -->
          </div>
        </div>
      </div>
      <div slot="list-title">
        {{i18n.t('playlist')}}
        <v-icon name="x" @click.native="setPlaylist([])" class="group-control"></v-icon>
      </div>
      <div slot="playlist">
        <div
                v-for="(item, key) in playlist"
                :key="key"
                :class="{'list-item': true, 'current': currentPlaylistKey === key}"
                @click="setPlaylistTrack(key)"
        >
          <div class="list-item--pre" v-if="key === currentPlaylistKey">&#9724;</div>
          <div class="list-item--pre" v-else>&#9723;</div>
          <div class="list-item--title">{{item.title}}</div>
          <div class="list-item--info">{{item.album.title}}</div>
          <div class="list-item--sub-info">{{formatTrackTime(item.duration)}}</div>
          <div class="list-item--controls">
            <v-icon
                    @click.native.stop="removeTrackFromPlaylist(key)"
                    name="x"></v-icon>
          </div>
        </div>
      </div>
      <div slot="play-line" style="width: 100%;border-top:1px solid #999;display: flex">
        <Timeline></Timeline>
        <div id="controls">
          <v-icon @click.native="playlistPrevious" name="skip-back" id="play-line-backward"></v-icon>
          <v-icon @click.native="playerPlay" v-if="!playing" name="play-circle" id="play-line-play"></v-icon>
          <v-icon @click.native="playerPause" v-else name="pause-circle" id="play-line-pause"></v-icon>
          <v-icon @click.native="playlistNext" name="skip-forward" id="play-line-forward"></v-icon>
        </div>
        <div id="now-time">
          <span id="now-time-elapsed">{{formatTrackTime(currentTrackTime)}}</span> /
          {{formatTrackTime(currentTrackDuration)}}
        </div>
        <div id="now-playing">
          <div id="now-playing--song">
            {{currentTrackTitle || i18n.t('unknown_track')}}
          </div>
          <div id="now-playing--artist">
            {{currentTrackArtist || i18n.t('unknown_artist')}}
            <span v-if="currentTrackAlbum">
              - {{currentTrackAlbum}}
            </span>
            <span v-if="currentTrackYear">
              - {{currentTrackYear}}
            </span>
          </div>
        </div>
      </div>
    </Layout>
    <div>
      <audio preload="auto" ref="player">{{i18n.t('browser_no_support')}}</audio>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations, mapGetters } from 'vuex'
import Timeline from './components/Timeline'
import Layout from './layouts/Main'
import LanguagePicker from './components/LanguagePicker'

export default {
  name: 'app',
  data () {
    return {
      skin: 'green'
    }
  },
  computed: {
    ...mapState({
      currentArtist: state => state.Artists.currentArtist,
      currentAlbum: state => state.Albums.currentAlbum,
      currentTrack: state => state.Playlist.currentTrack,
      playlist: state => state.Playlist.playlist,
      currentPlaylistKey: state => state.Playlist.currentTrackN,
      artists: state => state.Artists.artists,
      albums: state => state.Albums.albums,
      tracks: state => state.Tracks.tracks,
      playing: state => state.Player.playing,
      trackEnd: state => state.Player.trackEnd,
      currentTrackTime: state => state.Player.currentTime
    }),
    ...mapGetters({
      currentTrackDuration: 'playerDuration'
    }),
    currentTrackArtist () {
      return this.currentTrack && this.currentTrack.artist.title
    },
    currentTrackTitle () {
      return this.currentTrack && this.currentTrack.title
    },
    currentTrackAlbum () {
      return this.currentTrack && this.currentTrack.album.title
    },
    currentTrackYear () {
      return this.currentTrack && this.currentTrack.album.year
    }
  },
  created () {
    this.loadPlaylist()
    this.loadArtistList()
    this.loadTrackList()
    this.loadAlbumList()
  },
  mounted () {
    this.setAudioDOM(this.$refs.player)
  },
  methods: {
    ...mapActions([
      'loadPlaylist',
      'loadArtistList',
      'loadAlbumList',
      'loadTrackList'
    ]),
    ...mapMutations([
      'setAudioDOM',
      'playerSetTrack',
      'addTrackToPlaylist',
      'setCurrentArtist',
      'clearCurrentArtist',
      'setCurrentAlbum',
      'clearCurrentAlbum',
      'removeTrackFromPlaylist',
      'setPlaylistTrack',
      'playerPlay',
      'playerPause',
      'playlistPrevious',
      'setPlaylist',
      'playlistNext'
    ]),
    formatTrackTime (v) {
      var sec_num = parseInt(v, 10);
      var hours   = Math.floor(sec_num / 3600);
      var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
      var seconds = sec_num - (hours * 3600) - (minutes * 60);

      if (hours && hours   < 10) {hours   = "0"+hours;}
      if (minutes < 10) {minutes = "0"+minutes;}
      if (seconds < 10) {seconds = "0"+seconds;}
      return (hours ? hours+':' : '')+minutes+':'+seconds;
    },
    trackToPlaylist (track) {
      this.addTrackToPlaylist(track)
    },
    addAlbum () {
      this.tracks.forEach(v => this.trackToPlaylist(v))
    },
    playAlbum () {
      this.setPlaylist([])
      this.addAlbum()
      this.setPlaylistTrack(0)
      this.playerPlay()
    }
  },
  watch: {
    trackEnd (v) {
      if (v) {
        this.playlistNext()
      }
    },
    currentArtist (v) {
      if (v) {
        this.loadAlbumList(v && v.id)
        this.clearCurrentAlbum()
        if (v && v.id) {
          this.loadTrackList({
            artistId: v.id
          })
        }
      }
    },
    currentAlbum (v) {
      if (v) {
        this.loadTrackList({
          artistId: (this.currentArtist && this.currentArtist.id) || this.currentAlbum.artist.id,
          albumId: v && v.id
        })
      }
    },
    currentTrack (v) {
      this.playerSetTrack(v)
      this.playerPlay()
    }
  },
  components: {
    Layout,
    LanguagePicker,
    Timeline
  }
}
</script>

<style>
@import "http://fonts.fontstorage.com/import/bloggersans.css";
</style>
<style lang="scss">
@import './assets/skins/purple.scss';
@import './assets/skins/green.scss';

body {
  margin:0;
  padding:0;
  height:100vh;
  font-family: 'Blogger Sans';
}

#now-time {
  padding-top:22px;
  padding-left:15px;
  font-size:18px;
}
#now-time-elapsed {
  color:#666;
}
#now-playing {
  flex:1;
  padding-left:15px;
  padding-top:12px;
}
#now-playing--song {
  font-size:17px;
  font-weight: bold;
}
#now-playing--artist {
}

#controls {
  margin-left:15px;
  padding-top:12px;
  display: block;
  height:100%;
  margin-right:0;
}
#controls svg {
  cursor:pointer;
}

#play-line-backward {
  display: block;
  float:left;
  margin-top:8px;
  height:15px;
  border-radius: 30px;
  padding:3px;
  margin-right:2px;
}
#play-line-play, #play-line-pause {
  display: block;
  float:left;
  height:24px;
  margin-top: 5px;
  border-radius: 30px;
  padding:3px;
}
#play-line-forward {
  display: block;
  float:left;
  margin-top:8px;
  margin-left:2px;
  height:15px;
  border-radius: 30px;
  padding:3px;
}
.list-title {
  font-size:20px;
  padding:15px;
  font-weight: bold;
}
.list-item {
  padding-bottom:0;
  padding-top:3px;
  cursor:pointer;
  display: flex;
}
.list-item .list-item--pre {
  padding-left:15px;
}
.list-item:hover .list-item--title {
  text-decoration: none;
}
.list-item--title {
  font-size:14px;
  padding-left:15px;
  padding-right:15px;
  line-height: 21px;
  text-decoration: none;
  overflow-x: hidden;
  white-space: nowrap;
  margin-right:10px;
}
.list-item--info {
  font-size:12px;
  padding-top:1px;
  overflow-x: hidden;
  margin-right:10px;
  white-space: nowrap;
  padding-left:5px;
  line-height:19px;
}
.list-item--sub-info {
  align-self: flex-end;
  margin-left: auto;
  font-size:12px;
  padding-top:1px;
  margin-right:15px;
  line-height:19px;
}
.list-item--controls {
  width:auto;
  align-self: flex-end;
  padding-right:15px;
  white-space: nowrap;
}
.list-item--controls .icon {
  height:12px;
}
@media (max-width: 768px) {
  #now-playing {
    display: none;
  }
  #now-time {
    margin:0 auto;
  }
}
#menu-switchers {
  position: absolute;
  top:20px;
  right:20px;
}
@media (max-width:768px) {
  #menu-switchers {
    display: none;
  }
}
.group-control {
  height:20px;
  float:right;
  cursor:pointer;
}
</style>
