import {Decimal} from 'decimal.js';

let yeararr = `
1941,2001,…	6钱	1942,2002,…	8钱	1943,2003,…	7钱	1944,2004,…	5钱	1945,2005,…	1两5
1946,2006,…	6钱	1947,2007,…	1两6	1948,2008,…	1两5	1949,2009,…	7钱	1950,2010,…	9钱
1951,2011,…	1两2	1952,2012,…	1两	1953,2013,…	7钱	1954,2014,…	1两5	1955,2015,…	6钱
1956,2016,…	5钱	1957,2017,…	1两4	1958,2018,…	1两4	1959,2019,…	9钱	1960,2020,…	7钱
1961,2021,…	7钱	1962,2022,…	9钱	1963,2023,…	1两2	1964,2024,…	8钱	1965,2025,…	7钱
1966,2026,…	1两3	1967,2027,…	5钱	1968,2028,…	1两4	1969,2029,…	5钱	1970,2030,…	9钱
1971,2031,…	1两7	1972,2032,…	5钱	1973,2033,…	7钱	1974,2034,…	1两2	1975,2035,…	8钱
1976,2036,…	8钱	1977,2037,…	6钱	1978,2038,…	1两9	1979,2039,…	6钱	1980,2040,…	8钱
1981,2041,…	1两6	1982,2042,…	1两	1983,2043,…	7钱	1984,2044,…	1两2	1985,2045,…	9钱
1986,2046,…	6钱	1987,2047,…	7钱	1988,2048,…	1两2	1989,2049,…	5钱	1990,2050,…	9钱
1991,2051,…	8钱	1992,2052,…	7钱	1993,2053,…	8钱	1994,2054,…	1两5	1995,2055,…	9钱
1996,2056,…	1两6	1997,2057,…	8钱	1998,2058,…	8钱	1999,2059,…	1两9	2000,2060,…	1两2

`.replaceAll(',…\t', '__').replaceAll('\n', '\t').split('\t').filter(v => v).map(v=> v.split('__')).map(v => {
    let p = v[1]
    if (v[1].includes('钱')) {

        p = parseFloat(v[1].slice(0, 1)) * 0.1

    }
    if (v[1].includes('两')) {
        p = parseFloat(v[1].slice(0, 1)) * 1
        if (v[1].includes('钱')) {
        p = p + parseFloat(v[1].slice(2,3)) * 0.1
        }
    }
    return [
        v[0].slice(0,4),
        parseFloat( p.toFixed(1))
    ]
})

// `
// 正月	六钱	二月	七钱	三月	一两八钱	四月	九钱
// 五月	五钱	六月	一两六钱	七月	九钱	八月	一两五钱
// 九月	一两八钱	十月	八钱	十一月	九钱	十二月	五钱
// `

let montharr = [
    0.6,
    0.7,
    1.8,
    0.9,
    0.5,
    1.6,
    0.9,
    1.5,
    1.8,
    0.8,
    0.9,
    0.5
]


// `
// 初一	五钱	初二	一两	初三	八钱	初四	一两五钱	初五	一两六钱
// 初六	一两五钱	初七	八钱	初八	一两六钱	初九	八钱	初十	一两六钱
// 十一	九钱	十二	一两七钱	十三	八钱	十四	一两七钱	十五	一两
// 十六	八钱	十七	九钱	十八	一两八钱	十九	五钱	二十	一两
// 廿一	一两	廿二	九钱	廿三	八钱	廿四	九钱	廿五	一两五钱
// 廿六	一两八钱	廿七	七钱	廿八	八钱	廿九	一两六钱	三十	六钱
// `

let datearr = [
    0.5,
    1,
    0.8,
    1.5,
    1.6,
    1.5,
    0.8,
    1.6,
    0.8,
    1.6,

    0.9,
    1.7,
    0.8,
    1.7,
    1,
    0.8,
    0.9,
    1.8,
    0.5,
    1,

    1,
    0.9,
    0.8,
    0.9,
    1.5,
    1.8,
    0.7,
    0.8,
    1.6,
    0.6
]

// `
// 子时	一两六钱	丑时	六钱	寅时	七钱	卯时	一两	辰时	九钱	巳时	一两六钱
// 午时	一两	未时	八钱	申时	八钱	酉时	九钱	戌时	六钱	亥时	六钱
// `

// 时辰为 : 子时：23点到1点；丑时：1点到3点；寅时：3点到5点；卯时：5点到7点；辰时：7点到9点；巳时：9点到11点；午时：11点到13点；未时：13点到15点；申时：15点到17点；酉时：17点到19点；戌时：19点到21点；亥时：21点到23点。

let timearr = [
    1.6,
    // 1点到3点； 
    0.6,
    // 3点到5点；
    0.7,
    // 5点到7点；
    1,
    // 7点到9点；
    0.9,
    // 9点到11点；
    1.6,
    // 11点到13点；
    1,

// 13点到15点；
    0.8,
    0.8,
    0.9,

    0.6,
    0.6
]


let input = [
    1992,
   5,
    15
]

let yearmap = Object.fromEntries(yeararr)

function calcjg(arr) {
    let res = 0
    let [year, month, day] = arr
    while (year < 1941) {
        year = year + 60
    }
    // console.log(year, yearmap)
    let yearres = yearmap[year]
    let monthres = montharr[month - 1]
    let dayres = datearr[day - 1]
    res = yearres + monthres + dayres
    console.log(yearres, monthres, dayres);

    let maybes = []
    timearr.forEach(v => {
        let s = new Decimal(v)
        maybes.push(parseFloat(s.add(new Decimal(res)).valueOf()))
    })
    console.log(maybes)
    return res
}

let output = calcjg(input)

console.log(output)