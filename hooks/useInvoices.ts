import { useQuery } from "@tanstack/react-query";
import { fetchInvoices } from "@/lib/api/invoices";

export function useInvoices(statuses: string[] = []) {
    return useQuery({
        queryKey: ["invoices",statuses],
        queryFn: () => fetchInvoices(statuses),
    });
}