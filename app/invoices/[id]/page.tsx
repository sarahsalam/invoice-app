"use client";

import { useParams, useRouter } from "next/navigation";
import { useInvoice } from "@/hooks/useInvoice";
import { useUpdateInvoice } from "@/hooks/useUpdateInvoice";
import { useDeleteInvoice } from "@/hooks/useDeleteInvoice";
import type { Invoice } from "@/lib/schemas/invoice";
import { statusStyles } from "@/components/invoices/InvoiceCard";
import { useState } from "react";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import Button from "@/components/common/Button";


export default function InvoiceDetail() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const { data: invoice, isLoading, isError } = useInvoice(id);
    const updateInvoice = useUpdateInvoice();
    const deleteInvoice = useDeleteInvoice();
    const [isDeleting, setIsDeleting] = useState(false);

    if (isLoading) return <p className="p-6">Loading...</p>;
    if (isError || !invoice) return <p className="p-6">Invoice not found.</p>;

    const badge = statusStyles[invoice.status];

    function handleMarkAsPaid() {
        updateInvoice.mutate({ id, data: { status: "paid" } });
    }

    function handleDelete() {
        
            deleteInvoice.mutate(id, {
                onSuccess: () => router.push("/"),
            });
        
    }

    return (
        <>
        <ConfirmDialog
        open={isDeleting}
        title="Delete Invoice"
        message={"Are you sure you want to delete invoice #" + invoice._id + "? This action cannot be undone."}
        onConfirm={handleDelete}
        onCancel={() => setIsDeleting(false)}
      />

        <div className="mx-auto w-full max-w-[730px] px-4 py-10 sm:py-16">
            <button onClick={() => router.push("/")} className="mb-8 flex items-center gap-3 text-xs font-bold text-slate-900 dark:text-white">
                <span className="text-lg text-[#7c5dfa]">‹</span>
                Go back
            </button>

            <div className="mb-4 flex flex-wrap items-center justify-between gap-4 rounded-lg bg-white p-6 shadow-sm dark:bg-card" >
                <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-500 dark:text-white">Status</span>
                    <span className={`flex h-[40px] w-[104px] items-center justify-center gap-2 rounded-md px-2 text-xs font-bold ${badge.bg} ${badge.text}`}>
                        <span className={`h-2 w-2 rounded-full ${badge.dot}`} />
                        {badge.label}
                    </span>
                </div>
                <div className="flex flex-wrap justify-end gap-2">
                    {invoice.status !== "paid" && (
                        <Button
                            onClick={() => router.push(`/invoices/${id}/edit`)}
                            bgColor="bg-gray-100 dark:bg-[#252945]"
                            classes="h-11 px-5 font-bold text-[#888eb0] dark:text-white"
                        >
                            Edit
                        </Button>
                    )}

                    <Button
                        onClick={() => setIsDeleting(true)}
                        bgColor="bg-[#ec5757]"
                        classes="h-11 px-5 font-bold text-white hover:bg-red-600"
                    >
                        Delete
                    </Button>
                    {invoice.status !== "paid" && (
                        <Button
                            onClick={handleMarkAsPaid}
                            bgColor="bg-[#7c5dfa]"
                            classes="h-11 px-5 font-bold text-white hover:bg-[#6c4ee8]"
                        >
                            Mark as Paid
                        </Button>
                    )}
                </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-card sm:p-8">
                <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2">
                    <div>
                        <p className="text-lg font-bold text-slate-900 dark:text-white">
                            <span className="text-[#7e88c3] dark:text-white">#</span>
                            {invoice._id}
                        </p>
                        <p className="mt-2 text-xs text-[#7e88c3] dark:text-white">{invoice.description}</p>
                    </div>
                    <div className="text-left text-xs leading-5 text-[#7e88c3] dark:text-white md:text-right">
                        <p>{invoice.senderAddress.street}</p>
                        <p>{invoice.senderAddress.city}</p>
                        <p>{invoice.senderAddress.postCode}</p>
                        <p>{invoice.senderAddress.country}</p>
                    </div>
                </div>

                <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-3">
                    <div>
                        <p className="mb-3 text-xs text-[#7e88c3] dark:text-white">Invoice Date</p>
                        <p className="mb-6 font-bold text-slate-900 dark:text-white">{invoice.createdAt}</p>
                        <p className="mb-3 text-xs text-[#7e88c3] dark:text-white">Payment Due</p>
                        <p className="font-bold text-slate-900 dark:text-white">{invoice.paymentDue}</p>
                    </div>
                    <div>
                        <p className="mb-3 text-xs text-[#7e88c3] dark:text-white">Bill To</p>
                        <p className="mb-2 font-bold text-slate-900 dark:text-white">{invoice.clientName}</p>
                        <p className="text-xs leading-5 text-[#7e88c3] dark:text-white">{invoice.clientAddress.street}</p>
                        <p className="text-xs leading-5 text-[#7e88c3] dark:text-white">{invoice.clientAddress.city}</p>
                        <p className="text-xs leading-5 text-[#7e88c3] dark:text-white">{invoice.clientAddress.postCode}</p>
                        <p className="text-xs leading-5 text-[#7e88c3] dark:text-white">{invoice.clientAddress.country}</p>
                    </div>
                    <div>
                        <p className="mb-3 text-xs text-[#888eb0] dark:text-white">Sent to</p>
                        <p className="font-bold text-slate-900 dark:text-white">{invoice.clientEmail}</p>
                    </div>
                </div>

                <div className="rounded-t-lg bg-[#f8f8fb] p-6 dark:bg-[#252945]">
                    <div className="overflow-x-auto">
                    <table className="w-full min-w-[480px]">
                        <thead>
                        <tr className="text-left text-xs text-[#888eb0] dark:text-white">
                            <th className="pb-4 font-normal">Item Name</th>
                            <th className="pb-4 text-center font-normal">QTY.</th>
                            <th className="pb-4 text-right font-normal">Price</th>
                            <th className="pb-4 text-right font-normal">Total</th>
                        </tr>
                        </thead>
                        <tbody>
                        {invoice.items.map((item: Invoice["items"][number], i: number) => (
                            <tr key={i}>
                                <td className="py-3 text-xs font-bold">{item.name}</td>
                                <td className="text-center text-xs font-bold text-[#7e88c3] dark:text-white">{item.quantity}</td>
                                <td className="text-right text-xs font-bold text-[#7e88c3] dark:text-white">${item.price}</td>
                                <td className="text-right text-xs font-bold">${item.total}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    </div>
                </div>

                <div className="flex items-center justify-between rounded-b-lg bg-[#373b53] p-6 text-white dark:bg-black">
                    <span className="text-xs">{invoice.status === "paid" ? "Grand Total" : "Amount Due"}</span>
                    <span className="text-2xl font-bold">${invoice.total}</span>
                </div>
            </div>
        </div>
        </>
    );
}