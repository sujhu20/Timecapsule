"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { LockIcon, PlusIcon, SendIcon, TimerIcon } from "lucide-react";

interface Capsule {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  scheduledFor: string;
  status: "pending" | "delivered";
  isLocked: boolean;
}

export default function DashboardPage() {
  // Mock data - would come from an API in a real app
  const [capsules, setCapsules] = useState<Capsule[]>([
    {
      id: "1",
      title: "Letter to My Future Self",
      description: "Thoughts and reflections for my 30th birthday",
      createdAt: "2023-09-15",
      scheduledFor: "2025-01-01",
      status: "pending",
      isLocked: true,
    },
    {
      id: "2",
      title: "Wedding Memories",
      description: "Photos and messages from our special day",
      createdAt: "2023-10-20",
      scheduledFor: "2024-10-20",
      status: "pending",
      isLocked: true,
    },
    {
      id: "3",
      title: "Time Capsule 2023",
      description: "A snapshot of my life this year",
      createdAt: "2023-12-31",
      scheduledFor: "2028-12-31",
      status: "pending",
      isLocked: false,
    },
  ]);

  const pendingCapsules = capsules.filter((capsule) => capsule.status === "pending");
  const deliveredCapsules = capsules.filter((capsule) => capsule.status === "delivered");

  return (
    <div className="container py-8 px-4 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Time Capsules</h1>
          <p className="text-muted-foreground mt-1">
            Manage your digital time capsules
          </p>
        </div>
        <Button asChild>
          <Link href="/capsules/new" className="flex items-center gap-2">
            <PlusIcon className="h-4 w-4" />
            Create New Capsule
          </Link>
        </Button>
      </div>

      <div className="grid gap-8 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Total Capsules</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{capsules.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Across all statuses</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Scheduled</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{pendingCapsules.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Waiting to be delivered</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Delivered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{deliveredCapsules.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Successfully delivered</p>
          </CardContent>
        </Card>
      </div>

      {capsules.length === 0 ? (
        <Card className="border-dashed bg-muted/50">
          <CardContent className="py-12 flex flex-col items-center justify-center text-center">
            <div className="rounded-full w-12 h-12 bg-primary/10 flex items-center justify-center mb-4">
              <TimerIcon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-1">No time capsules yet</h3>
            <p className="text-muted-foreground mb-4 max-w-md">
              Create your first time capsule to start preserving memories for the future
            </p>
            <Button asChild>
              <Link href="/capsules/new" className="flex items-center gap-2">
                <PlusIcon className="h-4 w-4" />
                Create your first capsule
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="pending">
          <TabsList className="mb-6">
            <TabsTrigger value="pending" className="flex gap-2">
              <TimerIcon className="h-4 w-4" />
              <span>Scheduled <span className="ml-1 rounded-full bg-muted px-2 py-0.5 text-xs">{pendingCapsules.length}</span></span>
            </TabsTrigger>
            <TabsTrigger value="delivered" className="flex gap-2">
              <SendIcon className="h-4 w-4" />
              <span>Delivered <span className="ml-1 rounded-full bg-muted px-2 py-0.5 text-xs">{deliveredCapsules.length}</span></span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending" className="space-y-4">
            {pendingCapsules.map((capsule) => (
              <Card key={capsule.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    {capsule.title}
                    {capsule.isLocked && <LockIcon className="h-4 w-4 text-amber-500" />}
                  </CardTitle>
                  <CardDescription>{capsule.description}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="grid gap-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Created:</span>
                      <span>{new Date(capsule.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Delivery Date:</span>
                      <span>{new Date(capsule.scheduledFor).toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" asChild className="w-full">
                    <Link href={`/capsules/${capsule.id}`}>View Details</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </TabsContent>
          
          <TabsContent value="delivered" className="space-y-4">
            {deliveredCapsules.length > 0 ? (
              deliveredCapsules.map((capsule) => (
                <Card key={capsule.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2">
                      {capsule.title}
                      {capsule.isLocked && <LockIcon className="h-4 w-4 text-amber-500" />}
                    </CardTitle>
                    <CardDescription>{capsule.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="grid gap-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Created:</span>
                        <span>{new Date(capsule.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Delivered:</span>
                        <span>{new Date(capsule.scheduledFor).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" asChild className="w-full">
                      <Link href={`/capsules/${capsule.id}`}>Open Capsule</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <Card className="border-dashed bg-muted/50">
                <CardContent className="py-8 flex flex-col items-center justify-center text-center">
                  <p className="text-muted-foreground">You don't have any delivered capsules yet.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
} 