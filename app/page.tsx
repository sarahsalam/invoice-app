"use client";

import { useState } from "react";
import { useInvoices } from "@/hooks/useInvoices";
import { InvoiceCard } from "@/components/invoices/InvoiceCard";
import StatusFilter from "@/components/invoices/StatusFilter";
import InvoiceForm from "@/components/invoices/InvoiceForm";
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



    return (
        <>
            <main className="box-border flex min-h-screen justify-center bg-[#f8f8fb] px-4 pt-16 text-lg dark:bg-background sm:px-8 sm:pt-16 md:-translate-x-[51.5px]">
                <div className="w-full max-w-[730px]">

                <div className="flex items-start justify-between gap-4">

                    <div>
                        <h1 className="text-[32px] font-bold leading-tight">Invoices</h1>
                        <p className="mt-1 text-sm text-[#888EB0]">
                            {invoices?.length ?? 0} invoices
                        </p>
                    </div>

                    <div className="flex items-center gap-3 md:gap-8">
                        <StatusFilter selected={selectedStatuses} onChange={setSelectedStatuses} />


                        <button
                            type="button"
                            onClick={() => setIsCreating(true)}
                            className="flex h-11 w-11 items-center justify-center rounded-[24px] bg-[#7C5DFA] text-xl font-bold text-white md:h-auto md:w-auto md:gap-2 md:px-5 md:py-3 md:text-lg"
                            aria-label="New Invoice"
                        >
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-[#7C5DFA]">
                                <Plus className="h-4 w-4 stroke-[3]" />
                            </span>
                            <span className="hidden md:inline">New Invoice</span>
                        </button>

                    </div>

                </div>
                {!invoices?.length && <p className="mt-8 text-xl">No invoices yet.</p>}
                <div className="mt-16 space-y-4">
                    {filteredInvoices.map((invoice: Invoice) => (
                        <InvoiceCard
                            key={invoice._id}
                            id={String(invoice._id)}
                            dueDate={invoice.paymentDue}
                            client={invoice.clientName}
                            amount={invoice.total}
                            status={invoice.status}
                        />
                    ))}
                    {!!invoices?.length && !filteredInvoices.length && <p className="text-xl">No invoices found for this filter.</p>}
                </div>
                </div>
            </main>

            {isCreating && (
                <div className="fixed inset-x-0 bottom-0 top-20 z-10 bg-black/40 md:left-[103px] md:top-0">
                    <div className="h-full w-full max-w-2xl overflow-y-auto bg-background p-4 shadow-2xl animate-[invoice-drawer-in_250ms_ease-out] sm:p-8">
                        <InvoiceForm
                            onSubmit={handleCreate}
                            onCancel={() => setIsCreating(false)}
                            className="md:mx-0"
                        />
                    </div>
                </div>
            )}
        </>
    );
}