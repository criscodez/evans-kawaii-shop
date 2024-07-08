import { DashboardBreadCrumb } from "@/components/breadcrumb";
import { CategoriesTable } from "@/components/dashboard/catalog/categories/categories-table";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { getCategories } from "@/lib/dashboard/catalog/categories/queries";
import { searchParamsSchema } from "@/lib/dashboard/catalog/categories/validations";
import { SearchParams } from "@/types";
import React from "react";

const breadcrumbItems = [{ title: 'Catalogo', link: '/dashboard/catalog' }, { title: 'Categorias', link: '/dashboard/catalog/categories' }];

export default function CategoriesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const search = searchParamsSchema.parse(searchParams);

  const categoriesPromise = getCategories(search);

  return (
    <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
      <DashboardBreadCrumb items={breadcrumbItems} />
      <Heading title="Categorias" description="Gestionar categorias (Funcionalidades de la tabla auxiliar de categorias)." />
      <Separator />
      <React.Suspense
        fallback={
          <DataTableSkeleton
            columnCount={3}
            searchableColumnCount={1}
            shrinkZero
          />
        }
      >
        <CategoriesTable categoriesPromise={categoriesPromise} />
      </React.Suspense>
    </div>
  );
}