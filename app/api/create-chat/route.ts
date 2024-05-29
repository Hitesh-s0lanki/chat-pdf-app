import { db } from "@/lib/db";
import { loadFileDataToPinecone } from "@/lib/pinecone-server.action";
import { chats } from "@/lib/schema";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {

    const { userId } = await auth()

    if (!userId) {
        return NextResponse.json({
            error: "User not found!"
        }, { status: 401 })
    }

    try {
        const formData = await req.formData()

        const file: File = formData.get('file') as File
        const file_key = formData.get("file_key") as string
        const file_name = formData.get("file_name") as string
        const file_url = formData.get("file_url") as string

        await loadFileDataToPinecone(file, file_key)

        const chat_id = await db.insert(chats).values({
            fileKey: file_key,
            pdfName: file_name,
            pdfUrl: file_url,
            userId,
            createdAt: new Date()
        }).returning({
            insertedId: chats.id
        })

        return NextResponse.json({
            chat_id: chat_id[0].insertedId,
        }, { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}