import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260329224759 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "hero_slide" ("id" text not null, "title" text not null, "subtitle" text null, "discount" text null, "description" text null, "image_url" text null, "button_text" text null, "button_link" text null, "bg_gradient" text null, "sort_order" integer not null default 0, "is_active" boolean not null default true, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "hero_slide_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_hero_slide_deleted_at" ON "hero_slide" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "promo_banner" ("id" text not null, "title" text not null, "subtitle" text null, "description" text null, "image_url" text null, "button_text" text null, "button_link" text null, "bg_gradient" text null, "text_color" text null, "accent_color" text null, "sort_order" integer not null default 0, "is_active" boolean not null default false, "layout" text check ("layout" in ('half', 'full')) not null default 'half', "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "promo_banner_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_promo_banner_deleted_at" ON "promo_banner" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "hero_slide" cascade;`);

    this.addSql(`drop table if exists "promo_banner" cascade;`);
  }

}
