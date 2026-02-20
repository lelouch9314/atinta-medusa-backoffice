import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import { updateDesignStatusStep } from "./steps/update-design-status";

interface ReviewDesignInput {
  id: string;
  status: "APPROVED" | "REJECTED";
  moderation_notes?: string;
}

export const reviewDesignWorkflow = createWorkflow(
  "review-design-workflow",
  (input: ReviewDesignInput) => {
    const updatedDesign = updateDesignStatusStep({
      id: input.id,
      status: input.status,
      moderation_notes: input.moderation_notes,
    });

    return new WorkflowResponse(updatedDesign);
  },
);
