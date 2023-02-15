<template>
  <div id="app" :class="'skin-' + skin">
    <div id="loader" v-if="loading">
      <div>
        <v-icon name="loader"></v-icon>
      </div>
    </div>
    <Layout ref="layout">
      <div slot="menu-line">
        <div id="menu-switchers">
          <div id="network-status">
            <v-icon v-if="online" name="wifi"></v-icon>
            <v-icon v-else name="wifi-off"></v-icon>
          </div>
          <select v-model="skin">
            <option
                v-for="skinName in ['purple', 'green', 'dark']"
                :value="skinName"
                :key="skinName"
            >
              {{i18n.t('skin_' + skinName)}}
            </option>
          </select>
          <LanguagePicker></LanguagePicker>
        </div>
      </div>
      <div slot="genres-list">
        <div
                v-for="(genre) in genres"
                :key="genre.id"
                class="list-item"
                @click="setCurrentGenre(genre.id)"
        >
          <div class="list-item--title">{{genre.title}}</div>
          <div class="list-item--sub-info">{{genre.track_count}}</div>
          <div class="list-item--controls">
            <v-icon name="list"></v-icon>
          </div>
        </div>
      </div>
      <div slot="artist-list" v-if="!showSearch">
        <div class="list-item list-header"><div class="list-item--title">{{i18n.t('playlists')}}</div></div>
        <div
            v-for="(artist) in playlists"
            :key="'recent-'+artist.id"
            class="list-item"
            @click="setUserPlaylists(artist.title)"
        >
          <div class="list-item--title">{{artist.title || i18n.t('unknown_playlist')}}</div>
          <div class="list-item--sub-info">{{artist.track_count}}</div>
          <div class="list-item--controls">
            <v-icon name="list"></v-icon>
          </div>
        </div>
        <div class="list-item list-header"><div class="list-item--title">{{i18n.t('recent_artists')}}</div></div>
        <div
            v-for="(artist) in artists.filter(a => artists_recent.indexOf(a.id) > -1)"
            :key="'recent-'+artist.id"
            class="list-item"
            @click="setArtist(artist.id)"
        >
          <div class="list-item--title">{{artist.title || i18n.t('unknown_artist')}}</div>
          <div class="list-item--info">{{artist.genre.title}}</div>
          <div class="list-item--sub-info">{{artist.track_count}}</div>
          <div class="list-item--controls">
            <v-icon name="list"></v-icon>
          </div>
        </div>
        <div class="list-item list-header"><div class="list-item--title">{{i18n.t('artists_alphabet')}}</div></div>
        <div
          v-for="(artist) in artists"
          :key="artist.id"
          class="list-item"
          @click="setArtist(artist.id)"
        >
          <div class="list-item--title">{{artist.title || i18n.t('unknown_artist')}}</div>
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
        <div class="group-control">
          <v-icon v-if="currentArtist" @click.native="playArtist" name="play" class="group-control"></v-icon>
          <v-icon v-if="currentArtist" @click.native="addArtist" name="plus" class="group-control"></v-icon>
        </div>
      </div>
      <div slot="artist-title" v-if="!showSearch">
        {{i18n.t('artists')}}
        <v-icon name="search" @click.native="openSearch" class="group-control"></v-icon>
      </div>
      <div slot="artist-title" v-else>
        <input type="text" v-model="searchInput">
        <v-icon name="search" @click.native="openSearch" class="group-control"></v-icon>
        <v-icon name="x" @click.native.stop="closeSearch" class="group-control"></v-icon>
        <v-icon name="fast-forward" v-if="currentPreview > -1" @click.native="startWithPreview" class="group-control"></v-icon>
      </div>
      <div v-if="showSearch" slot="search-artists">
        <div
            v-for="(artist) in searchResults.artists"
            :key="artist.id"
            class="list-item"
            @click="setArtist(artist.id)"
        >
          <div class="list-item--title">{{artist.title || i18n.t('unknown_artist')}}</div>
          <div class="list-item--info">{{artist.genre.title}}</div>
          <div class="list-item--sub-info">{{artist.track_count}}</div>
          <div class="list-item--controls">
            <v-icon name="list"></v-icon>
          </div>
        </div>
      </div>
      <div v-if="showSearch" slot="search-albums">
        <div
            v-for="(album) in searchResults.albums"
            :key="album.id"
            class="list-item"
            @click="setAlbum(album.id)"
        >
          <div class="list-item--title">{{album.title || i18n.t('unknown_album')}}</div>
          <div class="list-item--info">{{album.year}}</div>
          <div class="list-item--sub-info">{{album.track_count}}</div>
          <div class="list-item--controls">
            <v-icon name="list"></v-icon>
          </div>
        </div>
      </div>
      <div v-if="showSearch" slot="search-tracks">
        <div
            v-for="(track) in searchResults.tracks"
            :key="track.id"
            class="list-item"
            @click.stop="addTrackToPlaylist(track)"
        >
          <div @click.stop="userPlaying = true; previewTrack(track)" class="list-item--pre">{{
              currentPreview === track.id ? "●" : "&cir;"
            }}</div>
          <div class="list-item--title">{{track.title}}</div>
          <div class="list-item--info">
            <a @click.stop="setArtist(track.artist_id)" href="#">{{track.artist}}</a>
            -
            <a @click.stop="setAlbum(track.album_id)" href="#">{{track.album}}</a>
          </div>
          <div class="list-item--sub-info">{{formatTrackTime(track.duration)}}</div>
          <div class="list-item--controls">
            <!--
            <v-icon name="play" class="filled"></v-icon>
            <v-icon name="plus"></v-icon>
            -->
          </div>
        </div>
      </div>
      <div slot="albums-list">
        <div
                v-for="(album) in albums"
                :key="album.id"
                class="list-item"
                @click="'type' in album && album.type == 'playlist' ? setUserPlaylist(album.id) : setAlbum(album.id)"
        >
          <div class="list-item--title">{{album.title || i18n.t('unknown_album')}}</div>
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
                :class="{'list-item': true,'preview' : currentPreview === track.id}"
                @click="trackToPlaylist(track)"
        >
          <div @click.stop="userPlaying = true; previewTrack(track)" class="list-item--pre">{{
              currentPreview === track.id ? "●" : "&cir;"
            }}</div>
          <div class="list-item--title">{{track.title}}</div>
          <div class="list-item--info">
            <a @click.stop="setArtist(track.artist.id)" href="#">{{track.artist.title}}</a>
            -
            <a @click.stop="setAlbum(track.album.id)" href="#">{{track.album.title}}</a>
          </div>
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
        <span :title="i18n.t('clear')"><v-icon name="x" @click.native="clearPlaylist" class="group-control"></v-icon></span>
        <span :title="i18n.t('shuffle')"><v-icon name="shuffle" @click.native="shufflePlaylist" class="group-control"></v-icon></span>
        <span :title="i18n.t('random_playlist')"><v-icon name="box" @click.native="randomPlaylist" class="group-control"></v-icon></span>
        <span :title="i18n.t('redo')"><v-icon name="corner-right-down" @click.native="redoPlaylist" class="group-control"></v-icon></span>
        <span :title="i18n.t('undo')"><v-icon name="corner-left-down" @click.native="undoPlaylist" class="group-control"></v-icon></span>
        <span :title="i18n.t('save')"><v-icon name="save" @click.native="savePlaylist" class="group-control"></v-icon></span>
      </div>
      <div slot="playlist">
        <PlaylistTrack
          @click.native="userPlaying = true; currentPreview = -1; setPlaylistTrack(key)"
          v-for="(item, key) in playlist"
          :index="key"
          :key="key"
          :track="item"
          :class="{'list-item': true, 'playlist-item': true, 'current': currentPlaylistKey === key}"
          :set-album="setAlbum"
          :set-artist="setArtist"
        />
      </div>
    </Layout>
    <div slot="play-line" id="bottom-block">
      <div>
        <Timeline/>
        <div id="controls">
          <v-icon @click.native="playlistPrevious" name="skip-back" id="play-line-backward"></v-icon>
          <v-icon @click.native="playerPlay(); userPlaying = true" v-if="!playing" name="play-circle" id="play-line-play"></v-icon>
          <v-icon @click.native="playerPause" v-else name="pause-circle" id="play-line-pause"></v-icon>
          <v-icon @click.native="playlistNext" name="skip-forward" id="play-line-forward"></v-icon>
        </div>
        <div id="now-time">
          <span id="now-time-elapsed">{{formatTrackTime(currentTrackTime)}}</span>
          <span id="now-time-slash"> /</span>
          {{formatTrackTime(currentTrackDuration)}}
        </div>
        <div id="now-playing">
          <div id="now-playing--song">
            {{currentTrackTitle || i18n.t('unknown_track')}}
          </div>
          <div id="now-playing--artist">
            <a v-if="currentTrackArtist" href="#" @click="setArtist(currentTrackArtist.id)">{{currentTrackArtist.title || i18n.t('unknown_artist')}}</a>
            <span v-if="currentTrackAlbum">
              - <a href="#" @click="setAlbum(currentTrackAlbum.id)">{{currentTrackAlbum.title}}</a>
            </span>
            <span v-if="currentTrackYear">
              - {{currentTrackYear}}
            </span>
          </div>
        </div>
        <div id="controls-right">
          <div id="volume"></div>
        </div>
      </div>
    </div>
    <div>
      <audio preload="auto" ref="player">{{i18n.t('browser_no_support')}}</audio>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations, mapGetters } from 'vuex'
