
import { createClient } from 'redis';
import {RedisJSONClient} from "./web/RedisJSONClient.js";
import Dayjs from "dayjs";

const DB_KEY = "screen_shots";

const db = new RedisJSONClient();
const client = await createClient()
    .on('error', err => console.log('Redis Client Error', err))
    .connect();
db.setClient(client);

let now = new Dayjs();
let isNeedResolve = now.isBefore(new Dayjs("2012-12-1"))
console.log(isNeedResolve)

process.stdin.resume(); // so the program will not close instantly

async function  task()  {
    try {
        await db.initDB(DB_KEY);

        console.log(`now is: ${Date.now()} ${db.get(0)}`);
    } catch(err) {
        console.log(err)
    }
}

// task()

let interval = setInterval(task,  30 * 1000);


async function exitHandler(options, exitCode) {
    await client.disconnect();
    clearInterval(interval)
    if (options.cleanup) console.log('clean');
    if (exitCode || exitCode === 0) console.log(exitCode);
    if (options.exit) process.exit();
}

// do something when app is closing
process.on('exit', exitHandler.bind(null,{cleanup:true}));

// catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler.bind(null, {exit:true}));
process.on('SIGUSR2', exitHandler.bind(null, {exit:true}));

// catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));