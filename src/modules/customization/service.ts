import { MedusaService } from "@medusajs/framework/utils";
import { Customization, SelectedProperty } from "./models/customization";

class CustomizationService extends MedusaService({
  Customization,
  SelectedProperty,
}) {}

export default CustomizationService;
