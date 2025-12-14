import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const geminiAPI = {
  generateContent: async ({ prompt }) => {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent(prompt);
      return result;
    } catch (error) {
      throw new Error('Gemini API failed: ' + error.message);
    }
  }
};
