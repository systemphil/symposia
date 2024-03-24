import sharp from 'sharp'
import { NextRequest, NextResponse } from 'next/server'
import { requireAdminAuth } from '@/server/auth'
import { gcPipeImageUpload } from '@/server/controllers/gcController';

/**
 * Thanks to these resources for helping me understand how to do this!
 * @link https://stackoverflow.com/questions/62411430/post-multipart-form-data-to-serverless-next-js-api-running-on-vercel-now-sh/77353442#77353442
 * @link https://github.com/DanielOttodev/GoogleStorage-UploadTutorial/blob/master/index.js
 */
export async function POST(request: NextRequest) {
    requireAdminAuth();

    const formData = await request.formData();
    const imageFile = formData.get('image') as unknown as File | null;

    if (!imageFile) return NextResponse.json(null, { status: 400 });

    const imageFileName = imageFile.name;
    const imageBuffer = Buffer.from(await imageFile.arrayBuffer());

    const editedImageBuffer = await sharp(imageBuffer)
        .jpeg({ quality: 80 })
        .toBuffer();

    const imageUrl = gcPipeImageUpload({
        file: editedImageBuffer,
        fileName: `${imageFileName}`,
    });

    return NextResponse.json({ imageUrl })
}

// Export types for API Routes
export type UploadProfileImageResponse = ExtractGenericFromNextResponse<
  Awaited<ReturnType<typeof POST>>
>
type ExtractGenericFromNextResponse<Type> = Type extends NextResponse<infer X>
  ? X
  : never