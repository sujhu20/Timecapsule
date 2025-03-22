"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useEncryption } from '@/lib/encryptionContext';
import { getCapsuleById, decryptCapsuleContents, markCapsuleAsOpened } from '@/lib/capsuleService';
import { TimeCapsule, CapsuleStatus } from '@/types/timeCapsule';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { CalendarClock, Eye, Download, Key, Lock, Shield, Hourglass, AlertTriangle } from 'lucide-react';

// Mock current user for demonstration
const MOCK_USER = {
  id: "user-123",
  name: "Current User",
  email: "user@example.com"
};

interface ViewCapsuleProps {
  capsuleId: string;
}

export function ViewCapsule({ capsuleId }: ViewCapsuleProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { keys } = useEncryption();
  
  // State
  const [capsule, setCapsule] = useState<TimeCapsule | null>(null);
  const [loading, setLoading] = useState(true);
  const [decrypting, setDecrypting] = useState(false);
  const [decryptedContents, setDecryptedContents] = useState<Array<{ 
    type: string; 
    data: string | File; 
    metadata?: any 
  }> | null>(null);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [selfDestructCountdown, setSelfDestructCountdown] = useState<number | null>(null);
  
  // Load the capsule data
  useEffect(() => {
    const loadCapsule = () => {
      // Pass the current user ID when fetching the capsule to check privacy permissions
      const capsuleData = getCapsuleById(capsuleId, MOCK_USER.id);
      
      if (!capsuleData) {
        // Handle case where capsule doesn't exist or user doesn't have access
        toast({
          title: "Access Denied",
          description: "This capsule either doesn't exist or you don't have permission to view it.",
          variant: "destructive"
        });
        
        // Redirect back to capsules page after a short delay
        setTimeout(() => {
          router.push('/capsules');
        }, 2000);
        
        setLoading(false);
        return;
      }
      
      setCapsule(capsuleData);
      setLoading(false);
    };
    
    loadCapsule();
  }, [capsuleId, router, toast]);
  
  // Handle self-destruct countdown if applicable
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (capsule?.status === CapsuleStatus.OPENED && 
        capsule.selfDestruct?.enabled && 
        capsule.openedAt) {
      
      const openedTime = new Date(capsule.openedAt).getTime();
      const currentTime = new Date().getTime();
      const elapsedSeconds = Math.floor((currentTime - openedTime) / 1000);
      const remainingSeconds = Math.max(0, capsule.selfDestruct.delay - elapsedSeconds);
      
      setSelfDestructCountdown(remainingSeconds);
      
      if (remainingSeconds > 0) {
        timer = setInterval(() => {
          setSelfDestructCountdown(prev => {
            if (prev === null || prev <= 1) {
              clearInterval(timer);
              router.push('/capsules');
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        // Time already expired, redirect
        router.push('/capsules');
      }
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [capsule, router]);
  
  // Check if user can access this capsule
  const canAccess = () => {
    if (!capsule) return false;
    
    const isCreator = capsule.creatorId === MOCK_USER.id;
    const isRecipient = capsule.recipients.some(r => r.id === MOCK_USER.id);
    
    return isCreator || isRecipient || capsule.visibility === 'public';
  };
  
  // Check if capsule can be opened
  const canOpen = () => {
    if (!capsule) return false;
    
    // Check if already delivered or opened
    if (capsule.status === CapsuleStatus.DELIVERED || 
        capsule.status === CapsuleStatus.OPENED) {
      return true;
    }
    
    // Only the creator can see drafts
    if (capsule.status === CapsuleStatus.DRAFT && 
        capsule.creatorId === MOCK_USER.id) {
      return true;
    }
    
    return false;
  };
  
  // Decrypt the capsule contents
  const handleDecrypt = async () => {
    if (!capsule || !keys?.privateKey) {
      toast({
        title: "Cannot decrypt",
        description: "Missing encryption keys or capsule data.",
        variant: "destructive"
      });
      return;
    }
    
    setDecrypting(true);
    
    try {
      const contents = await decryptCapsuleContents(capsule, keys.privateKey);
      setDecryptedContents(contents);
      
      // If not already opened, mark as opened
      if (capsule.status !== CapsuleStatus.OPENED) {
        const updatedCapsule = markCapsuleAsOpened(capsule.id, MOCK_USER.id);
        if (updatedCapsule) {
          setCapsule(updatedCapsule);
        }
      }
      
      toast({
        title: "Capsule decrypted",
        description: "The contents have been successfully decrypted.",
      });
    } catch (error) {
      console.error('Error decrypting capsule:', error);
      toast({
        title: "Decryption failed",
        description: "Unable to decrypt the capsule contents. You may not have the correct keys.",
        variant: "destructive"
      });
    } finally {
      setDecrypting(false);
    }
  };
  
  // Verify password for password-protected capsules
  const handlePasswordVerify = async () => {
    if (!capsule) return;
    
    const passwordCondition = capsule.deliveryConditions.find(c => c.type === 'password');
    if (!passwordCondition) return;
    
    setPasswordError('');
    
    if (!passwordInput.trim()) {
      setPasswordError('Please enter the password');
      return;
    }
    
    // In a real app, verify the password against the hash
    // For demo, we'll just check if it's "password"
    if (passwordInput === "password") {
      handleDecrypt();
    } else {
      setPasswordError('Incorrect password');
    }
  };
  
  // Download a decrypted file
  const downloadFile = (file: File) => {
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  if (loading) {
    return (
      <Card>
        <CardContent className="py-10">
          <div className="flex flex-col items-center justify-center space-y-2">
            <Hourglass className="h-6 w-6 animate-spin text-primary" />
            <p>Loading capsule...</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!capsule) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Capsule Not Found</CardTitle>
          <CardDescription>
            The time capsule you're looking for doesn't exist or has been deleted.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Capsule Not Available</AlertTitle>
            <AlertDescription>
              This capsule may have self-destructed or been removed by its creator.
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter>
          <Button onClick={() => router.push('/capsules')}>
            Back to Capsules
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  if (!canAccess()) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Access Denied</CardTitle>
          <CardDescription>
            You don't have permission to view this time capsule.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <Lock className="h-4 w-4" />
            <AlertTitle>Restricted Access</AlertTitle>
            <AlertDescription>
              This capsule is private and only available to its creator and intended recipients.
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter>
          <Button onClick={() => router.push('/capsules')}>
            Back to Capsules
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  return (
    <Card className="w-full max-w-4xl">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="mb-1">{capsule.title}</CardTitle>
            <CardDescription>{capsule.description}</CardDescription>
          </div>
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
      </CardHeader>
      
      <CardContent className="space-y-6">
        {selfDestructCountdown !== null && (
          <Alert variant="destructive" className="animate-pulse">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Self-Destruct Countdown</AlertTitle>
            <AlertDescription className="font-bold">
              This capsule will self-destruct in {Math.floor(selfDestructCountdown / 60)}:{String(selfDestructCountdown % 60).padStart(2, '0')}
            </AlertDescription>
          </Alert>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">From</h3>
            <div className="flex items-center gap-2">
              {capsule.isAnonymous ? (
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback>A</AvatarFallback>
                  </Avatar>
                  <span>Anonymous</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback>{capsule.creatorId[0]}</AvatarFallback>
                  </Avatar>
                  <span>{capsule.creatorId === MOCK_USER.id ? 'You' : 'Creator'}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium">To</h3>
            <div className="flex flex-wrap gap-2">
              {capsule.recipients.map(recipient => (
                <div 
                  key={recipient.id} 
                  className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md text-sm"
                >
                  <Avatar className="h-4 w-4">
                    <AvatarFallback>{recipient.name[0]}</AvatarFallback>
                  </Avatar>
                  <span>{recipient.id === MOCK_USER.id ? 'You' : recipient.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-medium flex items-center gap-1">
              <CalendarClock className="h-4 w-4" /> Created
            </h3>
            <p className="text-sm text-muted-foreground">{formatDate(capsule.createdAt)}</p>
          </div>
          
          {capsule.scheduledFor && (
            <div className="space-y-1">
              <h3 className="text-sm font-medium flex items-center gap-1">
                <CalendarClock className="h-4 w-4" /> Scheduled For
              </h3>
              <p className="text-sm text-muted-foreground">{formatDate(capsule.scheduledFor)}</p>
            </div>
          )}
          
          {capsule.deliveredAt && (
            <div className="space-y-1">
              <h3 className="text-sm font-medium flex items-center gap-1">
                <CalendarClock className="h-4 w-4" /> Delivered
              </h3>
              <p className="text-sm text-muted-foreground">{formatDate(capsule.deliveredAt)}</p>
            </div>
          )}
          
          {capsule.openedAt && (
            <div className="space-y-1">
              <h3 className="text-sm font-medium flex items-center gap-1">
                <Eye className="h-4 w-4" /> Opened
              </h3>
              <p className="text-sm text-muted-foreground">{formatDate(capsule.openedAt)}</p>
            </div>
          )}
        </div>
        
        <div className="space-y-1">
          <h3 className="text-sm font-medium flex items-center gap-1">
            <Shield className="h-4 w-4" /> Security Features
          </h3>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{capsule.visibility} visibility</Badge>
            {capsule.isAnonymous && <Badge variant="outline">Anonymous</Badge>}
            {capsule.selfDestruct?.enabled && (
              <Badge variant="outline">
                Self-Destruct: {capsule.selfDestruct.delay} seconds
              </Badge>
            )}
            {capsule.deliveryConditions.map((condition, index) => (
              <Badge key={index} variant="outline">
                {condition.type === 'date' ? 'Date-Based Delivery' :
                 condition.type === 'password' ? 'Password Protected' :
                 condition.type === 'location' ? 'Location-Based' :
                 condition.type === 'event' ? 'Event-Triggered' :
                 condition.type === 'biometric' ? 'Biometric Protected' :
                 'Custom Condition'}
              </Badge>
            ))}
          </div>
        </div>
        
        {canOpen() && !decryptedContents && (
          <div className="border rounded-md p-4 space-y-4">
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              <h3 className="font-medium">Encrypted Content</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              This time capsule contains encrypted content that needs to be decrypted with your private key.
            </p>
            
            {capsule.deliveryConditions.some(c => c.type === 'password') ? (
              <div className="space-y-2">
                <p className="text-sm font-medium">This capsule is password protected</p>
                <div className="flex space-x-2">
                  <Input
                    type="password"
                    placeholder="Enter the capsule password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className={passwordError ? "border-red-500" : ""}
                  />
                  <Button onClick={handlePasswordVerify} disabled={decrypting}>
                    <Key className="h-4 w-4 mr-1" /> Verify
                  </Button>
                </div>
                {passwordError && <p className="text-sm text-red-500">{passwordError}</p>}
              </div>
            ) : (
              <Button onClick={handleDecrypt} disabled={decrypting || !keys}>
                {decrypting ? (
                  <>Decrypting...</>
                ) : (
                  <>
                    <Key className="h-4 w-4 mr-1" /> Decrypt Content
                  </>
                )}
              </Button>
            )}
          </div>
        )}
        
        {decryptedContents && (
          <div className="border rounded-md p-4 space-y-4">
            <h3 className="font-medium">Decrypted Contents</h3>
            <div className="space-y-4">
              {decryptedContents.map((content, index) => (
                <div key={index} className="border-t pt-4 first:border-t-0 first:pt-0">
                  {content.type === 'text' && typeof content.data === 'string' && (
                    <div className="bg-muted p-3 rounded-md whitespace-pre-wrap">
                      {content.data}
                    </div>
                  )}
                  
                  {content.type === 'image' && content.data instanceof File && (
                    <div className="space-y-2">
                      <div className="relative aspect-square max-w-md mx-auto overflow-hidden rounded-md">
                        <img 
                          src={URL.createObjectURL(content.data)} 
                          alt="Time Capsule Image" 
                          className="object-contain w-full h-full"
                        />
                      </div>
                      <div className="flex justify-center">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => downloadFile(content.data as File)}
                        >
                          <Download className="h-4 w-4 mr-1" /> Download Image
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {content.type === 'video' && content.data instanceof File && (
                    <div className="space-y-2">
                      <video 
                        controls 
                        className="w-full max-w-md mx-auto rounded-md"
                        src={URL.createObjectURL(content.data)}
                      />
                      <div className="flex justify-center">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => downloadFile(content.data as File)}
                        >
                          <Download className="h-4 w-4 mr-1" /> Download Video
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {content.type === 'audio' && content.data instanceof File && (
                    <div className="space-y-2">
                      <audio 
                        controls 
                        className="w-full max-w-md mx-auto"
                        src={URL.createObjectURL(content.data)}
                      />
                      <div className="flex justify-center">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => downloadFile(content.data as File)}
                        >
                          <Download className="h-4 w-4 mr-1" /> Download Audio
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {content.type === 'file' && content.data instanceof File && (
                    <div className="flex items-center justify-between bg-muted p-3 rounded-md">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0 h-10 w-10 bg-primary/10 rounded flex items-center justify-center">
                          📄
                        </div>
                        <div>
                          <p className="font-medium">{content.data.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {(content.data.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => downloadFile(content.data as File)}
                      >
                        <Download className="h-4 w-4 mr-1" /> Download
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => router.push('/capsules')}>
          Back to Capsules
        </Button>
        
        {capsule.status === CapsuleStatus.DRAFT && capsule.creatorId === MOCK_USER.id && (
          <Button>
            Edit Capsule
          </Button>
        )}
      </CardFooter>
    </Card>
  );
} 