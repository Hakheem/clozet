import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
export { cloudinary };

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const LUKKUU_FOLDERS = {
  PRODUCTS: "lukkuu/products",
  CATEGORIES: "lukkuu/categories",
  USER_IMAGES: "lukkuu/users",
  BANNERS: "lukkuu/banners",
};

/**
 * Upload a file as a base64 string or buffer to Cloudinary.
 */
export async function uploadToCloudinary(
  file: string | Buffer,
  folder: string
): Promise<UploadApiResponse> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      file as string,
      {
        folder,
        resource_type: "auto",
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result!);
      }
    );
  });
}

/**
 * Extract public ID from a Cloudinary URL.
 * URL format: https://res.cloudinary.com/[name]/image/upload/v[version]/[folder]/[filename].[ext]
 */
export function getPublicIdFromUrl(url: string): string | null {
  try {
    // Split by '/upload/' and get the part after the version (v123456789/)
    const parts = url.split("/upload/");
    if (parts.length < 2) return null;

    const afterUpload = parts[1].split("/");
    // First part is usually version (starts with 'v')
    const pathParts = afterUpload[0].startsWith("v")
      ? afterUpload.slice(1)
      : afterUpload;

    // Join and remove extension
    const publicIdWithExt = pathParts.join("/");
    return publicIdWithExt.split(".")[0];
  } catch (error) {
    console.error("Error parsing public ID from URL:", error);
    return null;
  }
}

/**
 * Delete an image from Cloudinary by its URL or public ID.
 */
export async function deleteFromCloudinary(urlOrId: string): Promise<void> {
  const publicId = urlOrId.startsWith("http")
    ? getPublicIdFromUrl(urlOrId)
    : urlOrId;

  if (!publicId) return;

  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error(`Failed to delete asset from Cloudinary: ${publicId}`, error);
  }
}
