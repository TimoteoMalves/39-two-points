import {
  GoogleGenAI,
  createUserContent,
  createPartFromUri,
  createPartFromBase64,
} from "@google/genai";
import { useState } from "react";
import { z } from "zod";

const messageSchema = z.object({
  corrected_pt: z.string(),
  en_translation: z.string(),
  grammar_tips: z.array(z.string()),
});

type MessageType = z.infer<typeof messageSchema>;

export function useGeminiChat() {
  const [message, setMessage] = useState<MessageType>({
    corrected_pt: "",
    en_translation: "",
    grammar_tips: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ai = new GoogleGenAI({
    apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || "",
  });

  const sendMessage = async (userInput: string) => {
    const prompt = `
Você é um assistente de idiomas bilíngue avançado que ajuda falantes de português a melhorar seu inglês.

Siga as instruções abaixo com precisão:

1. Receba uma frase ou palavra escrita em português do Brasil.
2. Corrija eventuais erros gramaticais ou ortográficos, mantendo o sentido original da frase.
3. Traduza a frase corrigida para o inglês americano.
4. Gere uma lista de explicações gramaticais em português com base na tradução em inglês. Cada item da lista deve:

   - Explicar o significado de uma ou mais palavras da tradução,
   - Indicar o tempo verbal (presente, passado, etc.) quando aplicável,
   - Mencionar a função da palavra na frase (verbo, substantivo, preposição, etc.),
   - Incluir outros significados comuns da palavra (se houver),
   - Sempre que possível, trazer um mini exemplo com a palavra usada em outra frase em inglês.

Formato de saída:
- Retorne **apenas** um objeto JSON **sem qualquer formatação adicional** (sem blocos de código, sem marcações como \`\`\`json ou similares).
- O retorno deve ser um JSON limpo, que possa ser consumido diretamente pelo frontend.

Campos do JSON:
- "corrected_pt": frase corrigida em português
- "en_translation": tradução para o inglês americano
- "grammar_tips": array strings de explicações curtas e detalhadas em português, conforme descrito acima

Exemplo de entrada:
"ela vai no escola todo os dia"

Exemplo de saída esperada:
{
  "corrected_pt": "Ela vai à escola todos os dias.",
  "en_translation": "She goes to school every day.",
  "grammar_tips": [
    "'She' é o pronome pessoal usado para 'ela' em inglês. É usado com verbos conjugados na terceira pessoa do singular.",
    "'Goes' é o presente simples do verbo 'go' (ir). Outros tempos: 'went' (passado), 'gone' (particípio). Ex: 'He goes to the gym every morning.'",
    "'To' é uma preposição que indica direção ou destino. Ex: 'I’m going to the store.'",
    "'School' significa 'escola'. Pode ser usada com ou sem artigo, dependendo do contexto.",
    "'Every day' significa 'todos os dias'. É uma expressão comum para indicar rotina. Cuidado: diferente de 'everyday' (adjetivo)."
  ]
}

Entrada do usuário: ${userInput}`;

    setError(null);

    setMessage({
      corrected_pt: "",
      en_translation: "",
      grammar_tips: [],
    });

    setLoading(true);
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
      });

      const cleanJson = response.text?.replace(/```json\n?|\n?```/g, "");
      const parseResult = messageSchema.safeParse(JSON.parse(cleanJson || ""));

      if (parseResult.success) {
        setMessage(parseResult.data);
      } else {
        setError("Failed to parse the response.");
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      console.log(err);
      setError("An error occurred while sending the message.");
    } finally {
      setLoading(false);
    }
  };

  const sendAudio = async (audioFile: File) => {
    const prompt = `
    Você é um assistente de idiomas bilíngue avançado que ajuda falantes de português a melhorar seu inglês.
    
    A entrada será um **áudio falado em português do Brasil**, e não uma frase digitada.
    
    Siga as instruções abaixo com precisão:
    
    1. Transcreva o que foi dito no áudio de forma clara e fiel.
    2. Corrija eventuais erros gramaticais ou ortográficos da transcrição, mantendo o sentido original da fala.
    3. Traduza a frase corrigida para o inglês americano.
    4. Gere uma lista de explicações gramaticais em português com base na tradução em inglês. Cada item da lista deve:
    
       - Explicar o significado de uma ou mais palavras da tradução,
       - Indicar o tempo verbal (presente, passado, etc.) quando aplicável,
       - Mencionar a função da palavra na frase (verbo, substantivo, preposição, etc.),
       - Incluir outros significados comuns da palavra (se houver),
       - Sempre que possível, trazer um mini exemplo com a palavra usada em outra frase em inglês.
    
    Formato de saída:
    - Retorne **apenas** um objeto JSON **sem qualquer formatação adicional** (sem blocos de código, sem marcações como \`\`\`json ou similares).
    - O retorno deve ser um JSON limpo, que possa ser consumido diretamente pelo frontend.

    Campos do JSON:
    - "corrected_pt": frase corrigida em português
    - "en_translation": tradução para o inglês americano
    - "grammar_tips": array strings de explicações curtas e detalhadas em português, conforme descrito acima

    Exemplo de saída esperada:
    {
      "corrected_pt": "Ela vai à escola todos os dias.",
      "en_translation": "She goes to school every day.",
      "grammar_tips": [
        "'She' é o pronome pessoal usado para 'ela' em inglês. É usado com verbos conjugados na terceira pessoa do singular.",
        "'Goes' é o presente simples do verbo 'go' (ir). Outros tempos: 'went' (passado), 'gone' (particípio). Ex: 'He goes to the gym every morning.'",
        "'To' é uma preposição que indica direção ou destino. Ex: 'I’m going to the store.'",
        "'School' significa 'escola'. Pode ser usada com ou sem artigo, dependendo do contexto.",
        "'Every day' significa 'todos os dias'. É uma expressão comum para indicar rotina. Cuidado: diferente de 'everyday' (adjetivo)."
      ]
    }`;

    setError(null);

    setMessage({
      corrected_pt: "",
      en_translation: "",
      grammar_tips: [],
    });

    setLoading(true);
    try {
      const base64 = await blobToBase64(audioFile);

      const response = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: createUserContent([
          createPartFromBase64(base64, "audio/mp3"),
          prompt,
        ]),
      });

      const cleanJson = response.text?.replace(/```json\n?|\n?```/g, "");
      const parseResult = messageSchema.safeParse(JSON.parse(cleanJson || ""));

      if (parseResult.success) {
        setMessage(parseResult.data);
      } else {
        setError("Failed to parse the response.");
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    sendMessage,
    sendAudio,
  };
}
