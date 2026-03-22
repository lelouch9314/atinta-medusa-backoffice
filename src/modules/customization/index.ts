import { Module } from "@medusajs/framework/utils";
import CustomizationService from "./service";
import { InferTypeOf } from "@medusajs/framework/types";
import { Customization } from "./models/customization";

export type CustomizationType = InferTypeOf<typeof Customization>;

export const CUSTOMIZATION_MODULE = "customization";

export default Module(CUSTOMIZATION_MODULE, {
  service: CustomizationService,
});
