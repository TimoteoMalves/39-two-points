import { NextRequest } from "next/server";

import { deleteDeck, updateDeck } from "@/lib/queries/deck";

export async function DELETE(req: NextRequest) {
  const url = new URL(req.url);
  const id = parseInt(url.pathname.split("/").pop() || "");

  if (isNaN(id)) {
    return Response.json({ message: "ID inválido" }, { status: 400 });
  }

  await deleteDeck(id);

  return Response.json(
    {
      message: "Deck deleted successfully",
    },
    { status: 200 }
  );
}

export async function PUT(req: NextRequest) {
  const url = new URL(req.url);
  const id = parseInt(url.pathname.split("/").pop() || "");

  if (isNaN(id)) {
    return Response.json({ message: "ID inválido" }, { status: 400 });
  }

  const data = await req.json();

  await updateDeck(id, data.name, data.languageId);

  return Response.json(
    {
      message: "Deck updated successfully",
    },
    { status: 200 }
  );
}
