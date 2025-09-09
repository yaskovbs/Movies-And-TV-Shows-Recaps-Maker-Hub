import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { FileUpload } from './components/FileUpload';
import { RecapControls } from './components/RecapControls';
import { OutputDisplay } from './components/OutputDisplay';
import { AdBanner } from './components/AdBanner';
import { generateRecapScript } from './services/geminiService';
import { useTextToSpeech } from './hooks/useTextToSpeech';
import { loadFFmpeg, processVideo } from './services/ffmpegService';
import { ServerSettings } from './components/ServerSettings';
import type { FFmpeg } from '@ffmpeg/ffmpeg';

interface Server {
  id: string;
  name: string;
  url: string;
  apiKey: string;
  maxFileSize: number;
  type: 'free' | 'paid' | 'private';
}


const App: React.FC = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [youtubeUrl, setYoutubeUrl] = useState<string>('');
  const [youtubeVideoInfo, setYoutubeVideoInfo] = useState<any>(null);
  const [isYouTubeMode, setIsYouTubeMode] = useState<boolean>(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [recapLength, setRecapLength] = useState<number>(() => {
    const savedLength = localStorage.getItem('recapLength');
    return savedLength ? parseInt(savedLength, 10) : 60;
  });
  const [videoDescription, setVideoDescription] = useState<string>('');
  const [generatedScript, setGeneratedScript] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [statusMessage, setStatusMessage] = useState<string>('Initializing video engine...');
  const [processedVideoUrl, setProcessedVideoUrl] = useState<string | null>(null);
  const [ffmpeg, setFfmpeg] = useState<FFmpeg | null>(null);
  const [geminiApiKey, setGeminiApiKey] = useState<string>(() => {
    return localStorage.getItem('geminiApiKey') || '';
  });
  const [servers, setServers] = useState<Server[]>(() => {
    const savedServers = localStorage.getItem('servers');
    return savedServers ? JSON.parse(savedServers) : [];
  });
  const [showServerSettings, setShowServerSettings] = useState<boolean>(false);

  const { isPlaying, isPaused, speak, pause, resume, cancel, voices, selectedVoiceURI, setSelectedVoiceURI } = useTextToSpeech();

  useEffect(() => {
    loadFFmpeg(setStatusMessage).then(ff => {
      setFfmpeg(ff);
      setStatusMessage('');
    }).catch(err => {
      console.error("Failed to load ffmpeg", err);
      setError("Could not load video processing engine. Please refresh the page.");
    });
  }, []);

  useEffect(() => {
    let objectUrl: string | null = null;
    if (videoFile) {
      objectUrl = URL.createObjectURL(videoFile);
      setVideoUrl(objectUrl);
    } else {
      setVideoUrl(null);
    }
    return () => {
      if(objectUrl) URL.revokeObjectURL(objectUrl);
    }
  }, [videoFile]);
  
  useEffect(() => {
    localStorage.setItem('recapLength', recapLength.toString());
  }, [recapLength]);

  useEffect(() => {
    if (geminiApiKey) {
      localStorage.setItem('geminiApiKey', geminiApiKey);
    }
  }, [geminiApiKey]);

  useEffect(() => {
    localStorage.setItem('servers', JSON.stringify(servers));
  }, [servers]);

  useEffect(() => {
      let objectUrl = processedVideoUrl;
      return () => {
          if (objectUrl) URL.revokeObjectURL(objectUrl);
      }
  }, [processedVideoUrl]);


  const handleFileChange = (file: File | null) => {
    setVideoFile(file);
    setYoutubeUrl('');
    setYoutubeVideoInfo(null);
    setIsYouTubeMode(false);
    setGeneratedScript('');
    setProcessedVideoUrl(null);
    setError('');
  };

  const handleUrlSubmit = (url: string, videoInfo: any) => {
    setYoutubeUrl(url);
    setYoutubeVideoInfo(videoInfo);
    setVideoFile(null);
    setIsYouTubeMode(true);
    setGeneratedScript('');
    setProcessedVideoUrl(null);
    setError('');
  };

  const handleCreateRecap = useCallback(async () => {
    if ((!videoFile && !isYouTubeMode) || !videoDescription) {
      setError('Please upload a video or enter YouTube URL and provide a description.');
      return;
    }
    if (isYouTubeMode) {
      setError('YouTube support requires a backend service for video download. Please use file upload for now.');
      return;
    }
    if (!geminiApiKey) {
      setError('Please enter your Gemini API key in the settings.');
      return;
    }
    if (!ffmpeg) {
      setError('Video processing engine is not ready. Please wait a moment.');
      return;
    }

    setIsLoading(true);
    setError('');
    setGeneratedScript('');
    setProcessedVideoUrl(null);
    cancel(); // Stop any ongoing speech

    try {
      // Step 1: Generate Script
      setStatusMessage('AI is crafting your script...');
      const script = await generateRecapScript(videoDescription, recapLength, geminiApiKey);
      setGeneratedScript(script);

      // Step 2: Process Video and embed subtitles
      if (videoFile) {
        const videoBlob = await processVideo(ffmpeg, videoFile, script, setStatusMessage);
        const url = URL.createObjectURL(videoBlob);
        setProcessedVideoUrl(url);
      }

    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Failed to create recap. ${errorMessage}`);
    } finally {
      setIsLoading(false);
      setStatusMessage('');
    }
  }, [videoFile, isYouTubeMode, videoDescription, recapLength, cancel, ffmpeg, geminiApiKey]);

  const handlePlay = () => {
    if (generatedScript) {
      speak(generatedScript);
    }
  };

  const handleServerAdd = useCallback((server: Server) => {
    setServers(prev => [...prev, server]);
  }, []);

  const handleServerRemove = useCallback((id: string) => {
    setServers(prev => prev.filter(server => server.id !== id));
  }, []);

  const isGenerateDisabled = (!videoFile && !isYouTubeMode) || !videoDescription.trim() || !geminiApiKey || isLoading || !ffmpeg;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans flex flex-col">
      <Header apiKey={geminiApiKey} onApiKeyChange={setGeminiApiKey} />

      {showServerSettings ? (
        // Server Settings View
        <main className="flex-grow container mx-auto p-4 md:p-8">
          <ServerSettings
            onServerAdd={handleServerAdd}
            onServerRemove={handleServerRemove}
            servers={servers}
          />
        </main>
      ) : (
        // Main Video Processing View
        <main className="flex-grow container mx-auto p-4 md:p-8 flex flex-col gap-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="flex flex-col gap-6 p-6 bg-gray-800 rounded-2xl shadow-lg">
              <h2 className="text-2xl font-bold text-cyan-400">1. Upload & Describe</h2>
              <FileUpload
                onFileChange={handleFileChange}
                onUrlSubmit={handleUrlSubmit}
                videoUrl={videoUrl}
                isYouTubeUrl={isYouTubeMode}
              />
              <RecapControls
                recapLength={recapLength}
                setRecapLength={setRecapLength}
                videoDescription={videoDescription}
                setVideoDescription={setVideoDescription}
                onCreateRecap={handleCreateRecap}
                isDisabled={isGenerateDisabled}
                isLoading={isLoading}
              />
            </div>
            <div className="flex flex-col gap-6 p-6 bg-gray-800 rounded-2xl shadow-lg min-h-[400px]">
              <h2 className="text-2xl font-bold text-cyan-400">2. Get Your Recap</h2>
              {error ? (
                <div className="flex-grow flex items-center justify-center text-red-400 bg-red-900/20 p-4 rounded-lg">
                  <p>{error}</p>
                </div>
              ) : (
                <OutputDisplay
                  script={generatedScript}
                  onPlay={handlePlay}
                  onPause={pause}
                  onResume={resume}
                  onStop={cancel}
                  isPlaying={isPlaying}
                  isPaused={isPaused}
                  isLoading={isLoading}
                  statusMessage={statusMessage}
                  processedVideoUrl={processedVideoUrl}
                  originalFileName={videoFile?.name}
                  voices={voices}
                  selectedVoiceURI={selectedVoiceURI}
                  setSelectedVoiceURI={setSelectedVoiceURI}
                />
              )}
            </div>
          </div>
        </main>
      )}

      <AdBanner />

      {/* Server Settings Toggle Button */}
      <div className="text-center mb-4">
        <button
          onClick={() => setShowServerSettings(!showServerSettings)}
          className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
        >
          {showServerSettings ? 'חזור לעיבוד וידאו' : 'הגדרות שרתי API'}
        </button>
      </div>

      <footer className="text-center p-4 text-gray-500 text-sm">
        <p>Powered by Gemini AI & FFmpeg.wasm</p>
      </footer>
    </div>
  );
};

export default App;
