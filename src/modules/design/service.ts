import { MedusaService } from "@medusajs/framework/utils";
import { Design, Designer } from "./models/design";

class DesignService extends MedusaService({
  Design,
  Designer,
}) {}

export default DesignService;
