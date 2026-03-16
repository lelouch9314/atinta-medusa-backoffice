import { defineRouteConfig } from "@medusajs/admin-sdk";
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
import { sdk } from "../../lib/sdk";
import ActionButtons from "./components/action-buttons";
import { Customization } from "./types";
import { mapStatusToColor } from "./utils";

const columnHelper = createDataTableColumnHelper<Customization>();

const limit = 15;

export default function CustomizationsPage() {
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
    customizations: Customization[];
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
        },
      }),
  });

  const columns = useMemo(
    () => [
      columnHelper.accessor("id", {
        header: "ID",
        cell: ({ row }) => (
          <Tooltip content={row.original.id}>
            <span className="text-ui-fg-subtle font-mono text-xs">
              {row.original.id.substring(0, 8)}...
            </span>
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
      columnHelper.accessor("customer_id", {
        header: "Cliente",
        cell: ({ row }) => row.original.customer_id,
      }),
      columnHelper.accessor("product_id", {
        header: "Producto",
        cell: ({ row }) => row.original.product_id,
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
