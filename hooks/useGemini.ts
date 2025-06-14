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

  const ai = new GoogleGenAI({
    apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || "",
  });

  const sendVideo = async (videoFile: File) => {
    const prompt = `Descreva os elementos do video para um cego, fale sobre os elementos dela de forma direta e objetiva, sem rodeios. Não fale sobre a imagem em si, mas sim sobre o que ela contém.
    Você deve falar sobre os elementos da imagem, como se fosse um guia para uma pessoa cega, tem que ser curto e direto, o retorno deve ser já falando sobre os elementos, sem introdução.`;

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
    const prompt = `Descreva os elementos da imagem para um cego, fale sobre os elementos dela de forma direta e objetiva, sem rodeios. Não fale sobre a imagem em si, mas sim sobre o que ela contém.
    Você deve falar sobre os elementos da imagem, como se fosse um guia para uma pessoa cega, tem que ser curto e direto, o retorno deve ser já falando sobre os elementos, sem introdução.`;

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
        const base64 = result.split(",")[1]; // Remove o prefixo data:audio/mp3;base64,

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
