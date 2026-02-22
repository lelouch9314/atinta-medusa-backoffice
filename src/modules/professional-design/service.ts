import { MedusaService } from "@medusajs/framework/utils";
import { ProfessionalDesignRequest } from "./models/professional-design-request";

export default class ProfessionalDesignModuleService extends MedusaService({
  ProfessionalDesignRequest,
}) {}
