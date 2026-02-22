import {
  Button,
  Container,
  createDataTableColumnHelper,
  DataTable,
  DataTablePaginationState,
  Heading,
  Toaster,
  useDataTable,
} from "@medusajs/ui";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { sdk } from "../../lib/sdk";
import { ArrowPath, ImageSparkle } from "@medusajs/icons";
import { defineRouteConfig } from "@medusajs/admin-sdk";

type ProfessionalDesignRequest = {
  id: string;
  company_name: string;
  industry: string;
  description: string;
  accent_colors: string[];
  style: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  customer_id: string;
  status: string;
  created_at: Date;
  updated_at: Date;
  customer?: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
  };
};

const columnHelper = createDataTableColumnHelper<ProfessionalDesignRequest>();

const columns = [
  //   columnHelper.select(),
  columnHelper.accessor("id", {
    header: "ID",
  }),
  columnHelper.accessor("company_name", {
    header: "Company Name",
  }),
  columnHelper.accessor("industry", {
    header: "Industry",
  }),
  columnHelper.accessor("description", {
    header: "Description",
  }),
  columnHelper.accessor("accent_colors", {
    header: "Accent Colors",
  }),
  columnHelper.accessor("style", {
    header: "Style",
  }),
  columnHelper.accessor("contact_name", {
    header: "Contact Name",
  }),
  columnHelper.accessor("contact_email", {
    header: "Contact Email",
  }),
  columnHelper.accessor("contact_phone", {
    header: "Contact Phone",
  }),
  columnHelper.accessor("customer", {
    header: "Customer",
    cell: ({ row }) => {
      return (
        <Link to={`/customers/${row.original.customer_id}`}>
          {row.original.customer?.first_name} {row.original.customer?.last_name}
        </Link>
      );
    },
  }),
];

const limit = 15;

export default function ProfessionalDesignRequestsPage() {
  const [pagination, setPagination] = useState<DataTablePaginationState>({
    pageSize: limit,
    pageIndex: 0,
  });

  const offset = useMemo(() => {
    return pagination.pageIndex * limit;
  }, [pagination]);

  const { data, isLoading, refetch } = useQuery<{
    reviews: ProfessionalDesignRequest[];
    count: number;
    limit: number;
    offset: number;
  }>({
    queryKey: ["reviews", offset, limit],
    queryFn: () =>
      sdk.client.fetch("/admin/pro-designs-request", {
        query: {
          offset: pagination.pageIndex * pagination.pageSize,
          limit: pagination.pageSize,
          order: "-created_at",
        },
      }),
  });

  const table = useDataTable({
    columns,
    data: data?.reviews || [],
    rowCount: data?.count || 0,
    isLoading,
    pagination: {
      state: pagination,
      onPaginationChange: setPagination,
    },
    getRowId: (row) => row.id,
    //   commands,
    //   rowSelection: {
    //     state: rowSelection,
    //     onRowSelectionChange: setRowSelection,
    //   },
  });

  return (
    <Container>
      <DataTable instance={table}>
        <DataTable.Toolbar className="flex flex-col items-start justify-between gap-2 md:flex-row md:items-center">
          <Heading>Designs Request</Heading>

          <Button onClick={() => refetch()}>
            <ArrowPath /> Recargar
          </Button>
        </DataTable.Toolbar>
        <DataTable.Table />
        <DataTable.Pagination />
        <DataTable.CommandBar selectedLabel={(count) => `${count} selected`} />
      </DataTable>
      <Toaster />
    </Container>
  );
}

export const config = defineRouteConfig({
  label: "Designs Requests",
  icon: ImageSparkle,
});
