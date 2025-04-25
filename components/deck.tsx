"use client";

import { Button } from "@heroui/button";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { addToast } from "@heroui/toast";
import { LuPen, LuPlus, LuTrash } from "react-icons/lu";

import { ModalDeck } from "./modal-deck";

import { type Deck, useMutationDeleteDeck } from "@/hooks/deck/hooks";
import { Link } from "@heroui/link";

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
    <Card className="p-3 hover:scale-105 aspect-[2/3] border" shadow="none">
      <CardHeader className="flex flex-col items-start">
        <h1 className="text-xl font-bold">
          #{id} {name}
        </h1>
        <p className="text-base">
          #{language_id} {language}
        </p>
      </CardHeader>
      <Divider />
      <CardBody className="text-sm flex flex-col gap-1">
        <p>Total: 0</p>
        <p>Revisar: 0</p>
        <span className="font-bold">Criado em 22/05/2025</span>
      </CardBody>
      <CardFooter className="flex justify-end gap-3">
        <Link href={`/deck/${id}`}>
          <LuPlus />
        </Link>
        <button onClick={handleDeleteDeck}>
          <LuTrash />
        </button>
        <ModalDeck
          deck={{ id, name, language, language_id }}
          refetchDecks={refetchDecks}
        >
          <LuPen />
        </ModalDeck>
        <Button color="primary" size="sm" variant="flat">
          Revisar
        </Button>
      </CardFooter>
    </Card>
  );
}
