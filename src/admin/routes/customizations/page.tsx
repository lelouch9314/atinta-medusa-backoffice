import { defineRouteConfig } from "@medusajs/admin-sdk";
import { HttpTypes } from "@medusajs/framework/types";
import { ArrowPath, Swatch } from "@medusajs/icons";
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
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CustomizationType } from "../../../modules/customization";
import { sdk } from "../../lib/sdk";
import ActionButtons from "./components/action-buttons";
import { mapStatusToColor } from "./utils";

const columnHelper = createDataTableColumnHelper<
  CustomizationType & {
    customer?: HttpTypes.AdminCustomer;
    product?: HttpTypes.AdminProduct;
  }
>();

const limit = 15;

export default function CustomizationsPage() {
  const navigate = useNavigate();
  const [pagination, setPagination] = useState<DataTablePaginationState>({
    pageSize: limit,
    pageIndex: 0,
  });

  const [rowSelection, setRowSelection] = useState<DataTableRowSelectionState>(
    {},
  );

  const offset = useMemo(() => {
    return pagination.pageIndex * limit;
  }, [pagination]);

  const { data, isLoading, refetch } = useQuery<{
    customizations: CustomizationType[];
    count: number;
    limit: number;
    offset: number;
  }>({
    queryKey: ["customizations", offset, limit],
    queryFn: () =>
      sdk.client.fetch("/admin/customizations", {
        query: {
          offset: pagination.pageIndex * pagination.pageSize,
          limit: pagination.pageSize,
          fields: "+customer.*, +product.*",
          order: "-created_at",
        },
      }),
  });

  const columns = useMemo(
    () => [
      columnHelper.accessor("id", {
        header: "ID",
        cell: ({ row }) => (
          <Tooltip content={row.original.id}>
            <Link to={`/customizations/${row.original.id}`}>
              <span className="text-ui-fg-subtle font-mono text-xs">
                {row.original.id.substring(0, 8)}...
              </span>
            </Link>
          </Tooltip>
        ),
      }),
      columnHelper.accessor("image_url", {
        header: "Diseño",
        cell: ({ row }) => (
          <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-md border bg-gray-50">
            {row.original.image_url ? (
              <img
                src={row.original.image_url}
                alt="Custom design"
                className="h-full w-full object-contain"
              />
            ) : (
              <Swatch className="text-ui-fg-muted" />
            )}
          </div>
        ),
      }),
      columnHelper.accessor("customer", {
        header: "Customer",
        cell: ({ row }) => {
          return (
            <Link to={`/customers/${row.original.customer_id}`}>
              {row.original.customer?.first_name}{" "}
              {row.original.customer?.last_name}
            </Link>
          );
        },
      }),
      columnHelper.accessor("product", {
        header: "Product",
        cell: ({ row }) => {
          return (
            <Link to={`/products/${row.original.product_id}`}>
              {row.original.product?.title}
            </Link>
          );
        },
      }),
      columnHelper.accessor("status", {
        header: "Estado",
        cell: ({ row }) => (
          <StatusBadge
            color={mapStatusToColor(row.original.status.toLowerCase() as any)}
            className="capitalize"
          >
            {row.original.status}
          </StatusBadge>
        ),
      }),
      columnHelper.accessor("created_at", {
        header: "Fecha",
        cell: ({ row }) =>
          new Date(row.original.created_at).toLocaleDateString(),
      }),
      columnHelper.display({
        id: "actions",
        cell: ({ row }) => (
          <ActionButtons
            id={row.original.id}
            status={row.original.status}
            queryKey={["customizations", offset, limit]}
          />
        ),
      }),
    ],
    [data, offset],
  );

  const table = useDataTable({
    columns,
    data: data?.customizations || [],
    rowCount: data?.count || 0,
    isLoading,
    pagination: {
      state: pagination,
      onPaginationChange: setPagination,
    },
    getRowId: (row) => row.id,
    rowSelection: {
      state: rowSelection,
      onRowSelectionChange: setRowSelection,
    },
  });

  return (
    <Container>
      <DataTable instance={table}>
        <DataTable.Toolbar className="flex flex-col items-start justify-between gap-2 md:flex-row md:items-center">
          <Heading>Diseños Personalizados</Heading>
          <Button onClick={() => refetch()} variant="secondary">
            <ArrowPath /> Recargar
          </Button>
        </DataTable.Toolbar>
        <DataTable.Table />
        <DataTable.Pagination />
      </DataTable>
      <Toaster />
    </Container>
  );
}

export const config = defineRouteConfig({
  label: "Personalizaciones",
  icon: Swatch,
});
