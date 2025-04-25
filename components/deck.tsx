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

  return (
    <Card className="border" shadow="none">
      <CardHeader
        className="flex flex-col h-10 items-start"
        style={{
          backgroundColor: genRandomColor(),
        }}
      />
      <Divider />
      <CardBody className="text-sm h-20 flex flex-col">
        <span className="font-bold text-base">{name}</span>
        <p>{language}</p>
      </CardBody>
      <CardFooter className="flex h-12 justify-end gap-1">
        <Link
          className="border rounded-full text-black p-2 bg-gray-100 hover:bg-gray-200"
          href={`/deck/${id}`}
        >
          <LuPlus />
        </Link>
        <button
          className="border rounded-full p-2 bg-gray-100 hover:bg-gray-200"
          onClick={handleDeleteDeck}
        >
          <LuTrash />
        </button>
        <ModalDeck
          deck={{ id, name, language, language_id }}
          refetchDecks={refetchDecks}
        >
          <div className="border rounded-full p-2 bg-gray-100 hover:bg-gray-200">
            <LuPen className="fill-transparent" />
          </div>
        </ModalDeck>
        <Button color="primary" radius="full" size="sm">
          Revisar +25
        </Button>
      </CardFooter>
    </Card>
  );
}
