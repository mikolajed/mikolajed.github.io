"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, PenTool } from "lucide-react";
import { GuestbookJourney } from "@/components/guestbook";

export function GuestbookModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-left underline underline-offset-4 decoration-zinc-300 dark:decoration-zinc-700 hover:decoration-zinc-900 dark:hover:decoration-zinc-100 transition-all w-fit"
      >
        Sign Guestbook
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center isolate">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-white/80 dark:bg-black/80 backdrop-blur-sm"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto m-4 bg-white dark:bg-zinc-900 rounded-lg shadow-2xl border border-zinc-200 dark:border-zinc-800"
            >
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="p-8 md:p-12">
                <div className="flex items-center justify-center gap-3 mb-8">
                     <PenTool className="w-5 h-5 text-zinc-400" />
                     <h2 className="text-2xl font-bold uppercase tracking-widest font-display text-zinc-900 dark:text-zinc-50">
                        Guestbook Ledger
                     </h2>
                </div>
                
                <GuestbookJourney />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
