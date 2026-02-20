import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260201175335 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "designer" drop constraint if exists "designer_user_id_unique";`);
    this.addSql(`create table if not exists "designer" ("id" text not null, "user_id" text not null, "bio" text null, "portfolio_link" text null, "is_verified" boolean not null default false, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "designer_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_designer_user_id_unique" ON "designer" ("user_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_designer_deleted_at" ON "designer" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "design" ("id" text not null, "title" text not null, "description" text null, "image_url" text not null, "status" text check ("status" in ('DRAFT', 'PENDING_REVIEW', 'APPROVED', 'REJECTED', 'ARCHIVED')) not null default 'DRAFT', "score" integer not null default 0, "moderation_notes" text null, "designer_id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "design_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_design_designer_id" ON "design" ("designer_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_design_deleted_at" ON "design" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`alter table if exists "design" add constraint "design_designer_id_foreign" foreign key ("designer_id") references "designer" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "design" drop constraint if exists "design_designer_id_foreign";`);

    this.addSql(`drop table if exists "designer" cascade;`);

    this.addSql(`drop table if exists "design" cascade;`);
  }

}
