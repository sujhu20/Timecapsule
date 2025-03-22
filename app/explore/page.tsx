"use client";

import { Capsule } from "../../lib/types";
import { CapsuleGrid } from "../../components/capsule/CapsuleGrid";
import { useEffect, useState } from "react";
import { getPublicCapsules } from "@/lib/capsuleService";
import { TimeCapsule } from "@/types/timeCapsule";

export default function ExplorePage() {
  const [publicCapsules, setPublicCapsules] = useState<TimeCapsule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch public capsules when the component mounts
    const fetchPublicCapsules = () => {
      try {
        const capsules = getPublicCapsules();
        setPublicCapsules(capsules);
      } catch (error) {
        console.error("Error fetching public capsules:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPublicCapsules();
  }, []);

  return (
    <div className="container py-12 md:py-16 lg:py-24">
      <div className="mx-auto flex flex-col items-center space-y-4 text-center mb-12">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
          Explore Public Capsules
        </h1>
        <p className="max-w-[700px] text-muted-foreground md:text-xl">
          Discover time capsules that others have chosen to share with the world.
        </p>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Recently Published</h2>
        </div>
        
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">Loading public capsules...</p>
          </div>
        ) : (
          <CapsuleGrid 
            capsules={publicCapsules} 
            isPreview={true} 
            emptyMessage="No public capsules found. Be the first to create one!"
          />
        )}
      </div>
    </div>
  );
} 