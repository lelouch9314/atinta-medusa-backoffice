import { defineRouteConfig } from "@medusajs/admin-sdk";
import {
  Container,
  Heading,
  Input,
  Label,
  StatusBadge,
  Textarea,
} from "@medusajs/ui";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { sdk } from "../../../lib/sdk";
import ActionButtons from "../components/action-buttons";
import { ProfessionalDesignRequest } from "../types";
import { mapStatusToColor } from "../utils";

export default function RequestDetails() {
  const { id } = useParams();

  const { data } = useQuery<ProfessionalDesignRequest>({
    queryKey: ["pro-designs-request", id],
    queryFn: () => sdk.client.fetch(`/admin/pro-designs-request/${id}`),
  });

  return (
    <div className="grid gap-4">
      <Container className="flex justify-between">
        <Heading>
          Request Details: <span className="underline">{id}</span>
        </Heading>

        <StatusBadge
          color={mapStatusToColor(
            data?.status as
              | "pending"
              | "processing"
              | "completed"
              | "cancelled",
          )}
          className="capitalize"
        >
          {data?.status}
        </StatusBadge>
      </Container>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Request description data */}
        <Container className="grid items-start">
          <Heading>Designs Request</Heading>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10 *:space-y-2">
            <div className="col-span-1">
              <Label>Company Name</Label>
              <Input type="text" value={data?.company_name} disabled />
            </div>
            <div className="col-span-1">
              <Label>Industry</Label>
              <Input type="text" value={data?.industry} disabled />
            </div>
            <div className="col-span-1">
              <Label>Accent Colors</Label>
              <Input type="text" value={data?.accent_colors} disabled />
            </div>
            <div className="col-span-1">
              <Label>Style</Label>
              <Input type="text" value={data?.style} disabled />
            </div>

            <div className="col-span-2">
              <Label>Description</Label>
              <Textarea rows={10} value={data?.description} disabled />
            </div>
          </div>

          {id && data && (
            <div className="flex justify-end place-self-end mt-10">
              <ActionButtons
                id={id}
                status={data.status}
                queryKey={["pro-designs-request", id]}
              />
            </div>
          )}
        </Container>

        <div className="grid gap-4">
          <Container>
            <Heading>Contact Info</Heading>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-10 *:space-y-2">
              <div className="col-span-1">
                <Label>Contact Name</Label>
                <Input type="text" value={data?.contact_name} disabled />
              </div>
              <div className="col-span-1">
                <Label>Contact Email</Label>
                <Input type="text" value={data?.contact_email} disabled />
              </div>
              <div className="col-span-1">
                <Label>Contact Phone</Label>
                <Input type="text" value={data?.contact_phone} disabled />
              </div>
            </div>
          </Container>
          <Container>
            <div>
              <Heading>Customer Info</Heading>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-10 *:space-y-2">
                <div className="col-span-1">
                  <Label>Name</Label>
                  <Input
                    type="text"
                    value={data?.customer?.first_name}
                    disabled
                  />
                </div>
                <div className="col-span-1">
                  <Label>Last Name</Label>
                  <Input
                    type="text"
                    value={data?.customer?.last_name}
                    disabled
                  />
                </div>
                <div className="col-span-1">
                  <Label>Email</Label>
                  <Input type="text" value={data?.customer?.email} disabled />
                </div>
              </div>
            </div>
          </Container>
        </div>
      </div>
    </div>
  );
}

export const config = defineRouteConfig({
  label: "Designs Requests Details",
});
