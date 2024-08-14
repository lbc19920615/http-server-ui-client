<style lang="scss">
.z-video {
  position: relative;
  video {
    opacity:1;
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
  <div>{{ imgSrc }} {{ poster }}</div>
  <div class="z-video" 
  :class="['z-video--' + (isPLaying ? 'playing' : '')]">
    <video style="max-width: 100%;" :id="videoID"
           muted 
           playsinline 
       
           controls
           @loadeddata="onLoadedData"
           :src="imgSrc"
    >
    </video>
    <!-- <div  class="z-video__poster"  >
      <img
          @click="play"
          crossorigin="anonymous"
          loading="lazy"
          :src="poster" alt="">
      <div class="fa fa-play icon-ff"></div>
    </div> -->
  </div>
</template>

<script>

      const { fetchFile } = window.FFmpegUtil;
      const { FFmpeg } = window.FFmpegWASM;
      let ffmpeg = null;


      const transcode = async ({ name, src } ={}) => {
        let imgName = name.replace('.mp4', '.jpg')
        if (ffmpeg === null) {
          ffmpeg = new FFmpeg();
          ffmpeg.on("log", ({ message }) => {
            console.log(message);
          })
          ffmpeg.on("progress", ({ progress, time }) => {
            console.log(`${progress * 100} %, time: ${time / 1000000} s`)
          });
          await ffmpeg.load({
            coreURL: "/assets/core/package/dist/umd/ffmpeg-core.js",
          });
        }
        console.log(ffmpeg, imgName)
        let videoFile = await fetchFile(src)
        console.log('videoFile', imgName)
        await ffmpeg.writeFile(name, videoFile);
        console.time('exec');
        await ffmpeg.exec(['-i', name,  imgName, '-ss', '00:01:05', '-frames:v', '1']);
        console.timeEnd('exec');
        const data = await ffmpeg.readFile(imgName);
console.log(data)
return data
      }

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
  computed: {
    imgSrc() {
      if (this.src) {
        return this.src.replace('giga//', 'giga/') 
      }
      return ''
    }
  },
  methods: {
    async onLoadedData() {
      if (this.src) {
        let imgSrc =this.src.replace('giga//', 'giga/')
        let names = imgSrc.split('/')

        // try{
        //   this.poster = await transcode({name: names[names.length - 1], src: imgSrc})
        // } catch(e) {
        //   console.log(imgSrc, e)
        // }
      }


      // this.play()
      //   setTimeout(v => {
      //     this.pause()
      //   }, 3000)
  },
    onImgLoad() {
      this.showed = true
    },
    play(e) {
      console.log('play', e)
      this.isPLaying = true
      let v = document.getElementById(this.videoID)
      if (v) {
        v.play();
      }
    },
    pause(e) {
      console.log('pause', e)
      if (this.isPLaying) {
        this.isPLaying = false
        let v = document.getElementById(this.videoID)
        if (v) {
          v.pause();
        }
      }

    }
  }
}
</script>