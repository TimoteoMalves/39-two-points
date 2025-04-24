import { Divider } from "@heroui/divider";

import { DeckInsert } from "@/components/deck-insert";
import { Deck } from "@/components/deck";

export default function Home() {
  return (
    <section className="flex flex-col gap-6">
      <div>
        <h1 className="text-4xl">Organizar decks</h1>
        <span className="text-lg">Crie, edite e revise seus decks</span>
      </div>
      <Divider />
      <div className="grid grid-cols-4 gap-6">
        <Deck />
        <DeckInsert />
      </div>
    </section>
  );
}
