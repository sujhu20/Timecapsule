"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { useEncryption } from '@/lib/encryptionContext';
import { getCapsulesByUser } from '@/lib/capsuleService';
import { TimeCapsule, CapsuleStatus } from '@/types/timeCapsule';
import { KeySetup } from '@/components/encryption/KeySetup';
import { CalendarClock, Eye, Lock, Mail, Plus, Archive, Clock } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

// Mock user data for demonstration
const MOCK_USER = {
  id: "user-123",
  name: "Current User",
  email: "user@example.com"
};

export default function CapsulesPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { keys } = useEncryption();
  
  const [capsules, setCapsules] = useState<TimeCapsule[]>([]);
  
  useEffect(() => {
    if (keys) {
      // Load user's capsules
      const userCapsules = getCapsulesByUser(MOCK_USER.id);
      setCapsules(userCapsules);
    }
  }, [keys]);
  
  // Filter capsules by status
  const draftCapsules = capsules.filter(c => c.status === CapsuleStatus.DRAFT);
  const scheduledCapsules = capsules.filter(c => c.status === CapsuleStatus.SCHEDULED);
  const deliveredCapsules = capsules.filter(c => c.status === CapsuleStatus.DELIVERED);
  const openedCapsules = capsules.filter(c => c.status === CapsuleStatus.OPENED);
  
  // Incoming capsules are ones where the user is a recipient
  const incomingCapsules = capsules.filter(c => 
    c.recipients.some(r => r.id === MOCK_USER.id) && 
    c.creatorId !== MOCK_USER.id
  );
  
  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Navigate to view a specific capsule
  const viewCapsule = (id: string) => {
    router.push(`/capsules/${id}`);
  };
  
  // Navigate to create a new capsule
  const createCapsule = () => {
    router.push('/capsules/create');
  };
  
  if (!keys) {
    return (
      <div className="container py-10">
        <h1 className="text-2xl font-bold mb-6">Encrypted Time Capsules</h1>
        <div className="max-w-3xl mx-auto">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Set Up Encryption</CardTitle>
              <CardDescription>
                You need to set up encryption before you can create or view encrypted time capsules.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <KeySetup />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Time Capsules</h1>
        <Button onClick={createCapsule}>
          <Plus className="h-4 w-4 mr-1" /> Create Capsule
        </Button>
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid grid-cols-6 mb-6">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="incoming">
            Incoming
            {incomingCapsules.length > 0 && (
              <Badge variant="secondary" className="ml-1">{incomingCapsules.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="drafts">Drafts</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="delivered">Delivered</TabsTrigger>
          <TabsTrigger value="opened">Opened</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <CapsuleGrid 
            capsules={capsules} 
            onView={viewCapsule} 
            emptyMessage="You don't have any time capsules yet." 
          />
        </TabsContent>
        
        <TabsContent value="incoming">
          <CapsuleGrid 
            capsules={incomingCapsules} 
            onView={viewCapsule} 
            emptyMessage="You don't have any incoming time capsules." 
          />
        </TabsContent>
        
        <TabsContent value="drafts">
          <CapsuleGrid 
            capsules={draftCapsules} 
            onView={viewCapsule} 
            emptyMessage="You don't have any draft time capsules." 
          />
        </TabsContent>
        
        <TabsContent value="scheduled">
          <CapsuleGrid 
            capsules={scheduledCapsules} 
            onView={viewCapsule} 
            emptyMessage="You don't have any scheduled time capsules." 
          />
        </TabsContent>
        
        <TabsContent value="delivered">
          <CapsuleGrid 
            capsules={deliveredCapsules} 
            onView={viewCapsule} 
            emptyMessage="You don't have any delivered time capsules." 
          />
        </TabsContent>
        
        <TabsContent value="opened">
          <CapsuleGrid 
            capsules={openedCapsules} 
            onView={viewCapsule} 
            emptyMessage="You don't have any opened time capsules." 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface CapsuleGridProps {
  capsules: TimeCapsule[];
  onView: (id: string) => void;
  emptyMessage: string;
}

function CapsuleGrid({ capsules, onView, emptyMessage }: CapsuleGridProps) {
  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  if (capsules.length === 0) {
    return (
      <Card>
        <CardContent className="py-10">
          <div className="flex flex-col items-center justify-center text-center">
            <Archive className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">{emptyMessage}</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {capsules.map(capsule => (
        <Card key={capsule.id} className="overflow-hidden hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex justify-between">
              <CardTitle className="truncate">{capsule.title}</CardTitle>
              <Badge 
                variant={
                  capsule.status === CapsuleStatus.DRAFT ? "outline" :
                  capsule.status === CapsuleStatus.SCHEDULED ? "secondary" :
                  capsule.status === CapsuleStatus.DELIVERED ? "default" :
                  "success"
                }
              >
                {capsule.status}
              </Badge>
            </div>
            <CardDescription className="line-clamp-2">
              {capsule.description || "No description"}
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="space-y-1 mb-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Lock className="h-3 w-3" />
                  <span>
                    {capsule.contents.length} encrypted {capsule.contents.length === 1 ? 'item' : 'items'}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Mail className="h-3 w-3" />
                  <span>{capsule.recipients.length} {capsule.recipients.length === 1 ? 'recipient' : 'recipients'}</span>
                </div>
              </div>
              
              {(capsule.scheduledFor || capsule.deliveredAt || capsule.openedAt) && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  {capsule.status === CapsuleStatus.SCHEDULED && capsule.scheduledFor && (
                    <>
                      <Clock className="h-3 w-3" />
                      <span>Delivers on {formatDate(capsule.scheduledFor)}</span>
                    </>
                  )}
                  
                  {capsule.status === CapsuleStatus.DELIVERED && capsule.deliveredAt && (
                    <>
                      <CalendarClock className="h-3 w-3" />
                      <span>Delivered on {formatDate(capsule.deliveredAt)}</span>
                    </>
                  )}
                  
                  {capsule.status === CapsuleStatus.OPENED && capsule.openedAt && (
                    <>
                      <Eye className="h-3 w-3" />
                      <span>Opened on {formatDate(capsule.openedAt)}</span>
                    </>
                  )}
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => onView(capsule.id)}
            >
              {capsule.status === CapsuleStatus.DELIVERED ? (
                <>Open Capsule</>
              ) : capsule.status === CapsuleStatus.OPENED ? (
                <>View Contents</>
              ) : (
                <>View Details</>
              )}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
} 