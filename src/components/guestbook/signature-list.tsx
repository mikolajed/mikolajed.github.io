"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSignMessage } from "wagmi";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, KeyRound, Loader2 } from "lucide-react";
import { isEncryptedEntry, decryptMessage, deriveKeyFromSignature } from "@/lib/encryption";
import { DEPLOYER_ADDRESS, DECRYPT_SIGN_MESSAGE } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function SignatureList({ 
    entries, 
    address 
}: { 
    entries: any[], 
    address?: `0x${string}` 
}) {
  const [sigPage, setSigPage] = useState(0);
  const [sigsPerPage, setSigsPerPage] = useState(4);
  const sigContainerRef = useRef<HTMLDivElement>(null);
  const [decryptKey, setDecryptKey] = useState<Uint8Array | null>(null);
  const { signMessageAsync, isPending: isSigning } = useSignMessage();

  const isDeployer = address?.toLowerCase() === DEPLOYER_ADDRESS.toLowerCase();

  // Reset decrypt key when wallet changes
  useEffect(() => {
    setDecryptKey(null);
  }, [address]);

  const handleDecrypt = async () => {
    try {
      const signature = await signMessageAsync({ message: DECRYPT_SIGN_MESSAGE });
      const derived = await deriveKeyFromSignature(signature);
      console.log("Derived public key (B64):", derived.publicKeyB64);
      console.log("↑ Set this as DEPLOYER_PUBLIC_KEY_B64 in constants.ts");
      setDecryptKey(derived.secretKey);
    } catch (err) {
      console.error("Signing cancelled or failed:", err);
    }
  };

  // Dynamically calculate how many signature cards fit
  const CARD_GAP = 12; // space-y-3

  const recalcPageSize = useCallback(() => {
    if (sigContainerRef.current) {
      const panelHeight = sigContainerRef.current.clientHeight;
      const available = panelHeight - 48 - 48;
      const fits = Math.max(1, Math.floor((available + CARD_GAP) / (92 + CARD_GAP)));
      setSigsPerPage(prev => {
        if (prev !== fits) {
          setSigPage(0);
        }
        return fits;
      });
    }
  }, []);

  useEffect(() => {
    recalcPageSize();
    const el = sigContainerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(recalcPageSize);
    observer.observe(el);
    return () => observer.disconnect();
  }, [recalcPageSize]);

  const hasEncryptedEntries = entries?.some((e: any) => isEncryptedEntry(e.message));

  return (
    <motion.div
        ref={sigContainerRef}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="flex flex-col min-h-0 px-2 lg:px-8 xl:px-12 py-4"
      >
        <div className="flex items-center justify-between mb-6 flex-shrink-0">
          <h3 className="text-base font-semibold text-muted-foreground uppercase tracking-widest">
            Signatures
          </h3>
          <div className="flex items-center gap-3">
            {/* Decrypt button for deployer */}
            {isDeployer && hasEncryptedEntries && !decryptKey && (
              <button
                onClick={handleDecrypt}
                disabled={isSigning}
                className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full ring-1 ring-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 transition-colors disabled:opacity-50"
              >
                {isSigning ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <KeyRound className="w-3 h-3" />
                )}
                Decrypt
              </button>
            )}
            {decryptKey && (
              <span className="flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full bg-green-500/10 text-green-600 dark:text-green-400 ring-1 ring-inset ring-green-500/20">
                <KeyRound className="w-3 h-3" />
                Unlocked
              </span>
            )}
            {entries && entries.length > 0 && (
              <span className="text-xs text-muted-foreground font-mono">
                {Math.min(sigPage * sigsPerPage + 1, entries.length)}–{Math.min((sigPage + 1) * sigsPerPage, entries.length)} of {entries.length}
              </span>
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col min-h-0">
          {entries && entries.length > 0 ? (
            <>
              <div className="flex-1">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={sigPage}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="space-y-3"
                  >
                    {[...entries].reverse().slice(sigPage * sigsPerPage, (sigPage + 1) * sigsPerPage).map((entry, i) => (
                      <motion.div
                        key={`${entry.signer}-${entry.timestamp}`}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06, ease: "easeOut" }}
                        className="p-5 bg-card border border-border backdrop-blur-sm rounded-xl space-y-2 hover:bg-accent hover:text-accent-foreground transition-colors"
                      >
                        {isEncryptedEntry(entry.message) ? (() => {
                          const decrypted = decryptKey ? decryptMessage(entry.message, decryptKey) : null;
                          return decrypted ? (
                            <p className="text-base text-card-foreground font-serif italic break-words flex items-start gap-2">
                              <Lock className="w-3.5 h-3.5 text-green-500 mt-1 flex-shrink-0" />
                              <span>&ldquo;{decrypted}&rdquo;</span>
                            </p>
                          ) : (
                            <p className="text-base text-muted-foreground flex items-center gap-2">
                              <Lock className="w-3.5 h-3.5 text-amber-500" />
                              <span className="font-light italic">Encrypted message</span>
                            </p>
                          );
                        })() : (
                          <p className="text-base text-card-foreground font-serif italic break-words">
                            &ldquo;{entry.message}&rdquo;
                          </p>
                        )}
                        <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono">
                          <span>{entry.signer.slice(0, 6)}...{entry.signer.slice(-4)}</span>
                          <span>•</span>
                          <span>{new Date(Number(entry.timestamp) * 1000).toLocaleDateString()}</span>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Pagination Controls */}
              {entries.length > sigsPerPage && (
                <div className="flex items-center justify-center gap-4 pt-6 flex-shrink-0">
                  <button
                    onClick={() => setSigPage(p => Math.max(0, p - 1))}
                    disabled={sigPage === 0}
                    className="text-xs font-semibold uppercase tracking-widest text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 disabled:opacity-30 transition-colors"
                  >
                    ← Previous
                  </button>
                  <div className="flex gap-1.5">
                    {Array.from({ length: Math.ceil(entries.length / sigsPerPage) }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setSigPage(i)}
                        className={cn(
                          "w-1.5 h-1.5 rounded-full transition-all",
                          i === sigPage
                            ? "bg-zinc-900 dark:bg-zinc-100 scale-125"
                            : "bg-zinc-300 dark:bg-zinc-600 hover:bg-zinc-500"
                        )}
                      />
                    ))}
                  </div>
                  <button
                    onClick={() => setSigPage(p => Math.min(Math.ceil(entries.length / sigsPerPage) - 1, p + 1))}
                    disabled={sigPage >= Math.ceil(entries.length / sigsPerPage) - 1}
                    className="text-xs font-semibold uppercase tracking-widest text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 disabled:opacity-30 transition-colors"
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-base text-muted-foreground font-light italic font-serif text-center">
                The page is blank.<br />Be the first to write history.
              </p>
            </div>
          )}
        </div>
      </motion.div>
  );
}
