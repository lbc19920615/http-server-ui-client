const {exec} = require('child_process');
exec('http-server . -p 3010 --cors', function (err, stdout, stderr) {
    console.log(err, stdout, stderr)
})