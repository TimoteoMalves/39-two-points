import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

type CreateDeck = {
  name: string;
  languageId: number;
};

export function useMutationCreateDeck() {
  const mutation = useMutation({
    mutationFn: (data: CreateDeck) => axios.post("/api/deck", data),
  });

  return mutation;
}

export function useMutationUpdateDeck() {
  const mutation = useMutation({
    mutationFn: (data: CreateDeck & { id: number }) =>
      axios.put(`/api/deck/${data.id}`, {
        name: data.name,
        languageId: data.languageId,
      }),
  });

  return mutation;
}

export type Deck = {
  id: number;
  name: string;
  language: string;
  language_id: number;
};

export function useQueryGetDecks() {
  const query = useQuery({
    queryKey: ["decks"],
    queryFn: async () => {
      const { data } = await axios.get("/api/deck");

      return data.response as Deck[];
    },
  });

  return query;
}

export function useMutationDeleteDeck() {
  const mutation = useMutation({
    mutationFn: (id: number) => axios.delete(`/api/deck/${id}`),
  });

  return mutation;
}
