import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

let chatSession: Chat | null = null;

// Initialize the chat session with a system instruction suitable for IT support
export const initChatSession = async (): Promise<Chat> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  chatSession = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: `You are Nebula, an advanced IT support assistant for a Virtual Desktop Infrastructure (VDI) client. 
      Help users troubleshoot connection latency, password resets, resource allocation, and general usage of the VDI.
      Keep answers concise, professional, and helpful. 
      If a user asks about connection status, guide them to the dashboard charts.
      If they need to restart a VM, explain that they can use the power menu on the resource card.`,
    },
  });

  return chatSession;
};

export const sendMessageToGemini = async function* (message: string) {
  if (!chatSession) {
    await initChatSession();
  }
  
  if (!chatSession) {
     throw new Error("Failed to initialize chat session");
  }

  try {
    const result = await chatSession.sendMessageStream({ message });
    
    for await (const chunk of result) {
       const response = chunk as GenerateContentResponse;
       if (response.text) {
         yield response.text;
       }
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    yield "I'm having trouble connecting to the support server right now. Please try again later.";
  }
};
