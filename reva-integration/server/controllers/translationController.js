// server/controllers/translationController.js
import axios from 'axios';

export const translate = async (req, res) => {
  try {
    const { text, targetLang } = req.body;
    
    // Detect source language
    const sourceLang = targetLang === 'en' ? 'kn' : 'en';
    
    const response = await axios.post(process.env.LIBRETRANSLATE_API, {
      q: text,
      source: sourceLang,
      target: targetLang,
      format: 'text'
    });
    
    res.status(200).json({
      success: true,
      translatedText: response.data.translatedText
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Batch translation for UI elements
export const batchTranslate = async (req, res) => {
  try {
    const { texts, targetLang } = req.body;
    const sourceLang = targetLang === 'en' ? 'kn' : 'en';
    
    const translations = await Promise.all(
      texts.map(async (text) => {
        const response = await axios.post(process.env.LIBRETRANSLATE_API, {
          q: text,
          source: sourceLang,
          target: targetLang,
          format: 'text'
        });
        return { original: text, translated: response.data.translatedText };
      })
    );
    
    res.status(200).json({ success: true, translations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
