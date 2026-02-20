import { SubscriberArgs, SubscriberConfig } from "@medusajs/framework";
import { Modules } from "@medusajs/framework/utils";
import { ICustomerModuleService } from "@medusajs/framework/types";

export default async function customerGroupHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const customerModuleService: ICustomerModuleService = container.resolve(
    Modules.CUSTOMER,
  );

  const customerGroups = await customerModuleService.listCustomerGroups({
    name: { $in: ["Clients"] },
  });

  if (customerGroups.length) {
    const clientsGroup = customerGroups[0];
    await customerModuleService.addCustomerToGroup({
      customer_group_id: clientsGroup.id,
      customer_id: data.id,
    });
  }
}

export const config: SubscriberConfig = {
  event: "customer.created",
};
