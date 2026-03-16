import { CheckCircle, XCircle } from "@medusajs/icons";
import { Button, toast } from "@medusajs/ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sdk } from "../../../lib/sdk";

type ActionButtonsProps = {
  id: string;
  status: string;
  queryKey: any[];
};

export default function ActionButtons({
  id,
  status,
  queryKey,
}: ActionButtonsProps) {
  const queryClient = useQueryClient();

  const { mutate: updateStatus, isPending } = useMutation({
    mutationFn: (newStatus: string) =>
      sdk.client.fetch(`/admin/customizations/${id}/status`, {
        method: "POST",
        body: { status: newStatus },
      }),
    onSuccess: () => {
      toast.success("Estado actualizado exitosamente");
      queryClient.invalidateQueries({ queryKey });
    },
    onError: () => {
      toast.error("Error al actualizar el estado");
    },
  });

  if (status !== "PENDING" && status !== "pending") {
    return null;
  }

  return (
    <div className="flex items-center gap-x-2">
      <Button
        variant="secondary"
        size="small"
        onClick={() => updateStatus("APPROVED")}
        disabled={isPending}
      >
        <CheckCircle className="text-green-500" /> Aprobar
      </Button>
      <Button
        variant="secondary"
        size="small"
        onClick={() => updateStatus("REJECTED")}
        disabled={isPending}
      >
        <XCircle className="text-red-500" /> Rechazar
      </Button>
    </div>
  );
}
