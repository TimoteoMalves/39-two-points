"use client";

import { useState, useEffect } from "react";

type TypewriterProps = {
  text: string;
  speed?: number;
  onDone?: () => void;
};

export function Typewriter({ text, speed = 30, onDone }: TypewriterProps) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, i + 1));
      i++;
      if (i === text.length) {
        clearInterval(interval);
        onDone?.();
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed, onDone]);

  return <p>{displayedText}</p>;
}
