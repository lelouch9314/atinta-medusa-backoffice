import { model } from "@medusajs/framework/utils";

export const Customization = model.define("customization", {
  id: model.id().primaryKey(),
  customer_notes: model.text().nullable(),
  status: model
    .enum(["DRAFT", "ORDERED", "IN_PRODUCTION", "COMPLETED", "CANCELLED"])
    .default("DRAFT"),
  product_id: model.text(), // Link to Medusa Product ID (Base Material)
  design_id: model.text().nullable(), // Link to our Design Module ID
  selected_properties: model.hasMany(() => SelectedProperty, {
    mappedBy: "customization",
  }),
});

export const SelectedProperty = model.define("selected_property", {
  id: model.id().primaryKey(),
  property_name: model.text(),
  selected_value: model.text(),
  custom_value: model.text().nullable(),
  customization: model.belongsTo(() => Customization, {
    mappedBy: "selected_properties",
  }),
});
