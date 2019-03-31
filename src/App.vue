<template>
  <div id="app">
    <Layout>
      <div slot="menu-line">
        <div style="font-size:30px;font-weight: bold;margin:12px 0 12px 15px;float:left;">Zusic</div>
        <div style="float:right;margin-top:0;padding-top:20px;padding-right:20px;">
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
          <div class="list-item--sub-info">{{artist.trackCount}}</div>
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
          <div class="list-item--sub-info">{{album.trackCount}}</div>
          <div class="list-item--controls">
            <v-icon name="play" class="filled"></v-icon>
            <v-icon name="plus"></v-icon>
          </div>
        </div>
      </div>
      <div slot="tracks-title">
        {{i18n.t('tracks')}}
        <span v-if="currentArtist" @click="clearCurrentArtist">
          - {{currentArtist.title}}
        </span>
        <span v-else-if="currentAlbum">
          - {{currentAlbum.artist.title}}
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
                @click="addTrackToPlaylist(track)"
        >
          <div class="list-item--title">{{track.title}}</div>
          <div class="list-item--info">{{track.artist.title}} - {{track.album.title}}</div>
          <div class="list-item--sub-info">{{track.duration}}</div>
          <div class="list-item--controls">
            <v-icon name="play" class="filled"></v-icon>
            <v-icon name="plus"></v-icon>
          </div>
        </div>
      </div>
      <div slot="playlist">
        <div
                v-for="(item, key) in playlist"
                :key="key"
                class="list-item"
        >
          <div class="list-item--title">{{item.title}}</div>
          <div class="list-item--info">{{item.album.title}}</div>
          <div class="list-item--sub-info">{{item.duration}}</div>
          <div class="list-item--controls">
            <v-icon
                    @click.native="removeTrackFromPlaylist(key)"
                    name="x"></v-icon>
          </div>
        </div>
      </div>
      <div slot="play-line" style="width: 100%;border-top:1px solid #999;display: flex">
        <div id="now-playing">
          <div id="now-playing--song">
            Uknown Artist
          </div>
          <div id="now-playing--artist">
            Unknown Title - Unknown Album - 2000
          </div>
        </div>
        <div id="controls">
          <v-icon name="skip-back" id="play-line-backward"></v-icon>
          <v-icon name="play-circle" id="play-line-play"></v-icon>
          <v-icon name="skip-forward" id="play-line-forward"></v-icon>
        </div>
      </div>
    </Layout>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex'
import Layout from './layouts/Main'
import LanguagePicker from './components/LanguagePicker'

export default {
  name: 'app',
  data () {
    return {
    }
  },
  computed: {
    ...mapState({
      currentArtist: state => state.Artists.currentArtist,
      currentAlbum: state => state.Albums.currentAlbum,
      playlist: state => state.Playlist.playlist,
      artists: state => state.Artists.artists,
      albums: state => state.Albums.albums,
      tracks: state => state.Tracks.tracks
    })
  },
  created () {
    this.loadPlaylist()
    this.loadArtistList()
    this.loadTrackList()
    this.loadAlbumList()
  },
  methods: {
    ...mapActions([
      'loadPlaylist',
      'loadArtistList',
      'loadAlbumList',
      'loadTrackList'
    ]),
    ...mapMutations([
      'addTrackToPlaylist',
      'setCurrentArtist',
      'clearCurrentArtist',
      'setCurrentAlbum',
      'clearCurrentAlbum',
      'removeTrackFromPlaylist'
    ])
  },
  watch: {
    currentArtist (v) {
      this.loadAlbumList(v && v.id)
      this.clearCurrentAlbum()
      if (v && v.id) {
        this.loadTrackList({
          artistId: v.id
        })
      }
    },
    currentAlbum (v) {
      this.loadTrackList({
        artistId: (this.currentArtist && this.currentArtist.id) || this.currentAlbum.artist.id,
        albumId: v && v.id
      })
    }
  },
  components: {
    Layout,
    LanguagePicker
  }
}
</script>

<style>
body {
  margin:0;
  padding:0;
  height:100vh;
}

#now-playing {
  flex:1;
  padding-left:15px;
  padding-top:7px;
}
#now-playing--song {
  font-size:17px;
  font-weight: bold;
}
#now-playing--artist {
}

#controls {
  margin-left:15px;
  padding-top:8px;
  display: block;
  height:100%;
  margin-right:15px;
}

#play-line-backward {
  display: block;
  float:left;
  margin-top:8px;
  height:15px;
  background-color: purple;
  border-radius: 30px;
  padding:3px;
  border:2px solid #ed00ed;
  margin-right:2px;
  color: #fff;
}
#play-line-play {
  display: block;
  float:left;
  height:24px;
  margin-top: 5px;
  background-color: purple;
  border-radius: 30px;
  padding:3px;
  color: #fff;
}
#play-line-forward {
  display: block;
  float:left;
  margin-top:8px;
  margin-left:2px;
  height:15px;
  background-color: purple;
  border-radius: 30px;
  padding:3px;
  border:2px solid #ed00ed;
  color: #fff;
}
.list-title {
  font-size:20px;
  padding:15px;
  font-weight: bold;
}
.list-item {
  border-bottom: 1px solid #ddd;
  padding-bottom:2px;
  padding-top:2px;
  cursor:pointer;
  display: flex;
}
.list-item:hover .list-item--title {
  text-decoration: none;
}
.list-item--title {
  font-size:15px;
  padding-left:15px;
  padding-right:15px;
  color:purple;
  text-decoration: underline;
}
.list-item--info {
  font-size:12px;
  padding-top:1px;
  color:#999;
}
.list-item--sub-info {
  align-self: flex-end;
  margin-left: auto;
  font-size:12px;
  padding-top:1px;
  color:#999;
  margin-right:15px;
}
.list-item--controls {
  width:auto;
  align-self: flex-end;
  padding-right:15px;
}
.list-item--controls .icon.filled {
  fill:black !important;
}
.list-item--controls .icon {
  height:12px;
}
.list-item--controls .icon.filled:hover {
  fill:purple !important;
}
</style>
