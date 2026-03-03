import { useQuery } from "@tanstack/react-query";
import { sdk } from "../../../lib/sdk";
import { ProfessionalDesignRequest } from "../types";

const useDesignRequest = (id: string) => {
  return useQuery<ProfessionalDesignRequest>({
    queryKey: ["pro-designs-request", id],
    queryFn: () => sdk.client.fetch(`/admin/pro-designs-request/${id}`),
  });
};

export default useDesignRequest;
