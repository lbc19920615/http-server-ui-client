/**
 *
 * @param oldArr
 * @param newArr
 * @param key
 * @returns {{added: *[], deleted: *[], updated: *[]}}
 */
export function arrayDiffById(oldArr= [], newArr = [], key = "id") {
    // 将id强制转换为字符串后构建映射表
    const oldMap = oldArr.reduce((acc, item) => {
        acc[String(item[key])] = item;  // 显式类型转换
        return acc;
    }, {});
    const newMap = newArr.reduce((acc, item) => {
        acc[String(item[key])] = item;  // 显式类型转换
        return acc;
    }, {});

    const deleted = [];
    const added = [];
    const updated = [];

    // 遍历旧映射表检测删除项
    for (const id of Object.keys(oldMap)) {
        if (!(id in newMap)) deleted.push(oldMap[id]);
    }

    // 遍历新映射表检测新增和更新
    for (const id of Object.keys(newMap)) {
        if (!(id in oldMap)) {
            added.push(newMap[id]);
        } else if (!shallowEqual(oldMap[id], newMap[id])) {
            updated.push(newMap[id]);
        }
    }

    return { added, deleted, updated };
}

// 浅层比较函数（保持不变）
function shallowEqual(obj1, obj2) {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    if (keys1.length !== keys2.length) return false;
    return keys1.every(key => obj1[key] === obj2[key]);
}

function test() {
    // 测试混合类型id场景
    const oldArr = [
        { id: "1", name: '文本ID' },
        { id: "2", name: '数字ID' }
    ];
    const newArr = [
        { id: "1", name: '文本ID转数字' },  // 原id为"1"，现改为数字1
        { id: "3", name: '新ID' }
    ];

    const diff = arrayDiffById(oldArr, newArr);
    console.log(diff);
}