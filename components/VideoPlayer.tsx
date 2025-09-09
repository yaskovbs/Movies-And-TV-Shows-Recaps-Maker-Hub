import React, { useRef, useEffect } from 'react';
import { DownloadIcon } from './icons.tsx';

interface VideoPlayerProps {
    processedVideoUrl: string;
    originalFileName?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ processedVideoUrl, originalFileName }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
          if (!videoRef.current) return;
          
          const activeElement = (window as any).document.activeElement;
          if (activeElement && ['INPUT', 'TEXTAREA', 'SELECT'].includes(activeElement.tagName)) {
            return; // Don't interfere with typing
          }
          
          // FIX: Cast event to 'any' to access the 'code' property.
          switch ((event as any).code) {
            case 'Space':
              event.preventDefault();
              // FIX: Cast videoRef.current to 'any' to access properties like 'paused' and methods like 'play' and 'pause'.
              (videoRef.current as any).paused ? (videoRef.current as any).play() : (videoRef.current as any).pause();
              break;
            case 'ArrowLeft':
              event.preventDefault();
              // FIX: Cast videoRef.current to 'any' to access the 'currentTime' property.
              (videoRef.current as any).currentTime -= 5;
              break;
            case 'ArrowRight':
              event.preventDefault();
              // FIX: Cast videoRef.current to 'any' to access the 'currentTime' property.
              (videoRef.current as any).currentTime += 5;
              break;
          }
        };
        
        // Use the container to listen for keydown events to allow focus
        const container = containerRef.current;
        // FIX: Cast container to 'any' to access 'addEventListener', which may be missing in some TypeScript configurations.
        (container as any)?.addEventListener('keydown', handleKeyDown);
    
        return () => {
          // FIX: Cast container to 'any' to access 'removeEventListener', which may be missing in some TypeScript configurations.
          (container as any)?.removeEventListener('keydown', handleKeyDown);
        };
      }, []);

    const getRecapVideoFileName = (original?: string): string => {
        if (!original) {
            return 'recap-video.mp4';
        }
        const lastDotIndex = original.lastIndexOf('.');
        if (lastDotIndex < 1) {
            return `${original}-recap.mp4`;
        }
        const nameWithoutExtension = original.substring(0, lastDotIndex);
        return `${nameWithoutExtension}-recap.mp4`;
    };
    
    const downloadVideoFileName = getRecapVideoFileName(originalFileName);

    return (
        <div ref={containerRef} tabIndex={-1} className="focus:outline-none">
             <h3 className="text-lg font-semibold text-gray-200 mb-2">Recap Video</h3>
             <div className="w-full aspect-video bg-black rounded-lg overflow-hidden ring-2 ring-cyan-500/50">
                <video ref={videoRef} src={processedVideoUrl} controls className="w-full h-full object-contain"></video>
            </div>
             <a 
                href={processedVideoUrl} 
                download={downloadVideoFileName}
                className="mt-2 inline-flex items-center gap-2 px-4 py-2 text-sm rounded-md bg-cyan-600 hover:bg-cyan-700 transition text-white">
                <DownloadIcon/> Download Video
             </a>
        </div>
    );
};