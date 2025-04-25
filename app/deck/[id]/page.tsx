"use client";

import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Link } from "@heroui/link";
import { useState } from "react";
import { LuArrowLeft, LuSend, LuX } from "react-icons/lu";
import { Spinner } from "@heroui/spinner";

import { Typewriter } from "@/components/type-writer";
import { useGeminiChat } from "@/hooks/useGemini";
import AudioUploader from "@/components/audio-uploader";

export default function Home() {
  const [input, setInput] = useState("");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const { message, loading, error, sendMessage, sendAudio } = useGeminiChat();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (audioFile) {
      sendAudio(audioFile);
    } else {
      if (input.trim()) {
        await sendMessage(input);
      }
    }
  };

  return (
    <section className="flex flex-col gap-6">
      <div className="flex gap-3 items-center">
        <Link href="/">
          <Button isIconOnly className="flex gap-3" radius="full">
            <LuArrowLeft />
          </Button>
        </Link>
        <h1 className="text-4xl">Criar novo card</h1>
      </div>

      <form className="flex flex-col flex-1 gap-3" onSubmit={handleSubmit}>
        <div className="bg-zinc-100 shadow flex flex-col gap-3 dark:bg-zinc-800 p-4 rounded-2xl">
          {audioFile && (
            <div className="text-sm flex gap-3 items-center">
              <span>🎧 Arquivo:</span> <strong>{audioFile.name}</strong>
              <Button
                isIconOnly
                radius="full"
                size="sm"
                onPress={() => setAudioFile(null)}
              >
                <LuX />
              </Button>
            </div>
          )}
          {!audioFile && (
            <Input
              isRequired
              errorMessage={"Este campo é obrigatório"}
              label="Sua frase"
              labelPlacement="outside"
              placeholder="Digite aqui sua frase"
              type="textarea"
              value={input}
              variant="underlined"
              onChange={(e) => setInput(e.target.value)}
            />
          )}

          <div className="flex gap-3 justify-end">
            <AudioUploader setAudioFile={setAudioFile} />
            <Button isIconOnly color="primary" radius="full" type="submit">
              <LuSend />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-4 w-full gap-3">
          {error && (
            <span className="col-span-4 bg-red-100 dark:bg-red-950">
              {error}
            </span>
          )}
          {loading && (
            <div className="col-span-4 flex py-4 justify-center items-center">
              <Spinner />
            </div>
          )}
          <div className="col-span-2 flex flex-col gap-1">
            {message.corrected_pt && (
              <>
                <span className="text-lg">Frase original:</span>
                <span className="flex gap-3 items-start p-4 rounded-xl bg-blue-100 shadow dark:bg-blue-900">
                  <Typewriter text={message.corrected_pt} />
                </span>
              </>
            )}
          </div>

          <div className="col-span-2 flex flex-col gap-1">
            {message.en_translation && (
              <>
                <span className="text-lg">Frase traduzida:</span>
                <span className="flex gap-3 items-start p-4 rounded-xl bg-blue-100 shadow dark:bg-blue-900">
                  <Typewriter text={message.en_translation} />
                </span>
              </>
            )}
          </div>

          <div className="col-span-4 flex flex-col gap-1">
            {message.grammar_tips.length > 0 && (
              <div className="flex flex-col gap-1">
                <span className="text-lg">Dicas gramaticais:</span>
                <div className="flex flex-col gap-3">
                  {message.grammar_tips.map((tip) => (
                    <span
                      key={tip}
                      className="flex gap-3 items-start p-4 rounded-xl bg-blue-50 shadow dark:bg-blue-950"
                    >
                      <Typewriter text={tip} />
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {message.en_translation && (
            <Button className="col-span-4" color="primary">
              Salvar
            </Button>
          )}
        </div>
      </form>
    </section>
  );
}
