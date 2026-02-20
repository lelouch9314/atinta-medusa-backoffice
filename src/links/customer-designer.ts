import DesignModule from "../modules/design";
import CustomerModule from "@medusajs/medusa/customer";
import { defineLink } from "@medusajs/framework/utils";

export default defineLink(
  CustomerModule.linkable.customer,
  DesignModule.linkable.designer,
);
