import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { createFindParams } from "@medusajs/medusa/api/utils/validators";
import { ProfessionalDesignRequestModel } from "../../../modules/professional-design/models/professional-design-request";

export const GetAdminProDesignsRequestSchema = createFindParams();

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const query = req.scope.resolve("query");

  const {
    data: requests,
    metadata: { count, take, skip } = {
      count: 0,
      take: 20,
      skip: 0,
    },
  } = await query.graph({
    entity: ProfessionalDesignRequestModel,
    ...req.queryConfig,
  });

  res.json({
    requests,
    count,
    limit: take,
    offset: skip,
  });
};
