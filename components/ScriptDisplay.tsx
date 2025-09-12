import React, { useState, useEffect } from 'react';
import { CopyIcon, DownloadIcon, CheckIcon } from './icons.tsx';

interface ScriptDisplayProps {
    script: string;
}

export const ScriptDisplay: React.FC<ScriptDisplayProps> = ({ script }) => {
    const [wasCopied, setWasCopied] = useState(false);

    useEffect(() => {
        if (wasCopied) {
            const timer = setTimeout(() => setWasCopied(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [wasCopied]);

    const handleCopy = () => {
        (navigator as any).clipboard.writeText(script);
        setWasCopied(true);
    };

    const handleDownloadScript = () => {
        const blob = new Blob([script], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = (window as any).document.createElement('a');
        a.href = url;
        a.download = 'recap-script.txt';
        (window as any).document.body.appendChild(a);
        a.click();
        (window as any).document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="flex-grow flex flex-col min-h-0">
          <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-200">Generated Script</h3>
              <div className="flex gap-2">
                <button onClick={handleCopy} className="p-2 rounded-md bg-gray-700 hover:bg-gray-600 transition-colors text-gray-300" title="Copy Script">
                    {wasCopied ? <CheckIcon /> : <CopyIcon/>}
                </button>
                <button onClick={handleDownloadScript} className="p-2 rounded-md bg-gray-700 hover:bg-gray-600 transition-colors text-gray-300" title="Download Script">
                    <DownloadIcon />
                </button>
              </div>
          </div>
          <div className="flex-grow bg-gray-900/50 rounded-lg p-4 overflow-y-auto custom-scrollbar">
            <p className="text-gray-300 whitespace-pre-wrap font-serif leading-relaxed">{script}</p>
          </div>
        </div>
    );
};