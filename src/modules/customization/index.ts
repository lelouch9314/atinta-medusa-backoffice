import { Module } from "@medusajs/framework/utils";
import CustomizationService from "./service";

export const CUSTOMIZATION_MODULE = "customization";

export default Module(CUSTOMIZATION_MODULE, {
  service: CustomizationService,
});
