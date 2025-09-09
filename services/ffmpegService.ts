import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

let ffmpeg: FFmpeg | null = null;

const FFMPEG_BASE_URL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm';

/**
 * Loads the FFmpeg instance. This is a singleton and will only be loaded once.
 * @param progressCallback A function to call with progress messages.
 * @returns A promise that resolves to the loaded FFmpeg instance.
 */
export const loadFFmpeg = async (progressCallback: (message: string) => void): Promise<FFmpeg> => {
  if (ffmpeg) {
    return ffmpeg;
  }
  
  ffmpeg = new FFmpeg();
  
  ffmpeg.on('log', ({ message }) => {
    // You can uncomment the line below to see detailed FFmpeg logs in the console
    // console.log(message);
  });

  ffmpeg.on('progress', ({ progress, time }) => {
    const percentage = Math.round(progress * 100);
    if (percentage > 0 && percentage <= 100) {
        progressCallback(`Processing video... ${percentage}% complete`);
    }
  });

  progressCallback('Initializing video engine...');
  await ffmpeg.load({
    coreURL: await toBlobURL(`${FFMPEG_BASE_URL}/ffmpeg-core.js`, 'text/javascript'),
    wasmURL: await toBlobURL(`${FFMPEG_BASE_URL}/ffmpeg-core.wasm`, 'application/wasm'),
  });
  
  return ffmpeg;
};

/**
 * Processes a video file to create a recap with embedded subtitles.
 * It takes a 2-second clip every 8 seconds and burns the provided script as subtitles.
 * @param ffmpegInstance The loaded FFmpeg instance.
 * @param videoFile The video file to process.
 * @param script The script to be embedded as subtitles.
 * @param progressCallback A function to call with progress messages.
 * @returns A promise that resolves to a Blob of the processed video.
 */
export const processVideo = async (
    ffmpegInstance: FFmpeg, 
    videoFile: File,
    script: string,
    progressCallback: (message: string) => void
): Promise<Blob> => {
    progressCallback('Preparing video for processing...');
    
    await ffmpegInstance.writeFile('input.mp4', await fetchFile(videoFile));

    // Create an SRT subtitle file in FFmpeg's virtual file system
    progressCallback('Generating subtitles...');
    const srtContent = `1\n00:00:00,000 --> 99:59:59,999\n${script}`;
    await ffmpegInstance.writeFile('subtitles.srt', srtContent);


    progressCallback('Slicing, stitching, and embedding subtitles...');
    
    // This command now also adds the subtitles filter to burn them into the video.
    // Filters are chained with a comma.
    await ffmpegInstance.exec([
        '-i', 'input.mp4',
        '-vf', "select='lt(mod(t,8),2)',setpts=N/FRAME_RATE/TB,subtitles=subtitles.srt",
        '-an', // Removes audio track
        '-y', // Overwrite output file if it exists
        'output.mp4'
    ]);
    
    progressCallback('Finalizing video...');
    const data = await ffmpegInstance.readFile('output.mp4');

    // Cleanup virtual file system
    await ffmpegInstance.deleteFile('input.mp4');
    await ffmpegInstance.deleteFile('output.mp4');
    await ffmpegInstance.deleteFile('subtitles.srt');

    progressCallback('Video processing complete.');
    return new Blob([data as BlobPart], { type: 'video/mp4' });
};
