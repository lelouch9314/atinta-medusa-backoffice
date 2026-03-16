import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import {
  updateCustomizationStep,
  UpdateCustomizationStepInput,
} from "./steps/update-customization";

export const updateCustomizationWorkflow = createWorkflow(
  "update-customization-workflow",
  (input: UpdateCustomizationStepInput) => {
    const customizations = updateCustomizationStep(input);

    return new WorkflowResponse(customizations);
  },
);
