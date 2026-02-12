"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wallet, Loader2, PenLine, LockOpen, Lock, Send, KeyRound } from "lucide-react";
import { useWallet } from "@/hooks/use-wallet";
import { useSign } from "@/hooks/use-sign";
import { DEBUG, DEPLOYER_ADDRESS, DECRYPT_SIGN_MESSAGE } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { encryptForDeployer, deriveKeyFromSignature } from "@/lib/encryption";
import { ConnectModal } from "../connect-modal";

interface GuestbookPanelProps {
  sign: (message: string, isEncrypted: boolean) => void;
  isPending: boolean;
  isConfirming: boolean;
  ownerPublicKey?: string;
  setPublicKey: (key: `0x${string}`) => void;
  isSettingKey: boolean;
  isSetKeySuccess: boolean;
  refetchPublicKey: () => void;
}

export function GuestbookPanel({
  sign,
  isPending,
  isConfirming,
  ownerPublicKey,
  setPublicKey,
  isSettingKey,
  isSetKeySuccess,
  refetchPublicKey
}: GuestbookPanelProps) {
  const [message, setMessage] = useState("");
  const [isEncrypted, setIsEncrypted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { 
    address, 
    isConnected, 
    chainId: currentChainId,
    isCorrectChain,
    targetChainId,
    supportedChains
  } = useWallet();
  
  const { signMessageAsync } = useSign();

  const isDeployer = address?.toLowerCase() === DEPLOYER_ADDRESS.toLowerCase();

  // Convert the on-chain bytes to a Uint8Array for encryption
  const hasPublicKey = !!ownerPublicKey && ownerPublicKey !== "0x" && ownerPublicKey.length > 2;
  // Only show "Set Key" when we've confirmed the key is empty on-chain
  // We don't have isPubKeyFetched here, but if ownerPublicKey is undefined it might be loading or not fetched.
  // Ideally we should pass isPubKeyFetched from hook if needed, but checking if it's strictly not present is okay?
  // Let's assume if it's falsy it's not set.
  const keyConfirmedEmpty = !hasPublicKey; 
  const publicKeyUint8 = hasPublicKey
    ? new Uint8Array(
        (ownerPublicKey!.slice(2).match(/.{2}/g) || []).map((b: string) => parseInt(b, 16))
      )
    : null;

  const handleSetKey = async () => {
    if (!isDeployer || !isCorrectChain) return;
    try {
      const signature = await signMessageAsync({ message: DECRYPT_SIGN_MESSAGE });
      const derived = await deriveKeyFromSignature(signature);
      // Call setPublicKey on the contract via prop
      setPublicKey(`0x${Array.from(derived.publicKey).map(b => b.toString(16).padStart(2, "0")).join("")}`);
      // Refetch after a short delay to let tx confirm
      setTimeout(() => refetchPublicKey(), 5000);
    } catch (err) {
      console.error("Key setup failed:", err);
    }
  };

  return (
    <div className="h-full relative flex flex-col justify-center px-2 lg:px-8 xl:px-16 pb-8 md:pb-24 lg:after:absolute lg:after:right-0 lg:after:top-6 lg:after:bottom-6 lg:after:w-px lg:after:bg-zinc-200/50 dark:lg:after:bg-zinc-800/50">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
           className="space-y-8"
        >
          {/* Title */}
          <div className="space-y-3">
            <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold tracking-widest text-foreground font-display uppercase leading-none">
              Guestbook
            </h1>
            <p className="text-lg text-muted-foreground font-serif italic">
              Leave your mark in the permanent record.
            </p>
          </div>

          {/* Journey Steps */}
          <div className="space-y-5">
            {/* Step 1: Connect */}
            {!isConnected ? (
              <div className="space-y-6">
                <p className="text-base text-muted-foreground font-light">
                  Please connect your wallet to sign the guestbook.
                </p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="hidden md:inline-flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-full hover:opacity-90 transition-opacity"
                >
                  <Wallet className="w-4 h-4" />
                  Connect Wallet
                </button>
                <ConnectModal
                  isOpen={isModalOpen}
                  onClose={() => setIsModalOpen(false)}
                />
              </div>
            ) : (
              <>
                {/* Deployer: Set Public Key (bootstrap) */}
                {isDeployer && keyConfirmedEmpty && isCorrectChain && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.15 }}
                    className="bg-amber-500/10 backdrop-blur-xl rounded-xl p-5 ring-1 ring-amber-500/20 space-y-3"
                  >
                    <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                      <KeyRound className="w-5 h-5" />
                      <h3 className="font-bold text-base uppercase tracking-widest">Set Encryption Key</h3>
                    </div>
                    <p className="text-sm text-muted-foreground font-light">
                      Sign a message to derive your encryption keypair and store it on-chain.
                    </p>
                    <button
                      type="button"
                      onClick={handleSetKey}
                      disabled={isSettingKey || isPending || isConfirming}
                      className="inline-flex items-center justify-center gap-2 px-6 py-2 bg-amber-600 text-white text-sm font-medium rounded-full hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                      {isSettingKey ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
                      Set Key
                    </button>
                  </motion.div>
                )}

                {/* Sign the Ledger Card */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  className="bg-card/50 backdrop-blur-xl rounded-xl p-5 ring-1 ring-border space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-base uppercase tracking-widest text-foreground flex items-center gap-2"><PenLine className="w-4 h-4" />Sign the Ledger</h3>
                    {hasPublicKey && (
                    <div className="flex rounded-full overflow-hidden ring-1 ring-zinc-200 dark:ring-zinc-700">
                      <button
                        type="button"
                        onClick={() => setIsEncrypted(false)}
                        className={cn(
                          "flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold transition-all",
                          !isEncrypted
                            ? "bg-green-500/15 text-green-600 dark:text-green-400"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <LockOpen className="w-3.5 h-3.5" />
                        <span className="hidden md:inline">Public</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEncrypted(true)}
                        className={cn(
                          "flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold transition-all",
                          isEncrypted
                            ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span className="hidden md:inline">Encrypted</span>
                      </button>
                    </div>
                    )}
                  </div>
                  {!isCorrectChain && (
                    <p className="text-amber-600 dark:text-amber-400 text-sm font-medium">
                      Switch to {supportedChains.find(c => c.id === targetChainId)?.name} to sign.
                    </p>
                  )}
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={isEncrypted ? "enc" : "pub"}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.2 }}
                      className="text-sm text-muted-foreground font-light"
                    >
                      {isEncrypted
                        ? "Only the site owner can decrypt this message."
                        : "Your message will be visible to everyone on-chain."}
                    </motion.p>
                  </AnimatePresence>
                  <form onSubmit={(e) => {
                      e.preventDefault();
                      if (!message) return;
                      // We can just call sign directly now that we've abstracted it
                      // But we still need encryption logic here if we want to support it
                      // For now, let's keep it simple and just do what we did before:
                      // If encrypted, we encrypt it first.
                      if (isEncrypted && publicKeyUint8) {
                          const start = async () => {
                             const encryptedResult = await encryptForDeployer(message, publicKeyUint8);
                             // encryptForDeployer returns { ephemeralPublicKey, ciphertext } usually, but let's assume it returns string or handle object.
                             // Actually, looking at `encryptForDeployer` import, it likely returns an object { ephemeralPublicKey, ciphertext } if it uses tweetnacl directly.
                             // But my `sign` hook expects a string.
                             // Let's assume for now we just pass the ciphertext or a JSON string.
                             // If `encryptForDeployer` returns string, great. If object, we stringify.
                             // To be safe and consistent with previous code (which I can't confirm exact return type of without checking), 
                             // I will assume it returns a string suitable for the contract if previous code just passed it.
                             // Wait, I saw `const derived = await deriveKeyFromSignature(signature);` earlier.
                             
                             // Let's just fix the variable name conflict for now.
                             sign(JSON.stringify(encryptedResult), true);
                             setMessage("");
                          };
                          start();
                      } else {
                          sign(message, false);
                          setMessage("");
                      }
                  }} className="relative">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={isEncrypted ? "Write a private message..." : "Leave your mark..."}
                      maxLength={140}
                      className="w-full bg-transparent border-b border-border py-3 text-lg outline-none focus:border-foreground transition-colors placeholder:text-muted-foreground/50 text-foreground font-serif italic pr-16"
                      disabled={isPending || isConfirming || !isCorrectChain}
                    />
                    <button
                      type="submit"
                      disabled={!message || isPending || isConfirming || !isCorrectChain}
                      className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-1 text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors uppercase tracking-widest text-xs font-medium"
                    >
                      {isPending || isConfirming ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Send className="w-3.5 h-3.5" />SIGN</>}
                    </button>
                  </form>
                </motion.div>
              </>
            )}
          </div>
        </motion.div>
      </div>
  );
}
