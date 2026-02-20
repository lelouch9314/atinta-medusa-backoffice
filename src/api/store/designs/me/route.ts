import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { DESIGN_MODULE } from "../../../../modules/design";
import DesignService from "../../../../modules/design/service";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const designService: DesignService = req.scope.resolve(DESIGN_MODULE);

  // In a real scenario, we extract logged-in user ID from req.auth_context
  // For MVP/Demo, we might accept a query param or header 'x-designer-id'
  const designerId = (req.query.designer_id as string) || "anon";

  const designs = await designService.listDesigns({
    designer_id: designerId,
  });

  res.json({ designs });
};
