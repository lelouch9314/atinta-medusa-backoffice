import { model } from "@medusajs/framework/utils";

export const Design = model.define("design", {
  id: model.id().primaryKey(),
  title: model.text(),
  description: model.text().nullable(),
  image_url: model.text(),
  status: model
    .enum(["DRAFT", "PENDING_REVIEW", "APPROVED", "REJECTED", "ARCHIVED"])
    .default("DRAFT"),
  score: model.number().default(0),
  moderation_notes: model.text().nullable(),
  designer: model.belongsTo(() => Designer, { mappedBy: "designs" }),
});

export const Designer = model.define("designer", {
  id: model.id().primaryKey(),
  user_id: model.text().unique(), // Link to Medusa User/Customer ID
  bio: model.text().nullable(),
  portfolio_link: model.text().nullable(),
  is_verified: model.boolean().default(false),
  designs: model.hasMany(() => Design, { mappedBy: "designer" }),
});
