import {
  ArrowUturnLeft,
  CodeCompare,
  ImageSparkle,
  ThumbUp,
  XCircle,
} from "@medusajs/icons";
import { Button, toast } from "@medusajs/ui";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { useUpdateDesignRequestStatus } from "../hooks/useUpdateDesignRequestStatus";

const ActionButtons = ({
  id,
  status,
  queryKey,
}: {
  id: string;
  status: string;
  queryKey: Array<string | number>;
}) => {
  const { mutate, isPending } = useUpdateDesignRequestStatus();
  const queryClient = useQueryClient();

  const onSuccess = useCallback(() => {
    queryClient.invalidateQueries({ queryKey });
  }, [queryClient, queryKey]);

  return (
    <div className="flex items-center gap-2">
      {status === "pending" && (
        <Button
          onClick={() =>
            mutate({ ids: [id], status: "processing" }, { onSuccess })
          }
          disabled={isPending}
        >
          <ThumbUp /> Approve
        </Button>
      )}
      {status === "processing" && (
        <>
          <Button
            onClick={() =>
              mutate({ ids: [id], status: "completed" }, { onSuccess })
            }
            disabled={isPending}
          >
            <ImageSparkle /> Complete
          </Button>
          <Button
            onClick={() =>
              mutate({ ids: [id], status: "pending" }, { onSuccess })
            }
            disabled={isPending}
          >
            <ArrowUturnLeft /> Cancel
          </Button>
        </>
      )}
      {status !== "cancelled" ? (
        <Button
          onClick={() =>
            mutate({ ids: [id], status: "cancelled" }, { onSuccess })
          }
          disabled={isPending}
        >
          <XCircle /> Reject
        </Button>
      ) : (
        <Button
          onClick={() =>
            mutate({ ids: [id], status: "pending" }, { onSuccess })
          }
          disabled={isPending}
        >
          <CodeCompare /> Reactivate
        </Button>
      )}
    </div>
  );
};

export default ActionButtons;
