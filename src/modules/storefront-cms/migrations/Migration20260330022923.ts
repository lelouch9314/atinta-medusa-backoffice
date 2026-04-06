import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260330022923 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "hero_slide" add column if not exists "bg_color_to" text null;`);
    this.addSql(`alter table if exists "hero_slide" rename column "bg_gradient" to "bg_color_from";`);

    this.addSql(`alter table if exists "promo_banner" add column if not exists "bg_color_to" text null, add column if not exists "button_color" text null;`);
    this.addSql(`alter table if exists "promo_banner" rename column "bg_gradient" to "bg_color_from";`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "hero_slide" drop column if exists "bg_color_to";`);

    this.addSql(`alter table if exists "hero_slide" rename column "bg_color_from" to "bg_gradient";`);

    this.addSql(`alter table if exists "promo_banner" drop column if exists "bg_color_to", drop column if exists "button_color";`);

    this.addSql(`alter table if exists "promo_banner" rename column "bg_color_from" to "bg_gradient";`);
  }

}
