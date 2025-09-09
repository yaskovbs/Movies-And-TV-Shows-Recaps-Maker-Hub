import React from 'react';
import { SparkleIcon } from './icons.tsx';

interface RecapControlsProps {
  recapLength: number;
  setRecapLength: (length: number) => void;
  videoDescription: string;
  setVideoDescription: (description: string) => void;
  onCreateRecap: () => void;
  isDisabled: boolean;
  isLoading: boolean;
}

export const RecapControls: React.FC<RecapControlsProps> = ({
  recapLength,
  setRecapLength,
  videoDescription,
  setVideoDescription,
  onCreateRecap,
  isDisabled,
  isLoading
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
          Video Description
        </label>
        <textarea
          id="description"
          rows={3}
          className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2.5 text-gray-100 focus:ring-cyan-500 focus:border-cyan-500 transition"
          placeholder="e.g., 'The Matrix, a movie about a hacker who discovers reality is a simulation.'"
          value={videoDescription}
          // FIX: Cast e.target to 'any' to access the 'value' property.
          onChange={(e) => setVideoDescription((e.target as any).value)}
        />
        <p className="text-xs text-gray-500 mt-1">A brief, clear description yields the best results.</p>
      </div>

      <div>
        <label htmlFor="recap-length" className="block text-sm font-medium text-gray-300 mb-1">
          Desired Recap Length: <span className="font-bold text-cyan-400">{recapLength} seconds</span>
        </label>
        <input
          id="recap-length"
          type="range"
          min="1"
          max="300"
          step="1"
          value={recapLength}
          // FIX: Cast e.target to 'any' to access the 'value' property.
          onChange={(e) => setRecapLength(Number((e.target as any).value))}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
        />
      </div>

      <button
        onClick={onCreateRecap}
        disabled={isDisabled}
        className="w-full flex items-center justify-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-cyan-600 hover:bg-cyan-700 focus:ring-4 focus:ring-cyan-500/50 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 ease-in-out transform hover:scale-105 disabled:hover:scale-100"
      >
        {isLoading ? (
          'Creating...'
        ) : (
          <>
            <SparkleIcon />
            Create Recap Video & Script
          </>
        )}
      </button>
    </div>
  );
};
