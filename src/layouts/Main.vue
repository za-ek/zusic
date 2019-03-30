<!--
  _____________
 |   |     |   |
 |   |_____|   |
 |   |     |   |
 |___|_____|___|
 |_____________|

  => => => => =>
   ___
  |   |
  |   |
  |___|
  |___|
-->
<template>
  <div id="main-layout">
    <div id="main-layout--top">
      <div id="main-layout--left">
        <div class="main-layout-content">
          <slot name="artist-list"></slot>
        </div>
      </div>
      <div id="main-layout--center">
        <div id="main-layout--center--top">
          <div class="main-layout-content">
            <slot name="album-list"></slot>
          </div>
        </div>
        <div id="main-layout--center--bottom">
          <div class="main-layout-content">
            <slot name="track-list"></slot>
          </div>
        </div>
      </div>
      <div id="main-layout--right">
        <div class="main-layout-content">
          <slot name="playlist"></slot>
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
    width:100%;
    flex:1;
    display: flex;
  }
  &--bottom {
    height:60px;
    width:100%;
  }

  &--left, &--center, &--right {
    overflow-x:hidden;
    overflow-y: auto;
  }

  &--left {
    width:30%;
  }

  &--center {
    display: flex;
    flex-direction: column;
    width:40%;

    &--bottom, &--top {
      display: block;
      overflow-x:hidden;
      overflow-y: auto;
    }
    &--bottom {
      flex:1;
      min-height: 60%;
    }
  }
  &--right {
    width:30%;
  }
}

.main-layout-content {
  padding:20px;
}
</style>