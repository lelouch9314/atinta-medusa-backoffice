import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import { updateProDesignRequestStep } from "./steps/update-pro-design-request";

export type UpdateProDesignRequestInput = {
  id: string;
  status: "pending" | "processing" | "completed" | "cancelled";
}[];

export const updateProDesignRequestWorkflow = createWorkflow(
  "update-pro-design-request",
  (input: UpdateProDesignRequestInput) => {
    // @ts-ignore - Medusa v2 dynamic service resolution
    const request = updateProDesignRequestStep(input);

    return new WorkflowResponse(request);
  },
);
