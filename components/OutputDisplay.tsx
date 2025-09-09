import React from 'react';
import { Spinner } from './Spinner.tsx';
import { Placeholder } from './Placeholder.tsx';
import { VideoPlayer } from './VideoPlayer.tsx';
import { ScriptDisplay } from './ScriptDisplay.tsx';
import { TextToSpeechControls } from './TextToSpeechControls.tsx';


interface OutputDisplayProps {
  script: string;
  onPlay: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  isPlaying: boolean;
  isPaused: boolean;
  isLoading: boolean;
  statusMessage: string;
  processedVideoUrl: string | null;
  originalFileName?: string;
  voices: any[]; // SpeechSynthesisVoice[];
  selectedVoiceURI: string | null;
  setSelectedVoiceURI: (uri: string) => void;
}

export const OutputDisplay: React.FC<OutputDisplayProps> = ({ 
    script, 
    onPlay, 
    onPause, 
    onResume, 
    onStop, 
    isPlaying, 
    isPaused, 
    isLoading, 
    statusMessage, 
    processedVideoUrl, 
    originalFileName, 
    voices, 
    selectedVoiceURI, 
    setSelectedVoiceURI 
}) => {
  
  if (isLoading) {
    return (
        <div className="flex-grow flex items-center justify-center">
            <Spinner message={statusMessage} />
        </div>
    )
  }

  if (!script && !processedVideoUrl) {
    return <Placeholder />;
  }
  
  return (
    <div className="h-full flex flex-col gap-4">
        {processedVideoUrl && (
            <VideoPlayer 
                processedVideoUrl={processedVideoUrl} 
                originalFileName={originalFileName}
            />
        )}

       {script && (
        <div className="flex-grow flex flex-col min-h-0">
            <ScriptDisplay script={script} />
            <TextToSpeechControls 
                 onPlay={onPlay}
                 onPause={onPause}
                 onResume={onResume}
                 onStop={onStop}
                 isPlaying={isPlaying}
                 isPaused={isPaused}
                 voices={voices}
                 selectedVoiceURI={selectedVoiceURI}
                 setSelectedVoiceURI={setSelectedVoiceURI}
            />
        </div>
      )}
    </div>
  );
};