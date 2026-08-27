import { NextResponse } from "next/server";
import { getInvoicesCollection } from "@/lib/db";
import {invoiceSchema} from "@/lib/schemas/invoice";
import {z} from "zod";
import { randomBytes } from "crypto";
import type { Collection, Filter } from "mongodb";

type InvoiceDocument = z.infer<typeof invoiceSchema> & { _id: string };

async function createInvoiceId(collection: Collection<InvoiceDocument>) {
    let invoiceId: string;

    do {
        invoiceId = randomBytes(3).toString("hex").toUpperCase();
    } while (await collection.findOne({ _id: invoiceId }));

    return invoiceId;
}

export async function GET(request:Request) {
    const { searchParams} = new URL(request.url);
    const statusParam = searchParams.get("status");
    const collection = await getInvoicesCollection<InvoiceDocument>();
    const filter: Filter<InvoiceDocument> = statusParam
        ? { status: { $in: statusParam.split(",") as InvoiceDocument["status"][] } }
        : {};
    const invoices = await collection.find(filter).toArray();
    return NextResponse.json(invoices);

}

export async function POST(request:Request) {
    const body = await request.json();
    const result = invoiceSchema.safeParse(body);

    if (!result.success) {
        return NextResponse.json(
            {error: z.formatError(result.error)},
            {status: 400}
        );
    }

    const collection = await getInvoicesCollection<InvoiceDocument>();
    const invoiceId = await createInvoiceId(collection);
    const invoice = { _id: invoiceId, ...result.data };
    await collection.insertOne(invoice);

    return NextResponse.json(
        invoice,
        {status: 201}
    );
}
