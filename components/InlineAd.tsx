// Type declarations for AdSense
declare global {
  interface Window {
    adsbygoogle: any[] & {
      loaded?: boolean;
      pauseAdRequests?: boolean;
      noSlotIds?: boolean;
    };
  }
}

import React, { useEffect, useRef } from 'react';

interface InlineAdProps {
  className?: string;
}

export const InlineAd: React.FC<InlineAdProps> = ({ className = '' }) => {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load AdSense ads when component mounts
    const timeoutId = setTimeout(() => {
      try {
        if (window.adsbygoogle && adRef.current && !adRef.current.hasChildNodes()) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
      } catch (err) {
        console.error('AdSense error:', err);
      }
    }, 100);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className={`my-6 ${className}`}>
      <div ref={adRef}>
        <ins
          className="adsbygoogle"
          style={{ display: 'block', textAlign: 'center' }}
          data-ad-client="ca-pub-9953179201685717"
          data-ad-slot="your-inline-ad-slot-id"
          data-ad-format="horizontal"
          data-full-width-responsive="true">
        </ins>
      </div>
    </div>
  );
}
