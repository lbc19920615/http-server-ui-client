import ffmpeg from 'ffmpeg'
import fs from 'fs-extra'
import Path from 'path'


export function screenShot(folder) {
    // console.log(folder)
    let filePaths = fs.readdirSync(folder)
    let videoFiles = filePaths.filter(v => v.endsWith('.mp4'))
        .filter(v => !v.startsWith('.'))
        .filter(v => {
            let shotFolderName = Path.basename(v, Path.extname(v))
            let shotFolderPath = Path.join(folder, 'screen_shots', shotFolderName)
            // let dirName = path.dirname(v)
            let hasShotFolder = fs.pathExistsSync(shotFolderPath)
            // console.log(v, shotFolderPath, hasShotFolder)
            // let hasShottedFolder = fs.pathExists(Path.join(v))
            return !hasShotFolder
        })

    console.log('current need resolve videoFiles', videoFiles)

    fs.ensureDirSync(Path.join(folder, 'screen_shots'))

    videoFiles.forEach(videoPath => {
        let videoPathArr = videoPath.split('.')
        try {
            let videoName = videoPathArr.slice(0, videoPathArr.length - 1).join('.')

            let importFilePath = Path.join(folder, videoPath)
            let exportFolderPath = Path.join(folder, 'screen_shots', videoName)


            let status = fs.statSync(importFilePath)
            // console.log(status)
            fs.outputFileSync(Path.join(exportFolderPath, 'status.js'),
                `module.exports =  ${JSON.stringify(status)}`)

            var process = new ffmpeg(importFilePath);
            process.then(function (video) {
                video.fnExtractFrameToJPG(exportFolderPath , {
                    frame_rate : 1,
                    number : 9,
                    file_name : 'frame%i'
                }, function (error, files) {
                    if (!error) {

                        console.log('Frames: ' + files);
                    }else {
                        console.log(error)
                    }
                });
            }, function (err) {
                console.log('Error: ' + err);
            });
        } catch (e) {
            console.log(e.code);
            console.log(e.msg);
        }
    })
}