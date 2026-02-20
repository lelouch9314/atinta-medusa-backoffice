import { defineWidgetConfig } from "@medusajs/admin-sdk";
import { DetailWidgetProps, AdminCustomer } from "@medusajs/framework/types";
import { Container, Heading, Text, clx } from "@medusajs/ui";
import { useQuery } from "@tanstack/react-query";
import { sdk } from "../lib/sdk";

type Designer = {
  id: string;
  bio: string | null;
  portfolio_link: string | null;
  created_at: string;
  updated_at: string;
};

const DesignerDetails = ({
  data: customer,
}: DetailWidgetProps<AdminCustomer>) => {
  const { data: designer, isLoading } = useQuery({
    queryFn: () =>
      sdk.client.fetch<Designer>(`/admin/designers/${customer.id}`),
    queryKey: [["designers", customer.id]],
    enabled: !!customer.id,
  });

  if (isLoading || !designer) {
    return null;
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">Designer Information</Heading>
      </div>
      <div
        className={clx("text-ui-fg-subtle grid grid-cols-2 gap-4 px-6 py-4")}
      >
        <div className="flex flex-col gap-y-1">
          <Text size="small" leading="compact" weight="plus">
            Bio
          </Text>
          <Text size="small" leading="compact">
            {designer.bio || "-"}
          </Text>
        </div>
        <div className="flex flex-col gap-y-1">
          <Text size="small" leading="compact" weight="plus">
            Portfolio
          </Text>
          <Text size="small" leading="compact">
            {designer.portfolio_link ? (
              <a
                href={designer.portfolio_link}
                target="_blank"
                rel="noreferrer"
                className="text-blue-500 hover:underline"
              >
                {designer.portfolio_link}
              </a>
            ) : (
              "-"
            )}
          </Text>
        </div>
      </div>
    </Container>
  );
};

export const config = defineWidgetConfig({
  zone: "customer.details.after",
});

export default DesignerDetails;
