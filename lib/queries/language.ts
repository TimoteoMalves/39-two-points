"use server";

import sql from "@/lib/db";

export async function getLanguages() {
  const response = await sql`SELECT id, name FROM language`;

  return response;
}
