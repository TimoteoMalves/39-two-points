"use client";

import { Card, CardBody } from "@heroui/card";
import { LuPlus } from "react-icons/lu";

import { ModalDeck } from "./modal-deck";

type DeckInsertProps = {
  refetchDecks: () => void;
};

export function DeckInsert({ refetchDecks }: DeckInsertProps) {
  return (
    <ModalDeck refetchDecks={refetchDecks}>
      <Card className="p-3 border min-h-[171px] w-full h-full border-dashed cursor-pointer border-primary hover:scale-105 shadow-none">
        <CardBody className="flex items-center justify-center text-4xl text-primary">
          <LuPlus />
        </CardBody>
      </Card>
    </ModalDeck>
  );
}
