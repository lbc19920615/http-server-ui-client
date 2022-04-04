import ffmpeg from 'ffmpeg'
import fs from 'fs-extra'
import path from 'path'


export function screenShot(folder) {
    let filePaths = fs.readdirSync(folder)
    let videoFiles = filePaths.filter(v => v.endsWith('.mp4'))
        .filter(v => !v.startsWith('.'))
        .filter(v => {
            let shotFolderName = path.basename(v, path.extname(v))
            let shotFolderPath = path.join(folder, 'screen_shots', shotFolderName)
            // let dirName = path.dirname(v)
            let hasShotFolder = fs.pathExistsSync(shotFolderPath)
            // console.log(v, shotFolderPath, hasShotFolder)
            // let hasShottedFolder = fs.pathExists(path.join(v))
            return !hasShotFolder
        })

    console.log('current need resolve videoFiles', videoFiles)

    fs.ensureDirSync(path.join(folder, 'screen_shots'))

    videoFiles.forEach(videoPath => {
        let videoPathArr = videoPath.split('.')
        try {
            let videoName = videoPathArr.slice(0, videoPathArr.length - 1).join('.')

            let importFilePath = path.join(folder, videoPath)
            let exportFolderPath = path.join(folder, 'screen_shots', videoName)


            let status = fs.statSync(importFilePath)
            // console.log(status)
            fs.outputFileSync(path.join(exportFolderPath, 'status.js'),
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