<!--
  _____________
 |_____________|
 |   |     |   |
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
      <slot name="menu-line"></slot>
    </div>
    <div id="main-layout--middle">
      <div id="main-layout--left">
        <div class="main-layout-content">
          <div class="list-title">
            <slot name="artist-title">
              {{i18n.t('artists')}}
            </slot>
          </div>
          <div class="list-content">
            <slot name="artist-list"></slot>
          </div>
        </div>
      </div>
      <div id="main-layout--center">
        <div id="main-layout--center--top">
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
        <div id="main-layout--center--bottom">
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
      <div id="main-layout--right">
        <div class="main-layout-content">
          <div class="list-title">
            {{i18n.t('playlist')}}
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

<style lang="scss">
#main-layout {
  width:100%;
  height:100vh;
  display: flex;
  text-align:left;
  flex-direction: column;
  align-content: stretch;
  align-items: stretch;

  &--top {
    height:60px;
    border-bottom: 1px solid #aaa;
  }
  &--middle {
    width:100%;
    flex:1;
    display: flex;
  }
  &--bottom {
    height:60px;
    width:100%;
  }

  &--left, &--center, &--right {
    overflow:hidden;
    flex-direction: column;
  }

  &--left {
    width:30%;
  }

  &--center {
    display: flex;
    flex-direction: column;
    width:40%;

    &--bottom, &--top {
      display: flex;
      flex-direction: column;
      overflow:hidden;
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
  display: flex;
  flex-direction: column;
}

.list-title {
}
.list-content {
  overflow-y:auto;
  flex:1;
}
</style>