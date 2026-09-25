export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_PHOTO_DIMENSION = 1024;

/** Returns an error message, or null if the file is an accepted image under 5 MB. */
export function validateImageFile(file: File, label: string): string | null {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) return `Your ${label} must be a JPG, PNG, or WebP image.`;
  if (file.size > MAX_UPLOAD_BYTES) return `Your ${label} must be under 5 MB (this one is ${(file.size / 1024 / 1024).toFixed(1)} MB).`;
  return null;
}

/**
 * Shrinks a profile photo to at most 1024px on its longest side (JPEG), so
 * uploads are quick and admin pages don't load multi-megabyte originals.
 * Small photos, or any the browser can't decode, are returned unchanged.
 */
export async function shrinkProfilePhoto(file: File): Promise<File> {
  try {
    const bitmap = await createImageBitmap(file);
    const scale = MAX_PHOTO_DIMENSION / Math.max(bitmap.width, bitmap.height);
    if (scale >= 1 && file.size < 1024 * 1024) {
      bitmap.close();
      return file;
    }
    const width = Math.round(bitmap.width * Math.min(1, scale));
    const height = Math.round(bitmap.height * Math.min(1, scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    canvas.getContext("2d")!.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.86));
    if (!blob || blob.size >= file.size) return file;
    return new File([blob], file.name.replace(/\.\w+$/, "") + ".jpg", { type: "image/jpeg" });
  } catch {
    return file;
  }
}
