"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Wallet } from "lucide-react";

export function ConnectModal({
  isOpen,
  onClose,
  connectors,
  connect,
}: {
  isOpen: boolean;
  onClose: () => void;
  connectors: readonly any[];
  connect: (args: any) => void;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-card rounded-3xl p-8 w-full max-w-sm shadow-2xl ring-1 ring-border space-y-6"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold tracking-tight text-foreground">Connect</h3>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              {connectors.map((connector: any) => (
                <button
                  key={connector.uid}
                  onClick={() => {
                    connect({ connector });
                    onClose();
                  }}
                  className="w-full flex items-center justify-between p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors group"
                >
                  <span className="font-medium text-foreground">{connector.name}</span>
                  <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                    <Wallet className="w-4 h-4 text-muted-foreground" />
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
