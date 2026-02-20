import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { DESIGN_MODULE } from "../../../modules/design";
import DesignService from "../../../modules/design/service";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const designService: DesignService = req.scope.resolve(DESIGN_MODULE);
  const filters: any = {};

  if (req.query.status) {
    filters.status = req.query.status;
  }

  const designs = await designService.listDesigns(filters);
  res.json({ designs });
};
