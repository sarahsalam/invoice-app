import { useQuery } from "@tanstack/react-query";
import { fetchInvoice } from "@/lib/api/invoices";

export function useInvoice(id: string) {
    return useQuery({
        queryKey: ["invoices", id],
        queryFn: () => fetchInvoice(id),
        enabled: Boolean(id),
    });
}
