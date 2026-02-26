import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import { DESIGN_MODULE } from "../../../modules/design";
import DesignService from "../../../modules/design/service";

interface CreateDesignInput {
  title: string;
  description?: string;
  promotional_images?: string[];
  design_images: string[];
  metadata?: Record<string, any>;
  designer_id: string;
}

export const createDesignStep = createStep(
  "create-design-step",
  async (input: CreateDesignInput, { container }) => {
    const designModule: DesignService = container.resolve(DESIGN_MODULE);

    // Assume the 'create' method exists on the service (standard DML service)
    const design = await designModule.createDesigns(input as any);

    return new StepResponse(design, design.id);
  },
  async (designId: string, { container }) => {
    const designModule: DesignService = container.resolve(DESIGN_MODULE);
    await designModule.deleteDesigns(designId);
  },
);
