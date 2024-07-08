import { DashboardBreadCrumb } from "@/components/breadcrumb";
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import CreateProductForm from "@/components/dashboard/catalog/products/create-product-form";

const breadcrumbItems = [
  { title: "Catalogo", link: "/dashboard/catalog" },
  { title: "Productos", link: "/dashboard/catalog/products" },
  { title: "Nuevo", link: "/dashboard/catalog/products/new" },
];

export default function NewProductPage() {
  return (
    <ScrollArea className="h-full">
      <DashboardBreadCrumb
        items={breadcrumbItems}
        className="space-y-4  p-4 pt-6 md:p-8"
      />
      <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 sm:pb-8 md:gap-8">
        <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
          <CreateProductForm />
        </div>
      </div>
    </ScrollArea>
  );
}
