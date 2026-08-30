"use client";

import { Formik, Form, Field, FieldArray, getIn, useFormikContext } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { addDays, differenceInCalendarDays } from "date-fns";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { invoiceFormSchema, type InvoiceFormValues } from "@/lib/schemas/invoice";
import DatePickerField from "@/components/invoices/DatePickerField";
import Button from "@/components/common/Button";
import { cn } from "@/lib/utils";

interface InvoiceFormProps {
    onSubmit: (data: InvoiceFormValues, status: "draft" | "pending") => void | Promise<void>;
    onCancel: () => void;
    initialValues?: InvoiceFormValues;
    className?: string;
}

const emptyItem = { name: "", quantity: 0, price: 0 };
const fieldLabelClass = "mb-2 block text-xs text-slate-500 dark:text-white";

function FieldError({ name }: { name: string }) {
    const { errors, touched, submitCount } = useFormikContext<InvoiceFormValues>();
    const error = getIn(errors, name);
    const isTouched = getIn(touched, name);

    if ((!isTouched && submitCount === 0) || !error) return null;

    const message = String(error).includes("Invalid input")
        ? "required"
        : String(error);

    return <span className="field-error absolute right-0 top-0 z-10 max-w-full truncate text-[10px] text-red-500">{message}</span>;
}

function QuantityError({ name }: { name: string }) {
    const { errors, submitCount } = useFormikContext<InvoiceFormValues>();
    const error = getIn(errors, name);

    if (submitCount === 0 || error !== "Quantity must be at least 1") return null;

    return <span className="field-error absolute left-0 top-full z-10 mt-1 whitespace-nowrap text-xs text-red-500">{error}</span>;
}

