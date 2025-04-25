import { createDeck, getDecks } from "@/lib/queries/deck";

export async function POST(req: Request) {
  const data = await req.json();

  await createDeck(data.name, data.languageId);

  return Response.json({
    message: "Deck created successfully",
    status: 201,
  });
}

export async function GET() {
  const response = await getDecks();

  return Response.json({
    response: response,
    status: 201,
  });
}
