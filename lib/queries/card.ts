"use server";

import sql from "@/lib/db";

export async function getCards(deckId: number) {
  const response = await sql`SELECT id, front, back, grammar
                              FROM card
                              WHERE deck_id = ${deckId}`;

  return response;
}

export async function createCard(
  front: string,
  back: string,
  grammar: string[],
  deckId: number
) {
  const response = await sql`INSERT INTO card (front, back, grammar, deck_id)
                              VALUES (${front}, ${back}, ${sql.array(grammar)}, ${deckId})`;

  return response;
}

export async function updateCard(
  id: number,
  front: string,
  back: string,
  grammar: string[],
  deckId: number
) {
  const response = await sql`UPDATE card
                              SET front = ${front}, back = ${back}, grammar = ${sql.array(grammar)}, deck_id = ${deckId}
                              WHERE id = ${id}`;

  return response;
}

export async function deleteCard(id: number) {
  const response = await sql`DELETE FROM card WHERE id = ${id}`;

  return response;
}
