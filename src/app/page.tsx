"use client";

import { motion } from "framer-motion";
import { SelfDrawingPortrait } from "@/components/self-drawing-portrait";

export default function Home() {
  return (
    <div className="h-screen relative overflow-hidden flex flex-col pt-20 pb-10 md:pt-24 md:pb-12">
      
        <div className="flex-1 w-full grid grid-cols-1 lg:grid-cols-2 gap-0 relative z-10">
             {/* Left: Photo */}
            <div className="relative h-full w-full order-2 lg:order-1 flex items-center justify-center p-6 md:p-8 lg:p-12 text-foreground">
                <div className="w-full h-full max-h-[70vh] relative overflow-hidden">
                    <SelfDrawingPortrait 
                        className="w-full h-full"
                    />
                </div>
            </div>

            {/* Right: Identity & Valid Actions */}
            <div className="relative h-full w-full flex flex-col justify-center px-4 lg:px-8 xl:px-16 order-1 lg:order-2">
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="space-y-12"
                >
                    <div className="space-y-8 lg:space-y-10">
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-widest text-foreground font-display uppercase leading-none break-words">
                            Mikołaj <br /> Jędrzejewski
                        </h1>
                        
                        <div className="space-y-4 text-base sm:text-lg font-serif italic text-muted-foreground">
                            <p>Computer Science <span className="not-italic text-xs sm:text-sm mx-2 uppercase tracking-widest font-sans opacity-50">at</span> Warsaw University of Technology</p>
                            <p>Formerly <span className="not-italic text-xs sm:text-sm mx-2 uppercase tracking-widest font-sans opacity-50">at</span> National University of Singapore</p>
                        </div>
                    </div>


                </motion.div>
            </div>
        </div>
    </div>
  );
}
