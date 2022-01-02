import ffmpeg from 'ffmpeg'
import fs from 'fs-extra'


let folder = '/Users/tongguwei/Downloads/色图/twitter'
let filePaths = fs.readdirSync(folder)
let videoFiles = filePaths.filter(v => v.endsWith('.mp4'))

console.log(videoFiles)

videoFiles.forEach(videoPath => {
    let videoPathArr = videoPath.split('.')
    try {
        let videoName = videoPathArr[0]
        var process = new ffmpeg(folder + `/${videoPath}`);
        process.then(function (video) {
            // Video metadata
            // console.log(video.metadata);
            // FFmpeg configuration
            // console.log(video.info_configuration);
            video.fnExtractFrameToJPG(folder + `/${videoName}` , {
                frame_rate : 1,
                number : 5,
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

