import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import {
  updateCustomizationStep,
  UpdateCustomizationStepInput,
} from "./steps/update-customization";
import { emitEventStep } from "@medusajs/medusa/core-flows";

export const updateCustomizationWorkflow = createWorkflow(
  { name: "update-customization-workflow", store: true, retentionTime: 99999 },
  (input: UpdateCustomizationStepInput) => {
    const customizations = updateCustomizationStep(input);

    emitEventStep({
      eventName: "customization.status.updated",
      data: { id: customizations[0].id, status: customizations[0].status },
    });

    return new WorkflowResponse(customizations[0]);
  },
);
