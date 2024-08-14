const {exec} = require('child_process');

try {
    const child1 = exec('http-server -p 7100  --cors', {cwd: 'E:/'},  function (err, stdout, stderr) {
        console.log(err, stdout, stderr)
    });
    const child2 = exec('npm run dev', function (err, stdout, stderr) {
        console.log(err, stdout, stderr)
    })
} catch(e) {
    console.log(e)
}


