"use client";

import { useState } from "react";
import { useInvoices } from "@/hooks/useInvoices";
import { InvoiceCard } from "@/components/invoices/InvoiceCard";
import StatusFilter from "@/components/invoices/StatusFilter";
import InvoiceForm from "@/components/invoices/InvoiceForm";
import Button from "@/components/common/Button";
import { useCreateInvoice } from "@/hooks/useCreateInvoice";
import { buildInvoicePayload } from "@/lib/utils";
import type { InvoiceFormValues } from "@/lib/schemas/invoice";
import { Plus } from "lucide-react";

type Invoice = {
    _id: string;
    paymentDue: string;
    clientName: string;
    total: number;
    status: "paid" | "pending" | "draft";
};

export default function Home() {
    const [selectedStatuses, setSelectedStatuses] = useState<string[]>(["all"]);
    const [isCreating, setIsCreating] = useState(false);
    const { data: invoices, isLoading, isError } = useInvoices();
    const createInvoice = useCreateInvoice();

    if (isLoading) return <p className="flex min-h-screen items-center justify-center text-lg">Loading invoices...</p>;
    if (isError) return <p className="flex min-h-screen items-center justify-center text-lg">Something went wrong.</p>;

    async function handleCreate(values: InvoiceFormValues, status: "draft" | "pending") {
        await createInvoice.mutateAsync(buildInvoicePayload(values, status));
        setIsCreating(false);
    }

    const filteredInvoices = selectedStatuses.includes("all")
        ? invoices || []
        : (invoices || []).filter((invoice: Invoice) => selectedStatuses.includes(invoice.status));
    const invoiceCount = filteredInvoices.length;



    return (
        <>
            <main className="box-border flex min-h-screen justify-center bg-[#f8f8fb] px-10 pt-0 text-lg dark:bg-background sm:px-8 sm:pt-24 md:-translate-x-[24px]">
                <div className="w-full max-w-[778px]">

                    <div className="flex h-[90px] w-full max-w-[730px] items-start justify-between gap-4">

                        <div>
                            <h1 className="text-[32px] font-bold leading-tight">Invoices</h1>
                            <p className="mt-1 text-xs text-[#888EB0] dark:text-white">
                                {invoiceCount === 0
                                    ? "No invoices"
                                    : `${invoiceCount} invoice${invoiceCount === 1 ? "" : "s"}`}
                            </p>
                        </div>

                        <div className="flex items-center gap-3 md:gap-8">
                            <StatusFilter selected={selectedStatuses} onChange={setSelectedStatuses} />


                            <Button
                                type="button"
                                buttonHandler={() => setIsCreating(true)}
                                bgColor=" bg-[#7c5dfa]"
                                classes="relative h-11 w-[150px] items-center justify-center text-xs font-bold text-white hover:bg-[#A68CFF]"
                                icon={
                                    <Plus className="absolute left-2 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full bg-white p-2 text-[#7c5dfa] stroke-4" />
                                }
                                text={<span className="translate-x-5">New Invoice</span>}
                                aria-label="New Invoice"
                            />

                        </div>

                    </div>
                    <div className="mt-12 w-full max-w-[730px] space-y-4">
                        {filteredInvoices.length ? (
                            filteredInvoices.map((invoice: Invoice) => (
                                <InvoiceCard
                                    key={invoice._id}
                                    id={String(invoice._id)}
                                    dueDate={invoice.paymentDue}
                                    client={invoice.clientName}
                                    amount={invoice.total}
                                    status={invoice.status}
                                />
                            ))
                        ) : (
                            <div className="flex flex-col items-center pt-48 text-center">
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">There is nothing here</h2>
                                <p className="mt-4 max-w-[260px] text-xs leading-5 text-[#888EB0]">
                                    Create an invoice by clicking the New Invoice button and get started
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            {isCreating && (
                <div className="fixed inset-x-0 bottom-0 top-20 z-10 bg-black/40 md:left-[103px] md:top-0">
                    <div className="h-full w-full max-w-[615px] overflow-y-auto bg-background shadow-2xl dark:bg-[#1E2139] animate-[invoice-drawer-in_250ms_ease-out]">
                        <InvoiceForm
                            onSubmit={handleCreate}
                            onCancel={() => setIsCreating(false)}
                            className="md:mx-0 "
                        />
                    </div>
                </div>
            )}
        </>
    );
}