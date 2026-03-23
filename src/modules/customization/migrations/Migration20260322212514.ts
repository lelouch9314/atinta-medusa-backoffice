import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260322212514 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "customization" add column if not exists "admin_notes" text null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "customization" drop column if exists "admin_notes";`);
  }

}
