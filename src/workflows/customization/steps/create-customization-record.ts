import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import { CUSTOMIZATION_MODULE } from "../../../modules/customization";
import CustomizationService from "../../../modules/customization/service";

interface PropertyInput {
  property_name: string;
  selected_value: string;
  custom_value?: string;
}

interface CreateCustomizationInput {
  product_id: string;
  variant_id: string;
  customer_id: string;
  image_url?: string;
  design_id?: string;
  customer_notes?: string;
  selected_properties: PropertyInput[];
}

export const createCustomizationStep = createStep(
  "create-customization-step",
  async (input: CreateCustomizationInput, { container }) => {
    const customizationModule: CustomizationService =
      container.resolve(CUSTOMIZATION_MODULE);

    // 1. Create the customization record
    const customization = await customizationModule.createCustomizations({
      product_id: input.product_id,
      variant_id: input.variant_id,
      customer_id: input.customer_id,
      image_url: input.image_url,
      design_id: input.design_id,
      customer_notes: input.customer_notes,
    });

    // 2. Create properties if any
    if (input.selected_properties?.length) {
      await customizationModule.createSelectedProperties(
        input.selected_properties.map((p) => ({
          ...p,
          customization_id: customization.id,
        })),
      );
    }

    return new StepResponse(customization, customization.id);
  },
  async (id: string, { container }) => {
    const customizationModule: CustomizationService =
      container.resolve(CUSTOMIZATION_MODULE);
    await customizationModule.deleteCustomizations(id);
  },
);
