import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { InvoiceFormValues } from "@/lib/schemas/invoice";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function buildInvoicePayload(values: InvoiceFormValues, status: "draft" | "pending") {
  const createdDate = new Date(values.createdAt);
  const dueDate = values.paymentDue
    ? new Date(values.paymentDue)
    : new Date(createdDate);
  if (!values.paymentDue) {
    dueDate.setDate(dueDate.getDate() + Number(values.paymentTerms));
  }

  const items = values.items.map((item) => ({
    ...item,
    quantity: Number(item.quantity),
    price: Number(item.price),
    total: Number(item.quantity) * Number(item.price),
  }));

  const total = items.reduce((sum, item) => sum + item.total, 0);

  return {
    ...values,
    paymentTerms: Number(values.paymentTerms),
    paymentDue: dueDate.toISOString().slice(0, 10),
    status,
    items,
    total,
  };
}