import Timeline from './components/Timeline'
import PlaylistTrack from './components/PlaylistTrack'
import Layout from './layouts/Main'
import LanguagePicker from './components/LanguagePicker'

export default {
  name: 'app',
  data () {
    return {
      skin: 'purple',
      online: false,
      userPlaying: false,
      currentPreview: -1,
      history: [],
      searchInput: '',
      searchTimer: null,
      searchResults: {artists: [], albums: [], tracks: []},
      showSearch: false,
      historyIndex: -1,
      loading: false
    }
  },
  computed: {
    ...mapState({
      currentArtist: state => state.Player.Artists.currentArtist,
      currentAlbum: state => state.Player.Albums.currentAlbum,
      currentTrack: state => state.Player.Playlist.currentTrack,
      playlist: state => state.Player.Playlist.playlist,
      currentPlaylistKey: state => state.Player.Playlist.currentTrackN,
      genres: state => state.Player.Genres.genres,
      artists: state => state.Player.Artists.artists,
      playlists: state => state.Player.Artists.playlists,
      artists_recent: state => state.Player.Artists.recent,
      albums: state => state.Player.Albums.albums,
      tracks: state => state.Player.Tracks.tracks,
      playing: state => state.Player.Player.playing,
      trackEnd: state => state.Player.Player.trackEnd,
      currentTrackTime: state => state.Player.Player.currentTime
    }),
    ...mapGetters('Player', {
      currentTrackDuration: 'playerDuration'
    }),
    currentTrackArtist () {
      return this.currentTrack && this.currentTrack.artist
    },
    currentTrackTitle () {
      return this.currentTrack && this.currentTrack.title
    },
    currentTrackAlbum () {
      return this.currentTrack && this.currentTrack.album
    },
    currentTrackYear () {
      return this.currentTrack && this.currentTrack.album && this.currentTrack.album.year
    }
  },
  created () {
    this.skin = localStorage.getItem('skin') || 'purple'
    this.$eventHub.$on('playlist-move', this.playlistMove)
    this.$eventHub.$on('network-error', this.networkError)
    this.$eventHub.$on('network-success', () => { this.online = true })
    this.restoreState()
    try {
      this.playerPause()
    } catch (e) {
    }
  },
  mounted () {
    this.setAudioDOM(this.$refs.player)
    const volume = document.getElementById('volume');
    const MAX = 30;
    this.commitHistory();

    volume.onclick = (e) => {
      let v = (e.clientX - document.getElementById('controls-right').offsetLeft) / 145
      this.$refs.player.volume = v;
      for(let i = 0; i <= MAX; i++) {
        if((i / MAX) < v) {
          volume.childNodes[i].className = 'fill';
        } else {
          volume.childNodes[i].className = '';
        }
      }
    };
    volume.onmousemove = (e) => {
      if(e.which === 1) {
        volume.onclick(e);
      }
    };
    const maxHeight = 35;
    for(let i = 0; i <= MAX; i++) {
      let div = document.createElement('div');
      div.style.marginTop=((51 - maxHeight) + maxHeight * (MAX - i) / MAX) + 'px';
      div.style.height=(maxHeight * i / MAX) + 'px';
      div.style.left=(145 * i / MAX) + 'px';
      div.className = 'fill';
      volume.appendChild(div);
    }
  },
  methods: {
    ...mapActions('Player', [
      'loadRandomPlaylist'
    ]),
    ...mapMutations('Player', [
      'playerSetTime',
      'shufflePlaylist',
      'playlistMove',
      'setAudioDOM',
      'playerSetTrack',
      'addTrackToPlaylist',
      'setCurrentArtist',
      'clearCurrentArtist',
      'setCurrentAlbum',
      'setCurrentPlaylist',
      'clearCurrentAlbum',
      'removeTrackFromPlaylist',
      'setRawTrack',
      'setPlaylistTrack',
      'playerPlay',
      'playerPause',
      'playlistPrevious',
      'setPlaylist',
      'playlistNext'
    ]),
    openSearch() {
      this.showSearch = true;
    },
    playArtist() {
      this.loading = true;
      this.$axios.get('/artists/' + this.currentArtist.id + '/tracks')
          .then(({data}) => {
            this.setPlaylist(data.tracks)
            this.setPlaylistTrack(0)
            this.playerPlay()
            this.userPlaying = true
          })
          .finally(() => {
            this.loading = false;
          })
    },
    addArtist() {
      this.loading = true;
      this.$axios.get('/artists/' + this.currentArtist.id + '/tracks')
          .then(({data}) => {
            data.tracks.map(this.addTrackToPlaylist)
          })
          .finally(() => {
            this.loading = false;
          })
    },
    closeSearch() {
      if(this.searchInput) this.searchInput = '';
      else this.showSearch = false;
    },
    startWithPreview() {
      this.setPlaylist([
        Object.assign({}, this.currentTrack)
      ])
    },
    randomPlaylist() {
      this.loading = true;
      this.$store.dispatch('Player/loadRandomPlaylist', {api: this.$axios})
          .then(() => {
            this.commitHistory()
          })
          .finally(() => this.loading = false)
    },
    trackToPlaylist (track) {
      this.addTrackToPlaylist(track)
    },
    previewTrack(track) {
      if(this.currentPreview === track.id) {
        this.currentPreview = -1;
      } else {
        this.currentPreview = track.id
        this.setRawTrack(track)
      }
    },
    addAlbum () {
      this.tracks.forEach(v => this.addTrackToPlaylist(v))
      this.commitHistory();
    },
    commitHistory() {
      this.history.push([...this.playlist]);
      this.historyIndex = this.history.length - 1;
    },
    undoPlaylist() {
      if(this.historyIndex <= 0) return;
      --this.historyIndex;
      this.setPlaylist(this.history[this.historyIndex])
    },
    savePlaylist() {
      const name = prompt(this.i18n.t('playlist_prompt'))
      if(name && name.indexOf(':') > 0 && name.indexOf('id_') !== name.indexOf(':') + 1) {
        this.loading = true
        const sendParams = {
          name: name,
          list: this.playlist.map(i => i.id)
        };
        this.$axios.post('playlists', sendParams).finally(() => {this.loading = false});
      }
      // if(this.historyIndex <= 0) return;
      // --this.historyIndex;
      // this.setPlaylist(this.history[this.historyIndex])
    },
    redoPlaylist() {
      if(this.historyIndex >= this.history.length - 1) return;
      ++this.historyIndex;
      this.setPlaylist(this.history[this.historyIndex])
    },
    clearPlaylist() {
      this.setPlaylist([]);
      this.commitHistory();
    },
    playAlbum () {
      this.setPlaylist([])
      this.addAlbum()
      this.setPlaylistTrack(0)
      this.playerPlay()
      this.userPlaying = true
    },
    networkError () {
      this.online = false
    },
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
        this.$store.commit('Player/setArtistList', {artists: list, recent: [1,2,3,4,5,6,7,8,9]})

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
        this.$store.commit('Player/setAlbumList', list)

        list = []
        for (let i = 1; i < 60; i++) {
          list.push({
            id: i,
            title: Math.random().toString(36).repeat(1 + Math.random() * 3),
            duration: 100 + parseInt(Math.random() * 50),
            artist: Math.random().toString(36).repeat(1 + Math.random() * 2),
            album: Math.random().toString(36).repeat(1 + Math.random() * 2)
          })
        }
        this.$store.commit('Player/setTrackList', list)

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
        this.$store.commit('Player/setPlaylist', list)

      } else {
        try {
          if(localStorage.getItem('artist_id')) {
            this.setArtist(localStorage.getItem('artist_id'));
          } else {
            this.$store.dispatch('Player/loadAlbumList', {api: this.$axios})
          }
          this.$store.dispatch('Player/loadPlaylist', {api: this.$axios})
          this.$store.dispatch('Player/loadArtistList', {api: this.$axios})
          this.$store.dispatch('Player/loadTrackList', {
            api: this.$axios,
            filter: {albumId: localStorage.getItem('album_id')}
          });

          this.$store.commit('Player/setPlaylist', JSON.parse(localStorage.getItem('playlist')))
          let currentTrack = JSON.parse(localStorage.getItem('currentTrack'))
          this.setPlaylistTrack(this.playlist.findIndex(i => i.id === currentTrack.id))
        } catch (e) {
        }
      }
    },
    setAlbum(albumId) {
      localStorage.setItem('album_id', albumId);
      this.setCurrentAlbum({albumId, api: this.$axios});
    },
    setUserPlaylists(title) {
      this.loading = true
      this.$store.dispatch('Player/loadPlaylists', {api: this.$axios, title})
          .finally(() => {
            this.loading = false
          })
    },
    setUserPlaylist(id) {
      this.loading = true
      // this.$store.dispatch('Player/loadUserPlaylist', {api: this.$axios, id})
      this.$axios.get('/playlists/id_' + id)
          .then(d => {
            this.$store.commit('Player/setTrackList', d.data.tracks);
            this.loading = false
          })
    },
    setArtist(artistId) {
      this.loading = true
      this.setCurrentArtist(artistId)
      localStorage.setItem('artist_id', artistId);
      this.$store.dispatch('Player/loadAlbumList', {api: this.$axios, artistId})
          .finally(() => {
            this.loading = false
          })
    }
  },
  watch: {
    searchInput(v) {
      if(this.searchTimer) clearTimeout(this.searchTimer);
      this.searchTimer = setTimeout(() => {
        this.loading = true;
        this.$axios.get('/search/' + v)
            .then(({data}) => {
              this.searchResults.artists = data.artists;
              this.searchResults.albums = data.albums;
              this.searchResults.tracks = data.tracks;
            })
            .finally(() => {
              this.loading = false;
            })
      }, 500);
    },
    skin (v) {
      localStorage.setItem('skin', v)
    },
    trackEnd (v) {
      if (v) {
        this.playlistNext()
      }
    },
    currentArtist (v) {
      if (v) {
        this.$store.dispatch('Player/loadAlbumList', {api: this.$axios, artistId: v && v.id})
        this.clearCurrentAlbum()
        if (v && v.id) {
          this.$store.dispatch('Player/loadTrackList', {
            api: this.$axios,
            filter: {
              artistId: v.id
            }
          })
        }
      }
    },
    currentAlbum (v) {
      if (v) {
        this.loading = true;
        const promise = this.$store.dispatch('Player/loadTrackList', {
          api: this.$axios,
          filter: {
            artistId: (this.currentArtist && this.currentArtist.id) || this.currentAlbum.artist.id,
            albumId: v.id
          }
        })
        if(promise && promise instanceof Promise) promise.finally(() => this.loading = false)
        else this.loading = false;
      }
    },
    currentTrack (v) {
      this.playerSetTrack(v)
      if(this.userPlaying) {
        this.playerPlay()
      }
      localStorage.setItem('currentTrack', JSON.stringify(v))
    },
    playlist: {
      handler (v) {
        localStorage.setItem('playlist', JSON.stringify(v))
      },
      deep: true
    }
  },
  components: {
    Layout,
    LanguagePicker,
    Timeline,
    PlaylistTrack
  }
}
</script>

