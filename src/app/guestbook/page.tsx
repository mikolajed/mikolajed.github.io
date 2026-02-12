"use client";

import { motion } from "framer-motion";
import { GuestbookJourney } from "@/components/guestbook";

export default function GuestbookPage() {
  return (
    <div className="h-screen flex flex-col pt-20 pb-20 overflow-hidden">
      <GuestbookJourney />
    </div>
  );
}
