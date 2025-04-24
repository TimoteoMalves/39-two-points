import { useQuery } from "@tanstack/react-query";
import axios from "axios";

type Language = {
  id: string;
  name: string;
};

export function useQueryGetLanguages() {
  const query = useQuery({
    queryKey: ["languages"],
    queryFn: async () => {
      const { data } = await axios.get("/api/languages");

      return data.response as Language[];
    },
  });

  return query;
}
