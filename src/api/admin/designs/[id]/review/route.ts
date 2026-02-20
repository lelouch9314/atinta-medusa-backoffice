import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { reviewDesignWorkflow } from "../../../../../workflows/design/review-design";

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const { id } = req.params;
  const { status, moderation_notes } = req.body as any;

  const { result } = await reviewDesignWorkflow(req.scope).run({
    input: {
      id,
      status,
      moderation_notes,
    },
  });

  res.json({ design: result });
};
