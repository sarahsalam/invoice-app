import { z } from "zod";

const addressSchema = z.object({
    street: z.string().trim().min(1, "Street is required"),
    city: z.string().trim().min(1, "City is required"),
    postCode: z.string().trim().min(1, "Post code is required"),
    country: z.string().trim().min(1, "Country is required"),
});

const requiredNumber = (label: string, minimum: number, minimumMessage: string) =>
    z.preprocess(
        (value) => (value === "" || value === null ? undefined : value),
        z.number({ error: `${label} is required` }).min(minimum, minimumMessage)
    );

const itemSchema = z.object({
    name: z.string().trim().min(1, "Item name is required"),
    quantity: requiredNumber("Quantity", 1, "Quantity must be at least 1"),
    price: requiredNumber("Price", 0, "Price cannot be negative"),
    total: z.number().min(0),
});

export const invoiceSchema = z.object({
    clientName: z.string().trim().min(1, "Client name is required"),
    clientEmail: z.string().trim().min(1, "Email is required").email("Enter a valid email"),
    senderAddress: addressSchema,
    clientAddress: addressSchema,
    createdAt: z.string(),
    paymentTerms: z.number(),
    paymentDue: z.string(),
    description: z.string().min(1, "Description is required"),
    status: z.enum(["draft", "pending", "paid"]),
    items: z.array(itemSchema).min(1,"At least one item is required"),
    total: z.number(),
});

export const invoiceFormSchema = z
    .object({
        clientName: z.string().trim().min(1, "Client name is required"),
        clientEmail: z.string().trim().min(1, "Email is required").email("Enter a valid email"),
        senderAddress: addressSchema,
        clientAddress: addressSchema,
        createdAt: z.string().min(1, "Date is required"),
        paymentDue: z.string().min(1, "Payment date is required"),
        paymentTerms: z.number(),
        description: z.string().min(1, "Description is required"),
        items: z.array(
            z.object({
                name: z.string().trim().min(1, "Item name is required"),
                quantity: requiredNumber("Quantity", 1, "Quantity must be at least 1"),
                price: requiredNumber("Price", 0, "Price cannot be negative"),
            })
        ).min(1, "At least one item is required"),
    })
    .superRefine(({ createdAt, paymentDue }, context) => {
        if (createdAt && paymentDue && paymentDue < createdAt) {
            context.addIssue({
                code: "custom",
                path: ["paymentDue"],
                message: "Payment date cannot be before the invoice date",
            });
        }
    });

export type InvoiceFormValues = z.infer<typeof invoiceFormSchema>;
export type Invoice = z.infer<typeof invoiceSchema> & { _id: string };
export type InvoiceUpdate = Partial<z.infer<typeof invoiceSchema>>;