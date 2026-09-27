"use client";

import { useRef, useState } from "react";
import { AppMedia } from "@/components/AppMedia";
import { isVideoMediaUrl } from "@/lib/image-url";
import { Film, X, Upload } from "lucide-react";

export type AdminMediaUploadTarget = "room" | "table";

type AdminMediaUploadProps = {
  urls: string[];
  onChange: (urls: string[]) => void;
  target: AdminMediaUploadTarget;
  entityId?: string;
  slug?: string;
  disabled?: boolean;
};

const UPLOAD_PATH: Record<AdminMediaUploadTarget, string> = {
  room: "/api/admin/rooms/upload",
  table: "/api/admin/restaurant-tables/upload",
};

export function AdminMediaUpload({
  urls,
  onChange,
  target,
  entityId,
  slug,
  disabled,
}: AdminMediaUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function uploadFiles(files: FileList | null) {
    if (!files?.length || disabled) return;
    setError(null);
    setUploading(true);
    const added: string[] = [];

    try {
      for (const file of Array.from(files)) {
        const form = new FormData();
        form.append("file", file);
        if (entityId) form.append("entityId", entityId);
        if (slug) form.append("slug", slug);

        const res = await fetch(UPLOAD_PATH[target], { method: "POST", body: form });
        const data = (await res.json()) as { url?: string; error?: string };
        if (!res.ok || !data.url) {
          throw new Error(data.error ?? "Upload impossible.");
        }
        added.push(data.url);
      }
      onChange([...urls, ...added]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload impossible.");
      if (added.length > 0) onChange([...urls, ...added]);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function removeAt(index: number) {
    onChange(urls.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/avif,video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov"
          multiple
          className="hidden"
          disabled={disabled || uploading}
          onChange={(e) => uploadFiles(e.target.files)}
        />
        <button
          type="button"
          disabled={disabled || uploading}
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm border border-palm-soft/60 rounded-sm hover:bg-palm-soft/20 disabled:opacity-50"
        >
          <Upload size={16} />
          {uploading ? "Envoi en cours…" : "Importer photos / vidéos"}
        </button>
        <span className="text-xs text-ink/50">Images max. 5 Mo · MP4 max. 50 Mo</span>
      </div>

      {error && (
        <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-sm px-3 py-2" role="alert">
          {error}
        </p>
      )}

      {urls.length > 0 && (
        <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {urls.map((url, index) => (
            <li
              key={`${url}-${index}`}
              className="relative aspect-[4/3] rounded-sm overflow-hidden border border-palm-soft/40 bg-black/5"
            >
              <AppMedia src={url} alt="" fill sizes="160px" className="object-cover" playing={isVideoMediaUrl(url)} />
              {isVideoMediaUrl(url) && (
                <span className="absolute top-1.5 left-1.5 inline-flex items-center gap-1 text-[10px] uppercase bg-black/60 text-white px-1.5 py-0.5 rounded-sm">
                  <Film size={10} /> Vidéo
                </span>
              )}
              <button
                type="button"
                onClick={() => removeAt(index)}
                className="absolute top-1.5 right-1.5 p-1 rounded-full bg-palm-deep/80 text-linen hover:bg-palm-deep"
                aria-label="Retirer ce média"
              >
                <X size={14} />
              </button>
              {index === 0 && (
                <span className="absolute bottom-1.5 left-1.5 text-[10px] uppercase tracking-wide bg-black/55 text-white px-1.5 py-0.5 rounded-sm">
                  Principale
                </span>
              )}
            </li>
          ))}
        </ul>
      )}

      <p className="text-xs text-ink/50">
        Le premier média est utilisé sur les cartes. Les URLs sont enregistrées en base (Supabase Storage).
      </p>
    </div>
  );
}
