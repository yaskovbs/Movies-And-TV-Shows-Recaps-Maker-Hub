import React, { useRef, useState } from 'react';
import { UploadIcon } from './icons.tsx';
import { getYouTubeVideoInfo, extractYouTubeId } from '../services/youtubeService';

interface FileUploadProps {
  onFileChange: (file: File | null) => void;
  onUrlSubmit: (url: string, videoInfo: any) => void;
  videoUrl: string | null;
  isYouTubeUrl?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileChange, onUrlSubmit, videoUrl, isYouTubeUrl = false }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<'file' | 'url'>('file');
  const [youtubeUrl, setYoutubeUrl] = useState<string>('');
  const [isLoadingUrl, setIsLoadingUrl] = useState<boolean>(false);

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    // FIX: Cast e.dataTransfer to 'any' to access the 'files' property, which may be missing in some TypeScript configurations.
    if ((e.dataTransfer as any).files && (e.dataTransfer as any).files[0]) {
      if ((e.dataTransfer as any).files[0].type.startsWith('video/')) {
        onFileChange((e.dataTransfer as any).files[0]);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    // FIX: Cast e.target to 'any' to access the 'files' property, which may be missing in some TypeScript configurations.
    if ((e.target as any).files && (e.target as any).files[0]) {
      const file = (e.target as any).files[0];

      // Check file size limit (2GB)
      const MAX_SIZE = 2 * 1024 * 1024 * 1024; // 2GB in bytes
      if (file.size > MAX_SIZE) {
        alert(`קובץ גדול מדי!\n\nגודל הקובץ: ${(file.size / (1024 * 1024 * 1024)).toFixed(2)}GB\nמגבלה מרבית: 2GB\n\nלעיבוד קבצי ענק יש צורך בחיבור לשרת API חיצוני.\n\nפתח את "הגדרות שרתי API" והגדר שרת מעבד וידאו משלך.\nאפשר להשתמש ב:\n• Linode\n• Railway.app\n• Vercel\n• Azure\n\nכל שרת דורש API key משלו.`);
        return;
      }

      if (file.type.startsWith('video/')) {
        onFileChange(file);
      }
    }
  };

  const handleClick = () => {
    // FIX: Cast fileInputRef.current to 'any' to call 'click()', which may be missing in some TypeScript configurations.
    (fileInputRef.current as any)?.click();
  };

  const handleYouTubeSubmit = async () => {
    if (!youtubeUrl.trim()) return;

    setIsLoadingUrl(true);
    try {
      const videoInfo = await getYouTubeVideoInfo(youtubeUrl);
      if (videoInfo) {
        onUrlSubmit(youtubeUrl, videoInfo);
      } else {
        throw new Error('Failed to get video information');
      }
    } catch (error) {
      console.error('YouTube processing error:', error);
      // For now, still allow processing even if metadata fetch fails
      onUrlSubmit(youtubeUrl, { title: 'YouTube Video', duration: 0, thumbnail: '' });
    } finally {
      setIsLoadingUrl(false);
    }
  };

  const handleUrlKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleYouTubeSubmit();
    }
  };

  return (
    <div className="w-full">
      {/* Mode Toggle */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setMode('file')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            mode === 'file'
              ? 'bg-cyan-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Upload File
        </button>
        <button
          onClick={() => setMode('url')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            mode === 'url'
              ? 'bg-cyan-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          YouTube URL
        </button>
      </div>

      {isYouTubeUrl ? (
        // YouTube preview
        <div className="w-full aspect-video bg-black rounded-lg overflow-hidden ring-2 ring-red-500/50">
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <div className="text-center">
              <UploadIcon />
              <p className="mt-2 text-sm">YouTube video selected</p>
              <p className="text-xs text-gray-500">Backend download required for processing</p>
            </div>
          </div>
        </div>
      ) : videoUrl ? (
        // Video preview for uploaded files
        <div className="w-full aspect-video bg-black rounded-lg overflow-hidden ring-2 ring-cyan-500/50">
          <video src={videoUrl} controls className="w-full h-full object-contain"></video>
        </div>
      ) : (
        <>
          {mode === 'file' ? (
            // File upload interface
            <label
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={handleClick}
              className="flex flex-col items-center justify-center w-full aspect-video border-2 border-dashed border-gray-600 rounded-lg cursor-pointer bg-gray-700/50 hover:bg-gray-700 transition-colors"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <UploadIcon />
                <p className="mb-2 text-sm text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                <p className="text-xs text-gray-500">MP4, MOV, AVI, or other video formats</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="video/*"
                onChange={handleFileSelect}
              />
            </label>
          ) : (
            // YouTube URL input interface
            <div className="flex flex-col items-center justify-center w-full aspect-video border-2 border-dashed border-gray-600 rounded-lg bg-gray-700/50 p-6 gap-4">
              <div className="flex flex-col items-center justify-center text-center">
                <svg className="w-12 h-12 text-red-500 mb-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                <p className="mb-2 text-sm text-gray-400"><span className="font-semibold">Enter YouTube URL</span></p>
                <input
                  type="url"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  onKeyPress={handleUrlKeyPress}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full max-w-sm px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  onClick={handleYouTubeSubmit}
                  disabled={!youtubeUrl.trim() || isLoadingUrl}
                  className="mt-3 px-6 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
                >
                  {isLoadingUrl ? 'Processing...' : 'Load YouTube Video'}
                </button>
                <p className="text-xs text-gray-500 mt-2">
                  NOTE: YouTube download requires backend service. Use file upload for immediate testing.
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
