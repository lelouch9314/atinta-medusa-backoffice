import { model } from "@medusajs/framework/utils";

export const PromoBanner = model.define("promo_banner", {
  id: model.id().primaryKey(),
  title: model.text(),
  subtitle: model.text().nullable(),
  description: model.text().nullable(),
  image_url: model.text().nullable(),
  button_text: model.text().nullable(),
  button_link: model.text().nullable(),
  bg_color_from: model.text().nullable(),
  bg_color_to: model.text().nullable(),
  text_color: model.text().nullable(),
  accent_color: model.text().nullable(),
  button_color: model.text().nullable(),
  sort_order: model.number().default(0),
  is_active: model.boolean().default(false),
  layout: model.enum(["half", "full"]).default("half"),
});
