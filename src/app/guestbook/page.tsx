"use client";

import { GuestbookJourney } from "@/components/guestbook";

export default function GuestbookPage() {
  return (
    <div className="h-screen flex flex-col pt-20 md:pt-24 pb-0 overflow-hidden">
      <GuestbookJourney />
    </div>
  );
}
