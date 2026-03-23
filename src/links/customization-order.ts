import CustomizationModule from "../modules/customization";
import OrderModule from "@medusajs/medusa/order";
import { defineLink } from "@medusajs/framework/utils";

export default defineLink(CustomizationModule.linkable.customization, {
  linkable: OrderModule.linkable.order,
  isList: true,
});
