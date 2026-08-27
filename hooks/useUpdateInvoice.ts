import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateInvoice } from "@/lib/api/invoices";
import type { InvoiceUpdate } from "@/lib/schemas/invoice";

export function useUpdateInvoice() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: InvoiceUpdate }) => updateInvoice(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["invoices"] });
            queryClient.invalidateQueries({ queryKey: ["invoices", variables.id] });
        },
    });
}