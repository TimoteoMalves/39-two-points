export const speak = (text: string) => {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "pt-BR";

  const vozes = speechSynthesis.getVoices();
  const vozPortugues = vozes.find(
    (voz) => voz.lang === "pt-BR" || voz.lang === "pt-PT"
  );

  if (vozPortugues) {
    utterance.voice = vozPortugues;
  } else {
    console.warn(
      "Nenhuma voz em português encontrada. Usando a voz padrão do sistema."
    );
  }

  speechSynthesis.speak(utterance);
};
