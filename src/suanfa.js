function shortest(map, {from} = {}) {
    let vects = {
    }
    Object.keys(map).forEach(k => {
            vects[k] = {
                dist: Number.MAX_SAFE_INTEGER,
                final: false,
                parent: ''
            }
    });

    function calcs(k) {
        let v = vects[k]
        let d  = map[k]
        for (let nextnode in d) {

            let newdistance = v.dist + d[nextnode]
            let old = vects[nextnode].dist 
            console.log(nextnode, newdistance, old)
            if (newdistance < old) {
                vects[nextnode].dist = newdistance
                vects[nextnode].parent = k
            }
        }
        v.final = true
    }


    let curShortkey = '';
    function sort() {
        let curShortest = 0;
        for (let [k,v] of Object.entries(vects)) {
            if (!v.final) {

                if (curShortest == 0) {
                    curShortest = v.dist
                    curShortkey = k
                }
                else {
                    if (v.dist < curShortest) {
                        curShortest = v.dist
                        curShortkey = k
                    }
                }
            }
        }
         console.log(curShortest, curShortkey)
    }

    function needNext() {
        for (let [k,v] of Object.entries(vects)) {
            if (!v.final) {
                return true
            }
        }

        return false
    }

    
    function selectFirst(k) {
        vects[k].dist = 0
        calcs(k)
        console.log(JSON.parse(JSON.stringify(vects)))
    }


    if (from) {
        selectFirst('a')

        while(needNext()) {
            sort()
            calcs(curShortkey)
        
            console.log(JSON.parse(JSON.stringify(vects)))
        }
    }

}
window.testshortest = function() {
    
    let map = {
        a: {
            c: 35,
            b: 5,
            d: 40
        },
        b: {
            e: 25,
            d: 20
        },
        c: {
            e: 30,
            f: 25
        },
        d: {
            f: 20
        },
        e: {
            f: 25,
            d: 45,
        },
        f: {}
    }

    shortest(map, {from: 'a'})
}

window.testfloyd = function() {
    let max = Infinity

    let points = ['a', 'b', 'c', 'd'];
    let juzhen = [
        [0, 3, max, 1],
        [2, 0, max, 5],
        [max, 1, 0, max],
        [max, max, 2, 0] 
    ]


    function searchMid(midIndex) {
        let startIndex = 0
        let endIndex = 0
        for (let s = startIndex; s < points.length; s++) {
            for (let i = endIndex; i < points.length; i++) {
                let startToMidDis = juzhen[s][midIndex]
                let midToEndDis = juzhen[midIndex][i]
                let dis = juzhen[s][i]
                // console.log(s,  i, `${points[s]} ${points[i]}`, dis)
                if (startToMidDis + midToEndDis < dis) {
                    juzhen[s][i] = startToMidDis + midToEndDis
                }
            }
        }
    }

    for (let m = 0; m < points.length; m++) {
        console.dir(structuredClone(juzhen))
        searchMid(m)
    }
    console.dir(structuredClone(juzhen))

}


window.testsort = function() {
    let arr = [3,1,4,1,5,9,2,6];

    function bubbleSort(arr = []) {
        let n = arr.length
        let curSortIndex = 0;

        while (curSortIndex < n) {
            let minIndex = curSortIndex
            for (let i = minIndex + 1;  i<n; i++) {
                if (arr[i] < arr[minIndex]) {
                    minIndex = i
                }
            }

            let cache = arr[minIndex]
            for (let i = minIndex; i > curSortIndex; i--) {
                arr[i] = arr[i-1]
            }
            arr[curSortIndex] = cache

            curSortIndex++
        }

        return arr
    }

    console.log(bubbleSort(arr));
    
    function quickSort(arr) {
        function partion(nums, lo, hi) {
            let mid = nums[lo]
            let i = lo + 1;
            let j = hi;
            while( i <= j) {
                while ( i < hi && nums[i] <= mid) i++;
                while ( j > lo && nums[i] > mid) j--;
                if (i >= j) {
                    break;
                }
                [nums[i], nums[j]] = [nums[j], nums[i]]                
            }
            [nums[lo], nums[j]] = [nums[j], nums[lo]]
            return j
        }

        function sort(arr, lo, hi) {
            if (lo >= hi) {
                return
            }
            let p = partion(arr, lo, hi);

            sort(arr, lo, p - 1);

            sort(arr, p + 1, hi);
        }

        sort(arr, 0, arr.length - 1)

        return arr
    }


    console.log(quickSort(arr));

}

testsort()