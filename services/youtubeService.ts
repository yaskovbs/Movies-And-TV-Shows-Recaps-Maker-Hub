/**
 * Service for handling YouTube video downloads and processing
 */

export interface YouTubeVideoInfo {
  title: string;
  duration: number;
  thumbnail: string;
}

/**
 * Extract YouTube video ID from URL
 */
export const extractYouTubeId = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  return null;
};

/**
 * Get video information from YouTube URL
 * Since we're in a browser environment, this would need a backend proxy
 */
export const getYouTubeVideoInfo = async (url: string): Promise<YouTubeVideoInfo | null> => {
  try {
    const videoId = extractYouTubeId(url);
    if (!videoId) {
      throw new Error('Invalid YouTube URL');
    }

    // For demo purposes, we'll use YouTube's oEmbed API
    // In production, you'd want to use a more robust API or backend service
    const oEmbedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;

    const response = await fetch(oEmbedUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch video information');
    }

    const data = await response.json();

    return {
      title: data.title || 'YouTube Video',
      duration: 0, // oEmbed doesn't provide duration, would need another API
      thumbnail: data.thumbnail_url || ''
    };
  } catch (error) {
    console.error('Error fetching YouTube info:', error);
    // Return default info if API fails
    return {
      title: 'YouTube Video',
      duration: 0,
      thumbnail: 'https://via.placeholder.com/320x180/374151/9CA3AF?text=YouTube+Video'
    };
  }
};

/**
 * Download YouTube video as blob
 * In a real implementation, this would require a backend service
 * For now, this is a placeholder that shows the concept
 */
export const downloadYouTubeVideo = async (url: string, onProgress?: (progress: number) => void): Promise<Blob | null> => {
  const videoId = extractYouTubeId(url);
  if (!videoId) {
    throw new Error('Invalid YouTube URL');
  }

  // This is a placeholder implementation
  // In practice, you'd need a backend service to handle YouTube downloads
  // due to CORS and browser security limitations

  // For demo purposes, we'll simulate the download process
  onProgress?.(0);

  // Simulate progress
  for (let i = 1; i <= 10; i++) {
    await new Promise(resolve => setTimeout(resolve, 200));
    onProgress?.(i * 10);
  }

  // This would normally return the actual video blob
  // For now, we'll throw an informative error
  throw new Error('YouTube download requires a backend service. Please use the file upload feature for now.');

  // In a real implementation, you would:
  // 1. Send request to backend API
  // 2. Backend uses youtube-dl or similar to download
  // 3. Return the video file to the browser
  // 4. Process it with FFmpeg as usual
};
