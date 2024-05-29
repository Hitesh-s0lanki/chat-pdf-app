import { Pinecone } from '@pinecone-database/pinecone';

if (!process.env.PINECONE_API_KEY) {
    throw new Error("PINECONE DB Api not provided!")
}

export const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
