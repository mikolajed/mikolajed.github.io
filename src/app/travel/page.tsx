"use client";

import { motion } from "framer-motion";
import { Globe } from "@/components/globe";

const trips = [
  {
    country: "Bulgaria",
    date: "2009",
    description: "Early memories of the Black Sea coast.",
  },
  {
    country: "Greece",
    date: "2010",
    description: "Mediterranean exploration.",
  },
  {
    country: "USA",
    date: "2013",
    description: "First overseas trip exploring the East and West Coast cities.",
  },
  {
    country: "Spain",
    date: "2014 – Present",
    description: "Frequent trips and deep connection to the culture and language.",
  },
  {
    country: "United Kingdom",
    date: "2014",
    description: "Travelling across the UK.",
  },
  {
    country: "Italy, Hungary, Slovakia, Czech Republic",
    date: "2016",
    description: "Central European road trip exploring diverse histories and architectures.",
  },
  {
    country: "Portugal",
    date: "2017",
    description: "Atlantic coast exploration.",
  },
  {
    country: "Gibraltar",
    date: "2018",
    description: "Visit to the Rock.",
  },
  {
    country: "Netherlands, Germany",
    date: "2019",
    description: "Western European circuit.",
  },
  {
    country: "Austria",
    date: "2022",
    description: "Alpine views and Viennese culture.",
  },
  {
    country: "Singapore, Philippines, Cambodia, Malaysia, Thailand",
    date: "2024",
    description: "Exchange semester at NUS and extensive Southeast Asian exploration.",
  },
  {
    country: "Taiwan, Indonesia, Qatar",
    date: "2025",
    description: "Post-exchange travels and transit through the Middle East.",
  },
  {
    country: "France",
    date: "2025",
    description: "ETH Global in Cannes — combining blockchain and the French Riviera.",
  },
  {
    country: "Belgium",
    date: "2025",
    description: "Short trip exploring the heart of Europe.",
  },
];

export default function TravelPage() {
  return (
    <div className="max-w-4xl mx-auto pt-28 pb-24 space-y-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-6 text-center"
      >
        <h1 className="text-4xl font-bold tracking-widest text-foreground font-display uppercase">World & Journeys</h1>
        <p className="text-lg text-muted-foreground font-light max-w-2xl mx-auto">
          Exploring cultures, architectures, and ecosystems around the globe.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative aspect-square w-full max-w-lg mx-auto"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-full blur-3xl opacity-20" />
        <Globe className="w-full h-full" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="space-y-12 max-w-2xl mx-auto"
      >
        <h2 className="text-2xl font-bold tracking-wide text-center font-display uppercase">Travel Log</h2>
        <div className="grid gap-8">
            {trips.map((trip, i) => (
                <div key={i} className="relative pl-8 border-l border-border">
                    <span className="absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full bg-muted-foreground ring-4 ring-background" />
                    <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-2">
                        <h3 className="text-xl font-semibold">{trip.country}</h3>
                        <span className="text-sm text-muted-foreground font-mono">{trip.date}</span>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">{trip.description}</p>
                </div>
            ))}
        </div>
      </motion.div>
    </div>
  );
}
