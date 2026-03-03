import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import { PROFESSIONAL_DESIGN_MODULE } from "../../../modules/professional-design";
export type UpdateProDesignRequestStepInput = {
  id: string;
  status: "pending" | "processing" | "completed" | "cancelled";
}[];

export const updateProDesignRequestStep = createStep(
  "update-pro-design-request-step",
  async (input: UpdateProDesignRequestStepInput, { container }) => {
    const service = container.resolve(PROFESSIONAL_DESIGN_MODULE);

    // Get original review before update
    const originalRequest = await service.listProfessionalDesignRequests({
      id: input.map((request) => request.id),
    });

    const requests = await service.updateProfessionalDesignRequests(input);

    return new StepResponse(requests, originalRequest);
  },
  async (originalData, { container }) => {
    if (!originalData) {
      return;
    }

    const service = container.resolve(PROFESSIONAL_DESIGN_MODULE);

    // Restore original review status
    await service.updateProfessionalDesignRequests(originalData);
  },
);
