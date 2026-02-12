"use client";

import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, Check, ExternalLink } from "lucide-react";
import QRCode from "react-qr-code";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  address: string;
}

export function AddressModal({ isOpen, onClose, address }: AddressModalProps) {
  const [copied, setCopied] = useState(false);

  if (typeof document === "undefined") return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-card/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 w-full max-w-sm shadow-2xl ring-1 ring-border space-y-6 relative overflow-hidden"
          >
             {/* Decorative background elements */}
            <div className="absolute top-0 right-0 -mt-16 -mr-16 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex justify-between items-center relative z-10">
              <h3 className="text-xl font-bold tracking-tight text-foreground">
                Developer Address
              </h3>
              <button 
                onClick={onClose} 
                className="text-muted-foreground hover:text-foreground transition-colors p-1 hover:bg-secondary/50 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6 relative z-10">
              <div className="flex justify-center p-4 bg-white rounded-2xl w-full aspect-square max-w-[240px] mx-auto shadow-sm ring-1 ring-border/10">
                 <QRCode
                    size={256}
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                    value={address}
                    viewBox={`0 0 256 256`}
                    fgColor="#000000"
                    bgColor="#ffffff"
                 />
              </div>

              <div className="space-y-4">
                  <p className="text-sm text-center text-muted-foreground">
                    Scan to send ETH, tokens, or NFTs on Ethereum, Base, Optimism, and other EVM chains.
                  </p>

                  <div className="flex gap-2 p-2 bg-secondary/30 rounded-xl ring-1 ring-border/50 items-center">
                     <p className="flex-1 font-mono text-xs text-foreground truncate px-2 select-all">
                        {address}
                     </p>
                     <button
                        onClick={handleCopy}
                        className={cn(
                            "p-2 rounded-lg transition-all",
                            copied 
                                ? "bg-green-500/10 text-green-600 dark:text-green-400 ring-1 ring-green-500/20" 
                                : "bg-background hover:bg-secondary text-muted-foreground hover:text-foreground ring-1 ring-border/50"
                        )}
                        title="Copy Address"
                     >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                     </button>
                  </div>
              </div>
              
              <div className="text-center">
                 <a 
                   href={`https://etherscan.io/address/${address}`} 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                 >
                    View on Etherscan
                    <ExternalLink className="w-3 h-3" />
                 </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
