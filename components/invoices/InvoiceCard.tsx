import { ChevronRight } from "lucide-react";
import Link from "next/link";

export type InvoiceStatus = "paid" | "pending" | "draft";

type InvoiceCardProps = {
    id: string;
    dueDate: string;
    client: string;
    amount: number;
    status: InvoiceStatus;
};

export const statusStyles: Record<InvoiceStatus, { bg: string; text: string; dot: string; label: string }> = {
    paid: {
        bg: "bg-[#F5FDFA]",
        text: "text-[#33D69F]",
        dot: "bg-[#33D69F]",
        label: "Paid",
    },
    pending: {
        bg: "bg-[#FFF9F2]",
        text: "text-[#FF8F00]",
        dot: "bg-[#FF8F00]",
        label: "Pending",
    },
    draft: {
        bg: "bg-[#F5F5F6]",
        text: "text-[#373B53]",
        dot: "bg-[#373B53]",
        label: "Draft",
    },
};

export const InvoiceCard = ({ id, dueDate, client, amount, status }: InvoiceCardProps) => {
    const badge = statusStyles[status];

    return (
        <Link
            href={`/invoices/${id}`}
            className="flex h-[90px] w-[730px] items-center gap-4 rounded-[8px] border border-transparent bg-white px-8 py-6 text-card-foreground transition-colors hover:border-[#7C5DFA] dark:bg-card"
        >
            <div className="min-w-0 flex-1 text-xs font-bold text-slate-900 dark:text-white">
                <span className="text-gray-500">#</span>
                {id.slice(-6)}
            </div>

            <div className="flex-1.5 text-xs text-slate-500">
                Due {dueDate}
            </div>

            <div className="min-w-0 flex-1 pl-10 truncate text-xs text-slate-500">
                {client}
            </div>

            <div className="flex-1 text-right text-[16px] pr-10 font-bold text-slate-900 dark:text-white">
                {amount.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                })}
            </div>

            <div className="flex flex-1 items-center justify-end gap-6">
                <div className={`flex h-[40px] w-[104px] items-center justify-center gap-2 rounded-[6px] px-2 text-xs font-bold ${badge.bg} ${badge.text}`}>
                    <span className={`h-2 w-2 rounded-full ${badge.dot}`} />
                    {badge.label}
                </div>

                <ChevronRight className="h-5 w-5 text-violet-500" />
            </div>
        </Link>
    );
};