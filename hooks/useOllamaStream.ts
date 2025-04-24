import { useState } from "react";

export function useOllamaStream() {
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const sendPrompt = async (prompt: string) => {
    setResponse("");
    setLoading(true);

    const sendPrompt = `
    Você é um tradutor profissional.
    
    Receberá uma frase em português. Corrija qualquer erro gramatical ou ortográfico, se houver, e depois traduza a frase corrigida para o inglês.
    
    Se a entrada estiver vazia, retorne uma string vazia.
    
    O resultado deve conter:
    1. A frase corrigida em português.
    2. Ajuste maisculo/minúsculo, se necessário.
    3. A tradução em inglês.
    
    A separação entre as duas deve ser feita usando exatamente isto: #{break}#
    
    ⚠️ Não adicione explicações, comentários ou qualquer outra informação. Apenas as duas frases, exatamente nesse formato:
    
    <frase corrigida em português> #break# <tradução em inglês>
    
    Frase: ${prompt}`;

    const res = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gemma3:4b",
        prompt: sendPrompt,
        stream: true,
      }),
    });

    if (!res.body) return;

    const reader = res.body.getReader();
    const decoder = new TextDecoder("utf-8");

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split("\n").filter(Boolean);

      for (const line of lines) {
        try {
          const json = JSON.parse(line);
          if (json.done) continue;
          setResponse((prev) => prev + json.response);
        } catch (err) {
          console.error("Erro ao processar linha:", line);
        }
      }
    }

    setLoading(false);
  };

  return { response, loading, sendPrompt };
}
