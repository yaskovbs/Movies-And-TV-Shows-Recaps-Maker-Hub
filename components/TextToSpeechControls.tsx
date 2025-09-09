import React from 'react';
import { PlayIcon, PauseIcon, StopIcon } from './icons.tsx';

interface TextToSpeechControlsProps {
    onPlay: () => void;
    onPause: () => void;
    onResume: () => void;
    onStop: () => void;
    isPlaying: boolean;
    isPaused: boolean;
    voices: any[]; // SpeechSynthesisVoice[];
    selectedVoiceURI: string | null;
    setSelectedVoiceURI: (uri: string) => void;
}

export const TextToSpeechControls: React.FC<TextToSpeechControlsProps> = ({
    onPlay, onPause, onResume, onStop, isPlaying, isPaused, voices, selectedVoiceURI, setSelectedVoiceURI
}) => {
    return (
        <div className="mt-4 p-3 bg-gray-700/50 rounded-lg flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center justify-center gap-4 flex-grow">
            {!isPlaying ? (
                <button onClick={onPlay} className="flex items-center gap-2 px-4 py-2 rounded-md bg-green-600 hover:bg-green-700 transition text-white">
                    <PlayIcon /> Play Voice-Over
                </button>
            ) : isPaused ? (
                <button onClick={onResume} className="flex items-center gap-2 px-4 py-2 rounded-md bg-yellow-500 hover:bg-yellow-600 transition text-white">
                    <PlayIcon /> Resume
                </button>
            ) : (
                <button onClick={onPause} className="flex items-center gap-2 px-4 py-2 rounded-md bg-yellow-500 hover:bg-yellow-600 transition text-white">
                    <PauseIcon /> Pause
                </button>
            )}
            <button onClick={onStop} disabled={!isPlaying} className="flex items-center gap-2 px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 transition text-white disabled:bg-gray-500">
                <StopIcon /> Stop
            </button>
          </div>
          
          {voices.length > 0 && (
            <div className="flex items-center gap-2">
                <label htmlFor="voice-select" className="text-sm text-gray-300">Voice:</label>
                <select
                    id="voice-select"
                    value={selectedVoiceURI || ''}
                    // FIX: Cast e.target to 'any' to access the 'value' property.
                    onChange={(e) => setSelectedVoiceURI((e.target as any).value)}
                    className="bg-gray-600 border border-gray-500 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 p-2"
                >
                    {voices.map((voice) => (
                        <option key={voice.voiceURI} value={voice.voiceURI}>
                            {`${voice.name} (${voice.lang})`}
                        </option>
                    ))}
                </select>
            </div>
          )}
      </div>
    );
};