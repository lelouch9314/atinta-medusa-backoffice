import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260226201420 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "design" drop column if exists "image_url";`);

    this.addSql(`alter table if exists "design" add column if not exists "promotional_images" jsonb null, add column if not exists "design_images" jsonb not null, add column if not exists "metadata" jsonb null;`);
    this.addSql(`alter table if exists "design" alter column "status" drop default;`);
    this.addSql(`alter table if exists "design" alter column "status" drop not null;`);
    this.addSql(`alter table if exists "design" alter column "status" type text using ("status"::text);`);
    this.addSql(`alter table if exists "design" alter column "status" set default 'PENDING_REVIEW';`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "design" drop column if exists "promotional_images", drop column if exists "design_images", drop column if exists "metadata";`);

    this.addSql(`alter table if exists "design" add column if not exists "image_url" text not null;`);
    this.addSql(`alter table if exists "design" alter column "status" drop default;`);
    this.addSql(`alter table if exists "design" alter column "status" drop not null;`);
    this.addSql(`alter table if exists "design" alter column "status" type text using ("status"::text);`);
    this.addSql(`alter table if exists "design" alter column "status" set default 'DRAFT';`);
  }

}
