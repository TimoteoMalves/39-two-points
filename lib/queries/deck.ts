"use server";

import sql from "@/lib/db";

export async function getDecks() {
  const response =
    await sql`SELECT d.id, d.name, l.name as language, l.id as language_id
                              FROM deck d
                              INNER JOIN language l ON l.id = d.language_id`;

  return response;
}

export async function createDeck(name: string, languageId: number) {
  const response = await sql`INSERT INTO deck (name, language_id)
                              VALUES (${name}, ${languageId})`;

  return response;
}

export async function updateDeck(id: number, name: string, languageId: number) {
  const response = await sql`UPDATE deck
                              SET name = ${name}, language_id = ${languageId}
                              WHERE id = ${id}`;

  return response;
}

export async function deleteDeck(id: number) {
  const response = await sql`DELETE FROM deck WHERE id = ${id}`;

  return response;
}
