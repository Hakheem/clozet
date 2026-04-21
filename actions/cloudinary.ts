"use server";

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads a base64 string or file path to Cloudinary.
 * Returns the secure URL and other metadata.
 */
export async function uploadToCloudinary(base64: string, folder: string = "clozet") {
  try {
    if (!base64) return null;

    // Remove the prefix (e.g., data:image/jpeg;base64,) if present
    const cleanBase64 = base64.split(",")[1] || base64;

    const result = await cloudinary.uploader.upload(`data:image/jpeg;base64,${cleanBase64}`, {
      folder,
      resource_type: "auto",
      transformation: [
        { quality: "auto", fetch_format: "auto" }
      ]
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
    };
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error("Failed to upload image to Cloudinary");
  }
}

/**
 * Deletes an image from Cloudinary using its public ID.
 */
export async function deleteFromCloudinary(publicId: string) {
  try {
    await cloudinary.uploader.destroy(publicId);
    return { success: true };
  } catch (error) {
    console.error("Cloudinary deletion error:", error);
    return { success: false };
  }
}
