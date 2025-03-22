import {JSONKeyValueDB} from "../../src/web/ext.js";

export class RedisJSONClient {
    constructor() {
        this._dbKey = "";
        this.db = new JSONKeyValueDB();
        this._client = null;
    }
    setClient(client) {
        this._client = client;
    }
    async initDB(dbKey = '') {
        this._dbKey = dbKey;
        const value = await this._client.get(dbKey);
        this.db.deserialize(value);
    }

    /**
     *
     * @param key {*}
     * @returns {Promise<*>}
     */
    get(key = '') {
        return this.db.get(key);
    }
    has(key = '') {
        return this.db.has(key);
    }
    set(key, value) {
        this.db.set(key, value);
    }
    async save() {
        if (this._dbKey) {
            let newJson = this.db.serialize();
            this._client.set(this._dbKey, newJson);
        }
    }
}
