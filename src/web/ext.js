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

/**
 *
 * @param arr {*[]}
 * @param whenFun {function}
 * @param handle {function}
 */
export function setArrWhen(arr, whenFun, handle) {
    if (Array.isArray(arr)) {
        let index =arr.findIndex(whenFun);
        if (index > -1) {
            handle(arr[index]);
        }
    }
}

export class JSONKeyValueDB {
    constructor(initialData = "{}") {
        try {
            this._data = JSON.parse(initialData);
        } catch (error) {
            throw new Error("Invalid JSON string provided");
        }
    }

    // 插入或更新键值对
    set(key, value) {
        this._data[key] = value;
    }

    // 获取键对应的值（不存在则返回 undefined）
    get(key) {
        return this._data[key];
    }

    // 检查键是否存在
    has(key) {
        return Object.prototype.hasOwnProperty.call(this._data, key);
    }

    // 导出为 JSON 字符串
    serialize() {
        return JSON.stringify(this._data);
    }

    // 从 JSON 字符串加载数据（覆盖现有数据）
    deserialize(jsonString) {
        try {
            this._data = JSON.parse(jsonString);
        } catch (error) {
            throw new Error("Invalid JSON string provided");
        }
    }
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

    // 使用示例 ----------------------
    const db = new JSONKeyValueDB();

// 插入数据
    db.set("name", "Alice");
    db.set("age", 30);

// 检查存在性
    console.log(db.has("name")); // true
    console.log(db.has("gender")); // false

// 获取值
    console.log(db.get("age")); // 30

// 导出为 JSON
    const exportedJSON = db.serialize();
    console.log(exportedJSON); // {"name":"Alice","age":30}

// 从 JSON 加载数据
    db.deserialize('{"city":"Beijing","country":"China"}');
    console.log(db.get("city")); // Beijing
}