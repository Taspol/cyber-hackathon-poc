
import { GoogleGenAI, Type } from "@google/genai";
import { Message } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateMockupMessages = async (): Promise<Message[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Generate 5 realistic Samsung One UI style messaging app notifications/messages. Return them as JSON objects with id, sender, preview, time, unread(boolean), and a placeholder avatar URL (use picsum.photos).",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              sender: { type: Type.STRING },
              preview: { type: Type.STRING },
              time: { type: Type.STRING },
              unread: { type: Type.BOOLEAN },
              avatar: { type: Type.STRING }
            },
            required: ["id", "sender", "preview", "time", "unread", "avatar"]
          }
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error generating messages:", error);
    // Fallback data
    return [
      { id: '1', sender: 'Bixby', preview: 'Your daily briefing is ready.', time: '08:30 AM', unread: true, avatar: 'https://picsum.photos/100/100?random=1' },
      { id: '2', sender: 'Samsung Support', preview: 'A new update is available for your Galaxy.', time: 'Yesterday', unread: false, avatar: 'https://picsum.photos/100/100?random=2' }
    ];
  }
};

export const generateSmartSummary = async (messages: Message[]): Promise<string> => {
  try {
    const textContext = messages.map(m => `${m.sender}: ${m.preview}`).join('\n');
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Provide a single, short, and helpful AI summary of these recent messages for a Samsung One UI "Smart Suggestion" widget: \n${textContext}`,
    });
    return response.text.trim();
  } catch (error) {
    return "Stay on top of your schedule and updates today.";
  }
};
