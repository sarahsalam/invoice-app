"use client";

import { useParams, useRouter } from "next/navigation";
import InvoiceForm from "@/components/invoices/InvoiceForm";
import { useInvoice } from "@/hooks/useInvoice";
import { useUpdateInvoice } from "@/hooks/useUpdateInvoice";
import { buildInvoicePayload } from "@/lib/utils";
import type { InvoiceFormValues } from "@/lib/schemas/invoice";

export default function EditInvoice() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const { data: invoice, isLoading, isError } = useInvoice(id);
    const updateInvoice = useUpdateInvoice();

    if (isLoading) return <p className="p-6">Loading...</p>;
    if (isError || !invoice) return <p className="p-6">Invoice not found.</p>;

    async function handleSubmit(values: InvoiceFormValues, status: "draft" | "pending") {
        const payload = buildInvoicePayload(values, status);

        await updateInvoice.mutateAsync({ id, data: payload });
        router.push(`/invoices/${id}`);
    }

    const initialValues = {
        clientName: invoice.clientName,
        clientEmail: invoice.clientEmail,
        senderAddress: invoice.senderAddress,
        clientAddress: invoice.clientAddress,
        createdAt: invoice.createdAt,
        paymentTerms: invoice.paymentTerms,
        paymentDue: invoice.paymentDue,
        description: invoice.description,
        items: invoice.items.map(({ name, quantity, price }) => ({
            name,
            quantity,
            price,
        })),
    };

    return (
        <InvoiceForm
            initialValues={initialValues}
            onSubmit={handleSubmit}
            onCancel={() => router.push(`/invoices/${id}`)}
        />
    );
}
