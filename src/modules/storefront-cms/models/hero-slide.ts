import { model } from "@medusajs/framework/utils";

export const HeroSlide = model.define("hero_slide", {
  id: model.id().primaryKey(),
  title: model.text(),
  subtitle: model.text().nullable(),
  discount: model.text().nullable(),
  description: model.text().nullable(),
  image_url: model.text().nullable(),
  button_text: model.text().nullable(),
  button_link: model.text().nullable(),
  bg_gradient: model.text().nullable(),
  sort_order: model.number().default(0),
  is_active: model.boolean().default(true),
});
