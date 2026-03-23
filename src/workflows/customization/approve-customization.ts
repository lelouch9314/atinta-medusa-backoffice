import { Modules } from "@medusajs/framework/utils";
import {
  createStep,
  createWorkflow,
  StepResponse,
  transform,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import {
  createOrderWorkflow,
  createRemoteLinkStep,
} from "@medusajs/medusa/core-flows";
import { CUSTOMIZATION_MODULE } from "../../modules/customization";

export const getInputsStep = createStep(
  "get-draft-order-values",
  async (
    data: { customizationId: string; variantId: string; customerId: string },
    { container },
  ) => {
    const customerModuleService = container.resolve(Modules.CUSTOMER);
    const productModuleService = container.resolve(Modules.PRODUCT);
    const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL);
    const regionModuleService = container.resolve(Modules.REGION);

    const customer = await customerModuleService.retrieveCustomer(
      data.customerId,
    );
    const variant = await productModuleService.retrieveProductVariant(
      data.variantId,
    );

    // Fallback to 0 if price calculation is complex in v2 without context.
    // Admin can update the draft order price before sending to customer.

    const salesChannels = await salesChannelModuleService.listSalesChannels({});
    const region = await regionModuleService.listRegions({});
    const salesChannelId = salesChannels[0]?.id;
    const regionId = region[0]?.id;

    let unitPrice = 10;

    return new StepResponse(
      { salesChannelId, regionId, unitPrice, customer, variant },
      {},
    );
  },
);

export const approveCustomizationWorkflow = createWorkflow(
  { name: "approve-customization", retentionTime: 99999, store: true },
  (input: { id: string; variant_id: string; customer_id: string }) => {
    const { customer, regionId, salesChannelId, unitPrice, variant } =
      getInputsStep({
        customizationId: input.id,
        variantId: input.variant_id,
        customerId: input.customer_id,
      });

    const draftOrdersInputs = transform(
      { customer, regionId, salesChannelId, unitPrice, variant },
      (data) => {
        console.log("DEGUB", data);
        return {
          currency_code: "usd",
          email: data.customer.email,
          customer_id: data.customer.id,
          sales_channel_id: data.salesChannelId,
          region_id: data.regionId,
          items: [
            {
              variant_id: data.variant.id,
              title: data.variant.title,
              quantity: 1,
              unit_price: data.unitPrice,
              // thumbnail: variant.thumbnail ?? "",
            },
          ],
          status: "draft",
        };
      },
    );

    const draftOrder = createOrderWorkflow.runAsStep({
      input: draftOrdersInputs,
    });

    const draftOrderId = transform({ draftOrder }, (data) => {
      console.log("DEBUG", data.draftOrder);
      return data.draftOrder.id;
    });

    createRemoteLinkStep([
      {
        [CUSTOMIZATION_MODULE]: {
          customization_id: input.id,
        },
        [Modules.ORDER]: {
          order_id: draftOrderId,
        },
      },
    ]);

    return new WorkflowResponse(draftOrder);
  },
);
