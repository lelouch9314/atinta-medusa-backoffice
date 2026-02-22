import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http";
import { createProfessionalDesignRequestWorkflow } from "../../../workflows/pro-designs-request/create-professional-design-request";
import { PostStoreProfessionalDesignRequestSchema } from "./validators";
import { z } from "zod";

type PostStoreProfessionalDesignRequestReq = z.infer<
  typeof PostStoreProfessionalDesignRequestSchema
>;

export async function POST(
  req: AuthenticatedMedusaRequest<PostStoreProfessionalDesignRequestReq>,
  res: MedusaResponse,
) {
  const customerId = req.auth_context?.actor_id;

  const { result: request } = await createProfessionalDesignRequestWorkflow(
    req.scope,
  ).run({
    input: {
      ...req.validatedBody,
      customer_id: customerId as string,
    },
  });

  res.json({ professional_design_request: request });
}
