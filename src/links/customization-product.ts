import { defineLink } from "@medusajs/framework/utils";
import ProductModule from "@medusajs/medusa/product";
import CustomizationModule from "../modules/customization";

export default defineLink(
  {
    linkable: CustomizationModule.linkable.customization,
    field: "product_id",
    isList: false,
  },
  ProductModule.linkable.product,
  {
    readOnly: true,
  },
);
