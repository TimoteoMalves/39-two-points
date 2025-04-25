"use client";

import { Button } from "@heroui/button";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { addToast } from "@heroui/toast";
import { LuPen, LuPlus, LuTrash } from "react-icons/lu";

import { ModalDeck } from "./modal-deck";

import { type Deck, useMutationDeleteDeck } from "@/hooks/deck/hooks";
import { Link } from "@heroui/link";
import { genRandomColor } from "@/utils/gen-random-colors";
import { Tooltip } from "@heroui/tooltip";
import { Image } from "@heroui/image";

type DeckProps = Deck & {
  refetchDecks: () => void;
};

export function Deck({
  id,
  language,
  name,
  language_id,
  refetchDecks,
}: DeckProps) {
  const deleteDeck = useMutationDeleteDeck();

  const handleDeleteDeck = async () => {
    deleteDeck.mutateAsync(id).then(() => {
      addToast({
        title: "Sucesso",
        description: "Deck deletado com sucesso.",
        color: "success",
        shouldShowTimeoutProgress: true,
      });
      refetchDecks();
    });
  };

  const flags = {
    1: "languages/united-states.png",
    2: "languages/spain.png",
    3: "languages/germany.png",
  };

  return (
    <Card className="border dark:border-zinc-600" shadow="none">
      <CardHeader
        className="flex flex-col h-10 items-start"
        style={{
          backgroundColor: genRandomColor(),
        }}
      />
      <Divider />
      <CardBody className="text-sm h-20 flex flex-col gap-1">
        <span className="font-bold ">
          #{id} - {name}
        </span>
        <div className="flex gap-2 items-center">
          <Image
            alt="flag"
            src={flags[language_id as keyof typeof flags]}
            width={15}
            className="border"
          />
          <p>{language}</p>
        </div>
      </CardBody>
      <CardFooter className="flex h-12 justify-end gap-1">
        <Tooltip content="Adicionar cards">
          <Link
            className="border rounded-full text-black p-2 bg-transparent dark:text-white hover:bg-zinc-200 dark:hover:bg-zinc-600"
            href={`/deck/${id}`}
          >
            <LuPlus size={12} />
          </Link>
        </Tooltip>
        <Tooltip content="Remover deck">
          <button
            className="border rounded-full p-2 bg-transparent dark:text-white hover:bg-zinc-200 dark:hover:bg-zinc-600"
            onClick={handleDeleteDeck}
          >
            <LuTrash size={12} />
          </button>
        </Tooltip>
        <ModalDeck
          deck={{ id, name, language, language_id }}
          refetchDecks={refetchDecks}
        >
          <Tooltip content="Editar deck">
            <div className="border rounded-full p-2 bg-transparent dark:text-white hover:bg-zinc-200 dark:hover:bg-zinc-600">
              <LuPen className="fill-transparent" size={12} />
            </div>
          </Tooltip>
        </ModalDeck>
        <Button color="primary" radius="full" size="sm">
          Revisar +25
        </Button>
      </CardFooter>
    </Card>
  );
}
