import { Container, Heading, Text } from "@medusajs/ui";
import { useQuery } from "@tanstack/react-query";
import { sdk } from "../lib/sdk";
import { Link } from "react-router-dom";
import { CustomizationType } from "../../modules/customization";
import { defineWidgetConfig } from "@medusajs/admin-sdk";
import { DetailWidgetProps, AdminOrder } from "@medusajs/framework/types";

const CustomizationOrderWidget = ({
  data: order,
}: DetailWidgetProps<AdminOrder>) => {
  const { data, isLoading } = useQuery<{
    customization: CustomizationType;
  }>({
    queryKey: ["order-customizations", order.id],
    queryFn: () => sdk.client.fetch(`/admin/orders/${order.id}/customizations`), // We need an API for this
    // Since we don't have an endpoint specifically for this yet, we can query it using Graph if we create one.
    // Let's create `GET /admin/orders/[id]/customizations`
  });

  // Since we haven't created the endpoint `GET /admin/orders/[id]/customizations`, I'll create it.

  if (isLoading) {
    return (
      <Container className="mb-4">
        <Text>Loading linked customizations...</Text>
      </Container>
    );
  }

  const customization = data?.customization;

  if (!customization) {
    return null; // Don't show anything if no connected customization
  }

  return (
    <Container className="mt-4 p-4 border rounded-md bg-ui-bg-subtle">
      <div className="flex items-center gap-4">
        {customization.image_url && (
          <img
            src={customization.image_url}
            alt="Customization Thumbnail"
            className="w-16 h-16 rounded-md object-cover border"
          />
        )}
        <div className="flex-1">
          <Heading
            level="h2"
            className="text-base text-ui-fg-base font-semibold"
          >
            Generated from Customization
          </Heading>
          <Text className="text-ui-fg-subtle mt-1 text-sm">
            This order was created from an approved customization request.
          </Text>
        </div>
        <Link
          to={`/customizations/${customization.id}`}
          className="text-blue-500 hover:text-blue-700 text-sm font-semibold"
        >
          View Detail Page &rarr;
        </Link>
      </div>
    </Container>
  );
};

export const config = defineWidgetConfig({
  zone: "order.details.after",
});

export default CustomizationOrderWidget;