<style>
@import "https://st.fontstorage.com/font/import/bloggersans.css";
</style>
<style lang="scss">
@import './assets/skins/purple.scss';
@import './assets/skins/green.scss';
@import './assets/skins/dark.scss';

body {
  margin:0;
  padding:0;
  height:100vh;
  font-family: 'Blogger Sans';
}

#now-time {
  padding-top:25px;
  padding-left:15px;
  font-size:18px;
}
#now-time-elapsed {
  color:#666;
}
#now-playing {
  flex:1;
  padding-left:15px;
  padding-top:15px;
}
#now-playing--song {
  font-size:17px;
  font-weight: bold;
}
#now-playing--artist {
  height:1em;
  overflow: hidden;
}
#now-playing--artist a {
  color:#666;
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

#controls-right {
  height: 51px;
}
#volume {
  width:145px;
  margin-top: 8px;
  position: relative;
  overflow: hidden;
  height: 51px;
}
#volume > div {
  position:absolute;
  width:5px;
  float:left;
  border:1px solid #666;
  &.fill {background-color: #09ed00;}
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
.list-header {
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
.list-item.preview {
  background-color: #dedede;
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
.list-item--info a {
  color:inherit;
}
.list-item--info a:hover {
  text-decoration: none;
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
    white-space: nowrap;
    font-size: 12px;
    overflow: hidden;
  }
  #now-time-elapsed,
  #now-time-slash {
    display: none;
  }
  #controls-right {
    position: absolute;
    right:0;
    bottom:0;
  }
  #now-time {
    margin:0 auto;
  }
}
#menu-switchers {
  position: absolute;
  top:20px;
  right:20px;
  width:100%;
  text-align: right;
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
  margin-left:10px;
}
#network-status {
  display: inline-block;
  margin:0 10px 0 0 ;
}
#network-status .icon {
  height:20px;
  color:#fff;
}
#bottom-block {
  position: fixed;
  width: 100%;
  height:59px;
  border-top:1px solid #999;
  display: block;
  z-index: 10;
  margin-top:-59px;
}
#bottom-block > * {
  width: 100%;
  height:59px;
  position: relative;
  z-index: 10;
  float:left;
  display: flex;
  background-color: #fff;
}
#loader {
  position: absolute;
  width:100%;
  height:100%;
  background-color: rgba(255,255,255,0.4);
  overflow: hidden;
}
#loader > * {
  max-width:100px;
  display:flex;
  display: flex;
  width: 100%;
  height: 100%;
  margin: auto;
}
@-moz-keyframes spin {
  100% { -moz-transform: rotate(360deg); }
}
@-webkit-keyframes spin {
  100% { -webkit-transform: rotate(360deg); }
}
@keyframes spin {
  100% {
    -webkit-transform: rotate(360deg);
    transform:rotate(360deg);
  }
}
#loader svg {
  -webkit-animation:spin 4s linear infinite;
  -moz-animation:spin 4s linear infinite;
  animation:spin 4s linear infinite;
}
</style>
