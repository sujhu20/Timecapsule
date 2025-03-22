"use client";

import { Capsule } from "../../lib/types";
import { CapsuleCard } from "./CapsuleCard";

interface CapsuleGridProps {
  capsules: Capsule[];
  isPreview?: boolean;
  emptyMessage?: string;
}

export function CapsuleGrid({ 
  capsules, 
  isPreview = false,
  emptyMessage = "No time capsules found"
}: CapsuleGridProps) {
  if (!capsules.length) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {capsules.map((capsule) => (
        <CapsuleCard key={capsule.id} capsule={capsule} isPreview={isPreview} />
      ))}
    </div>
  );
} 