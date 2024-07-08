"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CalendarDatePicker } from "@/components/ui/calendar-date-picker";
import { CreateUserDialog } from "@/components/dashboard/organization/users/create-user-dialog";

const FormSchema = z.object({
  calendar: z.object({
    from: z.date(),
    to: z.date(),
  }),
  datePicker: z.object({
    from: z.date(),
    to: z.date(),
  }),
});

export default function Home() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      calendar: {
        from: new Date(new Date().getFullYear(), 0, 1),
        to: new Date(),
      },
      datePicker: {
        from: new Date(),
        to: new Date(),
      },
    },
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    toast(
      `1. Date range: ${data.calendar.from.toDateString()} - ${data.calendar.to.toDateString()}
      \n2. Single date: ${data.datePicker.from.toDateString()}`
    );
  };

  return (
    <main className="flex min-h-screen:calc(100vh - 4rem) flex-col items-center justify-start">
      <CreateUserDialog />
    </main>
  );
}