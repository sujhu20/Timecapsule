"use client";

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { DatePicker } from "@/components/ui/date-picker";
import { useEncryption } from '@/lib/encryptionContext';
import { createEncryptedCapsule } from '@/lib/capsuleService';
import { CalendarClock, Lock, Mail, Plus, Trash, Upload, User, Shield } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DeliveryCondition } from '@/types/timeCapsule';

// Mock user data for demonstration
const MOCK_USER = {
  id: "user-123",
  name: "Current User",
  email: "user@example.com"
};

// Mock recipient suggestions for demonstration
const MOCK_RECIPIENTS = [
  { id: "rec-1", name: "Jane Smith", email: "jane@example.com", publicKey: "mock-public-key-1" },
  { id: "rec-2", name: "John Doe", email: "john@example.com", publicKey: "mock-public-key-2" },
  { id: "rec-3", name: "Alice Johnson", email: "alice@example.com", publicKey: "mock-public-key-3" },
];

export function CreateCapsuleForm() {
  const router = useRouter();
  const { toast } = useToast();
  const { keys, getPublicKey } = useEncryption();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const [deliveryDate, setDeliveryDate] = useState<Date | undefined>(undefined);
  const [selectedRecipients, setSelectedRecipients] = useState<Array<typeof MOCK_RECIPIENTS[0]>>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Privacy settings
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [visibility, setVisibility] = useState<'private' | 'recipients' | 'public'>('private');
  const [selfDestruct, setSelfDestruct] = useState(false);
  const [selfDestructDelay, setSelfDestructDelay] = useState(300); // 5 minutes in seconds
  
  // Validation state
  const [titleError, setTitleError] = useState('');
  const [recipientsError, setRecipientsError] = useState('');
  const [contentError, setContentError] = useState('');
  
  const handleRecipientSelect = (recipient: typeof MOCK_RECIPIENTS[0]) => {
    // Check if recipient is already selected
    if (selectedRecipients.some(r => r.id === recipient.id)) {
      return;
    }
    
    setSelectedRecipients([...selectedRecipients, recipient]);
    setRecipientsError('');
  };
  
  const handleRemoveRecipient = (recipientId: string) => {
    setSelectedRecipients(selectedRecipients.filter(r => r.id !== recipientId));
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // Convert FileList to array and append to existing files
      const newFiles = Array.from(e.target.files);
      setSelectedFiles([...selectedFiles, ...newFiles]);
      setContentError('');
    }
  };
  
  const handleRemoveFile = (index: number) => {
    const updatedFiles = [...selectedFiles];
    updatedFiles.splice(index, 1);
    setSelectedFiles(updatedFiles);
  };
  
  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const validateForm = (): boolean => {
    let isValid = true;
    
    // Validate title
    if (!title.trim()) {
      setTitleError('Please provide a title for your time capsule');
      isValid = false;
    } else {
      setTitleError('');
    }
    
    // Validate recipients
    if (selectedRecipients.length === 0) {
      setRecipientsError('Please select at least one recipient');
      isValid = false;
    } else {
      setRecipientsError('');
    }
    
    // Validate content (either message or files)
    if (!message.trim() && selectedFiles.length === 0) {
      setContentError('Please add a message or files to your time capsule');
      isValid = false;
    } else {
      setContentError('');
    }
    
    return isValid;
  };
  
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    
    if (!keys) {
      toast({
        title: "Encryption keys not set up",
        description: "Please set up your encryption keys before creating a capsule.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare delivery conditions
      const deliveryConditions: DeliveryCondition[] = [];
      
      if (deliveryDate) {
        deliveryConditions.push({
          type: 'date',
          params: {
            date: deliveryDate.toISOString()
          }
        });
      }
      
      // Prepare contents
      const contents = [];
      
      if (message.trim()) {
        contents.push({
          type: 'text' as const,
          data: message
        });
      }
      
      // Add files
      for (const file of selectedFiles) {
        let type: 'image' | 'video' | 'audio' | 'file' = 'file';
        
        if (file.type.startsWith('image/')) {
          type = 'image';
        } else if (file.type.startsWith('video/')) {
          type = 'video';
        } else if (file.type.startsWith('audio/')) {
          type = 'audio';
        }
        
        contents.push({
          type,
          data: file
        });
      }
      
      // Get user's public key
      const userPublicKey = getPublicKey() || '';
      
      // Create the capsule
      await createEncryptedCapsule(
        MOCK_USER.id, // In a real app, this would be the authenticated user's ID
        userPublicKey,
        {
          title,
          description,
          contents,
          recipients: selectedRecipients,
          deliveryConditions,
          selfDestruct: {
            enabled: selfDestruct,
            delay: selfDestructDelay
          },
          isAnonymous,
          visibility
        }
      );
      
      toast({
        title: "Time Capsule Created",
        description: "Your encrypted time capsule has been created and scheduled.",
      });
      
      // Redirect to the capsules list page
      router.push('/capsules');
    } catch (error) {
      console.error('Error creating capsule:', error);
      toast({
        title: "Failed to create time capsule",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!keys) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Set Up Encryption First</CardTitle>
          <CardDescription>
            You need to set up encryption before creating time capsules.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <Lock className="h-4 w-4" />
            <AlertTitle>Encryption Required</AlertTitle>
            <AlertDescription>
              Please go to your profile or settings page to set up encryption keys before proceeding.
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter>
          <Button onClick={() => router.push('/profile')}>
            Set Up Encryption
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Lock className="mr-2" /> Create Encrypted Time Capsule
        </CardTitle>
        <CardDescription>
          Create a secure time capsule to share memories, messages, or files with your loved ones.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            placeholder="Give your time capsule a name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={titleError ? "border-red-500" : ""}
          />
          {titleError && <p className="text-sm text-red-500">{titleError}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description (Optional)</Label>
          <Textarea
            id="description"
            placeholder="Add a brief description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
          />
        </div>
        
        <div className="space-y-2">
          <Label>Recipients</Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {selectedRecipients.map((recipient) => (
              <div 
                key={recipient.id} 
                className="flex items-center gap-2 bg-muted p-2 rounded-md"
              >
                <Avatar className="h-6 w-6">
                  <AvatarFallback>{recipient.name[0]}</AvatarFallback>
                </Avatar>
                <span className="text-sm">{recipient.name}</span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-5 w-5" 
                  onClick={() => handleRemoveRecipient(recipient.id)}
                >
                  <Trash className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
          
          <div className="border rounded-md p-3 space-y-3">
            <p className="text-sm font-medium">Add Recipients</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {MOCK_RECIPIENTS.map((recipient) => (
                <Button
                  key={recipient.id}
                  variant="outline"
                  className="justify-start"
                  onClick={() => handleRecipientSelect(recipient)}
                  disabled={selectedRecipients.some(r => r.id === recipient.id)}
                >
                  <Avatar className="h-6 w-6 mr-2">
                    <AvatarFallback>{recipient.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start text-sm">
                    <span>{recipient.name}</span>
                    <span className="text-muted-foreground text-xs">{recipient.email}</span>
                  </div>
                </Button>
              ))}
            </div>
          </div>
          
          {recipientsError && <p className="text-sm text-red-500">{recipientsError}</p>}
        </div>
        
        <div className="space-y-2">
          <Label>Content</Label>
          <Tabs defaultValue="message" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="message">Message</TabsTrigger>
              <TabsTrigger value="files">Files</TabsTrigger>
            </TabsList>
            
            <TabsContent value="message" className="space-y-2">
              <Textarea
                placeholder="Write your message here..."
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  if (e.target.value.trim()) setContentError('');
                }}
                rows={6}
              />
            </TabsContent>
            
            <TabsContent value="files" className="space-y-4">
              <div className="border border-dashed rounded-md p-4 text-center">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  multiple
                />
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-2">
                  Drag and drop files here or click to browse
                </p>
                <Button variant="outline" size="sm" onClick={handleBrowseClick}>
                  Browse Files
                </Button>
              </div>
              
              {selectedFiles.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Selected Files:</p>
                  <div className="space-y-2">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-muted p-2 rounded-md">
                        <div className="flex items-center space-x-2 overflow-hidden">
                          <div className="flex-shrink-0 h-8 w-8 bg-primary/10 rounded flex items-center justify-center">
                            {file.type.startsWith('image/') ? '🖼️' : 
                             file.type.startsWith('video/') ? '🎬' : 
                             file.type.startsWith('audio/') ? '🎵' : '📄'}
                          </div>
                          <div className="overflow-hidden">
                            <p className="text-sm font-medium truncate">{file.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {(file.size / 1024).toFixed(1)} KB
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveFile(index)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
          
          {contentError && <p className="text-sm text-red-500">{contentError}</p>}
        </div>
        
        <div className="space-y-2">
          <Label>Delivery Settings</Label>
          <div className="border rounded-md p-4 space-y-4">
            <div className="flex items-center gap-4">
              <CalendarClock className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1">
                <Label htmlFor="deliveryDate">Delivery Date</Label>
                <DatePicker 
                  date={deliveryDate} 
                  setDate={setDeliveryDate} 
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label>Privacy & Security</Label>
          <div className="border rounded-md p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <Label htmlFor="anonymous">Send Anonymously</Label>
              </div>
              <Switch
                id="anonymous"
                checked={isAnonymous}
                onCheckedChange={setIsAnonymous}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <Label htmlFor="self-destruct">Self-Destruct After Opening</Label>
              </div>
              <Switch
                id="self-destruct"
                checked={selfDestruct}
                onCheckedChange={setSelfDestruct}
              />
            </div>
            
            {selfDestruct && (
              <div className="ml-6 space-y-2">
                <Label>Self-Destruct Delay</Label>
                <RadioGroup 
                  value={selfDestructDelay.toString()} 
                  onValueChange={(value) => setSelfDestructDelay(parseInt(value))}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="60" id="delay-1" />
                    <Label htmlFor="delay-1">1 minute</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="300" id="delay-2" />
                    <Label htmlFor="delay-2">5 minutes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="3600" id="delay-3" />
                    <Label htmlFor="delay-3">1 hour</Label>
                  </div>
                </RadioGroup>
              </div>
            )}
            
            <div className="space-y-2">
              <Label>Visibility</Label>
              <RadioGroup 
                value={visibility} 
                onValueChange={(value: 'private' | 'recipients' | 'public') => setVisibility(value)}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="private" id="visibility-1" />
                  <Label htmlFor="visibility-1">Private (only you and recipients)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="recipients" id="visibility-2" />
                  <Label htmlFor="visibility-2">Recipients can share</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="public" id="visibility-3" />
                  <Label htmlFor="visibility-3">Public (anyone with the link)</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Time Capsule"}
        </Button>
      </CardFooter>
    </Card>
  );
} 