import React from 'react';

export const AdBanner: React.FC = () => {
    return (
        <div className="container mx-auto px-4 md:px-8 py-4">
            <div className="bg-gray-800 rounded-lg h-24 flex items-center justify-center text-gray-500 border border-gray-700">
                <p>Advertisement</p>
            </div>
        </div>
    );
}
