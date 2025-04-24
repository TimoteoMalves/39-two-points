import { useState } from "react";

export function useOllamaGrammar() {
  const [result, setResult] = useState<{
    corrected: string;
    grammar: { word: string; grammar: string }[];
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendGrammarPrompt = async (input: string) => {
    setLoading(true);
    setError(null);
    setResult(null);

    const prompt = `
Você é um professor de inglês e especialista em gramática.  
Receberá uma frase em português como entrada.

1. Corrija a frase em português, se necessário.  
2. Traduza a frase para o inglês corretamente.  
3. Retorne a frase corrigida em português e um array de objetos explicando as regras gramaticais do inglês aplicadas na tradução.  
   Cada objeto do array deve ter o seguinte formato:  
   { "word": "palavra em inglês", "grammar": "explicação da regra gramatical aplicada" }

Exemplo de resposta:  
{  
  "corrected": "Frase corrigida em português",  
  "grammar": [  
    { "word": "went", "grammar": "Passado do verbo 'go', usado porque a ação aconteceu no passado." },  
    { "word": "to", "grammar": "Preposição indicando movimento para um lugar." }  
  ]  
}

Entrada: ${input}
`;

    try {
      const res = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "gemma3:12b",
          prompt,
          stream: false,
        }),
      });

      const data = await res.json();
      const rawResponse = data.response;

      // Tenta extrair JSON do texto gerado
      const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        setResult(parsed);
      } else {
        throw new Error("Resposta inesperada do modelo.");
      }
    } catch (err: any) {
      setError("Erro ao processar a resposta do modelo.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return { result, loading, error, sendGrammarPrompt };
}
