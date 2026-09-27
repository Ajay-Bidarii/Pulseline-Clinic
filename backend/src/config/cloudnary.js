import { v2 as cloudinary } from "cloudinary";
import fs from "node:fs/promises";
import { env } from "./env.js";

cloudinary.config({
  cloud_name: env.cloudinary.cloudName,
  api_key: env.cloudinary.apiKey,
  api_secret: env.cloudinary.apiSecret,
});

/**
 * Uploads one local file (as written to disk by multer's temp storage) to
 * Cloudinary, then removes the local temp file regardless of outcome so
 * `uploads/temp` never accumulates orphaned files.
 */
export async function uploadToCloudinary(file, options = {}) {
  const { folder = "healthcare/misc", resourceType = "auto" } = options;
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder,
      resource_type: resourceType,
    });
    return {
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      bytes: result.bytes,
    };
  } finally {
    await fs.unlink(file.path).catch(() => {});
  }
}

/** Uploads several local files in parallel, preserving order. */
export async function uploadMulterToCloudinary(files, options = {}) {
  if (!files || files.length === 0) return [];
  return Promise.all(files.map((file) => uploadToCloudinary(file, options)));
}

/** Deletes a previously uploaded asset — used when replacing an avatar or report file. */
export async function deleteFromCloudinary(publicId, resourceType = "image") {
  if (!publicId) return null;
  return cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
}

export { cloudinary };
