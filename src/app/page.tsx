"use client";

import { motion } from "framer-motion";
import { SelfDrawingPortrait } from "@/components/self-drawing-portrait";
import { Github, Linkedin, Mail, Send } from "lucide-react";

const socials = [
  { href: "https://github.com/mikolajed", icon: Github, label: "GitHub" },
  { href: "https://www.linkedin.com/in/mikolajed", icon: Linkedin, label: "LinkedIn" },
  { href: "mailto:mikolajedjed@gmail.com", icon: Mail, label: "Email" },
  { href: "https://t.me/mikolajed", icon: Send, label: "Telegram" },
];

export default function Home() {
  return (
    <div className="h-screen relative overflow-hidden flex flex-col pt-20 pb-10 md:pt-24 md:pb-12">
      
        <div className="flex-1 w-full flex flex-col lg:grid lg:grid-cols-2 gap-0 relative z-10 min-h-0">
             {/* Left: Photo */}
            <div className="relative flex-1 w-full min-h-0 flex items-center justify-center p-4 md:p-8 lg:p-12 text-foreground order-1">
                <div className="w-full h-full relative overflow-hidden">
                    <SelfDrawingPortrait 
                        className="w-full h-full"
                    />
                </div>
            </div>

            {/* Right: Identity & Valid Actions */}
            <div className="relative w-full flex-shrink-0 lg:h-full lg:flex-1 flex flex-col justify-center px-6 pb-6 lg:pb-0 lg:px-8 xl:px-16 order-2">
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="space-y-6 sm:space-y-12"
                >
                    <div className="space-y-4 sm:space-y-8 lg:space-y-10">
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-widest text-foreground font-display uppercase leading-none break-words">
                            Mikołaj <br /> Jędrzejewski
                        </h1>
                        
                        <div className="space-y-2 sm:space-y-4 text-sm sm:text-lg font-serif italic text-muted-foreground">
                            <p>Computer Science <span className="not-italic text-xs sm:text-sm mx-2 uppercase tracking-widest font-sans opacity-50">at</span> Warsaw University of Technology</p>
                            <p>Formerly <span className="not-italic text-xs sm:text-sm mx-2 uppercase tracking-widest font-sans opacity-50">at</span> National University of Singapore</p>
                        </div>
                    </div>

                    {/* Socials */}
                    <div className="flex gap-6 pt-2 sm:pt-4">
                        {socials.map((social) => (
                            <a
                                key={social.label}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-foreground transition-all hover:scale-110"
                            >
                                <social.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                                <span className="sr-only">{social.label}</span>
                            </a>
                        ))}
                    </div>


                </motion.div>
            </div>
        </div>
    </div>
  );
}
