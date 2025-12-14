// client/src/store/languageStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

export const useLanguageStore = create(
  persist(
    (set, get) => ({
      currentLang: 'en',
      translations: {},
      
      setLanguage: (lang) => set({ currentLang: lang }),
      
      translate: async (text) => {
        const { currentLang, translations } = get();
        
        if (currentLang === 'en') return text;
        
        // Check cache
        if (translations[text]) return translations[text];
        
        // Fetch translation
        try {
          const response = await axios.post('http://localhost:5000/api/translate', {
            text,
            targetLang: currentLang
          });
          
          const translated = response.data.translatedText;
          
          // Cache it
          set((state) => ({
            translations: { ...state.translations, [text]: translated }
          }));
          
          return translated;
        } catch (error) {
          console.error('Translation error:', error);
          return text;
        }
      }
    }),
    {
      name: 'language-storage',
    }
  )
);
