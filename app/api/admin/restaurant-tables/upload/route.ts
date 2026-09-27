import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin/auth-api";
import { uploadAdminMediaToStorage } from "@/lib/admin/admin-media-storage";

export async function POST(request: Request) {
  const auth = await requireAdminApi();
  if ("error" in auth && auth.error) return auth.error;

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Formulaire invalide." }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Fichier requis." }, { status: 400 });
  }

  const entityId =
    String(formData.get("entityId") ?? formData.get("tableId") ?? "").trim() || undefined;
  const slug = String(formData.get("slug") ?? "").trim() || undefined;

  try {
    const bytes = Buffer.from(await file.arrayBuffer());
    const url = await uploadAdminMediaToStorage({
      scope: "table",
      bytes,
      contentType: file.type || "application/octet-stream",
      originalName: file.name,
      entityId,
      slug,
    });
    return NextResponse.json({ url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Échec de l’upload.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
