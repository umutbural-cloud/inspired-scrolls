import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { diffWords } from "diff";
import { AccountLayout } from "@/components/site/AccountLayout";
import { AccountGuard } from "@/components/site/AccountGuard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { STATUS_LABELS, STATUS_TONES, type Post } from "@/lib/posts";
import { Check, X, MessageSquare, Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

type Revision = {
  id: string;
  post_id: string;
  editor_id: string;
  before_content: any;
  after_content: any;
  before_text: string;
  after_text: string;
  note: string | null;
  status: "pending" | "accepted" | "rejected";
  resolved_at: string | null;
  created_at: string;
};

type Comment = {
  id: string;
  post_id: string;
  author_id: string;
  body: string;
  created_at: string;
};

function RevisionInner() {
  const { id } = useParams();
  const { user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [revisions, setRevisions] = useState<Revision[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [busy, setBusy] = useState(false);

  const load = async () => {
    if (!id) return;
    const [{ data: p }, { data: r }, { data: c }] = await Promise.all([
      supabase.from("posts").select("*").eq("id", id).maybeSingle(),
      supabase.from("post_revisions").select("*").eq("post_id", id).order("created_at", { ascending: false }),
      supabase.from("post_comments").select("*").eq("post_id", id).order("created_at", { ascending: true }),
    ]);
    setPost((p as Post) ?? null);
    setRevisions((r as Revision[]) ?? []);
    setComments((c as Comment[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, [id]);

  const acceptRevision = async (rev: Revision) => {
    if (!post) return;
    setBusy(true);
    try {
      const { error: e1 } = await supabase
        .from("posts")
        .update({
          content: rev.after_content,
          content_text: rev.after_text,
        })
        .eq("id", post.id);
      if (e1) throw e1;
      const { error: e2 } = await supabase
        .from("post_revisions")
        .update({ status: "accepted", resolved_at: new Date().toISOString() })
        .eq("id", rev.id);
      if (e2) throw e2;
      toast.success("Değişiklik kabul edildi");
      await load();
    } catch (e: any) {
      toast.error(e.message || "Hata");
    } finally {
      setBusy(false);
    }
  };

  const rejectRevision = async (rev: Revision) => {
    setBusy(true);
    try {
      const { error } = await supabase
        .from("post_revisions")
        .update({ status: "rejected", resolved_at: new Date().toISOString() })
        .eq("id", rev.id);
      if (error) throw error;
      toast.success("Reddedildi");
      await load();
    } catch (e: any) {
      toast.error(e.message || "Hata");
    } finally {
      setBusy(false);
    }
  };

  const sendComment = async () => {
    if (!post || !user || !newComment.trim()) return;
    setBusy(true);
    try {
      const { error } = await supabase.from("post_comments").insert({
        post_id: post.id,
        author_id: user.id,
        body: newComment.trim(),
      });
      if (error) throw error;
      setNewComment("");
      await load();
    } catch (e: any) {
      toast.error(e.message || "Hata");
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <AccountLayout title="Yükleniyor…">
        <div className="flex justify-center py-20 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      </AccountLayout>
    );
  }

  if (!post) {
    return <AccountLayout title="Bulunamadı"><p className="text-muted-foreground">Yazı bulunamadı.</p></AccountLayout>;
  }

  const pending = revisions.filter((r) => r.status === "pending");
  const resolved = revisions.filter((r) => r.status !== "pending");

  return (
    <AccountLayout
      eyebrow="Revize incele"
      title={post.title || "Başlıksız"}
      description="Editörünün önerdiği değişiklikleri kabul et veya reddet."
      actions={
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={STATUS_TONES[post.status]}>{STATUS_LABELS[post.status]}</Badge>
          <Link to={`/profil/yaz/${post.id}`}>
            <Button size="sm" variant="outline"><ArrowLeft className="h-3.5 w-3.5 mr-1.5" />Editöre dön</Button>
          </Link>
        </div>
      }
    >
      <div className="space-y-10">
        <section>
          <h2 className="font-display text-xl mb-4">Bekleyen öneriler ({pending.length})</h2>
          {pending.length === 0 ? (
            <div className="border border-dashed border-hairline py-10 text-center text-sm text-muted-foreground">
              Bekleyen öneri yok.
            </div>
          ) : (
            <ul className="space-y-6">
              {pending.map((rev) => (
                <RevisionCard key={rev.id} rev={rev} onAccept={() => acceptRevision(rev)} onReject={() => rejectRevision(rev)} busy={busy} />
              ))}
            </ul>
          )}
        </section>

        {resolved.length > 0 && (
          <section>
            <h2 className="font-display text-xl mb-4">Geçmiş</h2>
            <ul className="space-y-3">
              {resolved.map((rev) => (
                <li key={rev.id} className="border border-hairline px-4 py-3 text-sm flex items-center justify-between">
                  <span className="text-muted-foreground line-clamp-1">{rev.note ?? "Öneri"}</span>
                  <Badge variant="outline" className={rev.status === "accepted" ? STATUS_TONES.approved : STATUS_TONES.rejected}>
                    {rev.status === "accepted" ? "Kabul edildi" : "Reddedildi"}
                  </Badge>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section>
          <h2 className="font-display text-xl mb-4 flex items-center gap-2">
            <MessageSquare className="h-4 w-4" /> Mesajlar ({comments.length})
          </h2>
          <div className="space-y-3 mb-4">
            {comments.map((c) => (
              <div key={c.id} className={`p-3 border border-hairline ${c.author_id === user?.id ? "bg-surface-sunken/40 ml-8" : "mr-8"}`}>
                <div className="text-xs text-muted-foreground mb-1">
                  {c.author_id === user?.id ? "Sen" : "Editör"} · {new Date(c.created_at).toLocaleString("tr-TR")}
                </div>
                <p className="text-sm whitespace-pre-wrap">{c.body}</p>
              </div>
            ))}
          </div>
          <div className="flex gap-2 items-end">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Mesaj yaz…"
              className="min-h-[60px]"
            />
            <Button onClick={sendComment} disabled={busy || !newComment.trim()}>Gönder</Button>
          </div>
        </section>
      </div>
    </AccountLayout>
  );
}

function RevisionCard({
  rev, onAccept, onReject, busy,
}: { rev: Revision; onAccept: () => void; onReject: () => void; busy: boolean }) {
  const parts = useMemo(() => diffWords(rev.before_text || "", rev.after_text || ""), [rev]);
  return (
    <li className="border border-hairline">
      {rev.note && (
        <div className="px-4 py-3 border-b border-hairline bg-surface-sunken/30 text-sm">
          <span className="eyebrow text-muted-foreground mr-2">Editör notu</span>
          {rev.note}
        </div>
      )}
      <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-hairline">
        <div className="p-4">
          <div className="eyebrow text-muted-foreground mb-2">Önce</div>
          <p className="text-sm whitespace-pre-wrap leading-relaxed">{rev.before_text}</p>
        </div>
        <div className="p-4">
          <div className="eyebrow text-muted-foreground mb-2">Sonra</div>
          <p className="text-sm whitespace-pre-wrap leading-relaxed">
            {parts.map((part, i) => (
              <span
                key={i}
                className={
                  part.added
                    ? "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200"
                    : part.removed
                      ? "bg-red-100 dark:bg-red-950/40 text-red-900 dark:text-red-200 line-through opacity-70"
                      : ""
                }
              >
                {part.value}
              </span>
            ))}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-hairline">
        <Button size="sm" variant="outline" onClick={onReject} disabled={busy}>
          <X className="h-3.5 w-3.5 mr-1.5" /> Reddet
        </Button>
        <Button size="sm" onClick={onAccept} disabled={busy}>
          <Check className="h-3.5 w-3.5 mr-1.5" /> Kabul et
        </Button>
      </div>
    </li>
  );
}

export default function RevisionPage() {
  return <AccountGuard><RevisionInner /></AccountGuard>;
}