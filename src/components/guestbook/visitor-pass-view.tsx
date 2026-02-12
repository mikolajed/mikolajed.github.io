"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useReadContract } from "wagmi";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { VISITOR_PASS_ABI, VISITOR_PASS_ADDRESS } from "@/lib/guestbook-abi";

export function VisitorPassView({ address }: { address?: `0x${string}` }) {
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
        className="text-[10px] font-medium text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors"
        type="button"
      >
        View
      </button>

      {typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.div
              key="visitor-pass-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/90 backdrop-blur-md p-6"
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
                  <img src={imageUrl} alt="Visitor Pass" className="w-full h-full object-cover" />
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
