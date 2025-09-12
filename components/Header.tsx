import React from 'react';
import { FilmIcon } from './icons.tsx';

export interface HeaderProps {
  apiKey: string;
  onApiKeyChange: (key: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ apiKey, onApiKeyChange }) => {
  return (
    <header className="bg-gray-800/50 backdrop-blur-sm shadow-lg border-b border-gray-700 sticky top-0 z-10">
      <div className="container mx-auto px-4 md:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FilmIcon />
            <div className="ml-4">
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
                Movies & TV Shows Recaps Maker Hub
              </h1>
              <p className="text-sm md:text-base text-cyan-400">Your AI Video Recap Assistant</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-400">Gemini API Key</label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => onApiKeyChange(e.target.value)}
                placeholder="Enter your API key"
                className="px-3 py-1 text-sm bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-500 focus:ring-cyan-500 focus:border-cyan-500"
                style={{ width: '200px' }}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
