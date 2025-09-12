import React, { useState, useEffect, useCallback } from 'react';

export const useTextToSpeech = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  // FIX: Use 'any' as a workaround for missing DOM typings.
  const [voices, setVoices] = useState<any[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string | null>(() => {
    // Load saved voice from localStorage on initial render
    return localStorage.getItem('selectedVoiceURI');
  });
  
  const utteranceRef = React.useRef<any | null>(null);

  useEffect(() => {
    // Save the selected voice to localStorage whenever it changes
    if (selectedVoiceURI) {
      localStorage.setItem('selectedVoiceURI', selectedVoiceURI);
    }
  }, [selectedVoiceURI]);

  const populateVoiceList = useCallback(() => {
    // FIX: Access speechSynthesis via '(window as any)' to bypass TypeScript errors.
    const availableVoices = (window as any).speechSynthesis.getVoices();
    if (availableVoices.length > 0) {
      setVoices(availableVoices);
      // Set a default voice if one isn't already selected from localStorage
      if (!selectedVoiceURI) {
        // Prefer a US English voice if available, otherwise use the first one
        const defaultVoice = availableVoices.find((v: any) => v.lang === 'en-US') || availableVoices[0];
        setSelectedVoiceURI(defaultVoice.voiceURI);
      }
    }
  }, [selectedVoiceURI]);

  useEffect(() => {
    populateVoiceList();
    // The 'voiceschanged' event is fired when the list of voices is ready.
    // FIX: Access speechSynthesis via '(window as any)' to bypass TypeScript errors.
    if ((window as any).speechSynthesis.onvoiceschanged !== undefined) {
      (window as any).speechSynthesis.onvoiceschanged = populateVoiceList;
    }

    return () => {
       // FIX: Access speechSynthesis via '(window as any)' to bypass TypeScript errors.
      if ((window as any).speechSynthesis) {
        (window as any).speechSynthesis.onvoiceschanged = null;
        (window as any).speechSynthesis.cancel();
      }
    };
  }, [populateVoiceList]);

  const speak = useCallback((text: string) => {
    // FIX: Access speechSynthesis via '(window as any)' to bypass TypeScript errors.
    if (!(window as any).speechSynthesis) {
      console.error("Text-to-speech not supported in this browser.");
      return;
    }

    (window as any).speechSynthesis.cancel();

    // FIX: Instantiate SpeechSynthesisUtterance via '(window as any)' because the type is not globally available.
    const newUtterance = new (window as any).SpeechSynthesisUtterance(text);
    utteranceRef.current = newUtterance;

    if (selectedVoiceURI) {
      const selectedVoice = voices.find(v => v.voiceURI === selectedVoiceURI);
      if (selectedVoice) {
        newUtterance.voice = selectedVoice;
      }
    }

    newUtterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
    };

    newUtterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      utteranceRef.current = null;
    };

    newUtterance.onerror = (event: any) => {
      console.error('SpeechSynthesisUtterance.onerror', event);
      setIsPlaying(false);
      setIsPaused(false);
      utteranceRef.current = null;
    };
    
    (window as any).speechSynthesis.speak(newUtterance);
  }, [selectedVoiceURI, voices]);

  const pause = useCallback(() => {
    // FIX: Access speechSynthesis via '(window as any)' to bypass TypeScript errors.
    if ((window as any).speechSynthesis && isPlaying && !isPaused) {
      (window as any).speechSynthesis.pause();
      setIsPaused(true);
    }
  }, [isPlaying, isPaused]);

  const resume = useCallback(() => {
    // FIX: Access speechSynthesis via '(window as any)' to bypass TypeScript errors.
    if ((window as any).speechSynthesis && isPlaying && isPaused) {
      (window as any).speechSynthesis.resume();
      setIsPaused(false);
    }
  }, [isPlaying, isPaused]);

  const cancel = useCallback(() => {
    // FIX: Access speechSynthesis via '(window as any)' to bypass TypeScript errors.
    if ((window as any).speechSynthesis) {
      (window as any).speechSynthesis.cancel();
      setIsPlaying(false);
      setIsPaused(false);
      utteranceRef.current = null;
    }
  }, []);

  return { isPlaying, isPaused, speak, pause, resume, cancel, voices, selectedVoiceURI, setSelectedVoiceURI };
};