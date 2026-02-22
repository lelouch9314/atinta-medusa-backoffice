import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import { PROFESSIONAL_DESIGN_MODULE } from "../../modules/professional-design";
import { createProfessionalDesignRequestStep } from "./steps/create-pro-design-request";

export type CreateProfessionalDesignRequestInput = {
  company_name: string;
  industry: string;
  description: string;
  accent_colors?: string;
  style?: string;
  contact_name: string;
  contact_email: string;
  contact_phone?: string;
  customer_id: string;
};

export const createProfessionalDesignRequestWorkflow = createWorkflow(
  "create-professional-design-request",
  (input: CreateProfessionalDesignRequestInput) => {
    const service = PROFESSIONAL_DESIGN_MODULE;

    // @ts-ignore - Medusa v2 dynamic service resolution
    const request = createProfessionalDesignRequestStep(input);

    return new WorkflowResponse(request);
  },
);
