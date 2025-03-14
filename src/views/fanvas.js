import ZTodo from "../compnents/ZTodo.vue";

let juzcom = {
    template:`<div id="juzcon" class="juz-con">
            <div  class="juz"  v-for="(row, rowindex) in rowlen">
                <div class="juz__item" v-for="(col, colindex) in collen">
                {{getNum(rowindex, colindex)}}
                </div>
            </div>
        </div>`,
    mounted() {

        let w = document.querySelector('#juzcon').clientWidth;
// console.log(w)

        window.appendStyle(`
.juz {
    display: flex;
    align-items: center;
}
        .juz-con {
            width: max-content;
            height: max-content;
            background-repeat: no-repeat;
        background-image: url('data:image/svg+xml,\
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100% 100%">\
        <rect x="0" y="0" width="100%"  transform="translate(375,375) rotate(-45)" height="2px" fill="pink"/>\
        </svg>');
        }
        
        .juz__item {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 30px;
            height: 30px;
        }
        

                .juz-con {
      
    background-image: url('data:image/svg+xml,\
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100% 100%">\
      <rect x="0" y="0" width="100%"  transform="translate(${w / 2},${w / 2}) rotate(-45)" height="2px" fill="pink"/>\
    </svg>');
    
}
        `)
    },
    data() {
        let rowlen = 27;
        let collen = 27;
        let centeridx = (rowlen - 1) / 2
        return {
            centeridx,
            rowlen,
            collen
        }
    },
    methods: {
        getNum(rowindex, colindex) {
            let base = this.centeridx
            if (rowindex === base &&colindex === base) {
                return 1
            }
            else if (rowindex === base) {
                if (colindex > base) {
                    let v =  (colindex - base) * 2;
                    return v * v + 1 + (colindex - base)
                }
                else if (colindex < base) {
                    let v = (colindex - base) * 2;
                    return (v * v + 1 - (2 * (base - colindex))) - (base - colindex )
                }
            }
            else if (colindex === base) {
                if (rowindex < base) {
                    let v =  (rowindex - base) * 2;
                    return v * v + 1 + (rowindex - base)
                }
                else if (rowindex > base) {
                    let v = (rowindex - base) * 2;
                    return (v * v + v + 1) + ( rowindex - base   )
                }
            }
            else if (rowindex < base && colindex > base) {
                let rowg = base - rowindex;
                let colg = colindex - base;
                if (rowg > colg) {
                    let v = (rowindex - base) * 2;
                    return (v * v + 1) - ( rowg - colg)
                }
                else {
                    let v = (colindex - base) * 2;
                    return (v * v + 1) + ( colg - rowg )
                }
            }
            else if (rowindex > base && colindex > base) {
                let rowg = rowindex - base ;
                let colg = colindex - base;
                if (rowg > colg) {
                    let v = (rowindex - base) * 2;
                    return (v * v + v + 1) - ( colg - rowg   )
                }
                else {
                    let v = (colindex - base) * 2;
                    return (v * v + v + 1) + ( rowg - colg  )
                }
            }
            else if (rowindex > base && colindex < base) {
                let rowg =  rowindex - base;
                let colg = base-  colindex;
                if (rowg == colg) {
                    let v = (rowindex - base) * 2 + 1;
                    return v * v
                }
                else if (rowg < colg) {
                    let v = (colindex - base) * 2 + 1;
                    return v * v + (colg - rowg )
                }

                else if (rowg > colg) {
                    let v = (rowindex - base) * 2 + 1;
                    return v * v + (colg - rowg )
                }
            }
            else if (rowindex < base && colindex < base) {
                let rowg =  rowindex;
                let colg = colindex;
                if (rowg == colg) {
                    let v = (rowindex - base) * 2;
                    return (v * v + 1 - (2 * (base - colindex)))
                }
                else if (rowg < colg) {
                    let v = (rowindex - base) * 2;
                    return (v * v + 1- (2 * (base - colindex)) ) + (rowg - colg)
                }
                else {
                    let v = (colindex - base) * 2;
                    return (v * v + 1- (2 * (base - colindex)) ) - (rowg - colg)
                }
            }
        }
    }
}

export default {
    components: {
        ZTodo
    },
    template: /*html*/`
    <div class="grid-sm" >
        <div>
            result
        </div>
        <div>
             <z-todo></z-todo>
        </div>
    </div>
    `,

    mounted() {
        // juzcom.mounted()
    },
    data() {
        return {
            // ...juzcom.data()
        }
    },
    methods: {
        // ...juzcom.methods
    }
}