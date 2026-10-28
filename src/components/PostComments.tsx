"use client";

import { useEffect, useState } from "react";

export default function PostComments({
  postId,
}: {
  postId: string;
}) {
  const [open, setOpen] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  async function loadComments() {
    try {
      setLoading(true);

      const res = await fetch(`/api/posts/${postId}/comments`, {
        cache: "no-store",
      });

      const data = await res.json();

      setComments(data.comments || []);
    } catch {
      setComments([]);
    } finally {
      setLoading(false);
    }
  }

  async function sendComment() {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    if (!text.trim()) {
      alert("Digite um comentário.");
      return;
    }

    try {
      setSending(true);

      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          text,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        alert(data.error || "Erro ao comentar");
        return;
      }

      setText("");
      loadComments();
    } catch {
      alert("Erro ao comentar");
    } finally {
      setSending(false);
    }
  }

  function toggleComments() {
    const next = !open;
    setOpen(next);

    if (next) {
      loadComments();
    }
  }

  return (
    <div className="mt-4">
      <button
        onClick={toggleComments}
        className="text-zinc-400 hover:text-[#F3B4A8] text-sm font-bold"
      >
        {open ? "Ocultar comentários" : "Ver comentários"}
      </button>

      {open && (
        <div className="mt-4 bg-black/20 border border-white/10 rounded-2xl p-4">
          {loading ? (
            <p className="text-sm text-zinc-400">
              Carregando comentários...
            </p>
          ) : comments.length === 0 ? (
            <p className="text-sm text-zinc-400">
              Nenhum comentário ainda. Seja o primeiro.
            </p>
          ) : (
            <div className="space-y-3">
              {comments.map((comment) => (
                <div
                  key={comment._id}
                  className="bg-white/5 border border-white/10 rounded-xl p-3"
                >
                  <p className="font-black text-[#DCCBFF]">
                    {comment.userName || "Usuário"}
                  </p>

                  <p className="text-zinc-300 text-sm mt-1">
                    {comment.text}
                  </p>

                  <p className="text-[11px] text-zinc-500 mt-2">
                    {comment.createdAt
                      ? new Date(comment.createdAt).toLocaleString("pt-BR")
                      : ""}
                  </p>
                </div>
              ))}
            </div>
          )}

          <div className="mt-4 flex gap-2">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Escreva um comentário..."
              className="flex-1 bg-white/5 border border-[#B69AF8]/20 rounded-xl px-4 py-3 text-white placeholder:text-zinc-500 outline-none focus:border-[#F3B4A8]"
            />

            <button
              onClick={sendComment}
              disabled={sending}
              className="bg-gradient-to-r from-[#B69AF8] to-[#F3B4A8] text-[#080B2A] px-5 py-3 rounded-xl font-black disabled:opacity-50"
            >
              {sending ? "..." : "Enviar"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}