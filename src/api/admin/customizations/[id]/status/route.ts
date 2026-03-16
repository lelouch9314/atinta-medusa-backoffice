import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http";
import { updateCustomizationWorkflow } from "../../../../../workflows/customization/update-customization";
import { z } from "zod";

const schema = z.object({
  status: z.string(),
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
