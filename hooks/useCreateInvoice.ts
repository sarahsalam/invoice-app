import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createInvoice } from "@/lib/api/invoices";
import type { Invoice } from "@/lib/schemas/invoice";

export function useCreateInvoice() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: Omit<Invoice, "_id">) => createInvoice(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["invoices"] });
        },
    });
}
