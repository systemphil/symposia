import { gcUploadVideo } from '@/server/controllers/storageController';
import { NextRequest, NextResponse } from 'next/server';
 
export async function GET(req: NextRequest, res: NextResponse) {
    const url = new URL(req.url);
    const fileName = url.searchParams.get("file")
    if (!fileName) throw new Error("No filename as single string");
    const response = await gcUploadVideo(fileName);
    /**
     * TypeScript Warning: Although Response.json() is valid, native TypeScript types 
     * currently shows an error, you can use NextResponse.json() for typed responses instead.
     * @see https://nextjs.org/docs/app/building-your-application/routing/route-handlers#caching
     */
    return NextResponse.json(response);
}

