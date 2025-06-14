"use client";

import CameraCapture from "@/components/capture-image";
import { useGeminiChat } from "@/hooks/useGemini";
import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";
import { Tooltip } from "@heroui/tooltip";
import { useState } from "react";

export default function Home() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const { message, loading, sendImage, sendVideo } = useGeminiChat();

  const handleSubmit = async () => {
    if (videoFile) {
      await sendVideo(videoFile);
      setVideoFile(null);
    }

    if (imageFile) {
      await sendImage(imageFile);
      setImageFile(null);
    }
  };

  return (
    <section className="flex flex-col gap-6">
      <CameraCapture setImageFile={setImageFile} setVideoFile={setVideoFile} />
      <Tooltip content="Enviar">
        <Button
          className="border dark:border-zinc-600"
          color="primary"
          type="submit"
          isDisabled={!imageFile && !videoFile}
          onPress={handleSubmit}
        >
          Enviar
        </Button>
      </Tooltip>
      {loading && <Spinner />}
      {message && <span>{message}</span>}
    </section>
  );
}
