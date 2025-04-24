import { getLanguages } from "@/lib/queries/language";

export async function GET() {
  const response = await getLanguages();

  return Response.json({
    response: response,
    status: 201,
  });
}
