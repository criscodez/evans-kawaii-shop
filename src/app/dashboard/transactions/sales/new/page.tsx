import { DashboardBreadCrumb } from "@/components/breadcrumb";
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import CreateSaleForm from "@/components/dashboard/transactions/sales/create-sale-form";

const breadcrumbItems = [
  { title: "Transacciones", link: "/dashboard/transactions" },
  { title: "Mis Ventas", link: "/dashboard/transactions/sales" },
  { title: "Nueva", link: "/dashboard/warehouse/transactions/sales/new" },
];

export default function NewSalePage() {
  return (
    <ScrollArea className="h-full">
      <DashboardBreadCrumb
        items={breadcrumbItems}
        className="space-y-4  p-4 pt-6 md:p-8"
      />
      <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 sm:pb-8 md:gap-8">
        <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
          <CreateSaleForm />
        </div>
      </div>
    </ScrollArea>
  );
}
