export let ver = "0.0.1";


class ZQueue {
    arr = [];
    get size() {
        return this.arr.length
    }
    each(cb) {
        this.arr.forEach(cb)
    }
    in(v) {
       this.arr.push(v)
    }
    out() {
        this.arr.shift()
    }
    
}
window.ZQueue = ZQueue

function initNotification() {
    let div = document.createElement('div');
    div.innerHTML = `<div id="mypopover" class="zpopover" popover>
    
    </div>`;
    document.body.appendChild(div)

    const popover = document.getElementById("mypopover");

    window.appendStyle(/*css*/`
          .zpopover {
           --notify-height: 20px;
          }
            @keyframes zfadeOutUp {
                0% {
                    opacity: 1;
                }
                100% {
                    opacity: 0;
                    margin-top:
                }
            } 

               @keyframes zfadeUp {
                0% {
                    transform: translateY(0);
                }
                100% {
                    transform: translateY(calc(-1 * var(--notify-height) - 10px));
                }
            } 
            .zpopover:popover-open {
                width: 100px;
                height: 260px;
                position: fixed;
                inset: unset;
                margin: 0;
                right:0;
                top: 90px;
                z-index: 1000;
                border: none;
                background: none;
            }
            .zpopover.beforerender {
                animation-duration: 1s;
                animation-name: zfadeUp;
            } 
            .zpopover.beforerender .zpopover__notify:nth-child(1) {
                animation-duration: 1s;
                animation-name: zfadeOutUp;
            }   
            .zpopover__notify {
              border: 1px solid #eee;
              margin-bottom: 10px;
              animation: none;
              height: var( --notify-height)
            }
        `)

    let isshow = false;
    let notifications = new ZQueue();

    function renderNotify(out = false, time = 0) {
        let html = '';

        notifications.each(text => {
            html = html + `<div class="zpopover__notify">${text}</div>`
        })

        popover.innerHTML = html

    }

    window.pushNotify = function(text = '', {time = 6000} = {}) {
        notifications.in(text)
        renderNotify()

        if (!isshow) {
            if (notifications.size > 0) {
                popover.showPopover();
            }
        }
        setTimeout(() => {
            if (popover.children && popover.children[0]) {
                popover.classList.add('beforerender')
            }
   

            setTimeout(() => {
                if (popover.children && popover.children[0]) {
                    popover.classList.remove('beforerender')
                }
                notifications.out();
                renderNotify(true)
                if (isshow) {
                    if (notifications.size < 1) {
                        popover.hidePopover();
                    }
                }
            },  1000)
        
        }, time)
    }

    popover.addEventListener("beforetoggle", (event) => {
        if (event.newState === "open") {
            console.log("Popover is being shown");
            isshow = true;
        } else {
            console.log("Popover is being hidden");
            isshow = false;
        }
    });
}


export function preImgList2 () {
    let arr = []
    let folder = getFolder();
    let len = document.querySelector('[role="presentation"]').children.length - 2
    window.pushNotify('printstart')
    setTimeout(() => {
        for (let i = 0; i < len; i++) {
            let index = i + 1;
            let r = window.getImgFromList(index);

            setTimeout(async () => {
                arr.push(r.ext);
                if (i > len-2 ) {
                    window.sendFile(folder, createJSONfile(arr, 'config.json'));
                }
            }, i * 300)

            setTimeout(() => {
                r.dom.scrollIntoView();
                window.printScreen(folder, `${index}`)
                if (i > len - 2) {
                    setTimeout(() => {
                        collectDone2(folder)
                    }, 3000)
                }
            }, i * 9000);
        }
    }, 3000)
}


export function init() {
    let folder = getFolder();
    window.expire = new ZExpireStore('pixiv__' + folder);
    expire.clearExpired()


    window.appendStyle(/*css*/`
        .printbtn {
          position: fixed;
          right: 60px;
          top: 60px;
          z-index: 1000;
          background: #fff;
        }
        `)

    let b = document.createElement('button');
    b.innerHTML = 'print'
    b.classList.add('printbtn')

    b.addEventListener('click', function() {
        // preFanbox()
        if (expire.isExpired()) {
            expire.setExpire(0.5)
            preImgList2()
        }
    });

    document.body.appendChild(b);
    
    initNotification()
}

function collectDone2(folder) {
    window.sendAllNotify(`${folder}收集完成`);
    fetch(`http://localhost:3000/screen_shot_clipper?folder=${folder}&save=1`)
}

function getFolder() {
    return 'a_' + location.href.split('/').at(-1).replace(location.hash, '').replace(location.search, '')
}


export function preFanbox() {
    let imgs = [...document.querySelectorAll('[class^=PostImage__Wrapper]')];

    console.log(imgs)
}