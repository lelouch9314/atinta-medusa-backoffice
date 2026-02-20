import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { createCustomizationWorkflow } from "../../../workflows/customization/create-customization";

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const input = req.body as any;

  const { result } = await createCustomizationWorkflow(req.scope).run({
    input: {
      ...input,
    },
  });

  res.json({ customization: result });
};
