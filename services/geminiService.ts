import { GoogleGenAI } from "@google/genai";

/**
 * Generates a recap script for a video using the Gemini API.
 * @param videoDescription A user-provided description of the video content.
 * @param recapLength The desired length of the recap in seconds.
 * @returns A promise that resolves to the generated script as a string.
 */
export const generateRecapScript = async (
  videoDescription: string,
  recapLength: number,
  apiKey: string
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey });
  
  const prompt = `
    You are a professional screenwriter and video editor. Your task is to create a compelling and concise recap script for a movie or TV show episode.

    **Video Description:**
    ${videoDescription}

    **Requested Recap Length:**
    Approximately ${recapLength} seconds.

    **Instructions:**
    1. Write a script that can be read aloud in about ${recapLength} seconds.
    2. The script should be engaging, capture the main plot points, and have a clear narrative flow.
    3. Use vivid language suitable for a voice-over.
    4. Structure the output as plain text, without any special formatting like markdown or JSON.
    5. The script should be ready to be used directly for a text-to-speech engine. Do not include scene numbers, character names in parenthesis, or any other script formatting, just the narrative voice-over text.

    Begin the script now.
  `;

  try {
    // FIX: Pass the prompt to the `contents` property as per @google/genai guidelines.
    const response = await ai.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: prompt
    });

    const script = response.text;
    
    if (!script) {
      throw new Error("The AI returned an empty response.");
    }

    return script.trim();
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to generate recap script. Check your network connection or API key configuration.");
  }
};
