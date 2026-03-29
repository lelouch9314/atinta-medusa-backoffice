import { Modules } from "@medusajs/framework/utils";
import {
  createStep,
  createWorkflow,
  StepResponse,
  transform,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import {
  acquireLockStep,
  addDraftOrderItemsWorkflow,
  addDraftOrderShippingMethodsWorkflow,
  addOrderLineItemsWorkflow,
  confirmDraftOrderEditWorkflow,
  convertDraftOrderWorkflow,
  createOrderChangeWorkflow,
  createOrderWorkflow,
  CreateOrderWorkflowInput,
  createRemoteLinkStep,
  getVariantPriceSetsStep,
  releaseLockStep,
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
    const locationModuleService = container.resolve(Modules.STOCK_LOCATION);
    const fullfilmentModuleService = container.resolve(Modules.FULFILLMENT);

    const customer = await customerModuleService.retrieveCustomer(
      data.customerId,
    );
    const variant = await productModuleService.retrieveProductVariant(
      data.variantId,
    );

    const salesChannels = await salesChannelModuleService.listSalesChannels({});
    const region = await regionModuleService.listRegions({});
    const salesChannelId = salesChannels[0]?.id;
    const regionId = region[0]?.id;

    const locations = await locationModuleService.listStockLocations({});
    const locationId = locations[0]?.id;

    const shippingOptions = await fullfilmentModuleService.listShippingOptions(
      {},
    );
    const shippingOptionId = shippingOptions[0]?.id;

    return new StepResponse(
      {
        salesChannelId,
        regionId,
        customer,
        variant,
        locationId,
        shippingOptionId,
      },
      {},
    );
  },
);

export const approveCustomizationWorkflow = createWorkflow(
  {
    name: `approve-customization-${Date.now()}`,
    retentionTime: 360,
    store: true,
  },
  (input: { id: string; variant_id: string; customer_id: string }) => {
    const {
      customer,
      regionId,
      salesChannelId,
      variant,
      locationId,
      shippingOptionId,
    } = getInputsStep({
      customizationId: input.id,
      variantId: input.variant_id,
      customerId: input.customer_id,
    });

    const variantPrice = getVariantPriceSetsStep({
      variantIds: [input.variant_id],
      context: { currency_code: "usd" },
    });

    const amount = transform(
      { variantPrice, variant: input.variant_id },
      (data) => {
        return data.variantPrice[data.variant].calculated_amount ?? 0;
      },
    );

    // THE ERROR MIGHT BE DUE TO ERROR WHILE SETTING ITEMS RAW TOTALS
    const draftOrdersInputs: CreateOrderWorkflowInput = transform(
      { customer, regionId, salesChannelId, variant, amount },
      (data) => {
        return {
          currency_code: "usd",
          email: data.customer.email,
          customer_id: data.customer.id,
          sales_channel_id: data.salesChannelId,
          region_id: data.regionId,
          // items: [
          //   {
          //     ...data.variant,
          //     variant_id: data.variant.id,
          //     title: data.variant.title,
          //     quantity: 1,
          //     unit_price: data.amount,
          //     thumbnail: data.variant.thumbnail ?? "",
          //     product_id: data.variant.product_id ?? "",
          //   },
          // ],
          status: "draft",
          is_draft_order: true,
        };
      },
    );

    const draftOrder = createOrderWorkflow.runAsStep({
      input: draftOrdersInputs,
    });

    const draftOrderId = transform({ draftOrder, variantPrice }, (data) => {
      return data.draftOrder.id;
    });

    createOrderChangeWorkflow.runAsStep({ input: { order_id: draftOrderId } });

    acquireLockStep({ key: draftOrderId, timeout: 30, ttl: 60 * 2 });

    addDraftOrderItemsWorkflow.runAsStep({
      input: {
        order_id: draftOrderId,
        items: [
          {
            variant_id: variant.id,
            quantity: 1,
            unit_price: amount,
            title: variant.title,
          },
        ],
      },
    });

    addDraftOrderShippingMethodsWorkflow.runAsStep({
      input: {
        order_id: draftOrderId,
        shipping_option_id: shippingOptionId,
      },
    });

    releaseLockStep({ key: draftOrderId });

    confirmDraftOrderEditWorkflow.runAsStep({
      input: {
        order_id: draftOrderId,
        confirmed_by: "",
      },
    });

    convertDraftOrderWorkflow.runAsStep({ input: { id: draftOrderId } });

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
