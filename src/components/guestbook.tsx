"use client";

import { useState, useEffect } from "react";
import { GuestbookPanel } from "./guestbook/guestbook-panel";
import { SignatureList } from "./guestbook/signature-list";
import { useGuestbook } from "@/hooks/use-guestbook";
import { useWallet } from "@/hooks/use-wallet";

export function GuestbookJourney() {
  const { address, isConnected, disconnect } = useWallet();

  const { 
    signatures, 
    totalCount, 
    totalPages, 
    isLoadingSignatures, 
    sign, 
    isSigning, 
    isSignConfirming,
    isSignConfirmed, // Keeping this as it's used in useEffect
    ownerPublicKey,
    setPublicKey,
    isSettingKey,
    isSetKeySuccess,
    refetchPublicKey,
    refetchCount,
    refetchSignatures
  } = useGuestbook(address);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (isSignConfirmed) {
      refetchCount();
      refetchSignatures();
    }
  }, [isSignConfirmed]);

  if (!mounted) return null;

  return (
    <div className="flex-1 w-full grid grid-cols-1 lg:grid-cols-2 gap-0 min-h-0 px-0 lg:px-12">
      {/* ─── LEFT: Interaction Panel ─── */}
      <GuestbookPanel 
        sign={sign}
        isPending={isSigning}
        isConfirming={isSignConfirming}
        ownerPublicKey={ownerPublicKey}
        setPublicKey={setPublicKey}
        isSettingKey={isSettingKey}
        isSetKeySuccess={isSetKeySuccess}
        refetchPublicKey={refetchPublicKey}
      />

      {/* ─── RIGHT: Signatures Panel ─── */}
      <SignatureList entries={signatures as any[]} address={address} />
    </div>
  );
}
