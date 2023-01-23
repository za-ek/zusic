<!--
  _____________
 |_____________|
 |___|     |   |
 |   |_____|   |
 |   |     |   |
 |___|_____|___|
 |_____________|

  => => => => =>
   ___
  |___|
  |   |
  |   |
  |___|
  |___|
-->
<template>
  <div id="main-layout">
    <div id="main-layout--top">
      <slot name="open-sidebar">
        <v-icon
                v-if="sidebar && sidebarStep > 0"
                name="corner-up-left"
                id="back-sidebar"
                @click.native.prevent="(sidebarStep === 4) ? sidebarStep = 0 : sidebarStep--"
        ></v-icon>
        <v-icon
                v-else
                name="align-justify"
                id="open-sidebar"
                @click.native="() => {sidebar = !sidebar; }"
        ></v-icon>
      </slot>
      <slot name="menu-wrapper">
        <div class="menu-title" v-if="sidebar">
          <slot v-if="sidebarStep === 0" name="search-title"></slot>
          <slot v-if="sidebarStep === 0" name="artist-title"></slot>
          <slot v-if="sidebarStep === 1" name="albums-title">{{i18n.t('albums')}}</slot>
          <slot v-if="sidebarStep === 2 || sidebarStep === 4" name="tracks-title">{{i18n.t('tracks')}}</slot>
        </div>
        <div class="menu-title" v-else>
          <slot name="list-title">{{i18n.t('playlist')}}</slot>
        </div>
        <slot name="menu-line"></slot>
      </slot>
    </div>
    <div id="main-layout--middle">
      <div
        id="main-layout--left"
        :class="{sidebar: sidebar && sidebarStep === 0}"
        @click="sidebarStep++"
      >
        <div id="main-layout--left--top" v-if="false">
          <div class="main-layout-content">
            <div class="list-title">
              <slot name="genres-title">
                {{i18n.t('genres')}}
              </slot>
            </div>
            <div class="list-content">
              <slot name="genres-list"></slot>
            </div>
          </div>
        </div>
        <div id="main-layout--left--bottom">
          <div class="main-layout-content">
            <div class="list-title">
              <slot name="artist-title"></slot>
            </div>
            <div class="list-content">
              <slot name="artist-list"></slot>
              <div>
                <div class="list-item list-header"><div class="list-item--title">{{i18n.t('artists')}}</div></div>
                <slot name="search-artists" @click.stop="sidebarStep = 1"></slot>
                <div class="list-item list-header"><div class="list-item--title">{{i18n.t('albums')}}</div></div>
                <div @click.stop="sidebarStep = 4"><slot name="search-albums" @click="searchAlbumSelected"></slot></div>
                <div class="list-item list-header"><div class="list-item--title">{{i18n.t('tracks')}}</div></div>
                <slot name="search-tracks"></slot>
              </div>

            </div>
          </div>
        </div>
      </div>
      <div id="main-layout--center" :class="{sidebar: sidebar && sidebarStep > 0}">
        <div
            id="main-layout--center--top"
           :class="{sidebar: sidebar && sidebarStep === 1}"
            @click="sidebarStep = 2"
        >
          <div class="main-layout-content">
            <div class="list-title">
              <slot name="albums-title">
                {{i18n.t('albums')}}
              </slot>
            </div>
            <div class="list-content">
              <slot name="albums-list"></slot>
            </div>
          </div>
        </div>
        <div
            id="main-layout--center--bottom"
            :class="{sidebar: sidebar && sidebarStep === 2 || sidebarStep === 4}"
        >
          <div class="main-layout-content">
            <div class="list-title">
              <slot name="tracks-title">
                {{i18n.t('tracks')}}
              </slot>
            </div>
            <div class="list-content">
              <slot name="track-list"></slot>
            </div>
          </div>
        </div>
      </div>
      <div
          id="main-layout--right"
          :class="{sidebar: sidebar}"
          @click="sidebar = false"
      >
        <div class="layout-overlay" v-if="sidebar"></div>
        <div class="main-layout-content">
          <div class="list-title">
            <slot name="list-title">
              {{i18n.t('playlist')}}
            </slot>
          </div>
          <div class="list-content">
            <slot name="playlist"></slot>
          </div>
        </div>
      </div>
    </div>
    <div id="main-layout--bottom">
      <slot name="play-line"></slot>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      window: {
        width: 0,
        height: 0
      },
      sidebar: false,
      sidebarStep: 0
    }
  },
  created () {
    window.addEventListener('resize', this.handleResize)
    this.handleResize()
  },
  destroyed() {
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    handleResize() {
      this.window.width = window.innerWidth;
      this.window.height = window.innerHeight;
    },
    searchAlbumSelected(e) {
      console.log(e);
    }
  },
  watch: {
    sidebarStep(v) {
      console.log(v);
    }
  }
}
</script>

