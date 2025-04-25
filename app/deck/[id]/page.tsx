"use client";

import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Link } from "@heroui/link";
import { useState } from "react";
import {
  LuArrowLeft,
  LuArrowRight,
  LuBookPlus,
  LuChartArea,
  LuFile,
  LuHeadset,
  LuList,
  LuSend,
  LuX,
} from "react-icons/lu";
import { Spinner } from "@heroui/spinner";

import { Typewriter } from "@/components/type-writer";
import { useGeminiChat } from "@/hooks/useGemini";
import AudioUploader from "@/components/audio-uploader";
import ImageUploader from "@/components/image-uploader";
import { Image } from "@heroui/image";
import { Tab, Tabs } from "@heroui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/table";
import { Tooltip } from "@heroui/tooltip";

export default function Home() {
  const [input, setInput] = useState("");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { message, loading, error, sendMessage, sendAudio, sendImage } =
    useGeminiChat();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (imageFile) {
      sendImage(imageFile);
    } else if (audioFile) {
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
          <Button isIconOnly className="flex gap-3" radius="full" size="sm">
            <LuArrowLeft />
          </Button>
        </Link>
        <h1 className="text-4xl">Criar novo card</h1>
      </div>

      <Tabs
        aria-label="Options"
        className="mx-auto"
        color="primary"
        variant="bordered"
      >
        <Tab
          key="cards"
          title={
            <div className="flex items-center space-x-2">
              <LuList />
              <span>Cards do deck</span>
            </div>
          }
        >
          <Table aria-label="Example static collection table">
            <TableHeader>
              <TableColumn>ID</TableColumn>
              <TableColumn>Frente</TableColumn>
              <TableColumn>Verso</TableColumn>
              <TableColumn>Grammars</TableColumn>
            </TableHeader>
            <TableBody>
              <TableRow key="1">
                <TableCell>1</TableCell>
                <TableCell>Olá, mundo!</TableCell>
                <TableCell>Hello, world!</TableCell>
                <TableCell>2</TableCell>
              </TableRow>
              <TableRow key="2">
                <TableCell>2</TableCell>
                <TableCell>
                  O rato roubou a roupa do rei de Roma usando uma moto.
                </TableCell>
                <TableCell>
                  {
                    "The rat stole the king of Rome's clothes using a motorcycle."
                  }
                </TableCell>
                <TableCell>9</TableCell>
              </TableRow>
              <TableRow key="3">
                <TableCell>3</TableCell>
                <TableCell>
                  Está muito frio hoje, você pegou o seu casaco?
                </TableCell>
                <TableCell>
                  {"It's very cold today, did you grab your coat?"}
                </TableCell>
                <TableCell>9</TableCell>
              </TableRow>
              <TableRow key="4">
                <TableCell>4</TableCell>
                <TableCell>
                  Nem todo mundo é igual a você, seu bobalhão.
                </TableCell>
                <TableCell>Not everyone is like you, you goofball.</TableCell>
                <TableCell>6</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Tab>
        <Tab
          key="insert-cards"
          title={
            <div className="flex items-center space-x-2">
              <LuBookPlus />
              <span>Criar cards</span>
            </div>
          }
        >
          <form className="flex flex-col flex-1 gap-3" onSubmit={handleSubmit}>
            <div className="bg-zinc-100 border dark:border-zinc-600 shadow flex flex-col gap-3 dark:bg-zinc-800 p-6 rounded-2xl">
              <div className="h-10">
                {imageFile && (
                  <div className="text-sm flex gap-3 items-center">
                    <span className="flex gap-3 items-center">
                      <LuFile /> <span>Arquivo:</span>
                    </span>
                    <strong>{imageFile.name}</strong>
                    <Button
                      isIconOnly
                      radius="full"
                      size="sm"
                      onPress={() => setImageFile(null)}
                    >
                      <LuX />
                    </Button>
                  </div>
                )}
                {audioFile && (
                  <div className="text-sm flex gap-1 items-center">
                    <span className="flex gap-3 items-center">
                      <LuHeadset /> <span>Arquivo:</span>
                    </span>
                    <strong>{audioFile.name}</strong>
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
                {!audioFile && !imageFile && (
                  <Input
                    isRequired
                    errorMessage={"Este campo é obrigatório"}
                    placeholder="Digite aqui sua frase"
                    type="textarea"
                    value={input}
                    variant="underlined"
                    onChange={(e) => setInput(e.target.value)}
                  />
                )}
              </div>

              <div className="flex gap-2 justify-between">
                <div className="flex gap-2 items-center">
                  <Image
                    alt="flag"
                    className="border"
                    src="/languages/brazil.png"
                    width={25}
                  />
                  <LuArrowRight size={20} />
                  <Image
                    alt="flag"
                    className="border"
                    src="/languages/united-states.png"
                    width={25}
                  />
                </div>
                <div className="flex gap-2">
                  <ImageUploader setImageFile={setImageFile} />
                  <AudioUploader setAudioFile={setAudioFile} />
                  <Tooltip content="Enviar">
                    <Button
                      isIconOnly
                      className="border dark:border-zinc-600"
                      color="primary"
                      radius="full"
                      type="submit"
                    >
                      <LuSend />
                    </Button>
                  </Tooltip>
                </div>
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
                    <span className="text-lg">Frente:</span>
                    <span className="flex gap-3 items-start p-3 rounded-lg bg-zinc-100 dark:bg-zinc-700 shadow">
                      <Typewriter text={message.corrected_pt} />
                    </span>
                  </>
                )}
              </div>

              <div className="col-span-2 flex flex-col gap-1">
                {message.en_translation && (
                  <>
                    <span className="text-lg">Verso:</span>
                    <span className="flex gap-3 items-start p-3 rounded-lg bg-zinc-100 dark:bg-zinc-700 shadow">
                      <Typewriter text={message.en_translation} />
                    </span>
                  </>
                )}
              </div>

              <div className="col-span-4 flex flex-col gap-1 text-sm">
                {message.grammar_tips.length > 0 && (
                  <div className="flex flex-col gap-1">
                    <span className="text-lg">Dicas gramaticais:</span>
                    <div className="flex flex-col gap-3">
                      {message.grammar_tips.map((tip) => (
                        <span
                          key={tip}
                          className="flex gap-3 items-start p-3 rounded-lg bg-zinc-100 dark:bg-zinc-700 shadow"
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
        </Tab>
      </Tabs>
    </section>
  );
}
