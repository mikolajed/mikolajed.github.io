"use client";

import { motion } from "framer-motion";
import { PenTool, Coffee } from "lucide-react";

export default function ArtPage() {
  return (
    <div className="max-w-4xl mx-auto pt-28 pb-24 space-y-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-6 text-center"
      >
        <h1 className="text-4xl font-bold tracking-widest text-foreground font-display uppercase">Art & Hobbies</h1>
        <p className="text-lg text-muted-foreground font-light max-w-2xl mx-auto">
          The analog pursuits that keep me grounded.
        </p>
      </motion.div>

      <div className="grid gap-12 md:grid-cols-2">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="group relative overflow-hidden rounded-3xl bg-secondary/30 border border-border p-8 min-h-[400px] flex flex-col justify-between"
        >
             <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
             
             <div className="space-y-4 relative z-10">
                <div className="w-12 h-12 rounded-xl bg-background flex items-center justify-center border border-border shadow-sm">
                    <PenTool className="w-6 h-6 text-foreground" />
                </div>
                <h2 className="text-2xl font-bold font-display">Calligraphy</h2>
                <p className="text-muted-foreground leading-relaxed">
                    Exploring the discipline of Copperplate and Spencerian scripts. The focus required for every stroke mirrors the precision needed in code.
                </p>
             </div>

             <div className="relative z-10 pt-12">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-background border border-border text-muted-foreground">
                    Gallery Coming Soon
                </span>
             </div>
        </motion.div>

        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="group relative overflow-hidden rounded-3xl bg-secondary/30 border border-border p-8 min-h-[400px] flex flex-col justify-between"
        >
             <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
             
             <div className="space-y-4 relative z-10">
                <div className="w-12 h-12 rounded-xl bg-background flex items-center justify-center border border-border shadow-sm">
                    <Coffee className="w-6 h-6 text-foreground" />
                </div>
                <h2 className="text-2xl font-bold font-display">Latte Art</h2>
                <p className="text-muted-foreground leading-relaxed">
                    Chasing the perfect rosetta and tulip. A daily ritual that combines chemistry, physics, and aesthetics.
                </p>
             </div>

             <div className="relative z-10 pt-12">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-background border border-border text-muted-foreground">
                    Gallery Coming Soon
                </span>
             </div>
        </motion.div>
      </div>
    </div>
  );
}
