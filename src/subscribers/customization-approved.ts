import { logger, SubscriberArgs, SubscriberConfig } from "@medusajs/framework";
import {
  CUSTOMIZATION_MODULE,
  CustomizationType,
} from "../modules/customization";
import { approveCustomizationWorkflow } from "../workflows/customization/approve-customization";

export default async function customerGroupHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string; status: CustomizationType["status"] }>) {
  logger.info("CUSTOMIZATION APPROVED: " + data);

  const customizationModuleService = container.resolve(CUSTOMIZATION_MODULE);

  const customization = await customizationModuleService.retrieveCustomization(
    data.id,
  );

  if (data.status === "APPROVED") {
    await approveCustomizationWorkflow(container).run({
      input: {
        id: customization.id,
        variant_id: customization.variant_id,
        customer_id: customization.customer_id,
      },
    });
  }
}

export const config: SubscriberConfig = {
  event: "customization.status.updated",
};
