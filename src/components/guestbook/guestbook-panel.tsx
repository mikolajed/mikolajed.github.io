"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wallet, LogOut, Ticket, Loader2, PenLine, LockOpen, Lock, Send, KeyRound } from "lucide-react";
import { useAccount, useChainId, useSwitchChain, useConnect, useDisconnect, useReadContract, useSignMessage } from "wagmi";
import { foundry, sepolia } from "wagmi/chains";
import { DEBUG, DEPLOYER_ADDRESS, DECRYPT_SIGN_MESSAGE } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { CHAIN_ID, GUESTBOOK_ABI, GUESTBOOK_ADDRESS } from "@/lib/guestbook-abi";
import { encryptForDeployer, deriveKeyFromSignature } from "@/lib/encryption";
import { encodeBase64 } from "tweetnacl-util";
import { VisitorPassView } from "./visitor-pass-view";

// ABI fragment for the new ownerPublicKey and setPublicKey functions
const PUBLIC_KEY_ABI = [
  {
    type: "function",
    name: "ownerPublicKey",
    inputs: [],
    outputs: [{ name: "", type: "bytes", internalType: "bytes" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "setPublicKey",
    inputs: [{ name: "_key", type: "bytes", internalType: "bytes" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
] as const;

export function GuestbookPanel({
    isConnected,
    address,
    hasMinted,
    isMinting,
    isMintConfirming,
    handleMint,
    writeContract,
    setIsConnectModalOpen,
    isPending,
    isConfirming
}: {
    isConnected: boolean,
    address?: `0x${string}`,
    hasMinted: boolean,
    isMinting: boolean,
    isMintConfirming: boolean,
    handleMint: () => void,
    writeContract: (args: any) => void,
    setIsConnectModalOpen: (open: boolean) => void,
    isPending: boolean,
    isConfirming: boolean
}) {
  const currentChainId = useChainId();
  const { switchChain, isPending: isSwitchingChain } = useSwitchChain();
  const { disconnect } = useDisconnect();
  const [message, setMessage] = useState("");
  const [isEncrypt, setIsEncrypt] = useState(false);
  const [isSettingKey, setIsSettingKey] = useState(false);
  const { signMessageAsync } = useSignMessage();

  const isCorrectChain = currentChainId === CHAIN_ID;
  const supportedChains = DEBUG ? [foundry, sepolia] : [sepolia];
  const isDeployer = address?.toLowerCase() === DEPLOYER_ADDRESS.toLowerCase();

  // Read the owner's public key from the contract
  const { data: ownerPubKeyBytes, refetch: refetchPubKey, isFetched: isPubKeyFetched } = useReadContract({
    abi: PUBLIC_KEY_ABI,
    address: GUESTBOOK_ADDRESS,
    functionName: "ownerPublicKey",
    query: { enabled: isCorrectChain },
  });

  // Convert the on-chain bytes to a Uint8Array for encryption
  const hasPublicKey = !!ownerPubKeyBytes && ownerPubKeyBytes !== "0x" && (ownerPubKeyBytes as string).length > 2;
  // Only show "Set Key" when we've confirmed the key is empty on-chain
  const keyConfirmedEmpty = isPubKeyFetched && !hasPublicKey;
  const publicKeyUint8 = hasPublicKey
    ? new Uint8Array(
        ((ownerPubKeyBytes as string).slice(2).match(/.{2}/g) || []).map((b: string) => parseInt(b, 16))
      )
    : null;

  // Bootstrap: sign message → derive keypair → set on contract
  const handleSetKey = async () => {
    if (!isDeployer || !isCorrectChain) return;
    setIsSettingKey(true);
    try {
      const signature = await signMessageAsync({ message: DECRYPT_SIGN_MESSAGE });
      const derived = await deriveKeyFromSignature(signature);
      // Call setPublicKey on the contract
      writeContract({
        abi: PUBLIC_KEY_ABI,
        address: GUESTBOOK_ADDRESS,
        functionName: "setPublicKey",
        args: [`0x${Array.from(derived.publicKey).map(b => b.toString(16).padStart(2, "0")).join("")}`],
      });
      // Refetch after a short delay to let tx confirm
      setTimeout(() => refetchPubKey(), 5000);
    } catch (err) {
      console.error("Key setup failed:", err);
    } finally {
      setIsSettingKey(false);
    }
  };

  return (
    <div className="relative flex flex-col justify-center px-2 lg:px-8 xl:px-16 lg:after:absolute lg:after:right-0 lg:after:top-6 lg:after:bottom-6 lg:after:w-px lg:after:bg-zinc-200/50 dark:lg:after:bg-zinc-800/50">
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
                  Connect your wallet to begin.
                </p>
                <button
                  onClick={() => setIsConnectModalOpen(true)}
                  className="inline-flex items-center justify-center gap-3 px-8 py-3 font-medium text-primary-foreground bg-primary rounded-full transition-transform active:scale-95 shadow-lg"
                >
                  <Wallet className="w-4 h-4" />
                  Connect Wallet
                </button>
              </div>
            ) : (
              <>
                {/* Connected Account Card */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="bg-card/50 backdrop-blur-xl rounded-xl px-4 py-3 ring-1 ring-border"
                >
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${isCorrectChain ? 'bg-green-500' : 'bg-amber-500'}`} />
                      <span className="font-mono text-muted-foreground">
                        {address?.slice(0, 6)}...{address?.slice(-4)}
                      </span>
                      <div className="flex gap-1 ml-1">
                        {supportedChains.map((chain) => (
                          <button
                            key={chain.id}
                            disabled={currentChainId === chain.id || isSwitchingChain}
                            onClick={() => switchChain({ chainId: chain.id })}
                            className={cn(
                              "px-2 py-0.5 rounded-full transition-all text-xs font-medium",
                              currentChainId === chain.id
                                ? "bg-primary text-primary-foreground"
                                : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                            )}
                          >
                            {chain.name}
                          </button>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => disconnect()}
                      className="text-muted-foreground hover:text-foreground transition-colors p-0.5"
                      title="Disconnect"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>

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

                {/* Visitor Pass Card */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="bg-card/50 backdrop-blur-xl rounded-xl p-5 ring-1 ring-border space-y-3"
                >
                  <div className="flex items-center gap-2 text-foreground">
                    <Ticket className="w-5 h-5" />
                    <h3 className="font-bold text-base uppercase tracking-widest">Visitor Pass</h3>
                  </div>
                  <p className="text-sm text-muted-foreground font-light">
                    Mint an on-chain souvenir of your visit.
                  </p>

                  {hasMinted ? (
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1.5 px-3 py-1 bg-green-500/10 text-green-600 dark:text-green-400 text-sm font-medium rounded-full ring-1 ring-inset ring-green-500/20">
                        <Ticket className="w-3 h-3" />
                        Collected
                      </span>
                      <VisitorPassView address={address} />
                    </div>
                  ) : (
                    <>
                      {!isCorrectChain && (
                        <p className="text-amber-600 dark:text-amber-400 text-sm font-medium">
                          Switch to {supportedChains.find(c => c.id === CHAIN_ID)?.name} first.
                        </p>
                      )}
                      <button
                        type="button"
                        onClick={handleMint}
                        disabled={isMinting || isMintConfirming || !isCorrectChain}
                        className="inline-flex items-center justify-center gap-2 px-6 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-full hover:opacity-90 transition-opacity disabled:opacity-50"
                      >
                        {isMinting || isMintConfirming ? <Loader2 className="w-4 h-4 animate-spin" /> : "Mint"}
                      </button>
                    </>
                  )}
                </motion.div>

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
                        onClick={() => setIsEncrypt(false)}
                        className={cn(
                          "flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold transition-all",
                          !isEncrypt
                            ? "bg-green-500/15 text-green-600 dark:text-green-400"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <LockOpen className="w-3.5 h-3.5" />
                        Public
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEncrypt(true)}
                        className={cn(
                          "flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold transition-all",
                          isEncrypt
                            ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <Lock className="w-3.5 h-3.5" />
                        Encrypted
                      </button>
                    </div>
                    )}
                  </div>
                  {!isCorrectChain && (
                    <p className="text-amber-600 dark:text-amber-400 text-sm font-medium">
                      Switch to {supportedChains.find(c => c.id === CHAIN_ID)?.name} to sign.
                    </p>
                  )}
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={isEncrypt ? "enc" : "pub"}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.2 }}
                      className="text-sm text-muted-foreground font-light"
                    >
                      {isEncrypt
                        ? "Only the site owner can decrypt this message."
                        : "Your message will be visible to everyone on-chain."}
                    </motion.p>
                  </AnimatePresence>
                  <form onSubmit={(e) => {
                      e.preventDefault();
                      if (!message) return;
                      import("@/lib/guestbook-abi").then(({ GUESTBOOK_ABI, GUESTBOOK_ADDRESS }) => {
                          const finalMessage = isEncrypt && publicKeyUint8
                            ? encryptForDeployer(message, publicKeyUint8)
                            : message;
                          writeContract({
                              abi: GUESTBOOK_ABI,
                              address: GUESTBOOK_ADDRESS,
                              functionName: "sign",
                              args: [finalMessage],
                          });
                      });
                  }} className="relative">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={isEncrypt ? "Write a private message..." : "Leave your mark..."}
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
