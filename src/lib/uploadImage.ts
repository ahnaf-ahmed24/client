import { IMGBB_KEY } from "./config";

export async function uploadToImgbb(file: File): Promise<string> {
  if (!IMGBB_KEY) {
    throw new Error(
      "Image hosting is not configured. Add NEXT_PUBLIC_IMGBB_KEY to client/.env, or paste an image URL instead."
    );
  }
  const form = new FormData();
  form.append("image", file);

  const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`, {
    method: "POST",
    body: form,
  });
  const json = (await res.json()) as {
    success?: boolean;
    data?: { url?: string; display_url?: string };
  };
  if (!json?.success) {
    throw new Error("Image upload failed. Try a smaller image or paste a URL instead.");
  }
  return (json.data?.display_url || json.data?.url) as string;
}
