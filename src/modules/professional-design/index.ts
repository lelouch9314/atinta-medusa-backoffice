import { Module } from "@medusajs/framework/utils";
import ProfessionalDesignModuleService from "./service";

export const PROFESSIONAL_DESIGN_MODULE = "professionalDesign";

export default Module(PROFESSIONAL_DESIGN_MODULE, {
  service: ProfessionalDesignModuleService,
});
