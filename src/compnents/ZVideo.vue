<style lang="scss">
.z-video {
  position: relative;
  video {
    opacity: 0;
  }
  &--playing {
    .z-video__poster {
      display: none;
    }
    video {
      opacity: 1;
    }
  }
}
.z-video__poster {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  display: block;
  height: 100%;

  //background-color: #3a8ee6;
  .icon-ff {
    width: 36px;
    height: 36px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    font-size: 18px;
    pointer-events: none;
    background-color: #3a8ee6;
    //line-height: 1;
    z-index: 111;
    text-align: center;
    border-radius: 50%;
    color: #ffffff;
    line-height: 36px;
  }
  //.icon-ff:before { content: "\23F5" }
  //.icon-ff--standard:before { content: "\23E9\FE0E" }
}
.z-video__poster > img {
  display: block;
  height: 100%;
}
</style>

<template>
  <div class="z-video" :class="['z-video--' + (isPLaying ? 'playing' : '')]">
    <video style="max-width: 100%;" :id="videoID"
           muted playsinline  controls
           preload="none"
           :poster="getPoster(src)"
    >
      <source :src="src" type="video/mp4" />
    </video>
    <div  class="z-video__poster">
      <img
          @load="onImgLoad"
          @click="play"
          crossorigin="anonymous"
          loading="lazy"
          :src="getPoster(src)" alt="">
      <div class="fa fa-play icon-ff"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ZVideo',
  props: {
    src: String
  },
  data() {
    return {
      metas: new Map(),
      showed: false,
      isPLaying: false,
      poster: '',
      videoID: 'z' + uuidv4(),
    }
  },
  methods: {
    onImgLoad() {
      this.showed = true
    },
    getPoster(src) {
      // console.log(src)
      let srcArr = src.split('/')
      let srcLast = srcArr[srcArr.length - 1]
      srcLast = srcLast.replace('.mp4', '/frame_3.jpg');
      // let urlObj = new URL(srcLast)
      // console.log(srcLast)
      srcArr[srcArr.length - 1] = `/screen_shots/${srcLast}`
      return srcArr.join('/')
    },
    play(e) {
      console.log('play', e)
      this.isPLaying = true
      let v = document.getElementById(this.videoID)
      if (v) {
        v.play();
      }
    }
  }
}
</script>