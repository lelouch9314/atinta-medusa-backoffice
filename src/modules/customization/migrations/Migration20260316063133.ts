import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260316063133 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "customization" drop constraint if exists "customization_status_check";`);

    this.addSql(`alter table if exists "customization" add column if not exists "variant_id" text not null, add column if not exists "image_url" text null, add column if not exists "customer_id" text not null;`);
    this.addSql(`alter table if exists "customization" alter column "status" drop default;`);
    this.addSql(`alter table if exists "customization" alter column "status" drop not null;`);
    this.addSql(`alter table if exists "customization" alter column "status" type text using ("status"::text);`);
    this.addSql(`alter table if exists "customization" alter column "status" set default 'PENDING';`);
    this.addSql(`alter table if exists "customization" add constraint "customization_status_check" check("status" in ('DRAFT', 'PENDING', 'APPROVED', 'REJECTED', 'ORDERED', 'IN_PRODUCTION', 'COMPLETED', 'CANCELLED'));`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "customization" drop constraint if exists "customization_status_check";`);

    this.addSql(`alter table if exists "customization" drop column if exists "variant_id", drop column if exists "image_url", drop column if exists "customer_id";`);

    this.addSql(`alter table if exists "customization" alter column "status" drop default;`);
    this.addSql(`alter table if exists "customization" alter column "status" drop not null;`);
    this.addSql(`alter table if exists "customization" alter column "status" type text using ("status"::text);`);
    this.addSql(`alter table if exists "customization" alter column "status" set default 'DRAFT';`);
    this.addSql(`alter table if exists "customization" add constraint "customization_status_check" check("status" in ('DRAFT', 'ORDERED', 'IN_PRODUCTION', 'COMPLETED', 'CANCELLED'));`);
  }

}
