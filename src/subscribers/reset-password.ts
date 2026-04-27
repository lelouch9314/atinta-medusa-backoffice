import { SubscriberArgs, SubscriberConfig } from "@medusajs/framework";
import { Modules } from "@medusajs/framework/utils";
import { logger } from "@medusajs/framework";

export default async function resetPasswordTokenHandler({
  event: {
    data: { entity_id: email, token, actor_type },
  },
  container,
}: SubscriberArgs<{
  entity_id: string;
  token: string;
  actor_type: string;
}>) {
  const notificationModuleService = container.resolve(Modules.NOTIFICATION);

  const urlPrefix =
    process.env.STOREFRONT_URL?.split(",")?.[0]?.trim() ||
    "http://localhost:3000";

  const resetUrl = `${urlPrefix}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;

  logger.info(`[RESET PASSWORD] ${actor_type}: ${email}`);
  logger.info(`[RESET PASSWORD] URL: ${resetUrl}`);

  await notificationModuleService.createNotifications({
    to: email,
    channel: "email",
    template: "password-reset",
    data: {
      reset_url: resetUrl,
      email,
    },
  });
}

export const config: SubscriberConfig = {
  event: "auth.password_reset",
};
