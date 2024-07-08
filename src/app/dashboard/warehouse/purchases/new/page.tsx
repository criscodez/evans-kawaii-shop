import { DashboardBreadCrumb } from "@/components/breadcrumb";
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import CreatePurchaseForm from "@/components/dashboard/warehouse/purchases/create-purchase-form";

const breadcrumbItems = [
  { title: "Almacén", link: "/dashboard/warehouse" },
  { title: "Ordenes de Compra", link: "/dashboard/warehouse/purchases" },
  { title: "Nueva", link: "/dashboard/warehouse/purchases/purchases/new" },
];

export default function NewPurchasePage() {
  return (
    <ScrollArea className="h-full">
      <DashboardBreadCrumb
        items={breadcrumbItems}
        className="space-y-4  p-4 pt-6 md:p-8"
      />
      <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 sm:pb-8 md:gap-8">
        <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
          <CreatePurchaseForm />
        </div>
      </div>
    </ScrollArea>
  );
}
