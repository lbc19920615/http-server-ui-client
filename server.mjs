// const {exec} = require('child_process');

import { exec } from 'child_process';

try {
    const child1 = exec('http-server -p 7100   --cors', {cwd: 'E:/'},  function (err, stdout, stderr) {
        console.log(err, stdout, stderr)
    });
    child1.stdout.on("data", function(e) {
        console.log(e)
    })
    const child2 = exec('npm run dev', function (err, stdout, stderr) {
        console.log(err, stdout, stderr)
    })
    child2.stdout.on("data", function(e) {
        console.log(e)
    })

    process.stdin.resume(); // so the program will not close instantly

function exitHandler(options, exitCode) {
    child1.kill()
    child2.kill()
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
} catch(e) {
    console.log(e)
}


