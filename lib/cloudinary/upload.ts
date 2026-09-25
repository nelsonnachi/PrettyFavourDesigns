import cloudinary from "./config";

type CloudinaryUploadResult = {
  url: string;
  publicId: string;
};

export async function uploadImageToCloudinary(
  file: File,
  folder: string,
): Promise<CloudinaryUploadResult> {
  const arrayBuffer = await file.arrayBuffer();

  const buffer = Buffer.from(arrayBuffer);

  console.log("CLOUDINARY UPLOAD START");
  console.log("File name:", file.name);
  console.log("File type:", file.type);
  console.log("File size:", file.size);
  console.log("Folder:", folder);

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          console.error("CLOUDINARY ACTUAL ERROR:", error);

          reject(error);

          return;
        }

        if (!result) {
          console.error(
            "CLOUDINARY ERROR: No result returned",
          );

          reject(
            new Error("Cloudinary returned no upload result"),
          );

          return;
        }

        console.log("CLOUDINARY SUCCESS:", {
          publicId: result.public_id,
          url: result.secure_url,
        });

        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      },
    );

    uploadStream.end(buffer);
  });
}