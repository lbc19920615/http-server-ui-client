<style>
.z-video {
  position: relative;
}
.z-video__poster {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  display: block;
  height: 100%;
  pointer-events: none;
}
</style>

<template>
  <div class="z-video">
    <video style="max-width: 100%;" :id="videoID"
           preload="metadata" muted playsinline  controls
      :poster="getPoster(src)"
           @loadeddata="onLoaded"
    >
      <source :src="src" type="video/mp4" />
    </video>
<!--    <img class="z-video__poster" crossorigin="anonymous" :src="getPoster(src)" alt="">-->
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
      poster: '',
      videoID: 'z' + uuidv4(),
    }
  },
  methods: {
    getPoster(src) {
      // console.log(src)
      return src.replace('.mp4', '/frame_3.jpg')
    },
    onLoaded(e) {
      console.dir(e)
      // let videoElement = this.$el.querySelector('#' + this.videoID)
      let videoElement = e.target
      videoElement.currentTime = 1
      let url = window.URL.revokeObjectURL(videoElement.src);
      var duration = videoElement.duration; // 得到时长
      console.log(duration)

      let canvas = document.createElement("canvas");
      canvas.setAttribute("crossOrigin",'Anonymous')
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;
      console.log(videoElement.videoWidth)
      canvas.getContext('2d').drawImage(videoElement, 0, 0, canvas.width, canvas.height);

      // let img = new Image()//创建新的图片对象
      // img.src = canvas.toDataURL("image/png");
      // img.setAttribute("crossOrigin",'Anonymous')
      // img.onload = function () {
      //   console.log('onload')
      // }

      this.poster = canvas.toDataURL("image/png");
      // console.log(this.poster)
    }
  }
}
</script>