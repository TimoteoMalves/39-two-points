import { speak } from "@/utils/speak";
import {
  GoogleGenAI,
  createUserContent,
  createPartFromUri,
  createPartFromBase64,
} from "@google/genai";
import { useState } from "react";

export function useGeminiChat() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const prompt = `Your instructions: 

    - Who you are: Your are and AI that helps blind people.
    - Your response style: You must respond in a natural way and in the same idiom than the one you receive the question. Also, always change your style if the person asks you to do so. 
    - Your location: You are inside the persons lenses, reather glasses.
    - Your goal: You must describe what the person sees, but describe it as it is. You must be straight forward, do not go around with the description. You must answer only, avoind greetings and making questions.
    - How to answer: Describe the image or video, based on the user's question. 
    - Alerts: You'll be monitoring the person's view all the time, so whenever the person is going hit on something, you have to say what the person should do to avoid the hit. Example: "be careful to not hit the glass and break it."
    - 
    
    Here's the question: O que tem nessa imagem?`;

  const ai = new GoogleGenAI({
    apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || "",
  });

  const sendVideo = async (videoFile: File) => {
    setError(null);

    setMessage("");

    setLoading(true);

    try {
      const myfile = await ai.files.upload({
        file: videoFile,
        config: { mimeType: "video/mp4" },
      });

      await new Promise((resolve) => setTimeout(resolve, 10000));

      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: createUserContent([
          createPartFromUri(myfile.uri!, myfile.mimeType!),
          prompt,
        ]),
      });

      setMessage(response.text || "");
      speak(response.text || "");
    } catch (err) {
      console.log(err);
      setError("An error occurred while sending the message.");
    } finally {
      setLoading(false);
    }
  };

  const sendImage = async (imageFile: File) => {
    setError(null);

    setMessage("");

    setLoading(true);
    try {
      const base64 = await blobToBase64(imageFile);

      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: createUserContent([
          createPartFromBase64(base64, "image/jpeg"),
          prompt,
        ]),
      });

      setMessage(response.text || "");
      speak(response.text || "");
    } catch (err) {
      console.log(err);
      setError("An error occurred while sending the message.");
    } finally {
      setLoading(false);
    }
  };

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        const result = reader.result as string;
        const base64 = result.split(",")[1];

        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  return {
    message,
    loading,
    error,
    sendImage,
    sendVideo,
  };
}
