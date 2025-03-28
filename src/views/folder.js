const SEVER_ORIGIN = 'http://' + location.hostname + ':7100';

let utilsMixin = {
    methods: {
        utils_screenShot() {
            let { href = '' } = this.$router.currentRoute.value.query
            // console.log(href)
            import(`./sds.linkvue?v=${Date.now()}&href=${href}`)
        },
        utils_jumpTo() {
            window.jumpToItem(this.num)
        },
        utils_appendNum(v = 10) {
            this.num = this.num + v
        }
    }
}

let searchMixin = {
    data() {
        return {
            searchContion: {
            }
        }
    },
    beforeMount() {
        this.resetSearchContion();
    },
    methods: {
        resetSearchContion() {
            this.searchContion.reverse = false
            this.searchContion.site = ''
        }
    }
}

const PathResolve = {
    decode(s) {
        return s.replaceAll('__', '/')
    },
    encode(s) {
        return s.replaceAll('/', '__')
    }
}

export default {
    template: '#folder-tpl',
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.updateContent(to, from)
        })
    },
    beforeRouteUpdate(to, from) {
        this.updateContent(to, from)
    },
    data() {
        return {
            obj: {},
        }
    },
    methods: {
        backLink() {
            // console.log(this.obj)
            let arr = this.obj.path.split('/');
            if (arr.length > 2) {
                // console.log(arr)
                arr.splice(-2);
                let href = arr.join('__');
                if (arr.length > 0) {
                    href = href + '__'
                }
                this.$router.push({
                    path: `/folder/${href}`,
                })
            }
        },
        onListScroll() {
            let self = this;
            window.goodUtils.setCurIndex(function (index) {
                self.obj.curIndex = index;
            })
        },
        resetFun(context) {
            context.globalItems = [...document.querySelectorAll('.list-item')];

            context.getSet = function () {
                return context.globalItems.map(v => elementIsVisibleInViewport(v, true))
            }

            context.setCurIndex = function (cb) {
                context.globalItems.every((v, index) => {
                    let isVisible = elementIsVisibleInViewport(v, document.getElementById('con').getBoundingClientRect())
                    if (isVisible) {
                        // console.log(v)
                        cb(index)
                        return false
                    }
                    return true
                })
            }
        },
        async updateContent(to) {
            let self = this;
            let href = to.params.href;
            // console.log(to)
            let trueHref = href.replaceAll('__', '/');
            let u = new URL(SEVER_ORIGIN + trueHref);
            // u.searchParams.append('v', Date.now())
            let data = await fetchDirectoryURL(u.toString(), trueHref);
            let newData = data.map(item => {
                // item['href'] = item.href.replaceAll('/', '__');
                return item
            });
            this.obj.arr = newData;
            this.obj.curIndex = 0;
            this.obj.path = trueHref;
            document.getElementById('con').scrollTop = 0
            this.render();
            window.goodUtils = {};
            this.$nextTick(() => {
                self.resetFun(window.goodUtils);
            })
        },
        onEvent(e) {
            if (e.name === 'index-update') {
                this.obj.curIndex = e.params.index;
            }
            else if (e.name === 'index-reset') {
                let self = this;
                window.goodUtils.setCurIndex(function (index) {
                    self.obj.curIndex = index;
                })
            }
        },
        render() {
               

            window.defComAndReloadCurPage('f-list',
                {
                    template: /*html*/`<div>
                    <div class="vis-viewer" v-if="useSliderImg()">
                        <div style="position: relative"  >
           
               
                           <div id="viewerimg" class="img2">
                           <img 
                           class="img"
                           style="max-width: 100%; display: block; min-height: 200px; transition: all  1s ease;"
                           :alt="sortArr[curImgIndex].hrefDispay"
                           :src="getImgSrc(sortArr[curImgIndex].href)"
                           @load="onSliderLoad"
                          / >
                           </div>

                        </div>
                        <div class="row">
                        <el-slider :disabled="curImgLoaded" v-model="curImgIndex" @change="onIndexChange"  :max="sortArr.length" show-input />
                        </div>
                    </div>
                    <div v-else>
                    <div v-for="(img, index) in sortArr" :key="img.id" 
                    class="list-item"> 
                        <template v-if="img.fileExt">
                            <template v-if="checkMimeType(img.fileExt, 'image')">
                                <!--                       <div><span v-html="img.hrefDispay"></span></div>-->
                                <div style="margin-left: 10px;">{{img.date}}</div>
                                <el-image 
                                :class="{'loaded': img.loaded}"
                                        style="max-width: 100%; display: block; min-height: 200px;"
                                        :alt="img.hrefDispay"
                                        :src="getImgSrc(img.href)"
                                        @load="onImageLoad(img, $event)"
                                        @close="onImageClose"
                                        @switch="onImageSwitch"
                                        :preview-src-list="bigImgList"  
                                        :initial-index="curIndex"
                                        lazy
                                        >
                                    <template #error="scope">
                                        
                                    </template>
                                </el-image>
                            </template>
                            <template v-else-if="img.fileExt === 'mp4'">
                                <div>{{img.hrefDisplay}} <span style="margin-left: 10px;">{{img.date}}</span></div>
                                <z-video style="max-width: 100%;"
                                        :src="getImgSrc(img.href)"
                                >
                                </z-video>
                            </template>
                            <template v-else>
                                <el-link target="_blank"
                                        :href="getImgSrc(img.href)"><span v-html="img.hrefDispay"></span></el-link>
                            </template>
                        </template>
                        <template v-else>
                            <div :class="{'back-link': img.hrefDispay === '..'}">
                                <el-link type="primary" @click="goToLink(img)"><span v-html="img.hrefDispay"></span> 
                                </el-link>
                            </div>
                        </template>
                    </div>
                    </div>
                    </div>`,
                    props: {
                        arr: Array,
                        curIndex: Number,
                        path: String
                    },
                    data() {
                        return {
                            curImgIndex: 0,
                            cloneImg: null,
                            curImgLoaded: false,
                        }
                    },
                    computed: {
                        bigImgList() {
                            return this.arr.map(v => {
                                return this.getImgSrc(v.href)
                            })
                        },
                        sortArr() {
                            if (Array.isArray(this.arr)) {
                                if (this.searchContion) {
                                    if (this.searchContion.reverse) {
                                        console.log(this.searchContion.reverse);
                                        return [...this.arr].sort((a, b) => {
                                            return b.dateObj - a.dateObj;
                                        })
                                    }
                                }
                                return [...this.arr]
                            }
                            return []
                        },
                    },
                    methods: {
                        onIndexChange(e) {
                            console.log('onIndexChange',e)
                            this.curImgLoaded = true;
            
        
                    
                        },
                        onSliderLoad(e){
                            console.log(e)
                            setTimeout(() =>{
                                this.curImgLoaded = false 
                                this.cloneImg = this.getImgSrc(this.sortArr[this.curImgIndex].href)
                            }, 1000)
                        },
                        useSliderImg() {
                            console.log(this.arr)
                            // return true
                           if (this.arr.every(v => this.checkMimeType(v.fileExt, 'image'))) {
                             return true
                           }
                           return false
                        },
                        onImageLoad(img) {
                            img.loaded = true;
                        },
                        onImageClose() {
                            this.$emit('event', {
                                name: 'index-reset',
                                params: {
                                }
                            })
                        },
                        onImageSwitch(index) {
                            this.$emit('event', {
                                name: 'index-update',
                                params: {
                                    index
                                }
                            })
                        },
                        getImgSrc(v) {

                            // console.log(SEVER_ORIGIN + this.path + PathResolve.uncode(v))
                            return SEVER_ORIGIN + this.path + v
                        },
                        checkMimeType(fileExt, lib) {
                            let imageExt = ['png', 'jpg', 'jpeg']
                            if (lib === 'image') {
                                return imageExt.includes(fileExt)
                            }
                            return false
                        },
                        goToLink(v) {
                            let trueHref = PathResolve.encode(this.path + v.href.slice(1))
                            // console.log(trueHref)
                            this.$router.push({
                                path: `/folder/${trueHref}`,
                            })
                        }
                    }
                },
            )
        }
    },
}