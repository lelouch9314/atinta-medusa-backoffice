import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http";
import { z } from "zod";
import { updateCustomizationWorkflow } from "../../../../../workflows/customization/update-customization";

const schema = z.object({
  status: z.enum([
    "DRAFT",
    "PENDING",
    "APPROVED",
    "REJECTED",
    "ORDERED",
    "IN_PRODUCTION",
    "COMPLETED",
    "CANCELLED",
  ]),
});

export const POST = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse,
) => {
  const { id } = req.params;
  const { status } = schema.parse(req.body);

  const { result } = await updateCustomizationWorkflow(req.scope).run({
    input: [
      {
        id,
        status: status as any,
      },
    ],
  });

  res.json({ customization: result[0] });
};
