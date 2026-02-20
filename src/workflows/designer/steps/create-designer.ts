import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import { DESIGN_MODULE } from "../../../modules/design";
import DesignService from "../../../modules/design/service";

export const createDesignerStep = createStep(
  "create-designer-step",
  async (
    input: { user_id: string; bio?: string; portfolio_link?: string },
    { container },
  ) => {
    const designModule: DesignService = container.resolve(DESIGN_MODULE);
    const designer = await designModule.createDesigners([input]);
    return new StepResponse(designer[0], designer[0].id);
  },
  async (id: string, { container }) => {
    const designModule: DesignService = container.resolve(DESIGN_MODULE);
    await designModule.deleteDesigners([id]);
  },
);
