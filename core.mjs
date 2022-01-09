import ffmpeg from 'ffmpeg'
import fs from 'fs-extra'



export function screenShot(folder) {
    let filePaths = fs.readdirSync(folder)
    let videoFiles = filePaths.filter(v => v.endsWith('.mp4')).filter(v => !v.startsWith('.'))

    videoFiles.forEach(videoPath => {
        let videoPathArr = videoPath.split('.')
        try {
            let videoName = videoPathArr.slice(0, videoPathArr.length - 1)

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
}