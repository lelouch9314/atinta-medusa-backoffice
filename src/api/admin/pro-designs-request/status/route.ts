import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { z } from "@medusajs/framework/zod";
import { updateProDesignRequestWorkflow } from "../../../../workflows/pro-designs-request/update-professional-design-request";

export const PostAdminUpdateProDesignRequestStatusSchema = z.object({
  ids: z.array(z.string()),
  status: z.enum(["pending", "processing", "completed", "cancelled"]),
});

export async function POST(
  req: MedusaRequest<
    z.infer<typeof PostAdminUpdateProDesignRequestStatusSchema>
  >,
  res: MedusaResponse,
) {
  const { ids, status } = req.validatedBody;

  const { result } = await updateProDesignRequestWorkflow(req.scope).run({
    input: ids.map((id) => ({
      id,
      status,
    })),
  });

  res.json(result);
}
