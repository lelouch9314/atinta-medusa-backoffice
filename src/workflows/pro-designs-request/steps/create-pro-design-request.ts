// We need to define the step as well
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import { CreateProfessionalDesignRequestInput } from "../create-professional-design-request";
import { PROFESSIONAL_DESIGN_MODULE } from "../../../modules/professional-design";

export const createProfessionalDesignRequestStep = createStep(
  "create-professional-design-request-step",
  async (input: CreateProfessionalDesignRequestInput, { container }) => {
    const service = container.resolve(PROFESSIONAL_DESIGN_MODULE) as any;
    const request = await service.createProfessionalDesignRequests(input);
    return new StepResponse(request, request.id);
  },
  async (id, { container }) => {
    const service = container.resolve(PROFESSIONAL_DESIGN_MODULE) as any;
    await service.deleteProfessionalDesignRequests(id);
  },
);
