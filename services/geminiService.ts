
import { GoogleGenAI, Type } from "@google/genai";
import type { QuizQuestion, Flashcard } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const model = 'gemini-2.5-flash';

export const generateSummary = async (content: string): Promise<string> => {
  const prompt = `Please provide a detailed, well-structured summary of the following text. The summary should be easy to understand, highlighting the key concepts, main arguments, and important conclusions. Use bullet points for key takeaways. Text to summarize:\n\n---\n${content}\n---`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating summary:", error);
    throw new Error("Could not generate summary from the provided text.");
  }
};

export const generateQuiz = async (content: string): Promise<QuizQuestion[]> => {
  const prompt = `Based on the following text, create a multiple-choice quiz with exactly 5 questions. Each question must have 4 options, and only one option can be correct. Ensure the questions cover different aspects of the text. Text to use for quiz generation:\n\n---\n${content}\n---`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              correctAnswer: { type: Type.STRING },
            },
            required: ["question", "options", "correctAnswer"],
          },
        },
      },
    });
    
    const jsonText = response.text.trim();
    const quizData = JSON.parse(jsonText);

    // Basic validation
    if (!Array.isArray(quizData) || quizData.some(q => !q.question || !Array.isArray(q.options) || !q.correctAnswer)) {
      throw new Error("Invalid quiz data structure received from API.");
    }
    
    return quizData as QuizQuestion[];

  } catch (error) {
    console.error("Error generating quiz:", error);
    throw new Error("Could not generate a quiz from the provided text.");
  }
};

export const generateFlashcards = async (content: string): Promise<Flashcard[]> => {
  const prompt = `From the text below, create a set of 10 flashcards. Each flashcard should represent a key term, concept, or important name from the text. For each flashcard, provide a "term" and a concise "definition". Text to use for flashcard generation:\n\n---\n${content}\n---`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              term: { type: Type.STRING },
              definition: { type: Type.STRING },
            },
            required: ["term", "definition"],
          },
        },
      },
    });
    
    const jsonText = response.text.trim();
    const flashcardData = JSON.parse(jsonText);

    // Basic validation
    if (!Array.isArray(flashcardData) || flashcardData.some(f => !f.term || !f.definition)) {
        throw new Error("Invalid flashcard data structure received from API.");
    }

    return flashcardData as Flashcard[];
    
  } catch (error) {
    console.error("Error generating flashcards:", error);
    throw new Error("Could not generate flashcards from the provided text.");
  }
};
