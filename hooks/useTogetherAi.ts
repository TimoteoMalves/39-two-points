import { useState } from "react";
import Together from "together-ai";
import { z } from "zod";

const messageSchema = z.object({
  corrected_pt: z.string(),
  en_translation: z.string(),
  grammar_tips: z.array(z.string()),
});

type MessageType = z.infer<typeof messageSchema>;

export function useTogetherChat() {
  const [message, setMessage] = useState<MessageType>({
    corrected_pt: "",
    en_translation: "",
    grammar_tips: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const together = new Together({
    apiKey: "3a29c1176629378176d799e432c2f25aaaed7520aef06e28b3a37b159b946069",
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
    
    Formato de saída: retorne apenas um objeto JSON, sem explicações adicionais ou marcações de código.
    
    Campos do JSON:
    - "corrected_pt": frase corrigida em português
    - "en_translation": tradução para o inglês americano
    - "grammar_tips": array de explicações curtas e detalhadas em português, conforme descrito acima
    
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
      const response = await together.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "meta-llama/Meta-Llama-3-8B-Instruct-Turbo",
      });

      const parseResult = messageSchema.safeParse(
        JSON.parse(response.choices[0]?.message?.content || "")
      );

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

  return {
    message,
    loading,
    error,
    sendMessage,
  };
}
