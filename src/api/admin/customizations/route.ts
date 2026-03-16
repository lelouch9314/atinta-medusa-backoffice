import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { CUSTOMIZATION_MODULE } from "../../../modules/customization";
import CustomizationService from "../../../modules/customization/service";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const customizationModule: CustomizationService =
    req.scope.resolve(CUSTOMIZATION_MODULE);

  const [customizations, count] =
    await customizationModule.listAndCountCustomizations(
      {},
      {
        relations: ["selected_properties"],
        take: req.query.limit ? Number(req.query.limit) : 20,
        skip: req.query.offset ? Number(req.query.offset) : 0,
        order: { created_at: "DESC" },
      },
    );

  res.json({
    customizations,
    count,
    limit: req.query.limit,
    offset: req.query.offset,
  });
};
