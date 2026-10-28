"use client";

import { useEffect, useState } from "react";

export default function FollowButton({
  followingId,
}: {
  followingId: string;
}) {
  const [following, setFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  async function loadStatus() {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    const res = await fetch(`/api/users/follow?followingId=${followingId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    setFollowing(Boolean(data.following));
    setLoading(false);
  }

  async function toggleFollow() {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    setLoading(true);

    const res = await fetch("/api/users/follow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        followingId,
      }),
    });

    const data = await res.json();

    setLoading(false);

    if (!data.success) {
      alert(data.error || "Erro ao seguir");
      return;
    }

    setFollowing(data.following);
  }

  useEffect(() => {
    loadStatus();
  }, []);

  return (
    <button
      onClick={toggleFollow}
      disabled={loading}
      className={`
        px-8 py-4 rounded-2xl font-black transition disabled:opacity-50
        ${
          following
            ? "bg-white/5 border border-[#B69AF8]/20 text-[#DCCBFF]"
            : "bg-gradient-to-r from-[#B69AF8] to-[#F3B4A8] text-[#080B2A]"
        }
      `}
    >
      {loading ? "..." : following ? "Seguindo" : "Seguir"}
    </button>
  );
}