<style lang="scss">
  html, body, #app {margin: 0; height:100%;}
#main-layout {
  width:100%;
  height:100%;
  display: flex;
  text-align:left;
  flex-direction: column;
  align-content: stretch;
  align-items: stretch;
  box-sizing: content-box;

  &--top {
    flex: 0 0 60px;
    border-bottom: 1px solid #aaa;
  }
  &--middle {
    width:100%;
    flex:1 1 100%;
    display: flex;
    padding-bottom: 30px;
    overflow: hidden;
  }
  &--bottom {
    flex:0 0 60px;
    width:100%;
  }

  &--left, &--center, &--right {
    overflow:hidden;
    flex-direction: column;
    max-height: 100%;
  }

  &--left {
    width:30%;
    flex-direction: column;
    display: flex;
    &--bottom, &--top {
      display: flex;
      flex-direction: column;
      overflow:hidden;
      flex:1;
    }
    &--top {
      flex:1;
    }
    &--bottom {
      flex:3;
    }
  }

  &--center {
    display: flex;
    flex-direction: column;
    width:40%;

    &--bottom, &--top {
      display: flex;
      flex-direction: column;
      overflow:hidden;
      flex:1;
    }
    &--bottom {
      margin-top:20px;
      flex:1;
      min-height: 60%;
    }
  }
  &--right {
    width:30%;
  }
}

.main-layout-content {
  height:100%;
  max-height:100%;
  display: flex;
  flex-direction: column;
}

.list-title {
}
.list-content {
  outline: 1px solid #666;
  padding-top:3px;
  padding-bottom:3px;
  overflow-y:auto;
  flex:1;
}
.back-sidebar {
  height:23px;
  float:left;
  margin-right:10px;
  color:#fff;
}
#open-sidebar,
#back-sidebar {
  color:#fff;
  display: none;
}
.menu-title {
  display: none;
}
@media (max-width: 768px) {
  .list-title {
    display: none;
  }
  .menu-title {
    display: block;
    color:#fff;
    font-size:17px;
    font-weight: bold;
    padding:20px;
    margin-left:30px;
  }
  .layout-overlay {
    width:100%;
    height:100%;
    display: block;
    position: absolute;
  }
  #main-layout {
    &--left {
      display: none;

      &.sidebar {
        display: flex;
        width: 100%;
      }
    }
    &--center {
      display: none;

      &.sidebar {
        display: flex;
        width: 100%;
      }

      &--top {
        display: none;
        &.sidebar {
          display: flex;
          width: 100%;
        }
      }
      &--bottom {
        display: none;
        &.sidebar {
          margin-top:0;
          display: flex;
          width: 100%;
        }
      }
    }
    &--right {
      width:100%;

      &.sidebar {
        width:10%;
        opacity: 0.5;
        * {
          overflow: hidden;
        }
      }
    }
    &--middle {
      padding-bottom: 0 !important;
    }
  }
  .list-content {
    margin:0 !important;
  }
  #open-sidebar, #back-sidebar {
    display: inline-block;
    float:left;
    margin:20px 0 20px 20px;
    height:20px;
  }
}
</style>