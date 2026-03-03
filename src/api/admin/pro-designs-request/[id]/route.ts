import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { ProfessionalDesignRequestModel } from "../../../../modules/professional-design/models/professional-design-request";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);
  const { id } = req.params;

  const { data } = await query.graph({
    entity: ProfessionalDesignRequestModel,
    fields: ["*", "customer.*"],
    filters: {
      id: [id],
    },
  });

  res.json(data[0]);
};
