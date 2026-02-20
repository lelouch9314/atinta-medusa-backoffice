import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { submitDesignWorkflow } from "../../../workflows/design/submit-design";
import { DESIGN_MODULE } from "../../../modules/design";
import DesignService from "../../../modules/design/service";

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const { title, description, files, designer_id } = req.body as any;

  const { result } = await submitDesignWorkflow(req.scope).run({
    input: {
      title,
      description,
      files,
      designer_id: designer_id || "anon", // Should be auth user ID
    },
  });

  res.json({ design: result });
};

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const designService: DesignService = req.scope.resolve(DESIGN_MODULE);

  // List only approved designs for valid storefront view
  const designs = await designService.listDesigns({
    status: "APPROVED",
  });

  res.json({ designs });
};
