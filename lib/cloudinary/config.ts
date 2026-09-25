import { v2 as cloudinary } from "cloudinary";

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

console.log("CLOUDINARY CONFIG CHECK:", {
  cloudName,
  apiKeyPresent: Boolean(apiKey),
  apiSecretPresent: Boolean(apiSecret),
});

if (!cloudName || !apiKey || !apiSecret) {
  throw new Error(
    "Cloudinary environment variables are missing",
  );
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
});

export default cloudinary;