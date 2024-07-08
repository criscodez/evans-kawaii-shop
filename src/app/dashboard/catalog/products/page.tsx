import { DashboardBreadCrumb } from "@/components/breadcrumb";
import { ProductsTable } from "@/components/dashboard/catalog/products/products-table";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { getProducts } from "@/lib/dashboard/catalog/products/queries";
import { searchParamsSchema } from "@/lib/dashboard/catalog/products/validations";
import { SearchParams } from "@/types";
import React from "react";

const breadcrumbItems = [
  { title: "Catalogo", link: "/dashboard/catalog" },
  { title: "Productos", link: "/dashboard/catalog/products" },
];

export default function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const search = searchParamsSchema.parse(searchParams);

  const productsPromise = getProducts(search);

  return (
    <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
      <DashboardBreadCrumb items={breadcrumbItems} />
      <Heading title="Productos" description="Gestionar productos (Funcionalidades de la tabla auxiliar de productos)." />
      <Separator />
      <React.Suspense
        fallback={
          <DataTableSkeleton
            columnCount={8}
            searchableColumnCount={1}
            filterableColumnCount={1}
            shrinkZero
          />
        }
      >
        <ProductsTable productsPromise={productsPromise} />
      </React.Suspense>
    </div>
  );
}
