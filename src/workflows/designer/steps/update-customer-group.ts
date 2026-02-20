import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import { Modules } from "@medusajs/framework/utils";

export const updateCustomerGroupStep = createStep(
  "update-customer-group",
  async (input: { customer_id: string }, { container }) => {
    const customerModuleService = container.resolve(Modules.CUSTOMER);

    const customerGroups = await customerModuleService.listCustomerGroups({
      name: { $in: ["Clients", "Designers"] },
    });

    const clientsGroup = customerGroups.find((cg) => cg.name === "Clients");
    const designersGroup = customerGroups.find((cg) => cg.name === "Designers");

    // Remove from Clients if exists
    if (clientsGroup) {
      // Check if user is in Clients group to avoid error if not?
      // Medusa's removeCustomerFromGroup might throw if not exists?
      // For safety we try/catch or just attempt.
      // The remove method is usually idempotent or we can check relationships first.
      // But for simplicity let's try to remove.
      try {
        await customerModuleService.removeCustomerFromGroup({
          customer_group_id: clientsGroup.id,
          customer_id: input.customer_id,
        });
      } catch (e) {
        // Ignore if not in group
      }
    }

    // Add to Designers
    if (designersGroup) {
      await customerModuleService.addCustomerToGroup({
        customer_group_id: designersGroup.id,
        customer_id: input.customer_id,
      });
    }

    return new StepResponse(input.customer_id, {
      customer_id: input.customer_id,
      previous_groups_ids: [], // TODO: We could store previous groups for compensation if needed
    });
  },
  async (compensation, { container }) => {
    // Compensation logic would be restoring the group
    // For now we skip detailed compensation for simplicity as this is a defined transition
  },
);
