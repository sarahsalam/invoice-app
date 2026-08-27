import clientPromise from "@/lib/mongodb";
import type { Collection, Document } from "mongodb";

export async function getInvoicesCollection<T extends Document = Document>(): Promise<Collection<T>> {
    const client = await clientPromise;
    const db = client.db("db-s");
    return db.collection<T>("invoices");
}