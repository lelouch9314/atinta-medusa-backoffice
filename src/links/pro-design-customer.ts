import { defineLink } from "@medusajs/framework/utils";
import CustomerModule from "@medusajs/medusa/customer";
import ProfessionalDesignModule from "../modules/professional-design";

export default defineLink(
  {
    linkable: ProfessionalDesignModule.linkable.professionalDesignRequest,
    field: "customer_id",
    isList: false,
  },
  CustomerModule.linkable.customer,
  {
    readOnly: true,
  },
);
