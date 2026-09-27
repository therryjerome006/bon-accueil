import { createAdminClient } from "@/lib/supabase/admin";

export type AdminMediaScope = "room" | "table";

const BUCKET_BY_SCOPE: Record<AdminMediaScope, string> = {
  room: "room-images",
  table: "table-images",
};

const IMAGE_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
]);

const VIDEO_MIME = new Set(["video/mp4", "video/webm", "video/quicktime"]);

const EXT_BY_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
  "video/mp4": "mp4",
  "video/webm": "webm",
  "video/quicktime": "mov",
};

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_VIDEO_BYTES = 50 * 1024 * 1024;

function sanitizeFolderPart(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}

export type UploadAdminMediaInput = {
  scope: AdminMediaScope;
  bytes: Buffer;
  contentType: string;
  originalName: string;
  entityId?: string;
  slug?: string;
};

export async function uploadAdminMediaToStorage(input: UploadAdminMediaInput): Promise<string> {
  const contentType = input.contentType.toLowerCase();
  const isImage = IMAGE_MIME.has(contentType);
  const isVideo = VIDEO_MIME.has(contentType);

  if (!isImage && !isVideo) {
    throw new Error("Format non supporté. Images (JPEG, PNG, WebP…) ou vidéo MP4/WebM.");
  }

  const maxBytes = isVideo ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
  if (input.bytes.length > maxBytes) {
    throw new Error(isVideo ? "Vidéo trop lourde (max. 50 Mo)." : "Image trop lourde (max. 5 Mo).");
  }

  const bucket = BUCKET_BY_SCOPE[input.scope];
  const folder =
    sanitizeFolderPart(input.entityId ?? "") ||
    sanitizeFolderPart(input.slug ?? "") ||
    "draft";
  const ext = EXT_BY_MIME[contentType] ?? (isVideo ? "mp4" : "jpg");
  const baseName =
    sanitizeFolderPart(input.originalName.replace(/\.[^.]+$/, "")) || (isVideo ? "video" : "photo");
  const objectPath = `${folder}/${Date.now()}-${baseName}.${ext}`;

  const admin = createAdminClient();
  const { error } = await admin.storage.from(bucket).upload(objectPath, input.bytes, {
    contentType,
    cacheControl: "3600",
    upsert: false,
  });

  if (error) {
    if (/bucket/i.test(error.message)) {
      throw new Error(
        `Bucket Supabase « ${bucket} » introuvable. Exécutez supabase/storage-hotel-media.sql.`,
      );
    }
    throw new Error(error.message);
  }

  const { data } = admin.storage.from(bucket).getPublicUrl(objectPath);
  return data.publicUrl;
}
