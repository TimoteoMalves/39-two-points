"use client";

import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Link } from "@heroui/link";
import { useState } from "react";
import { LuArrowLeft, LuSend } from "react-icons/lu";
import { Spinner } from "@heroui/spinner";

import { useTogetherChat } from "@/hooks/useTogetherAi";
import { Typewriter } from "@/components/type-writer";

export default function Home() {
  const [input, setInput] = useState("");
  const { message, loading, error, sendMessage } = useTogetherChat();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      await sendMessage(input);
    }
  };

  return (
    <section className="flex flex-col gap-6">
      <div className="flex gap-3 items-center">
        <Link href="/">
          <Button className="flex gap-3" isIconOnly radius="full">
            <LuArrowLeft />
          </Button>
        </Link>
        <h1 className="text-4xl">Criar novo deck</h1>
      </div>
      <form className="flex flex-col flex-1 gap-3" onSubmit={handleSubmit}>
        <div className="bg-zinc-100 shadow flex flex-col gap-3 dark:bg-zinc-800 p-4 rounded-2xl">
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
          <Button
            isIconOnly
            className="w-min ml-auto flex gap-3"
            color="primary"
            radius="full"
            type="submit"
          >
            <LuSend />
          </Button>
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
