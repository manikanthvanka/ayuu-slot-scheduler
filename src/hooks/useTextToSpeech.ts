import { useCallback } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export const useTextToSpeech = () => {
  const { language } = useLanguage();

  const speak = useCallback((text: string) => {
    // Check if speech synthesis is supported
    if (!('speechSynthesis' in window)) {
      console.warn('Text-to-speech not supported in this browser');
      return false;
    }

    try {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      
      // Set language based on current app language
      switch (language) {
        case 'te':
          utterance.lang = 'te-IN';
          break;
        case 'hi':
          utterance.lang = 'hi-IN';
          break;
        default:
          utterance.lang = 'en-US';
      }

      // Set speech properties
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 1;

      // Speak the text
      window.speechSynthesis.speak(utterance);
      return true;
    } catch (error) {
      console.error('Text-to-speech error:', error);
      return false;
    }
  }, [language]);

  const isSupported = 'speechSynthesis' in window;

  return { speak, isSupported };
};