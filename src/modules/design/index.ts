import { Module } from "@medusajs/framework/utils";
import DesignService from "./service";

export const DESIGN_MODULE = "design";

export default Module(DESIGN_MODULE, {
  service: DesignService,
});
