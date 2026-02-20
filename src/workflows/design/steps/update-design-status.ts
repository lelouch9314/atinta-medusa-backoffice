import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import { DESIGN_MODULE } from "../../../modules/design";
import DesignService from "../../../modules/design/service";

interface UpdateDesignStatusInput {
  id: string;
  status: "APPROVED" | "REJECTED" | "PENDING_REVIEW" | "ARCHIVED";
  moderation_notes?: string;
}

export const updateDesignStatusStep = createStep(
  "update-design-status-step",
  async (input: UpdateDesignStatusInput, { container }) => {
    const designModule: DesignService = container.resolve(DESIGN_MODULE);

    // @ts-ignore
    const previousString = await designModule.retrieveDesign(input.id);
    const previous = previousString
      ? JSON.parse(JSON.stringify(previousString))
      : {};

    const updated = await designModule.updateDesigns({
      id: input.id,
      status: input.status,
      moderation_notes: input.moderation_notes,
    });

    return new StepResponse(updated, { id: input.id, previousData: previous });
  },
  async (rollbackData: any, { container }) => {
    const designModule: DesignService = container.resolve(DESIGN_MODULE);
    if (rollbackData && rollbackData.previousData) {
      await designModule.updateDesigns(rollbackData.previousData);
    }
  },
);
