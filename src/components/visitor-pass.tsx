"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useWallet } from "@/hooks/use-wallet";
import { useVisitorPass } from "@/hooks/use-visitor-pass";
import { VisitorPassView } from "@/components/guestbook/visitor-pass-view";
import { motion, AnimatePresence } from "framer-motion";
import { Ticket, X, Loader2 } from "lucide-react";
import { DEBUG } from "@/lib/constants";

export function VisitorPass() {
  const { address, isConnected, chainId, targetChainId } = useWallet();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  const { 
    mint, 
    isMinting, 
    isMintConfirming, 
    hasMinted,
    isMintConfirmed,
    refetchHasMinted,
    isValidChain 
  } = useVisitorPass(address, targetChainId, chainId);

  useEffect(() => {
    if (isMintConfirmed) {
      refetchHasMinted();
    }
  }, [isMintConfirmed, refetchHasMinted]);

  const handleMint = () => {
    if (!isValidChain) {
      alert(`Please switch to ${DEBUG ? "Foundry (Localhost)" : "Sepolia"}`);
      return;
    }
    mint();
  };



  // Hydration guard
  if (!mounted) return null;
  if (!isConnected) return null;

  return (
    <div className="bg-card backdrop-blur-xl rounded-2xl p-6 sm:p-8 shadow-sm border border-border ring-1 ring-border/50">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="space-y-1">
          <h4 className="text-base font-bold text-foreground flex items-center gap-2">
            <Ticket className="w-5 h-5" />
            Visitor Pass
          </h4>
          <p className="text-sm text-muted-foreground font-light">
            Mint a permanent, on-chain memento of your visit.
          </p>
        </div>
        
        {hasMinted ? (
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 px-3 py-1 bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-medium rounded-full ring-1 ring-inset ring-green-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              Collected
            </span>
            <VisitorPassView address={address} />
          </div>
        ) : (
          <button
            type="button"
            onClick={handleMint}
            disabled={isMinting || isMintConfirming || !isValidChain}
            className="px-6 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-full hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
          >
            {isMinting || isMintConfirming ? <Loader2 className="w-4 h-4 animate-spin" /> : "Mint Free"}
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * VisitorPassView — fullscreen NFT viewer via React Portal.
 * Portal ensures the modal escapes all parent stacking contexts.
 * AnimatePresence is placed INSIDE the portal so framer-motion can track children.
 */

