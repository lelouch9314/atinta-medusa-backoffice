import {
  Button,
  Container,
  createDataTableColumnHelper,
  DataTable,
  DataTablePaginationState,
  DataTableRowSelectionState,
  Heading,
  StatusBadge,
  Toaster,
  Tooltip,
  useDataTable,
} from "@medusajs/ui";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { sdk } from "../../../lib/sdk";
import { CustomizationType } from "../../../../modules/customization";

// Detail page for customizations
export default function CustomizationsDetailsPage() {
  const { id } = useParams();

  const { data, isLoading } = useQuery<{ customization: CustomizationType }>({
    queryKey: ["customizations", id],
    queryFn: () => sdk.client.fetch(`/admin/customizations/${id}`),
  });

  console.log("DEBUG", { data });

  return (
    <>
      <Container>
        <Heading>Customization Details</Heading>
      </Container>
      <Container className="space-y-2">
        <Heading level="h2">Product Image Preview</Heading>
        <img
          src={data?.customization.image_url || ""}
          alt="Customization preview"
          className="max-w-md rounded-md"
        />
      </Container>
    </>
  );
}
