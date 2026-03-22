import { logger } from "@medusajs/framework";
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const query = req.scope.resolve("query");

  const {
    data: customizations,
    metadata: { count, take, skip } = {
      count: 0,
      take: 20,
      skip: 0,
    },
  } = await query.graph({
    entity: "customization",
    ...req.queryConfig,
  });

  res.json({
    customizations,
    count,
    limit: take,
    offset: skip,
  });
};
