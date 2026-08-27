import { NextResponse } from "next/server";
import { getInvoicesCollection } from "@/lib/db";
import { invoiceSchema } from "@/lib/schemas/invoice";
import { z } from "zod";
import type { Document, Filter } from "mongodb";

type RouteContext = { params: Promise<{ id: string }> };

function invoiceFilter(id: string): Filter<Document> {
    return { $expr: { $eq: [{ $toString: "$_id" }, id] } };
}

export async function GET(_request: Request, { params }: RouteContext) {
    const { id } = await params;
    const collection = await getInvoicesCollection<Document>();
    const invoice = await collection.findOne(invoiceFilter(id));

    if (!invoice) {
        return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    return NextResponse.json(invoice);
}

export async function PATCH(request: Request, { params }: RouteContext) {
    const { id } = await params;
    const result = invoiceSchema.partial().safeParse(await request.json());

    if (!result.success) {
        return NextResponse.json(
            { error: z.formatError(result.error) },
            { status: 400 },
        );
    }

    const collection = await getInvoicesCollection<Document>();
    const updateResult = await collection.findOneAndUpdate(
        invoiceFilter(id),
        { $set: result.data },
        { returnDocument: "after" },
    );

    if (!updateResult) {
        return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    return NextResponse.json(updateResult);
}

export async function DELETE(_request: Request, { params }: RouteContext) {
    const { id } = await params;
    const collection = await getInvoicesCollection<Document>();
    const result = await collection.deleteOne(invoiceFilter(id));

    if (!result.deletedCount) {
        return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
}
