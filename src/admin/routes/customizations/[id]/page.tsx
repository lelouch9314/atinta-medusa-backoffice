import {
  Button,
  Container,
  Heading,
  Select,
  Textarea,
  toast,
  Text,
  Badge,
} from "@medusajs/ui";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router";
import { useState, useEffect } from "react";
import { sdk } from "../../../lib/sdk";
import { CustomizationType } from "../../../../modules/customization";
import { ProductDTO } from "@medusajs/framework/types";

// Detail page for customizations
export default function CustomizationsDetailsPage() {
  const { id } = useParams();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<{
    customization: CustomizationType & {
      selected_properties: any[];
      admin_notes: string;
      product: ProductDTO;
    };
  }>({
    queryKey: ["customizations", id],
    queryFn: () => sdk.client.fetch(`/admin/customizations/${id}`),
  });

  const customization = data?.customization;
  const productData = data?.customization.product;
  // const { data: productData } = useQuery({
  //   queryKey: ["product", customization?.product_id],
  //   queryFn: () => sdk.admin.product.retrieve(customization!.product_id),
  //   enabled: !!customization?.product_id,
  // });

  const [status, setStatus] = useState<string>("");
  const [adminNotes, setAdminNotes] = useState<string>("");

  useEffect(() => {
    if (customization) {
      setStatus(customization.status);
      setAdminNotes(customization.admin_notes || "");
    }
  }, [customization]);

  const updateMutation = useMutation({
    mutationFn: (payload: { admin_notes?: string }) =>
      sdk.client.fetch(`/admin/customizations/${id}`, {
        method: "POST",
        body: payload,
      }),
    onSuccess: () => {
      toast.success("Successfully updated customization");
      queryClient.invalidateQueries({ queryKey: ["customizations", id] });
    },
    onError: (err: any) => {
      toast.error(`Error updating customization: ${err.message}`);
    },
  });

  const { mutate: updateStatus, isPending } = useMutation({
    mutationFn: (newStatus: string) =>
      sdk.client.fetch(`/admin/customizations/${id}/status`, {
        method: "POST",
        body: { status: newStatus },
      }),
    onSuccess: () => {
      toast.success("Estado actualizado exitosamente");
      queryClient.invalidateQueries({ queryKey: ["customizations"] });
    },
    onError: () => {
      toast.error("Error al actualizar el estado");
    },
  });

  const handleSaveNotes = () => {
    updateMutation.mutate({ admin_notes: adminNotes });
  };

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    updateStatus(newStatus);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const variant = productData?.variants?.find(
    (v: any) => v.id === customization?.variant_id,
  );

  return (
    <div className="flex flex-col gap-y-4">
      <Container className="flex items-center justify-between">
        <Heading>Customization Details</Heading>
        <div className="flex items-center gap-x-2">
          <Text size="small" weight="plus">
            Status
          </Text>
          <Select value={status} onValueChange={handleStatusChange}>
            <Select.Trigger>
              <Select.Value />
            </Select.Trigger>
            <Select.Content>
              {[
                "DRAFT",
                "PENDING",
                "APPROVED",
                "REJECTED",
                "ORDERED",
                "IN_PRODUCTION",
                "COMPLETED",
                "CANCELLED",
              ].map((s) => (
                <Select.Item key={s} value={s}>
                  {s}
                </Select.Item>
              ))}
            </Select.Content>
          </Select>
        </div>
      </Container>

      <div className="grid grid-cols-2 gap-4">
        <Container className="space-y-4">
          <Heading level="h2">Product Details</Heading>
          {productData ? (
            <div className="space-y-2">
              <Text weight="plus">{productData.title}</Text>
              {variant && <Text>Variant: {variant.title}</Text>}
            </div>
          ) : (
            <Text>Loading Product...</Text>
          )}

          <Heading level="h3" className="mt-4">
            Selected Properties
          </Heading>
          <div className="flex flex-col gap-2">
            {customization?.selected_properties?.map((prop: any) => (
              <div key={prop.id} className="flex gap-2">
                <Badge>{prop.property_name}</Badge>
                <Text>
                  {prop.selected_value}{" "}
                  {prop.custom_value && `(${prop.custom_value})`}
                </Text>
              </div>
            ))}
          </div>

          <Heading level="h3" className="mt-4">
            Customer Notes
          </Heading>
          <Text className="p-3 bg-ui-bg-base border rounded-md">
            {customization?.customer_notes || "No notes provided."}
          </Text>
        </Container>

        <Container className="space-y-4">
          <Heading level="h2">Admin Notes</Heading>
          <Textarea
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            placeholder="Add notes around this customization request..."
            rows={5}
          />
          <div className="flex justify-end">
            <Button
              onClick={handleSaveNotes}
              isLoading={updateMutation.isPending}
            >
              Save Notes
            </Button>
          </div>
        </Container>

        <Container className="space-y-4 col-span-2">
          <Heading level="h2">Design Preview</Heading>
          {customization?.image_url ? (
            <img
              src={customization.image_url}
              alt="Customization preview"
              className="max-w-md rounded-md border shadow-sm"
            />
          ) : (
            <Text>No design image provided.</Text>
          )}
        </Container>
      </div>
    </div>
  );
}
