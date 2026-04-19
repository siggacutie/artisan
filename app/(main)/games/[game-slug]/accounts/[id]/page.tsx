"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function AccountDetailPage() {
  const router = useRouter();
  const { "game-slug": gameSlug } = useParams();

  useEffect(() => {
    // Redirect to the main accounts page as details are now handled via modal
    router.replace(`/games/${gameSlug}/accounts`);
  }, [router, gameSlug]);

  return null;
}
