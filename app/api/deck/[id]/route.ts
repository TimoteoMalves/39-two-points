import { deleteDeck, updateDeck } from "@/lib/queries/deck";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);

  await deleteDeck(id);

  return Response.json({
    message: "Deck deleted successfully",
    status: 201,
  });
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const data = await req.json();
  const id = parseInt(params.id);

  await updateDeck(id, data.name, data.languageId);

  return Response.json({
    message: "Deck updated successfully",
    status: 201,
  });
}
