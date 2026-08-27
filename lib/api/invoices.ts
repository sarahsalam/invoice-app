import type { Invoice, InvoiceUpdate } from "@/lib/schemas/invoice";

export async function createInvoice(data: Omit<Invoice, "_id">): Promise<Invoice> {
    const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create invoice");
    return res.json() as Promise<Invoice>;
}

export async function fetchInvoices(statuses: string[] = []): Promise<Invoice[]> {
    const query = statuses.length ? `?status=${statuses.join(",")}` : "";
    const res = await fetch(`/api/invoices${query}`);
    if (!res.ok) {
        throw new Error("Failed to fetch invoices");
    }
    return res.json() as Promise<Invoice[]>;
}

export async function fetchInvoice(id: string): Promise<Invoice> {
    const res = await fetch(`/api/invoices/${id}`);
    if (!res.ok) throw new Error("Failed to fetch invoice");
    return res.json() as Promise<Invoice>;
}

export async function updateInvoice(id: string, data: InvoiceUpdate): Promise<Invoice> {
    const res = await fetch(`/api/invoices/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update invoice");
    return res.json() as Promise<Invoice>;
}

export async function deleteInvoice(id: string) {
    const res = await fetch(`/api/invoices/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete invoice");
    return res.json();
}