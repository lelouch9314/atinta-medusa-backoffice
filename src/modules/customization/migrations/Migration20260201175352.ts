import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260201175352 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "customization" ("id" text not null, "customer_notes" text null, "status" text check ("status" in ('DRAFT', 'ORDERED', 'IN_PRODUCTION', 'COMPLETED', 'CANCELLED')) not null default 'DRAFT', "product_id" text not null, "design_id" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "customization_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_customization_deleted_at" ON "customization" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "selected_property" ("id" text not null, "property_name" text not null, "selected_value" text not null, "custom_value" text null, "customization_id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "selected_property_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_selected_property_customization_id" ON "selected_property" ("customization_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_selected_property_deleted_at" ON "selected_property" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`alter table if exists "selected_property" add constraint "selected_property_customization_id_foreign" foreign key ("customization_id") references "customization" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "selected_property" drop constraint if exists "selected_property_customization_id_foreign";`);

    this.addSql(`drop table if exists "customization" cascade;`);

    this.addSql(`drop table if exists "selected_property" cascade;`);
  }

}
