import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import { CUSTOMIZATION_MODULE } from "../../../modules/customization";
import CustomizationService from "../../../modules/customization/service";

export type UpdateCustomizationStepInput = {
  id: string;
  status?: string;
  admin_notes?: string | null;
}[];

export const updateCustomizationStep = createStep(
  "update-customization-step",
  async (input: UpdateCustomizationStepInput, { container }) => {
    const customizationModule: CustomizationService =
      container.resolve(CUSTOMIZATION_MODULE);

    const customizations = await customizationModule.updateCustomizations(
      input as any,
    );

    return new StepResponse(customizations, input);
  },
  async (prevData: UpdateCustomizationStepInput, { container }) => {
    // Revert logic if needed (requires fetching previous state first, which we didn't do)
    // For now, we skip detailed revert for status updates.
  },
);
