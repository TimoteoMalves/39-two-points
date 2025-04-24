import { useMutation } from "@tanstack/react-query";
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
