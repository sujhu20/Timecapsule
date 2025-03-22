"use client";

import { Capsule } from "../../lib/types";
import { formatDistanceToNow, format } from "date-fns";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface CapsuleCardProps {
  capsule: Capsule;
  isPreview?: boolean;
}

export function CapsuleCard({ capsule, isPreview = false }: CapsuleCardProps) {
  const isDelivered = capsule.status === "delivered" || capsule.status === "public";
  const isScheduled = capsule.status === "scheduled";
  const deliveryDate = new Date(capsule.scheduledFor);
  const timeToDelivery = formatDistanceToNow(deliveryDate, { addSuffix: true });
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="line-clamp-1">{capsule.title}</CardTitle>
            <CardDescription>
              {isDelivered 
                ? `Delivered ${formatDistanceToNow(deliveryDate, { addSuffix: true })}`
                : `Delivery ${timeToDelivery}`}
            </CardDescription>
          </div>
          <div className="flex items-center">
            {capsule.isBlockchainSecured && (
              <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20 mr-2">
                Blockchain
              </span>
            )}
            <span 
              className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset
                ${isDelivered 
                  ? 'bg-green-50 text-green-700 ring-green-600/20' 
                  : isScheduled
                    ? 'bg-yellow-50 text-yellow-700 ring-yellow-600/20'
                    : 'bg-gray-50 text-gray-700 ring-gray-600/20'
                }`}
            >
              {capsule.status}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {capsule.description || "No description provided."}
        </p>
        <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
          <div>
            <p className="font-medium">Type</p>
            <p className="capitalize">{capsule.type}</p>
          </div>
          <div>
            <p className="font-medium">Privacy</p>
            <p className="capitalize">{capsule.privacy}</p>
          </div>
          <div>
            <p className="font-medium">Created</p>
            <p>{format(new Date(capsule.createdAt), 'MMM d, yyyy')}</p>
          </div>
          <div>
            <p className="font-medium">Scheduled For</p>
            <p>{format(new Date(capsule.scheduledFor), 'MMM d, yyyy')}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        {isPreview ? (
          <Button variant="secondary" className="w-full" asChild>
            <Link href={`/capsules/${capsule.id}`}>View Details</Link>
          </Button>
        ) : (
          <div className="flex w-full gap-2">
            <Button variant="outline" className="flex-1" asChild>
              <Link href={`/capsules/${capsule.id}`}>View</Link>
            </Button>
            {!isDelivered && (
              <Button variant="default" className="flex-1" asChild>
                <Link href={`/capsules/${capsule.id}/edit`}>Edit</Link>
              </Button>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  );
} 