import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import { createCustomizationStep } from "./steps/create-customization-record";

interface CreateCustomizationWorkflowInput {
  product_id: string;
  design_id?: string;
  customer_notes?: string;
  selected_properties: {
    property_name: string;
    selected_value: string;
    custom_value?: string;
  }[];
}

export const createCustomizationWorkflow = createWorkflow(
  "create-customization-workflow",
  (input: CreateCustomizationWorkflowInput) => {
    // 1. (Optional) Validate Design Status is APPROVED (Need a step for this)
    // For MVP, we skip validation or assume frontend checked.

    // 2. Create the customization record
    const customization = createCustomizationStep(input);

    return new WorkflowResponse(customization);
  },
);
