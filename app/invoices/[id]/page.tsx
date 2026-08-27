"use client";

import { useParams, useRouter } from "next/navigation";
import { useInvoice } from "@/hooks/useInvoice";
import { useUpdateInvoice } from "@/hooks/useUpdateInvoice";
import { useDeleteInvoice } from "@/hooks/useDeleteInvoice";
import type { Invoice } from "@/lib/schemas/invoice";
import { statusStyles } from "@/components/invoices/InvoiceCard";

export default function InvoiceDetail() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const { data: invoice, isLoading, isError } = useInvoice(id);
    const updateInvoice = useUpdateInvoice();
    const deleteInvoice = useDeleteInvoice();

    if (isLoading) return <p className="p-6">Loading...</p>;
    if (isError || !invoice) return <p className="p-6">Invoice not found.</p>;

    const badge = statusStyles[invoice.status];

    function handleMarkAsPaid() {
        updateInvoice.mutate({ id, data: { status: "paid" } });
    }

    function handleDelete() {
        if (confirm("Delete this invoice? This cannot be undone.")) {
            deleteInvoice.mutate(id, {
                onSuccess: () => router.push("/"),
            });
        }
    }

    return (
        <div className="mx-auto max-w-3xl p-4 sm:p-6">
            <button onClick={() => router.push("/")} className="mb-5 font-semibold sm:mb-6">
                ← Go back
            </button>

            <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-white p-3 shadow-sm dark:bg-gray-800 sm:p-4 mb-4" >
                <div className="flex items-center gap-3">
                    <span className="text-gray-500 dark:text-gray-400">Status</span>
                    <span className={`flex h-11 w-28 items-center justify-center gap-2 rounded-md px-4 py-3 text-sm font-bold ${badge.bg} ${badge.text}`}>
                        <span className={`h-2 w-2 rounded-full ${badge.dot}`} />
                        {badge.label}
                    </span>
                </div>
                <div className="flex flex-wrap justify-end gap-2">
                    <button
                        onClick={() => router.push(`/invoices/${id}/edit`)}
                        className="rounded-full bg-gray-100 px-3 py-2 text-sm font-semibold dark:bg-gray-600 sm:px-4"
                    >
                        Edit
                    </button>

                    <button
                        onClick={handleDelete}
                        className="rounded-full bg-red-600 px-3 py-2 text-sm font-semibold text-white sm:px-4"
                    >
                        Delete
                    </button>
                    {invoice.status !== "paid" && (
                        <button
                            onClick={handleMarkAsPaid}
                            className="rounded-full bg-purple-600 px-3 py-2 text-sm font-semibold text-white sm:px-4"
                        >
                            Mark as Paid
                        </button>
                    )}
                </div>
            </div>

            <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800 sm:p-6">
                <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <p className="font-semibold">
                            <span className="text-gray-400">#</span>
                            {invoice._id}
                        </p>
                        <p className="text-gray-500 dark:text-gray-400">{invoice.description}</p>
                    </div>
                    <div className="text-left text-gray-500 dark:text-gray-400 md:text-right">
                        <p>{invoice.senderAddress.street}</p>
                        <p>{invoice.senderAddress.city}</p>
                        <p>{invoice.senderAddress.postCode}</p>
                        <p>{invoice.senderAddress.country}</p>
                    </div>
                </div>

                <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                        <p className="text-gray-500  mb-2">Invoice Date</p>
                        <p className="font-semibold mb-4">{invoice.createdAt}</p>
                        <p className="text-gray-500 mb-2">Payment Due</p>
                        <p className="font-semibold">{invoice.paymentDue}</p>
                    </div>
                    <div>
                        <p className="text-gray-500 dark:text-gray-400 mb-2">Bill To</p>
                        <p className="font-semibold mb-1">{invoice.clientName}</p>
                        <p className="text-gray-500 dark:text-gray-400">{invoice.clientAddress.street}</p>
                        <p className="text-gray-500 dark:text-gray-400">{invoice.clientAddress.city}</p>
                        <p className="text-gray-500 dark:text-gray-400">{invoice.clientAddress.postCode}</p>
                        <p className="text-gray-500 dark:text-gray-400">{invoice.clientAddress.country}</p>
                    </div>
                </div>

                <div className="mb-8">
                    <p className="text-gray-500 dark:text-gray-400 mb-2">Sent to</p>
                    <p className="font-semibold">{invoice.clientEmail}</p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 rounded-t-lg p-6">
                    <div className="overflow-x-auto">
                    <table className="w-full min-w-[480px]">
                        <thead>
                        <tr className="text-left text-gray-500 dark:text-gray-400">
                            <th className="font-normal pb-4">Item Name</th>
                            <th className="text-center font-normal pb-4">QTY</th>
                            <th className="text-right font-normal pb-4">Price</th>
                            <th className="text-right font-normal pb-4">Total</th>
                        </tr>
                        </thead>
                        <tbody>
                        {invoice.items.map((item: Invoice["items"][number], i: number) => (
                            <tr key={i}>
                                <td className="py-2 font-semibold">{item.name}</td>
                                <td className="text-center text-gray-500 dark:text-gray-400">{item.quantity}</td>
                                <td className="text-right text-gray-500 dark:text-gray-400">${item.price}</td>
                                <td className="text-right font-semibold">${item.total}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    </div>
                </div>

                <div className="flex justify-between items-center bg-gray-900 text-white p-6 rounded-b-lg">
                    <span className="text-sm">Amount Due</span>
                    <span className="text-2xl font-bold">${invoice.total}</span>
                </div>
            </div>
        </div>
    );
}