"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useChainId, useReadContract } from "wagmi";
import { VISITOR_PASS_ABI, VISITOR_PASS_ADDRESS, CHAIN_ID } from "@/lib/guestbook-abi";
import { motion, AnimatePresence } from "framer-motion";
import { Ticket, X, Loader2 } from "lucide-react";
import { DEBUG } from "@/lib/constants";

export function VisitorPass() {
  const { address, isConnected } = useAccount();
  const currentChainId = useChainId();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  const { data: mintHash, writeContract: writeMint, isPending: isMinting } = useWriteContract();
  const { isLoading: isMintConfirming, isSuccess: isMintConfirmed } = useWaitForTransactionReceipt({ hash: mintHash });
  
  const { data: hasMinted, refetch: refetchHasMinted } = useReadContract({
    abi: VISITOR_PASS_ABI,
    address: VISITOR_PASS_ADDRESS,
    functionName: "hasMinted",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  useEffect(() => {
    if (isMintConfirmed) {
      refetchHasMinted();
    }
  }, [isMintConfirmed, refetchHasMinted]);

  const handleMint = () => {
    if (currentChainId !== CHAIN_ID) {
      alert(`Please switch to ${DEBUG ? "Foundry (Localhost)" : "Sepolia"}`);
      return;
    }
    writeMint({
      abi: VISITOR_PASS_ABI,
      address: VISITOR_PASS_ADDRESS,
      functionName: "mint",
    });
  };

  const isCorrectChain = currentChainId === CHAIN_ID;

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
            disabled={isMinting || isMintConfirming || !isCorrectChain}
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
function VisitorPassView({ address }: { address?: `0x${string}` }) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const { data: tokenId } = useReadContract({
    abi: VISITOR_PASS_ABI,
    address: VISITOR_PASS_ADDRESS,
    functionName: "visitorTokenId",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const { data: tokenURI } = useReadContract({
    abi: VISITOR_PASS_ABI,
    address: VISITOR_PASS_ADDRESS,
    functionName: "tokenURI",
    args: tokenId !== undefined ? [tokenId] : undefined,
    query: { enabled: tokenId !== undefined },
  });

  useEffect(() => {
    if (tokenURI) {
      try {
        const base64Json = tokenURI.split(",")[1];
        const jsonStr = atob(base64Json);
        const metadata = JSON.parse(jsonStr);
        setImageUrl(metadata.image);
      } catch (e) {
        console.error("Failed to parse token URI", e);
      }
    }
  }, [tokenURI]);

  if (!imageUrl) return null;

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300 underline underline-offset-4 decoration-zinc-300 dark:decoration-zinc-700 transition-colors"
        type="button"
      >
        View Pass
      </button>

      {/* Portal the AnimatePresence to document.body */}
      {typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.div
              key="visitor-pass-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/80 backdrop-blur-md p-6"
              onClick={() => setIsOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="relative max-w-sm w-full bg-card rounded-[2rem] p-3 shadow-2xl ring-1 ring-border"
              >
                <button 
                  onClick={() => setIsOpen(false)}
                  className="absolute -top-14 right-0 p-2 text-muted-foreground hover:text-foreground transition-colors"
                  type="button"
                >
                  <span className="sr-only">Close</span>
                  <div className="bg-white/10 backdrop-blur-md p-2 rounded-full ring-1 ring-white/20">
                    <X className="w-6 h-6" />
                  </div>
                </button>
                
                <div className="relative aspect-square rounded-[1.5rem] overflow-hidden bg-black">
                  <img 
                    src={imageUrl} 
                    alt="Visitor Pass" 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
                </div>
                
                <div className="p-6 text-center space-y-2">
                  <h3 className="font-bold text-lg tracking-tight text-foreground font-display">
                    Visitor Pass <span className="text-muted-foreground">#{tokenId?.toString().padStart(3, '0')}</span>
                  </h3>
                  <p className="text-sm text-muted-foreground font-light">
                    A permanent, on-chain memento of your visit.
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
