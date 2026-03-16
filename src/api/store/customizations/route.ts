import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http";
import { createCustomizationWorkflow } from "../../../workflows/customization/create-customization";

export const POST = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse,
) => {
  const input = req.body as any;

  const { result } = await createCustomizationWorkflow(req.scope).run({
    input: {
      ...input,
      customer_id: req.auth_context?.actor_id,
    },
  });

  res.json({ customization: result });
};
