import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260222233025 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "professional_design_request" ("id" text not null, "company_name" text not null, "industry" text not null, "description" text not null, "accent_colors" text null, "style" text null, "contact_name" text not null, "contact_email" text not null, "contact_phone" text null, "customer_id" text not null, "status" text check ("status" in ('pending', 'processing', 'completed', 'cancelled')) not null default 'pending', "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "professional_design_request_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_professional_design_request_deleted_at" ON "professional_design_request" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "professional_design_request" cascade;`);
  }

}
