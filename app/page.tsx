"use client";

import CameraCapture from "@/components/capture-image";
import { useGeminiChat } from "@/hooks/useGemini";
import { speak } from "@/utils/speak";
import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";
import { Tooltip } from "@heroui/tooltip";
import { useState } from "react";

export default function Home() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const { message, loading, error, sendImage, sendVideo } = useGeminiChat();

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
          onPress={handleSubmit}
        >
          Enviar
        </Button>
      </Tooltip>
      {loading && <Spinner />}
      {message && (
        <>
          <span>{message}</span>
          <Button onPress={() => speak(message)}>Replay</Button>
        </>
      )}
    </section>
  );
}
