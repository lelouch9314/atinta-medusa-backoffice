import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework";
import CustomizationService from "../../../../modules/customization/service";
import { CUSTOMIZATION_MODULE } from "../../../../modules/customization";

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse,
) => {
  const { id } = req.params;
  const customizationModule: CustomizationService =
    req.scope.resolve(CUSTOMIZATION_MODULE);

  const customization = await customizationModule.retrieveCustomization(id);

  res.json({ customization });
};