const fieldClass = "group relative has-[.field-error]:[&_input]:border-red-500 has-[.field-error]:[&_button]:border-red-500";

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
    const [draftAttempted, setDraftAttempted] = useState(false);

    return (
        <Formik<InvoiceFormValues>
            initialValues={initialValues || defaultValues}
            validationSchema={toFormikValidationSchema(invoiceFormSchema)}
            validateOnBlur
            onSubmit={(values) => {
                onSubmit(values, "pending");
            }}
        >
            {({ values, isSubmitting, submitCount, setFieldValue }) => (
                <Form className={cn("min-h-full w-full max-w-[615px] bg-card px-4 py-6 text-card-foreground dark:bg-[#141625] dark:[&_input]:border-[#1E2139] dark:[&_input]:bg-[#1E2139] dark:[&_input]:text-white dark:[&_input]:placeholder:text-[#888eb0] md:px-8 md:py-8", className)}>
                    <div className="mx-auto w-full max-w-[466px]">
                    <h2 className="mb-10 mt-5 text-xl font-bold sm:text-2xl" >New Invoice</h2>

                    <p className="mb-6 font-bold text-xs text-[#7c5dfa]">Bill From</p>
                    <div className={fieldClass}>
                        <label htmlFor="senderAddress.street" className={fieldLabelClass}>Street Address</label>
                        <Field
                            id="senderAddress.street"
                            name="senderAddress.street"
                            className="w-full max-w-[466px] h-[48px] border border-[#dfe3fa] rounded-sm px-4 py-3 text-xs font-bold text-foreground outline-none transition placeholder:text-muted-foreground focus:border-[#7c5dfa] focus:ring-2 focus:ring-[#7c5dfa]/10"
                        />
                        <FieldError name="senderAddress.street" />
                    </div>

                    <div className="mt-3 grid grid-cols-1 gap-6 md:grid-cols-3">
                        <div className={fieldClass}>
                            <label htmlFor="senderAddress.city" className={fieldLabelClass}>City</label>
                            <Field
                                id="senderAddress.city"
                                name="senderAddress.city"
                                className="w-full max-w-[139px] h-[48px] border border-[#dfe3fa] rounded-sm px-5 py-[15px] text-xs text-foreground font-bold outline-none transition placeholder:text-muted-foreground focus:border-[#7c5dfa] focus:ring-2 focus:ring-[#7c5dfa]/10"
                            />
                            <FieldError name="senderAddress.city" />
                        </div>
                        <div className={fieldClass}>
                            <label htmlFor="senderAddress.postCode" className={fieldLabelClass}>Post Code</label>
                            <Field
                                id="senderAddress.postCode"
                                name="senderAddress.postCode"
                                className="w-full max-w-[139px] h-[48px] border border-[#dfe3fa] rounded-sm px-5 py-[15px] text-xs text-foreground font-bold outline-none transition placeholder:text-muted-foreground focus:border-[#7c5dfa] focus:ring-2 focus:ring-[#7c5dfa]/10"
                            />
                            <FieldError name="senderAddress.postCode" />
                        </div>
                        <div className={fieldClass}>
                            <label htmlFor="senderAddress.country" className={fieldLabelClass}>Country</label>
                            <Field
                                id="senderAddress.country"
                                name="senderAddress.country"
                                className="w-full max-w-[139px] h-[48px] border border-[#dfe3fa] rounded-sm px-5 py-[15px] text-xs font-bold text-foreground outline-none transition placeholder:text-muted-foreground focus:border-[#7c5dfa] focus:ring-2 focus:ring-[#7c5dfa]/10"
                            />
                            <FieldError name="senderAddress.country" />
                        </div>
                    </div>

                    <p className="mb-6 mt-5 mt-8 font-bold text-xs text-[#7c5dfa]">Bill To</p>
                    <div className={fieldClass}>
                        <label htmlFor="clientName" className={fieldLabelClass}>Client&apos;s Name</label>
                        <Field
                            id="clientName"
                            name="clientName"
                            className="w-full max-w-[466px] h-[48px] border border-[#dfe3fa] rounded-sm px-4 py-3 text-xs text-foreground font-bold outline-none transition placeholder:text-muted-foreground focus:border-[#7c5dfa] focus:ring-2 focus:ring-[#7c5dfa]/10"
                        />
                        <FieldError name="clientName" />
                    </div>

                    <div className={`mt-3 ${fieldClass}`}>
                        <label htmlFor="clientEmail" className={fieldLabelClass}>Client&apos;s Email</label>
                        <Field
                            id="clientEmail"
                            name="clientEmail"
                            type="email"
                            placeholder="e.g. email@example.com"
                            className="w-full max-w-[466px] h-[48px] border border-[#dfe3fa] rounded-sm px-4 py-3 text-xs text-foreground font-bold outline-none transition placeholder:text-muted-foreground focus:border-[#7c5dfa] focus:ring-2 focus:ring-[#7c5dfa]/10 dark:!text-[#626C69]"
                        />
                        <FieldError name="clientEmail" />
                    </div>

                    <div className={`mt-3 ${fieldClass}`}>
                        <label htmlFor="clientAddress.street" className={fieldLabelClass}>Street Address</label>
                        <Field
                            id="clientAddress.street"
                            name="clientAddress.street"
                            className="w-full max-w-[466px] h-[48px] border border-[#dfe3fa] rounded-sm px-4 py-3 text-xs text-foreground font-bold outline-none transition placeholder:text-muted-foreground focus:border-[#7c5dfa] focus:ring-2 focus:ring-[#7c5dfa]/10"
                        />
                        <FieldError name="clientAddress.street" />
                    </div>

                    <div className="mt-3 grid grid-cols-1 gap-6 md:grid-cols-3">
                        <div className={fieldClass}>
                            <label htmlFor="clientAddress.city" className={fieldLabelClass}>City</label>
                            <Field
                                id="clientAddress.city"
                                name="clientAddress.city"
                                className="w-full max-w-[139px] h-[48px] border border-[#dfe3fa] rounded-sm px-5 py-[15px] text-xs text-foreground font-bold outline-none transition placeholder:text-muted-foreground focus:border-[#7c5dfa] focus:ring-2 focus:ring-[#7c5dfa]/10"
                            />
                            <FieldError name="clientAddress.city" />
                        </div>
                        <div className={fieldClass}>
                            <label htmlFor="clientAddress.postCode" className={fieldLabelClass}>Post Code</label>
                            <Field
                                id="clientAddress.postCode"
                                name="clientAddress.postCode"
                                className="w-full max-w-[139px] h-[48px] border border-[#dfe3fa] rounded-sm px-5 py-[15px] text-xs text-foreground font-bold outline-none transition placeholder:text-muted-foreground focus:border-[#7c5dfa] focus:ring-2 focus:ring-[#7c5dfa]/10"
                            />
                            <FieldError name="clientAddress.postCode" />
                        </div>
                        <div className={fieldClass}>
                            <label htmlFor="clientAddress.country" className={fieldLabelClass}>Country</label>
                            <Field
                                id="clientAddress.country"
                                name="clientAddress.country"
                                className="w-full max-w-[139px] h-[48px] border border-[#dfe3fa] rounded-sm px-5 py-[15px] text-xs text-foreground font-bold outline-none transition placeholder:text-muted-foreground focus:border-[#7c5dfa] focus:ring-2 focus:ring-[#7c5dfa]/10"
                            />
                            <FieldError name="clientAddress.country" />
                        </div>
                    </div>

                    <div className="mt-8 grid grid-cols-1 gap-3 md:grid-cols-2">
                        <div className={fieldClass}>
                            <label className={fieldLabelClass}>Invoice Date</label>
                            <DatePickerField name="createdAt" />
                            <FieldError name="createdAt" />
                        </div>
                        <div className={fieldClass}>
                            <label className={fieldLabelClass}>Payment Terms</label>
                            <FieldError name="paymentDue" />
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

                    <div className={`mt-3 ${fieldClass}`}>
                        <label htmlFor="description" className={fieldLabelClass}>Project Description</label>
                        <Field
                            id="description"
                            name="description"
                            placeholder="e.g. Graphic Design Service"
                            className="w-full max-w-[466px] h-[48px] rounded-sm border border-[#dfe3fa] px-4 py-3 text-xs text-foreground font-bold outline-none transition placeholder:text-muted-foreground focus:border-[#7c5dfa] focus:ring-2 focus:ring-[#7c5dfa]/10 dark:!text-[#626C69] "
                        />
                        <FieldError name="description" />
                    </div>

                    <p className="mb-3 mt-8 text-lg font-bold text-slate-500">Items List</p>

                    <FieldArray name="items">
                        {({ push, remove }) => (
                            <div>
                                {values.items.map((_, index: number) => (
                                    <div key={index} className="mb-4 grid grid-cols-1 items-end gap-2 md:grid-cols-12">
                                        <div className={`${fieldClass} md:col-span-5`}>
                                            <label htmlFor={`items.${index}.name`} className={fieldLabelClass}>Item Name</label>
                                            <Field
                                                id={`items.${index}.name`}
                                                name={`items.${index}.name`}
                                                placeholder="Item name"
                                                className="w-full max-w-[184px] h-[48px] rounded-sm border font-bold border-[#dfe3fa] px-4 py-3 text-xs text-foreground outline-none transition placeholder:text-black focus:border-[#7c5dfa] focus:ring-2 focus:ring-[#7c5dfa]/10"
                                            />
                                        </div>
                                        <div className={`${fieldClass} md:col-span-2`}>
                                            <label htmlFor={`items.${index}.quantity`} className={fieldLabelClass}>Qty</label>
                                            <Field
                                                id={`items.${index}.quantity`}
                                                name={`items.${index}.quantity`}
                                                type="number"
                                                placeholder="0"
                                                className="w-full max-w-[70px] h-[48px] rounded-sm border font-bold border-[#dfe3fa] px-4 py-3 text-xs text-foreground outline-none transition placeholder:text-black [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none focus:border-[#7c5dfa] focus:ring-2 focus:ring-[#7c5dfa]/10"
                                            />
                                            <QuantityError name={`items.${index}.quantity`} />
                                        </div>
                                        <div className={`${fieldClass} md:col-span-2`}>
                                            <label htmlFor={`items.${index}.price`} className={fieldLabelClass}>Price</label>
                                            <Field
                                                id={`items.${index}.price`}
                                                name={`items.${index}.price`}
                                                type="number"
                                                placeholder="0"
                                                className="w-full max-w-[100px] h-[48px] rounded-sm border font-bold border-[#dfe3fa] px-4 py-3 text-xs text-foreground outline-none transition placeholder:text-black [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none focus:border-[#7c5dfa] focus:ring-2 focus:ring-[#7c5dfa]/10"
                                            />
                                        </div>
                                        <div className="self-start pl-2 text-left md:col-span-2">
                                            <span className={fieldLabelClass}>Total</span>
                                            <div className="mt-[23px] text-xs font-bold text-slate-400">
                                                {((values.items[index]?.quantity || 0) * (values.items[index]?.price || 0))}
                                            </div>
                                        </div>
                                        <div className="md:col-span-1 md:text-center pb-2">
                                            <Button
                                               bgColor="bg-transparent"
                                                size="icon"
                                                onClick={() => remove(index)}
                                                aria-label={`Delete item ${index + 1}`}
                                                className="text-slate-400 hover:text-red-500"
                                            >
                                                <Trash2 className="size-5" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}

                                <Button
                                    type="button"
                                    onClick={() => push(emptyItem)}
                                    bgColor="bg-transparent"
                                    className="mt-2 w-full rounded-full bg-[#f8f8fb] py-5  text-xs font-bold  text-xs text-slate-400 hover:bg-[#f0effb] dark:bg-[#1E2139] dark:text-white"
                                >
                                    + Add New Item
                                </Button>
                                {(draftAttempted || submitCount > 0) && values.items.length === 0 && (
                                    <p className="mt-2 text-xs text-red-500">An item must be added</p>
                                )}
                            </div>
                        )}
                    </FieldArray>

              

                    <div className="mt-10 flex flex-wrap items-center justify-between gap-3">
                        <Button
                            type="button"
                            onClick={onCancel}
                            classes="px-4 py-2 text-slate-400 hover:bg-slate-100 font-bold bg-[#f8f8fb] dark:bg-[#1E2139] dark:text-slate-100"
                        >
                            Discard
                        </Button>
                        <div className="flex flex-wrap justify-end gap-2 sm:gap-3">
                            <Button
                                type="button"
                                onClick={() => {
                                    if (values.items.length === 0) {
                                        setDraftAttempted(true);
                                        return;
                                    }
                                    onSubmit(values, "draft");
                                }}
                                bgColor="bg-slate-700"
                                classes="px-5 py-2 text-slate-400 hover:bg-slate-800 font-bold dark:bg-[#1E2139]"
                            >
                                Save as Draft
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                bgColor="bg-[#7c5dfa]"
                                classes="px-5 py-2 text-white hover:bg-[#6c4ee8] font-bold"
                            >
                                Save & Send
                            </Button>
                        </div>
                    </div>
                    </div>
                </Form>
            )}
        </Formik>
    );
}