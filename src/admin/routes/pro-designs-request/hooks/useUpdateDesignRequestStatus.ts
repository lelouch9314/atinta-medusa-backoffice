import { toast } from "@medusajs/ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sdk } from "../../../lib/sdk";

export const useUpdateDesignRequestStatus = () => {
  return useMutation({
    mutationFn: ({
      ids,
      status,
    }: {
      ids: string[];
      status: "completed" | "cancelled" | "processing" | "pending";
    }) =>
      sdk.client.fetch("/admin/pro-designs-request/status", {
        method: "POST",
        body: {
          ids: ids,
          status,
        },
      }),
    onError: () => {
      toast.error("Failed to update request status");
    },
    onSuccess: () => {
      toast.success("Request status updated successfully");
    },
  });
};
