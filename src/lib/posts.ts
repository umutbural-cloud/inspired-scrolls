import { supabase } from "@/integrations/supabase/client";

export type PostStatus =
  | "draft"
  | "in_review"
  | "changes_requested"
  | "approved"
  | "published"
  | "rejected";

export type Post = {
  id: string;
  author_id: string;
  title: string;
  slug: string | null;
  excerpt: string | null;
  content: any;
  content_text: string;
  cover_image_url: string | null;
  category_slug: string | null;
  tags: string[];
  meta_title: string | null;
  meta_description: string | null;
  og_image_url: string | null;
  status: PostStatus;
  read_minutes: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export const STATUS_LABELS: Record<PostStatus, string> = {
  draft: "Taslak",
  in_review: "İncelemede",
  changes_requested: "Revizyon istendi",
  approved: "Onaylandı",
  published: "Yayında",
  rejected: "Reddedildi",
};

export const STATUS_TONES: Record<PostStatus, string> = {
  draft: "bg-muted text-muted-foreground",
  in_review: "bg-amber-100 text-amber-900 dark:bg-amber-950/40 dark:text-amber-200",
  changes_requested: "bg-orange-100 text-orange-900 dark:bg-orange-950/40 dark:text-orange-200",
  approved: "bg-emerald-100 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200",
  published: "bg-accent/15 text-accent",
  rejected: "bg-red-100 text-red-900 dark:bg-red-950/40 dark:text-red-200",
};

export function slugify(input: string): string {
  const map: Record<string, string> = {
    ç: "c", Ç: "c", ğ: "g", Ğ: "g", ı: "i", İ: "i",
    ö: "o", Ö: "o", ş: "s", Ş: "s", ü: "u", Ü: "u",
  };
  return input
    .split("")
    .map((c) => map[c] ?? c)
    .join("")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

export function calcReadMinutes(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

export async function ensureUniqueSlug(base: string, excludeId?: string): Promise<string> {
  let slug = base || `yazi-${Date.now()}`;
  let i = 1;
  // try up to 20 variants
  while (i < 20) {
    const { data } = await supabase
      .from("posts")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();
    if (!data || data.id === excludeId) return slug;
    i += 1;
    slug = `${base}-${i}`;
  }
  return `${base}-${Date.now()}`;
}

export async function uploadPostImage(file: File, userId: string): Promise<string> {
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${userId}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("post-images").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw error;
  const { data } = supabase.storage.from("post-images").getPublicUrl(path);
  return data.publicUrl;
}