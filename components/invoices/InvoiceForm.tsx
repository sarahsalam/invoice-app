"use client";

import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { addDays, differenceInCalendarDays } from "date-fns";
import { Trash2 } from "lucide-react";
import { invoiceFormSchema, type InvoiceFormValues } from "@/lib/schemas/invoice";
import DatePickerField from "@/components/invoices/DatePickerField";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface InvoiceFormProps {
    onSubmit: (data: InvoiceFormValues, status: "draft" | "pending") => void | Promise<void>;
    onCancel: () => void;
    initialValues?: InvoiceFormValues;
    className?: string;
}

const emptyItem = { name: "", quantity: 1, price: 0 };
const fieldErrorClass = "mt-1 text-xs text-red-500";

const defaultValues = {
    clientName: "",
    clientEmail: "",
    senderAddress: { street: "", city: "", postCode: "", country: "" },
    clientAddress: { street: "", city: "", postCode: "", country: "" },
    createdAt: new Date().toISOString().slice(0, 10),
    paymentTerms: 30,
    paymentDue: addDays(new Date(), 30).toISOString().slice(0, 10),
    description: "",
    items: [emptyItem],
};

export default function InvoiceForm({ onSubmit, onCancel, initialValues, className }: InvoiceFormProps) {
    return (
        <Formik<InvoiceFormValues>
            initialValues={initialValues || defaultValues}
            validationSchema={toFormikValidationSchema(invoiceFormSchema)}
            validateOnBlur
            onSubmit={(values) => {
                // this only runs for "Save & Send" — draft has its own button below
                onSubmit(values, "pending");
            }}
        >
            {({ values, isSubmitting, setFieldValue }) => (
                <Form className={cn("w-full rounded-xl bg-card p-4 text-card-foreground shadow-sm md:mx-auto md:max-w-2xl md:p-8", className)}>
                    <h2 className="mb-8 text-xl font-bold sm:text-2xl">New Invoice</h2>

                    <p className="mb-3 font-semibold text-[#7c5dfa]">Bill From</p>
                    <Field
                        name="senderAddress.street"
                        placeholder="Street Address"
                        className="w-full rounded-md border border-[#dfe3fa] bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-[#7c5dfa] focus:ring-2 focus:ring-[#7c5dfa]/10"
                    />
                    <ErrorMessage name="senderAddress.street" component="p" className={fieldErrorClass} />

                    <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
                        <div>
                            <Field
                                name="senderAddress.city"
                                placeholder="City"
                                className="w-full rounded-md border border-[#dfe3fa] bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-[#7c5dfa] focus:ring-2 focus:ring-[#7c5dfa]/10"
                            />
                            <ErrorMessage name="senderAddress.city" component="p" className={fieldErrorClass} />
                        </div>
                        <div>
                            <Field
                                name="senderAddress.postCode"
                                placeholder="Post Code"
                                className="w-full rounded-md border border-[#dfe3fa] bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-[#7c5dfa] focus:ring-2 focus:ring-[#7c5dfa]/10"
                            />
                            <ErrorMessage name="senderAddress.postCode" component="p" className={fieldErrorClass} />
                        </div>
                        <div>
                            <Field
                                name="senderAddress.country"
                                placeholder="Country"
                                className="w-full rounded-md border border-[#dfe3fa] bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-[#7c5dfa] focus:ring-2 focus:ring-[#7c5dfa]/10"
                            />
                            <ErrorMessage name="senderAddress.country" component="p" className={fieldErrorClass} />
                        </div>
                    </div>

                    <p className="mb-3 mt-8 font-semibold text-[#7c5dfa]">Bill To</p>
                    <Field
                        name="clientName"
                        placeholder="Client's Name"
                        className="w-full rounded-md border border-[#dfe3fa] bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-[#7c5dfa] focus:ring-2 focus:ring-[#7c5dfa]/10"
                    />
                    <ErrorMessage name="clientName" component="p" className={fieldErrorClass} />

                    <Field
                        name="clientEmail"
                        placeholder="Client's Email"
                        className="mt-3 w-full rounded-md border border-[#dfe3fa] bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-[#7c5dfa] focus:ring-2 focus:ring-[#7c5dfa]/10"
                    />
                    <ErrorMessage name="clientEmail" component="p" className={fieldErrorClass} />

                    <Field
                        name="clientAddress.street"
                        placeholder="Street Address"
                        className="mt-3 w-full rounded-md border border-[#dfe3fa] bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-[#7c5dfa] focus:ring-2 focus:ring-[#7c5dfa]/10"
                    />
                    <ErrorMessage name="clientAddress.street" component="p" className={fieldErrorClass} />

                    <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
                        <div>
                            <Field
                                name="clientAddress.city"
                                placeholder="City"
                                className="w-full rounded-md border border-[#dfe3fa] bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-[#7c5dfa] focus:ring-2 focus:ring-[#7c5dfa]/10"
                            />
                            <ErrorMessage name="clientAddress.city" component="p" className={fieldErrorClass} />
                        </div>
                        <div>
                            <Field
                                name="clientAddress.postCode"
                                placeholder="Post Code"
                                className="w-full rounded-md border border-[#dfe3fa] bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-[#7c5dfa] focus:ring-2 focus:ring-[#7c5dfa]/10"
                            />
                            <ErrorMessage name="clientAddress.postCode" component="p" className={fieldErrorClass} />
                        </div>
                        <div>
                            <Field
                                name="clientAddress.country"
                                placeholder="Country"
                                className="w-full rounded-md border border-[#dfe3fa] bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-[#7c5dfa] focus:ring-2 focus:ring-[#7c5dfa]/10"
                            />
                            <ErrorMessage name="clientAddress.country" component="p" className={fieldErrorClass} />
                        </div>
                    </div>

                    <div className="mt-8 grid grid-cols-1 gap-3 md:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm text-slate-500">Invoice Date</label>
                            <DatePickerField name="createdAt" />
                            <ErrorMessage name="createdAt" component="p" className={fieldErrorClass} />
                        </div>
                        <div>
                            <label className="mb-2 block text-sm text-slate-500">Payment Terms</label>
                            <ErrorMessage name="paymentDue" component="p" className={fieldErrorClass} />
                            <DatePickerField
                                name="paymentDue"
                                onChange={(date) => {
                                    if (date) {
                                        setFieldValue(
                                            "paymentTerms",
                                            differenceInCalendarDays(date, new Date(values.createdAt))
                                        );
                                    }
                                }}
                            />
                        </div>
                    </div>

                    <Field
                        name="description"
                        placeholder="Project Description"
                        className="mt-3 w-full rounded-md border border-[#dfe3fa] bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-[#7c5dfa] focus:ring-2 focus:ring-[#7c5dfa]/10"
                    />
                    <ErrorMessage name="description" component="p" className={fieldErrorClass} />

                    <p className="mb-3 mt-8 text-lg font-semibold text-slate-600">Item List</p>

                    <FieldArray name="items">
                        {({ push, remove }) => (
                            <div>
                                {values.items.map((_, index: number) => (
                                    <div key={index} className="mb-4 grid grid-cols-1 items-center gap-2 md:grid-cols-12">
                                        <div className="md:col-span-5">
                                            <Field
                                                name={`items.${index}.name`}
                                                placeholder="Item Name"
                                                className="w-full rounded-md border border-[#dfe3fa] bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-[#7c5dfa] focus:ring-2 focus:ring-[#7c5dfa]/10"
                                            />
                                            <ErrorMessage name={`items.${index}.name`} component="p" className={fieldErrorClass} />
                                        </div>
                                        <div className="md:col-span-2">
                                            <Field
                                                name={`items.${index}.quantity`}
                                                type="number"
                                                className="w-full rounded-md border border-[#dfe3fa] bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-[#7c5dfa] focus:ring-2 focus:ring-[#7c5dfa]/10"
                                            />
                                            <ErrorMessage name={`items.${index}.quantity`} component="p" className={fieldErrorClass} />
                                        </div>
                                        <div className="md:col-span-2">
                                            <Field
                                                name={`items.${index}.price`}
                                                type="number"
                                                className="w-full rounded-md border border-[#dfe3fa] bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-[#7c5dfa] focus:ring-2 focus:ring-[#7c5dfa]/10"
                                            />
                                            <ErrorMessage name={`items.${index}.price`} component="p" className={fieldErrorClass} />
                                        </div>
                                        <div className="text-left text-sm font-medium text-slate-600 md:col-span-2 md:text-right">
                                            ${((values.items[index]?.quantity || 0) * (values.items[index]?.price || 0)).toFixed(2)}
                                        </div>
                                        <div className="text-left md:col-span-1 md:text-center">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => remove(index)}
                                                aria-label={`Delete item ${index + 1}`}
                                                className="text-slate-400 hover:text-red-500"
                                            >
                                                <Trash2 className="size-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}

                                <Button
                                    type="button"
                                    onClick={() => push(emptyItem)}
                                    variant="secondary"
                                    className="mt-2 w-full rounded-full bg-[#f8f8fb] py-3 text-sm font-semibold text-[#7c5dfa] hover:bg-[#f0effb]"
                                >
                                    + Add New Item
                                </Button>
                            </div>
                        )}
                    </FieldArray>

                    <div className="mt-10 flex flex-wrap items-center justify-between gap-3">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={onCancel}
                            className="rounded-full px-4 py-2 text-slate-500 hover:bg-slate-100"
                        >
                            Discard
                        </Button>
                        <div className="flex flex-wrap justify-end gap-2 sm:gap-3">
                            <Button
                                type="button"
                                onClick={() => onSubmit(values, "draft")}
                                className="rounded-full bg-slate-700 px-5 py-2 text-white hover:bg-slate-800"
                            >
                                Save as Draft
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="rounded-full bg-[#7c5dfa] px-5 py-2 text-white hover:bg-[#6c4ee8]"
                            >
                                Save & Send
                            </Button>
                        </div>
                    </div>
                </Form>
            )}
        </Formik>
    );
}