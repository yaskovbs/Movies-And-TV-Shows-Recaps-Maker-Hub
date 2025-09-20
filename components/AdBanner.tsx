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

import React, { useEffect } from 'react';

export const AdBanner: React.FC = () => {
    useEffect(() => {
        // Load AdSense ads when component mounts
        try {
            if (window.adsbygoogle && window.adsbygoogle.loaded === undefined) {
                // AdSense script is loaded, but ads haven't been pushed yet
                (window.adsbygoogle = window.adsbygoogle || []).push({});
            }
        } catch (err) {
            console.error('AdSense error:', err);
        }
    }, []);

    return (
        <div className="flex justify-center py-4">
            <div className="w-full max-w-4xl mx-auto px-4">
                <ins
                    className="adsbygoogle"
                    style={{ display: 'block' }}
                    data-ad-client="ca-pub-9953179201685717"
                    data-ad-slot="your-ad-slot-id"
                    data-ad-format="auto"
                    data-full-width-responsive="true">
                </ins>
            </div>
        </div>
    );
}
