<template>
  <div id="app">
    <Layout>
      <div slot="artist-list">
        Artist list
        <div v-for="i in artists" :key="i">
          {{i}} <br>
        </div>
      </div>
      <div slot="album-list">
        Album list
        <div v-for="i in albums" :key="i">
          {{i}} <br>
        </div>
      </div>
      <div slot="track-list">
        Track list
        <div v-for="i in tracks" :key="i">
          {{i}} <br>
        </div>
      </div>
      <div slot="playlist">
        Playlist
        <div v-for="i in playlist" :key="i">
          {{i}} <br>
        </div>
      </div>
      <div slot="play-line" style="width: 100%;height:100%; display: block">
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
import Layout from './layouts/Main'

export default {
  name: 'app',
  data () {
    return {
      artists: [],
      albums: [],
      tracks: [],
      playlist: []
    }
  },
  created () {
    for (let i = 0; i < 40; i++) {
      this.artists.push(Math.random().toString(36).substring(7))
      this.albums.push(Math.random().toString(36).substring(7))
      this.tracks.push(Math.random().toString(36).substring(7))
      this.playlist.push(Math.random().toString(36).substring(7))
    }
  },
  components: {
    Layout
  }
}
</script>

<style>
body {
  margin:0;
  padding:0;
  height:100vh;
}

#controls {
  margin: 0 auto;
  display: block;
  height:100%;
  width: 120px;
}

#play-line-backward {
  display: block;
  float:left;
  margin-top:8px;
  height:25px;
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
  height:34px;
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
  height:25px;
  background-color: purple;
  border-radius: 30px;
  padding:3px;
  border:2px solid #ed00ed;
  color: #fff;
}
</style>
