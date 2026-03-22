import { defineLink } from "@medusajs/framework/utils";
import CustomerModule from "@medusajs/medusa/customer";
import CustomizationModule from "../modules/customization";

export default defineLink(
  {
    linkable: CustomizationModule.linkable.customization,
    field: "customer_id",
    isList: false,
  },
  CustomerModule.linkable.customer,
  {
    readOnly: true,
  },
);
