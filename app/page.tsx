"use client";

import { Divider } from "@heroui/divider";
import { Spinner } from "@heroui/spinner";

import { DeckInsert } from "@/components/deck-insert";
import { Deck } from "@/components/deck";
import { useQueryGetDecks } from "@/hooks/deck/hooks";

export default function Home() {
  const { data, isLoading, refetch } = useQueryGetDecks();

  return (
    <section className="flex flex-col gap-6">
      <div>
        <h1 className="text-4xl">Meus decks</h1>
      </div>
      {isLoading && <Spinner />}

      {data && !isLoading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {data.map((deck) => (
            <Deck key={deck.id} {...deck} refetchDecks={refetch} />
          ))}

          <DeckInsert refetchDecks={refetch} />
        </div>
      )}
    </section>
  );
}
