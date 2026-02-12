"use client";

import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Wallet, LogOut, Check, ChevronRight } from "lucide-react";
import { foundry, sepolia } from "wagmi/chains";
import { DEBUG } from "@/lib/constants";
import { cn } from "@/lib/utils";

const SUPPORTED_CHAINS = DEBUG ? [foundry, sepolia] : [sepolia];

export function ConnectModal({
  isOpen,
  onClose,
  connectors,
  connect,
  isConnected,
  address,
  chainId,
  switchChain,
  isSwitchingChain,
  disconnect,
}: {
  isOpen: boolean;
  onClose: () => void;
  connectors: readonly any[];
  connect: (args: any) => void;
  isConnected: boolean;
  address?: string;
  chainId?: number;
  switchChain?: (args: { chainId: number }) => void;
  isSwitchingChain?: boolean;
  disconnect?: () => void;
}) {
  if (typeof document === "undefined") return null;

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
            className="bg-card/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 w-full max-w-sm shadow-2xl ring-1 ring-border space-y-6"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold tracking-tight text-foreground">
                {isConnected ? "Wallet" : "Connect"}
              </h3>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors p-1 hover:bg-secondary/50 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            {isConnected ? (
              <div className="space-y-6">
                {/* Account Info */}
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-secondary/30 ring-1 ring-border/50">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center ring-1 ring-primary/20">
                    <Wallet className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {address}
                    </p>
                    <p className="text-xs text-muted-foreground">Connected</p>
                  </div>
                </div>

                {/* Network Switcher */}
                <div className="space-y-3">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider pl-1">Network</p>
                  <div className="space-y-2">
                    {SUPPORTED_CHAINS.map((chain) => {
                      const isActive = chainId === chain.id;
                      return (
                        <button
                          key={chain.id}
                          onClick={() => switchChain?.({ chainId: chain.id })}
                          disabled={isActive || isSwitchingChain}
                          className={cn(
                            "w-full flex items-center justify-between p-3 rounded-xl transition-all border",
                            isActive 
                              ? "bg-primary/5 border-primary/20 cursor-default" 
                              : "bg-card border-transparent hover:bg-secondary/50 hover:border-border cursor-pointer"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <span className={cn(
                              "w-2 h-2 rounded-full ring-2 ring-offset-2 ring-offset-card",
                              isActive ? "bg-green-500 ring-green-500/20" : "bg-zinc-300 dark:bg-zinc-700 ring-transparent"
                            )} />
                            <span className={cn("text-sm font-medium", isActive ? "text-foreground" : "text-muted-foreground")}>
                              {chain.name}
                            </span>
                          </div>
                          {isActive && <Check className="w-4 h-4 text-primary" />}
                          {!isActive && <ChevronRight className="w-4 h-4 text-muted-foreground/50" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2">
                  <button
                    onClick={() => {
                      disconnect?.();
                      onClose();
                    }}
                    className="w-full flex items-center justify-center gap-2 p-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-colors font-medium text-sm"
                  >
                    <LogOut className="w-4 h-4" />
                    Disconnect
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {connectors.map((connector: any) => (
                  <button
                    key={connector.uid}
                    onClick={() => {
                      connect({ connector });
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-4 rounded-xl bg-secondary/30 hover:bg-secondary/60 hover:shadow-sm border border-transparent hover:border-border transition-all group"
                  >
                    <span className="font-medium text-foreground">{connector.name}</span>
                    <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center shadow-sm ring-1 ring-border/50 group-hover:scale-105 transition-transform">
                      <Wallet className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
