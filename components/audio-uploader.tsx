"use client";

import { Button } from "@heroui/button";
import { useRef } from "react";
import { LuMic } from "react-icons/lu";

type AudioUploaderProps = {
  setAudioFile: (file: File | null) => void;
};

export default function AudioUploader({ setAudioFile }: AudioUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setAudioFile(file);
    } else {
      alert("Por favor, envie um arquivo .mp3 válido.");
      setAudioFile(null);
    }

    e.target.value = "";
  };

  return (
    <>
      <input
        type="file"
        ref={inputRef}
        onChange={handleChange}
        className="hidden"
        accept="audio/mp3"
      />

      <Button
        isIconOnly
        color="default"
        radius="full"
        type="button"
        onPress={handleButtonClick}
      >
        <LuMic />
      </Button>
    </>
  );
}
