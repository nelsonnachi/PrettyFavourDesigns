import { NextRequest, NextResponse } from "next/server";

import { uploadImageToCloudinary } from "@/lib/cloudinary/upload";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          error: "Image file is required",
        },
        {
          status: 400,
        },
      );
    }

    const result = await uploadImageToCloudinary(
      file,
      "shoppfd/test",
    );

    return NextResponse.json({
      success: true,
      message: "Image uploaded successfully",
      data: result,
    });
  } catch (error) {
    console.error("CLOUDINARY UPLOAD TEST ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Cloudinary upload failed",
      },
      {
        status: 500,
      },
    );
  }
}