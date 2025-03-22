export let ver = '0.0.1'

let xueqiuOption = {
    cci: -170
};

let pinghaofanOption = {
    "SH600115": {
        ccishow: [-150, 100]
    }
}

window.getGPSymbolConfig = function () {
    let symbol = SNB.data.quote.symbol;
    if (pinghaofanOption[symbol]) {
        return pinghaofanOption[symbol];
    }
    else {
        return {}
    }
}

window.getBollData = function() {
    return GpUtils.calcBollData().map(v => {
        return parseFloat(v.toFixed(2))
    })
}

function parsePrice(name) {
    let v = parseInt(globalSearchParams.get(name)) ?? 0;
    v = v / 100;
    return v
}

function checkIsXiuxi() {
    let d = dayjs();
    console.log(`${d.hour()} : ${d.minute()}`)
    if (d.hour() == 11 && d.minute() > 30) {
        return true
    }
    if (d.hour() == 12) {
        return true
    }
    if (d.hour() > 15) {
        return true
    }
    return false;
}
window.checkIsXiuxi = checkIsXiuxi;

function getCurPrice() {
    return parseFloat(SNB.data.quote.current)
}

function getCurName() {
    return SNB?.data?.quote?.name 
}

function getCCIarr(data) {
    try {
        let d = data ?? kdjData()
        if (d && d.cci) {
            console.log('getCCIarr')
            return d.cci.slice(d.cci.length  - 5).map(v => {
                return parseFloat(v.toFixed(2))
            });        
        }
        return []
    } catch(e) {
        console.log(e)
        return []
    }
}

function handleParam() {
    if (globalSearchParams.has('hat')) {
        let bollData = [];
        let arr = [];

        let gpOption = getGPSymbolConfig()

        setTimeout(() => {

            let f = globalSearchParams.get('hat');


 
    
            let tab = globalSearchParams.get('auto_tab') ?? '';

            window.checkPriceRight = function(){
                let curPrice = getCurPrice();
                let price = globalSearchParams.get('price') ?? 0;
                console.dir(price)
                price = price / 100;
                return curPrice < price + 0.001
            }

            let cciexpirestore = new ZExpireStore( `checked__${SNB.data.quote.symbol}__${tab}__cci`)     
            cciexpirestore.expiredStorage.clearExpired()

            let bollexpirestore = new ZExpireStore(  `checked__${SNB.data.quote.symbol}__${tab}`)     
            bollexpirestore.expiredStorage.clearExpired()

            let d = kdjData();
            window.checkCurIsKdjNeedBuy = function(arr = [30,30,30]) {
                let last = d.last;
                if (last.d < arr[0] & last.k < arr[1] & last.j < arr[2]) {
                    if (last.k < last.d & last.j < last.k) {
                        return true
                    }
                }
                return false
            }

            bollData = getBollData();
            arr = getCCIarr();
            globalThis.workerTimers.setInterval(() => {
                arr = getCCIarr();
                bollData = getBollData();
                if (checkIsXiuxi()) {
                    // window.sendNotify(`${getCurName()}  ${tab} 测试`)
                }
                
                else {
                    if (f == 3) {
                        window.sendNotify(`${getCurName()}  cci  ${tab} ${arr}`)
                    }


                    if (SNB?.data?.quote?.percent < -2.9) {
                        window.sendAllNotify(`${getCurName()}  大跌  ${tab} ${arr}`)
                    }

    
                    // let storagename = `checked__${SNB.data.quote.symbol}__${tab}`
                    let curPrice = getCurPrice();
                    if (globalSearchParams.has('price')) {
                        let price = parsePrice('price');
          
                        // window.sendNotify(`注意 ${getCurName()} ${price}`);
                        if (curPrice < price + 0.001) {
                            window.sendNotify(`注意 ${getCurName()} ${tab} 到达${price}下 ${curPrice} ${arr} `)
                        }
                    }

                    if (globalSearchParams.has('low')) {
                        let price = parsePrice('low');
          
                        // window.sendNotify(`注意 ${getCurName()} ${price}`);
                        if (curPrice > price - 0.001) {
                            window.sendNotify(`注意 ${getCurName()} ${tab} 到达${price}上 ${curPrice} ${arr} `)
                        }
                    }


                    let BollArr = []
                    try {
                        // let isExpired = expiredStorage.isExpired(storagename) || expiredStorage.getItem(storagename) != '1';
                        if (bollexpirestore.isExpired()) {
                            bollexpirestore.expiredStorage.clearExpired();
                            BollArr = GpUtils.calcBollData()?.map(v => parseFloat(v.toFixed(3))) ?? [];
                            if (BollArr && BollArr.length > 0) {
                                // expiredStorage.setItem(storagename, 1, 60 * 5)
                                bollexpirestore.setExpire(5)

                                if (curPrice <= BollArr[2]) {
                                    window.sendNotify(`注意 ${getCurName()} ${tab} 突破boll下区间 `);
                                    return;
                                }
                                // if (curPrice < BollArr[1]) {
                                //     window.sendNotify(`注意 ${getCurName()} ${tab} 到达boll下区间 `)
                                // }
                                if (curPrice > BollArr[1]) {
                                    // window.sendNotify(`注意 ${getCurName()} ${tab} 到达boll上区间 `)
                                    if (curPrice > BollArr[0]) {
                                        window.sendNotify(`注意 ${getCurName()} ${tab} 突破boll上区间 `)
                                    }
                                }
                                
                            }   
                        }
            
                    } catch(e) {}

                    if (cciexpirestore.isExpired()) {
                        if (arr && arr.length > 0) {
                            if (arr.at(-1) < xueqiuOption.cci) {
                                cciexpirestore.setExpire(5)
                                window.sendAllNotify(`${getCurName()} ${curPrice} 可能买 ${arr.at(-1)}`)
                            }
                        }
                    }
        
                }
            }, 1000 * 60);
        }, 10000);

        setTimeout(() => {
            let ccishow = gpOption?.ccishow ?? []
            globalThis.workerTimers.setInterval(() => {
                // console.log('interval')
                let ext = '';


                if (arr?.at(-1) < (ccishow[0] ?? -120) || arr?.at(-1) > (ccishow[1] ?? 120)) {
                    ext = ` ${arr?.at(-1)} ${bollData.join(' ')}`;
                }
                document.title = `${getCurName()} ${ext}`
            }, 210)
        }, 300)
    }
}

export function jumpTab() {
    setTimeout(() => {
        if (checkIsXiuxi()) {

        }
        else {
            try {
                let d = kdjData();
                console.log('jumpTab')
                let arr = d.cci.slice(d.cci.length  - 5).map(v => {
                    return parseFloat(v.toFixed(2))
                });
                let tab = globalSearchParams.get('auto_tab');
    
     
    
                // window.sendNotify(`cci: ${SNB.data.quote.name} ${tab} ${arr}`)
                let last = arr.at(-1);
                if (last < -100) {
                    window.sendNotify(`${getCurName()} cci  ${tab} ${arr}`)
                }
    
                if (last > 150) {
                    window.sendNotify(`${getCurName()} cci  ${tab} 注意`)
                }
        
            } catch(e) {
        
            }
        }
    }, 300)
}

export function init() {
    console.log('browserinit')

    window.appendStyle(`
        .stock-price  {
         opacity: 0 !important;
        }
        `)

 handleParam()
}

