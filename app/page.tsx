"use client";

import CameraCapture from "@/components/capture-image";
import ImageUploader from "@/components/image-uploader";
import VideoUploader from "@/components/video-uploader";
import { useGeminiChat } from "@/hooks/useGemini";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Spinner } from "@heroui/spinner";
import { image } from "@heroui/theme";
import { Tooltip } from "@heroui/tooltip";
import { useRef, useState } from "react";
import { LuSend } from "react-icons/lu";

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
      {imageFile && (
        <img
          src={URL.createObjectURL(imageFile)}
          alt="Imagem Capturada"
          style={{
            width: "100%",
            maxWidth: "500px",
            border: "1px solid blue",
          }}
        />
      )}
      {videoFile && <span>{videoFile.name}</span>}
      <div className="flex gap-2">
        <CameraCapture
          setImageFile={setImageFile}
          setVideoFile={setVideoFile}
        />
        <ImageUploader setImageFile={setImageFile} />
        <VideoUploader setImageFile={setVideoFile} />
        <Tooltip content="Enviar">
          <Button
            isIconOnly
            className="border dark:border-zinc-600"
            color="primary"
            radius="full"
            type="submit"
            onPress={handleSubmit}
          >
            <LuSend />
          </Button>
        </Tooltip>
      </div>
      {loading && <Spinner />}
      <span>{message}</span>
    </section>
  );
}
