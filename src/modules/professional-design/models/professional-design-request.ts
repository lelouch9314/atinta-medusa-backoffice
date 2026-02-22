import { model } from "@medusajs/framework/utils";

export const ProfessionalDesignRequestModel = "professional_design_request";

export const ProfessionalDesignRequest = model.define(
  ProfessionalDesignRequestModel,
  {
    id: model.id().primaryKey(),
    company_name: model.text(),
    industry: model.text(),
    description: model.text(),
    accent_colors: model.text().nullable(),
    style: model.text().nullable(),
    contact_name: model.text(),
    contact_email: model.text(),
    contact_phone: model.text().nullable(),
    customer_id: model.text(),
    status: model
      .enum(["pending", "processing", "completed", "cancelled"])
      .default("pending"),
  },
);
