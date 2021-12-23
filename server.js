const {exec} = require('child_process');
exec('npm run dev', function (err, stdout, stderr) {
    console.log(err, stdout, stderr)
})
