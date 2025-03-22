"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FormProvider } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { CapsuleFormData } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, FileText, Image, Lock, MessageSquare, Music, PlayCircle, ShieldCheck, Zap, Brain, Globe2 } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { cn, formatFileSize, isImageFile } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { cloudStorage } from "@/lib/cloudStorage";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Define the form schema with new fields for AI features and conditional locks
const formSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters").max(100, "Title must not exceed 100 characters"),
  description: z.string().max(500, "Description must not exceed 500 characters").optional(),
  content: z.string().min(10, "Content must be at least 10 characters"),
  mediaUrl: z.string().optional(),
  type: z.enum(["text", "image", "video", "audio", "mixed", "ar-vr"]),
  privacy: z.enum(["private", "public", "specific", "generational"]),
  scheduledFor: z.date({
    required_error: "Please select a delivery date",
  }).refine((date) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return date > now;
  }, {
    message: "Delivery date must be in the future",
  }),
  isBlockchainSecured: z.boolean().default(false),
  useAIFutureVisual: z.boolean().default(false),
  useConditionalLock: z.boolean().default(false),
  unlockCondition: z.enum(["date", "location", "event", "biometric"]).default("date"),
  locationData: z.string().optional(),
  eventCondition: z.string().optional(),
  allowReplies: z.boolean().default(false),
  isPartOfChallenge: z.boolean().default(false),
  challengeId: z.string().optional(),
  use3DMemoryScrapbook: z.boolean().default(false),
  memoryScrapbookStyle: z.enum(["floating", "timeline", "orbit", "gallery"]).optional(),
  useARPlacement: z.boolean().default(false),
  useTimeTravelEffect: z.boolean().default(false),
  useMemorySoundscape: z.boolean().default(false),
});

interface CapsuleFormProps {
  onSubmit: (data: CapsuleFormData) => void;
  isSubmitting?: boolean;
  defaultValues?: Partial<CapsuleFormData>;
  availableChallenges?: { id: string; name: string; description: string }[];
}

export function CapsuleForm({ 
  onSubmit, 
  isSubmitting = false, 
  defaultValues,
  availableChallenges = [] 
}: CapsuleFormProps) {
  const oneYearFromNow = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: defaultValues?.title || "",
      description: defaultValues?.description || "",
      content: defaultValues?.content || "",
      mediaUrl: defaultValues?.mediaUrl || "",
      type: defaultValues?.type || "text",
      privacy: defaultValues?.privacy || "private",
      scheduledFor: defaultValues?.scheduledFor || oneYearFromNow,
      isBlockchainSecured: defaultValues?.isBlockchainSecured || false,
      useAIFutureVisual: defaultValues?.useAIFutureVisual || false,
      useConditionalLock: defaultValues?.useConditionalLock || false,
      unlockCondition: defaultValues?.unlockCondition || "date",
      locationData: defaultValues?.locationData || "",
      eventCondition: defaultValues?.eventCondition || "",
      allowReplies: defaultValues?.allowReplies || false,
      isPartOfChallenge: defaultValues?.isPartOfChallenge || false,
      challengeId: defaultValues?.challengeId || "",
      use3DMemoryScrapbook: defaultValues?.use3DMemoryScrapbook || false,
      memoryScrapbookStyle: defaultValues?.memoryScrapbookStyle || "floating",
      useARPlacement: defaultValues?.useARPlacement || false,
      useTimeTravelEffect: defaultValues?.useTimeTravelEffect || false,
      useMemorySoundscape: defaultValues?.useMemorySoundscape || false,
    },
  });

  // State for managing file uploads
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  // Add at the beginning of the component function, after form definition
  const [showUploadField, setShowUploadField] = useState(false);

  // Define content types array
  const contentTypes = [
    { value: "text", label: "Text", icon: <FileText className="h-6 w-6" /> },
    { value: "image", label: "Image", icon: <Image className="h-6 w-6" /> },
    { value: "video", label: "Video", icon: <PlayCircle className="h-6 w-6" /> },
    { value: "audio", label: "Audio", icon: <Music className="h-6 w-6" /> },
    { value: "mixed", label: "Mixed", icon: <MessageSquare className="h-6 w-6" /> },
    { value: "ar-vr", label: "AR/VR", icon: <Zap className="h-6 w-6" /> },
  ];

  // Function to ensure we always use valid future dates
  const ensureFutureDate = (date: Date | null): Date => {
    if (!date) {
      // Default to 1 year from now if no date provided
      return new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
    }
    
    const now = new Date();
    // If the date is in the past, set it to tomorrow
    if (date < now) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      return tomorrow;
    }
    
    return date;
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, contentType: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Early set file name to improve responsiveness
    setFileName(file.name);
    
    // Create preview for image files immediately for better UX
    if (isImageFile(file.type)) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFilePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }

    console.log(`Uploading file: ${file.name} (${formatFileSize(file.size)}) for content type: ${contentType}`);
    
    // Update form with a meaningful description immediately for better feedback
    const defaultContent = `My ${contentType} file: ${file.name}`;
    form.setValue('content', defaultContent, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true
    });
    
    // Set a local URL immediately for better feedback
    const tempUrl = URL.createObjectURL(file);
    console.log("Created temporary URL:", tempUrl);

    // Set type in form for consistency
    form.setValue('type', contentType as any, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true
    });
    
    // Start upload process
    try {
      setUploading(true);
      toast.info(`Uploading ${file.name}...`);
      
      // Optimized progress simulation with fewer updates to reduce render cycles
      const progressSteps = [10, 30, 50, 70, 90, 100];
      for (const progress of progressSteps) {
        setUploadProgress(progress);
        // Shorter delay for AR/VR and video to improve perceived performance
        const delay = contentType === 'ar' || contentType === 'video' ? 100 : 150;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
      
      // Generate fake cloud URL
      const cloudUrl = `https://storage.example.com/${Date.now()}-${file.name.replace(/\s/g, '_')}`;
      console.log("Generated cloud URL:", cloudUrl);
      
      // Update form with the media URL
      form.setValue('mediaUrl', cloudUrl, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true
      });
      
      toast.success(`${contentType} uploaded successfully!`);
      
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload file. Please try again.");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  // Change handleSubmit function to properly work with the parent's onSubmit
  const submitForm = (data: z.infer<typeof formSchema>) => {
    // Log detailed information about what's being submitted
    console.log("🚀 Form submission data:", {
      title: data.title,
      type: data.type,
      content: data.content,
      mediaUrl: data.mediaUrl || "No media attached",
      mediaType: data.mediaUrl ? (fileName || "Unknown file") : "None",
      scheduledFor: data.scheduledFor.toISOString()
    });
    
    // Validate content based on content type
    if (!data.content || data.content.trim() === '') {
      toast.error("Please add a description or message to your time capsule");
      return;
    }
    
    // For non-text content types, ensure a media file is included
    if (data.type !== 'text' && !data.mediaUrl) {
      toast.error(`Please upload a ${data.type} file before submitting`);
      return;
    }
    
    // Validate scheduled date is in the future
    const scheduledDate = new Date(data.scheduledFor);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (scheduledDate < today) {
      toast.error("Please select a future delivery date");
      return;
    }
    
    // Show toast with submission status
    toast.promise(
      // This would be a real API call in a production app
      new Promise((resolve) => {
        setTimeout(() => {
          // Create a sanitized copy of the data for safe submission
          const submissionData = {
            ...data,
            scheduledFor: new Date(data.scheduledFor),
            content: data.content.trim(),
          };
          resolve(submissionData);
        }, 1500);
      }),
      {
        loading: 'Creating your time capsule...',
        success: () => {
          // Call the parent's onSubmit
          onSubmit(data as CapsuleFormData);
          return (
            <div className="flex flex-col">
              <span className="font-medium">Time capsule created!</span>
              <span className="text-sm">Your memories are now preserved for the future.</span>
              {data.mediaUrl && (
                <span className="text-xs mt-1">Media stored securely on cloud storage.</span>
              )}
            </div>
          );
        },
        error: 'Failed to create time capsule',
      }
    );
  };

  const contentType = form.watch("type");
  const privacyType = form.watch("privacy");
  const useConditionalLock = form.watch("useConditionalLock");
  const unlockCondition = form.watch("unlockCondition");
  const useAIFutureVisual = form.watch("useAIFutureVisual");
  const isPartOfChallenge = form.watch("isPartOfChallenge");
  
  // Debug content values when they change
  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      if (name === 'content' || name === 'mediaUrl' || name === 'type') {
        console.log(`Form field "${name}" changed:`, value[name]);
      }
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);

  // Content type specific handling with optimizations
  const getContentInputField = () => {
    switch (contentType) {
      case "text":
        return (
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message Content</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write your message here..."
                    className="min-h-[200px] resize-none focus-visible:ring-1"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      // Only log on development for better performance
                      if (process.env.NODE_ENV === 'development') {
                        console.log("Text content updated");
                      }
                    }}
                  />
                </FormControl>
                <FormDescription>
                  The main content of your time capsule.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        );
      case "image":
        return (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe this image and why it's meaningful to you..."
                      className="min-h-[100px] resize-none focus-visible:ring-1"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="rounded-lg overflow-hidden border bg-gradient-to-r from-slate-50 to-slate-100">
              <div className="p-4 border-b bg-white">
                <div className="flex justify-between items-center">
                  <Label htmlFor="image-upload-main" className="block mb-0 font-medium text-slate-700">Upload Image</Label>
                  {fileName && !uploading && (
                    <Button 
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const fileInput = document.getElementById('image-upload-main');
                        if (fileInput) fileInput.click();
                      }}
                      className="text-xs h-8"
                    >
                      Change Image
                    </Button>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-1">Add visual memories to your time capsule</p>
              </div>
              
              <div className="p-5">
                <div className="flex items-center justify-center border-2 border-dashed border-slate-300 rounded-lg p-6 bg-white transition-colors hover:bg-slate-50 hover:border-slate-400">
                  {!uploading && !filePreview && !fileName ? (
                    <div className="text-center">
                      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
                        <Image className="h-6 w-6 text-slate-400" />
                      </div>
                      <p className="text-sm text-slate-600 mb-3">Drag and drop your image here, or</p>
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="relative bg-white"
                        onClick={() => {
                          const fileInput = document.getElementById('image-upload-main');
                          if (fileInput) fileInput.click();
                        }}
                      >
                        <Input 
                          id="image-upload-main" 
                          type="file" 
                          accept="image/*"
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          onChange={(e) => handleFileUpload(e, "image")}
                          disabled={uploading}
                        />
                        <Image className="h-4 w-4 mr-2" />
                        Select Image
                      </Button>
                      <p className="mt-2 text-xs text-muted-foreground">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  ) : uploading ? (
                    <div className="w-full max-w-md">
                      <div className="flex justify-between mb-2">
                        <div className="flex items-center">
                          <div className="mr-2 h-5 w-5 text-blue-500 animate-spin">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          </div>
                          <span className="text-sm font-medium text-slate-700">Uploading {fileName}...</span>
                        </div>
                        <span className="text-sm font-medium text-blue-600">{uploadProgress}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full max-w-md">
                      {filePreview ? (
                        <div className="flex flex-col items-center">
                          <div className="relative rounded-lg overflow-hidden border border-slate-200 mb-3 shadow-sm">
                            <img src={filePreview} alt="Preview" className="max-h-64 max-w-full object-contain" />
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="icon"
                              className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm rounded-full h-7 w-7 p-0 shadow-sm hover:bg-white"
                              onClick={() => {
                                setFilePreview(null);
                                setFileName(null);
                                form.setValue('mediaUrl', '');
                              }}
                            >
                              <span className="sr-only">Remove</span>
                              ×
                            </Button>
                          </div>
                          <p className="text-sm text-slate-700 font-medium">{fileName}</p>
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm"
                            className="mt-2 text-xs h-8"
                            onClick={() => {
                              const fileInput = document.getElementById('image-upload-main');
                              if (fileInput) fileInput.click();
                            }}
                          >
                            Replace Image
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between w-full p-3 bg-slate-50 rounded-lg border border-slate-200">
                          <div className="flex items-center">
                            <div className="bg-slate-100 p-2 rounded-md mr-3">
                              <Image className="h-5 w-5 text-slate-500" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-slate-700">{fileName}</p>
                              <p className="text-xs text-slate-500">Image file uploaded</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="sm"
                              className="h-8 w-8 p-0 rounded-full"
                              onClick={() => {
                                setFilePreview(null);
                                setFileName(null);
                                form.setValue('mediaUrl', '');
                              }}
                            >
                              <span className="sr-only">Remove</span>
                              ×
                            </Button>
                          </div>
                        </div>
                      )}
                      
                      <Input 
                        id="image-upload-main" 
                        type="file" 
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, "image")}
                      />
                    </div>
                  )}
                </div>
                
                {form.watch('useTimeTravelEffect') && (
                  <div className="mt-4 p-3 rounded-lg bg-amber-50 border border-amber-100">
                    <div className="flex items-center gap-2 mb-1">
                      <CalendarIcon className="h-4 w-4 text-amber-600" />
                      <p className="text-sm font-medium text-amber-800">Time Travel Effect Enabled</p>
                    </div>
                    <p className="text-xs text-amber-700">
                      Your image will be processed to simulate aging over time. When opened in the future, it will appear as if it's been affected by the passage of time.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      case "video":
        return (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Video Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe this video and why it's meaningful to you..."
                      className="min-h-[100px] resize-none focus-visible:ring-1"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="rounded-lg overflow-hidden border bg-white">
              <div className="p-4 border-b">
                <div className="flex justify-between items-center">
                  <Label htmlFor="video-upload-main" className="block mb-0 font-medium text-slate-700">Upload Video</Label>
                  {fileName && !uploading && (
                    <Button 
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const fileInput = document.getElementById('video-upload-main');
                        if (fileInput) fileInput.click();
                      }}
                      className="text-xs h-8"
                    >
                      Change Video
                    </Button>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-1">Add video memories to your time capsule (max 100MB)</p>
              </div>
              
              <div className="p-5">
                <div className="flex items-center justify-center border-2 border-dashed border-slate-300 rounded-lg p-6 bg-white transition-colors hover:bg-slate-50 hover:border-slate-400">
                  {!uploading && !fileName ? (
                    <div className="text-center">
                      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
                        <PlayCircle className="h-6 w-6 text-slate-400" />
                      </div>
                      <p className="text-sm text-slate-600 mb-3">Drag and drop your video here, or</p>
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="relative bg-white"
                        onClick={() => {
                          const fileInput = document.getElementById('video-upload-main');
                          if (fileInput) fileInput.click();
                        }}
                      >
                        <Input 
                          id="video-upload-main" 
                          type="file" 
                          accept="video/*"
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          onChange={(e) => handleFileUpload(e, "video")}
                          disabled={uploading}
                        />
                        <PlayCircle className="h-4 w-4 mr-2" />
                        Select Video
                      </Button>
                      <p className="mt-2 text-xs text-muted-foreground">
                        MP4, WebM, MOV up to 100MB
                      </p>
                    </div>
                  ) : uploading ? (
                    <div className="w-full max-w-md">
                      <div className="flex justify-between mb-2">
                        <div className="flex items-center">
                          <div className="mr-2 h-5 w-5 text-blue-500 animate-spin">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          </div>
                          <span className="text-sm font-medium text-slate-700">Optimizing video for time travel...</span>
                        </div>
                        <span className="text-sm font-medium text-blue-600">{uploadProgress}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-in-out" style={{ width: `${uploadProgress}%` }}></div>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full max-w-md">
                      <div className="flex items-center justify-between w-full p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <div className="flex items-center">
                          <div className="bg-slate-100 p-2 rounded-md mr-3">
                            <PlayCircle className="h-5 w-5 text-slate-500" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-700">{fileName}</p>
                            <p className="text-xs text-slate-500">Video file uploaded</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm"
                            className="h-8 w-8 p-0 rounded-full"
                            onClick={() => {
                              setFilePreview(null);
                              setFileName(null);
                              form.setValue('mediaUrl', '');
                            }}
                          >
                            <span className="sr-only">Remove</span>
                            ×
                          </Button>
                        </div>
                      </div>
                      
                      <Input 
                        id="video-upload-main" 
                        type="file" 
                        accept="video/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, "video")}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      case "audio":
        return (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Audio Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe this audio and why it's meaningful to you..."
                      className="min-h-[100px] resize-none focus-visible:ring-1"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="border rounded-md p-4 bg-slate-50">
              <div className="flex justify-between items-center mb-2">
                <Label htmlFor="audio-upload-main" className="block mb-0">Upload Audio</Label>
                {fileName && !uploading && (
                  <Button 
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const fileInput = document.getElementById('audio-upload-main');
                      if (fileInput) fileInput.click();
                    }}
                  >
                    Change Audio
                  </Button>
                )}
              </div>
              <div className="flex items-center justify-center border-2 border-dashed border-slate-300 rounded-md p-6 bg-white">
                {!uploading && !fileName ? (
                  <div className="text-center">
                    <div className="mt-2 flex justify-center">
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="relative"
                        onClick={() => {
                          const fileInput = document.getElementById('audio-upload-main');
                          if (fileInput) fileInput.click();
                        }}
                      >
                        <Input 
                          id="audio-upload-main" 
                          type="file" 
                          accept="audio/*"
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          onChange={(e) => handleFileUpload(e, "audio")}
                          disabled={uploading}
                        />
                        Select Audio
                      </Button>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      MP3, WAV, M4A up to 50MB
                    </p>
                  </div>
                ) : uploading ? (
                  <div className="w-full">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Uploading...</span>
                      <span className="text-sm">{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2.5">
                      <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
                    </div>
                  </div>
                ) : (
                  <div className="w-full">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center">
                        <div className="bg-slate-100 p-2 rounded mr-2">
                          <Music className="h-5 w-5 text-slate-500" />
                        </div>
                        <span className="text-sm truncate max-w-[200px]">{fileName}</span>
                      </div>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setFileName(null);
                          form.setValue('mediaUrl', '');
                        }}
                      >
                        <span className="sr-only">Remove</span>
                        ×
                      </Button>
                    </div>
                    <Input 
                      id="audio-upload-main" 
                      type="file" 
                      accept="audio/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, "audio")}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      case "mixed":
        return (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write your message here..."
                      className="min-h-[150px] resize-none focus-visible:ring-1"
                      value={field.value}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        console.log("Mixed content updated:", e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Add text along with media files for a rich time capsule experience.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border rounded-md p-4 bg-slate-50">
                <Label htmlFor="mixed-image-upload" className="block mb-2 font-medium">Add Image</Label>
                <div className="flex items-center justify-center border-2 border-dashed border-slate-300 rounded-md p-4 bg-white h-[120px]">
                  {fileName && fileName.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                    <div className="w-full flex flex-col items-center">
                      {filePreview && (
                        <img src={filePreview} alt="Preview" className="max-h-20 max-w-full mb-2 rounded" />
                      )}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setFilePreview(null);
                          setFileName(null);
                          form.setValue('mediaUrl', '');
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center gap-1" 
                      onClick={() => {
                        const fileInput = document.getElementById('mixed-image-upload');
                        if (fileInput) fileInput.click();
                      }}
                    >
                      <Image className="h-4 w-4" />
                      <span>Image</span>
                      <Input 
                        id="mixed-image-upload" 
                        type="file" 
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, "mixed")}
                      />
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="border rounded-md p-4 bg-slate-50">
                <Label htmlFor="mixed-video-upload" className="block mb-2 font-medium">Add Video</Label>
                <div className="flex items-center justify-center border-2 border-dashed border-slate-300 rounded-md p-4 bg-white h-[120px]">
                  {fileName && fileName.match(/\.(mp4|mov|avi|webm)$/i) ? (
                    <div className="w-full flex flex-col items-center">
                      <div className="flex items-center justify-center bg-slate-100 p-2 rounded mb-2">
                        <PlayCircle className="h-8 w-8 text-blue-500" />
                      </div>
                      <span className="text-xs text-center truncate max-w-full mb-1">{fileName}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setFileName(null);
                          form.setValue('mediaUrl', '');
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center gap-1"
                      onClick={() => {
                        const fileInput = document.getElementById('mixed-video-upload');
                        if (fileInput) fileInput.click();
                      }}
                    >
                      <PlayCircle className="h-4 w-4" />
                      <span>Video</span>
                      <Input 
                        id="mixed-video-upload" 
                        type="file" 
                        accept="video/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, "mixed")}
                      />
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="border rounded-md p-4 bg-slate-50">
                <Label htmlFor="mixed-audio-upload" className="block mb-2 font-medium">Add Audio</Label>
                <div className="flex items-center justify-center border-2 border-dashed border-slate-300 rounded-md p-4 bg-white h-[120px]">
                  {fileName && fileName.match(/\.(mp3|wav|m4a|ogg)$/i) ? (
                    <div className="w-full flex flex-col items-center">
                      <div className="flex items-center justify-center bg-slate-100 p-2 rounded mb-2">
                        <Music className="h-8 w-8 text-green-500" />
                      </div>
                      <span className="text-xs text-center truncate max-w-full mb-1">{fileName}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setFileName(null);
                          form.setValue('mediaUrl', '');
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center gap-1"
                      onClick={() => {
                        const fileInput = document.getElementById('mixed-audio-upload');
                        if (fileInput) fileInput.click();
                      }}
                    >
                      <Music className="h-4 w-4" />
                      <span>Audio</span>
                      <Input 
                        id="mixed-audio-upload" 
                        type="file" 
                        accept="audio/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, "mixed")}
                      />
                    </Button>
                  )}
                </div>
              </div>
              
              {uploading && (
                <div className="col-span-full bg-blue-50 p-3 rounded-md border border-blue-100">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-blue-700">Uploading {fileName}...</span>
                    <span className="text-sm text-blue-700">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-white rounded-full h-2.5">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
                  </div>
                </div>
              )}
              
              {!uploading && fileName && (
                <div className="col-span-full bg-blue-50 p-3 rounded-md border border-blue-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="bg-white p-1.5 rounded mr-2">
                        {fileName.match(/\.(mp4|mov|avi|webm)$/i) ? (
                          <PlayCircle className="h-4 w-4 text-blue-500" />
                        ) : fileName.match(/\.(mp3|wav|m4a|ogg)$/i) ? (
                          <Music className="h-4 w-4 text-blue-500" />
                        ) : (
                          <Image className="h-4 w-4 text-blue-500" />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-blue-700 font-medium">File Added</span>
                        <span className="text-xs text-blue-600 truncate max-w-[250px]">{fileName}</span>
                      </div>
                    </div>
                    <Button 
                      type="button" 
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs border-blue-200 text-blue-700 hover:bg-blue-100"
                      onClick={() => {
                        if (fileName.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
                          const fileInput = document.getElementById('mixed-image-upload');
                          if (fileInput) fileInput.click();
                        } else if (fileName.match(/\.(mp4|mov|avi|webm)$/i)) {
                          const fileInput = document.getElementById('mixed-video-upload');
                          if (fileInput) fileInput.click();
                        } else if (fileName.match(/\.(mp3|wav|m4a|ogg)$/i)) {
                          const fileInput = document.getElementById('mixed-audio-upload');
                          if (fileInput) fileInput.click();
                        }
                      }}
                    >
                      Change File
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      case "ar-vr":
        return (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>AR/VR Experience Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the AR/VR experience you want to create..."
                      className="min-h-[100px] resize-none focus-visible:ring-1"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="rounded-lg overflow-hidden border bg-gradient-to-r from-purple-50 to-indigo-50">
              <div className="p-4 border-b bg-white">
                <div className="flex justify-between items-center">
                  <Label htmlFor="ar-upload-main" className="block mb-0 font-medium text-slate-700">Upload AR/VR Asset</Label>
                  {fileName && !uploading && (
                    <Button 
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const fileInput = document.getElementById('ar-upload-main');
                        if (fileInput) fileInput.click();
                      }}
                      className="text-xs h-8"
                    >
                      Change Asset
                    </Button>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-1">Add AR/VR experiences to your time capsule</p>
              </div>
              
              <div className="p-5">
                <div className="flex items-center justify-center border-2 border-dashed border-purple-300 rounded-lg p-6 bg-white transition-colors hover:bg-slate-50 hover:border-purple-400">
                  {!uploading && !fileName ? (
                    <div className="text-center">
                      <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-3">
                        <Zap className="h-6 w-6 text-purple-500" />
                      </div>
                      <p className="text-sm text-slate-600 mb-3">Drag and drop your 3D model or AR asset here, or</p>
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="relative bg-white"
                        onClick={() => {
                          const fileInput = document.getElementById('ar-upload-main');
                          if (fileInput) fileInput.click();
                        }}
                      >
                        <Input 
                          id="ar-upload-main" 
                          type="file" 
                          accept=".glb,.gltf,.usdz,.reality"
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          onChange={(e) => handleFileUpload(e, "ar")}
                          disabled={uploading}
                        />
                        <Zap className="h-4 w-4 mr-2" />
                        Select 3D Asset
                      </Button>
                      <p className="mt-2 text-xs text-muted-foreground">
                        GLB, GLTF, USDZ, Reality files up to 100MB
                      </p>
                    </div>
                  ) : uploading ? (
                    <div className="w-full max-w-md">
                      <div className="flex justify-between mb-2">
                        <div className="flex items-center">
                          <div className="mr-2 h-5 w-5 text-purple-500 animate-spin">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          </div>
                          <span className="text-sm font-medium text-slate-700">Processing AR/VR asset...</span>
                        </div>
                        <span className="text-sm font-medium text-purple-600">{uploadProgress}%</span>
                      </div>
                      <div className="w-full bg-purple-100 rounded-full h-2">
                        <div className="bg-purple-600 h-2 rounded-full transition-all duration-300 ease-in-out" style={{ width: `${uploadProgress}%` }}></div>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full max-w-md">
                      <div className="flex items-center justify-between w-full p-3 bg-purple-50 rounded-lg border border-purple-200">
                        <div className="flex items-center">
                          <div className="bg-purple-100 p-2 rounded-md mr-3">
                            <Zap className="h-5 w-5 text-purple-500" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-700">{fileName}</p>
                            <p className="text-xs text-purple-700">AR/VR asset ready</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm"
                            className="h-8 w-8 p-0 rounded-full"
                            onClick={() => {
                              setFileName(null);
                              form.setValue('mediaUrl', '');
                            }}
                          >
                            <span className="sr-only">Remove</span>
                            ×
                          </Button>
                        </div>
                      </div>
                      
                      <Input 
                        id="ar-upload-main" 
                        type="file" 
                        accept=".glb,.gltf,.usdz,.reality"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, "ar")}
                      />
                    </div>
                  )}
                </div>
                
                <div className="mt-4 p-3 bg-purple-50 border border-purple-100 rounded-md">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-4 w-4 text-purple-600" />
                    <p className="text-sm font-medium text-purple-700">AR/VR Experience Preview</p>
                  </div>
                  <p className="text-sm text-purple-700">
                    {fileName ? 
                      "Your AR/VR experience is ready. Recipients will be able to interact with your 3D model in augmented reality." : 
                      "Upload your 3D model or AR asset to enable an immersive experience for your time capsule recipients."}
                  </p>
                  {fileName && (
                    <div className="mt-3 p-2 bg-white rounded-md border border-purple-200">
                      <p className="text-xs text-purple-600">Preview will be available once your capsule is created</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message Content</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write your message here..."
                    className="min-h-[200px] resize-none focus-visible:ring-1"
                    value={field.value}
                    onChange={(e) => {
                      field.onChange(e);
                      console.log("Text content updated:", e.target.value);
                    }}
                  />
                </FormControl>
                <FormDescription>
                  The main content of your time capsule.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        );
    }
  };

  return (
    <div className="space-y-8 pb-28">
      {/* Form header with visual elements */}
      <div className="rounded-lg border-0 bg-gradient-to-r from-purple-50 via-blue-50 to-purple-50 p-6 mb-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Create Your Time Capsule
            </h1>
            <p className="text-slate-600 max-w-xl">
              Preserve your memories, thoughts, and media for future reflection. Add special features to create an extraordinary experience.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400 to-blue-400 animate-pulse opacity-40"></div>
              <div className="absolute inset-2 rounded-full bg-white flex items-center justify-center">
                <CalendarIcon className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex flex-wrap gap-2">
          <div className="bg-white/60 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 text-slate-700 border border-slate-200">
            <CalendarIcon className="h-3 w-3" />
            <span>Future delivery</span>
          </div>
          <div className="bg-white/60 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 text-slate-700 border border-slate-200">
            <Lock className="h-3 w-3" />
            <span>Private or public</span>
          </div>
          <div className="bg-white/60 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 text-slate-700 border border-slate-200">
            <Brain className="h-3 w-3" />
            <span>AI enhancements</span>
          </div>
          <div className="bg-white/60 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 text-slate-700 border border-slate-200">
            <Music className="h-3 w-3" />
            <span>Rich media</span>
          </div>
        </div>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(submitForm)} className="space-y-8">
          {/* Privacy Notice Alert */}
          <Alert className="bg-muted/50 border-primary/30">
            <Lock className="h-4 w-4 text-primary" />
            <AlertTitle>Privacy Notice</AlertTitle>
            <AlertDescription>
              Private capsules are only visible to you and will never appear in public listings. 
              Choose "Public" if you want your capsule to appear in the explore page.
            </AlertDescription>
          </Alert>
          
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Basic Information</h2>
                <p className="text-muted-foreground">
                  Let's start with the essential details of your time capsule.
                </p>
              </div>
              
              <Card className="p-6 border border-slate-200 shadow-sm">
                <div className="space-y-6">
                  <div className="border-b pb-4 mb-4">
                    <h2 className="text-xl font-semibold">Capsule Details</h2>
                    <p className="text-muted-foreground text-sm">Basic information about your time capsule</p>
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="My Time Capsule" {...field} className="focus-visible:ring-1" />
                        </FormControl>
                        <FormDescription>
                          Give your time capsule a meaningful title.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Briefly describe what this time capsule contains..."
                            className="resize-none focus-visible:ring-1"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          A short description to help you remember what's inside.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Separator />
                  
                  <div className="border-b pb-4 mb-4">
                    <h2 className="text-xl font-semibold">Content</h2>
                    <p className="text-muted-foreground text-sm">What do you want to include in this capsule?</p>
                  </div>

                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Content Type</FormLabel>
                        <FormDescription>
                          Select the type of content for your time capsule
                        </FormDescription>
                        <FormControl>
                          <RadioGroup
                            onValueChange={(value) => {
                              // Use requestAnimationFrame for better performance
                              requestAnimationFrame(() => {
                                field.onChange(value);
                                
                                // Set upload field visibility based on content type
                                if (value !== "text") {
                                  // Small delay for non-text types to reduce perceived lag
                                  setTimeout(() => {
                                    setShowUploadField(true);
                                  }, 10);
                                } else {
                                  setShowUploadField(false);
                                }
                                
                                // Log for debugging
                                console.log(`Content type changed to: ${value}`);
                              });
                            }}
                            defaultValue={field.value}
                            className="grid grid-cols-3 gap-4"
                          >
                            {contentTypes.map((type) => (
                              <FormItem key={type.value}>
                                <FormLabel className="[&:has([data-state=checked])>div]:border-primary">
                                  <FormControl>
                                    <RadioGroupItem value={type.value} className="sr-only" />
                                  </FormControl>
                                  <div className="items-center rounded-md border-2 border-muted p-1 hover:border-accent cursor-pointer">
                                    <div className="flex flex-col items-center justify-between rounded-sm p-2">
                                      {type.icon}
                                      <span className="mt-2 block text-center font-normal">
                                        {type.label}
                                      </span>
                                    </div>
                                  </div>
                                </FormLabel>
                              </FormItem>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Dynamic content input field based on content type */}
                  {getContentInputField()}

                  {/* Enhanced AI Future Visualization with Preview */}
                  <FormField
                    control={form.control}
                    name="useAIFutureVisual"
                    render={({ field }) => (
                      <FormItem className="flex flex-col space-y-4 rounded-xl border p-0 overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
                        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 h-2"></div>
                        <div className="p-4 flex flex-row items-start space-x-3">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="mt-1"
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none flex-1">
                            <div className="flex items-center">
                              <FormLabel className="font-medium cursor-pointer mr-2 text-lg text-slate-800">
                                AI Future Visualization
                              </FormLabel>
                              <div className="bg-purple-100 p-1 rounded-md">
                                <Brain className="h-4 w-4 text-purple-600" />
                              </div>
                              <div className="ml-auto text-xs font-medium bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 px-2 py-0.5 rounded-full">
                                Premium
                              </div>
                            </div>
                            <FormDescription className="text-sm">
                              Generate an AI visualization of how the world might look when your capsule is opened.
                              This creates a unique "window to the future" based on your content and delivery date.
                            </FormDescription>
                          </div>
                        </div>
                        
                        {field.value && (
                          <div className="p-4 bg-gradient-to-br from-purple-50 to-indigo-50 border-t border-purple-100">
                            <div className="flex items-center space-x-2 mb-3">
                              <div className="h-2 w-2 rounded-full bg-purple-600 animate-pulse"></div>
                              <p className="text-sm font-medium text-purple-800">AI Preview</p>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm text-purple-700 mb-3">
                                  Our AI will generate a visualization of how the world might 
                                  look in {form.getValues("scheduledFor") ? 
                                    new Date(form.getValues("scheduledFor")).getFullYear() : "the future"}. 
                                  Choose a theme for your visualization:
                                </p>
                                
                                <div className="grid grid-cols-2 gap-2 mb-3">
                                  <Button 
                                    type="button" 
                                    variant="outline" 
                                    size="sm"
                                    className="h-9 bg-white hover:bg-purple-50 border-purple-200 text-purple-700 hover:text-purple-800 hover:border-purple-300 transition-all"
                                  >
                                    <div className="w-3 h-3 rounded-full bg-purple-200 mr-2"></div>
                                    Urban Landscape
                                  </Button>
                                  <Button 
                                    type="button" 
                                    variant="outline" 
                                    size="sm"
                                    className="h-9 bg-white hover:bg-purple-50 border-purple-200 text-purple-700 hover:text-purple-800 hover:border-purple-300 transition-all"
                                  >
                                    <div className="w-3 h-3 rounded-full bg-green-200 mr-2"></div>
                                    Natural World
                                  </Button>
                                  <Button 
                                    type="button" 
                                    variant="outline" 
                                    size="sm"
                                    className="h-9 bg-white hover:bg-purple-50 border-purple-200 text-purple-700 hover:text-purple-800 hover:border-purple-300 transition-all"
                                  >
                                    <div className="w-3 h-3 rounded-full bg-blue-200 mr-2"></div>
                                    Technology
                                  </Button>
                                  <Button 
                                    type="button" 
                                    variant="outline" 
                                    size="sm"
                                    className="h-9 bg-white hover:bg-purple-50 border-purple-200 text-purple-700 hover:text-purple-800 hover:border-purple-300 transition-all"
                                  >
                                    <div className="w-3 h-3 rounded-full bg-indigo-200 mr-2"></div>
                                    Space Exploration
                                  </Button>
                                </div>
                                
                                <div className="mb-3">
                                  <Input 
                                    placeholder="Or describe what you want to see..." 
                                    className="h-9 bg-white border-purple-200 focus:border-purple-400 focus:ring-purple-400" 
                                  />
                                </div>
                              </div>
                              
                              <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-700 flex items-center justify-center shadow-inner">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.1)_0%,_transparent_70%)] bg-[length:20px_20px]"></div>
                                <div className="absolute inset-0 opacity-30">
                                  <div className="absolute inset-0 bg-[length:40px_40px] bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.2)_0%,_transparent_60%)]"></div>
                                </div>
                                <div className="relative flex flex-col items-center justify-center text-white p-4">
                                  <Brain className="h-10 w-10 mb-3 animate-pulse" />
                                  <p className="text-sm text-center font-medium mb-1">Your AI-generated vision of the future</p>
                                  <p className="text-xs text-center opacity-80">
                                    Visualization of {form.getValues("scheduledFor") ? 
                                      new Date(form.getValues("scheduledFor")).getFullYear() : "the future"}
                                  </p>
                                  <div className="mt-3 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-xs">
                                    Generated after submission
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </FormItem>
                    )}
                  />

                  {/* Interactive 3D Memory Scrapbook */}
                  <FormField
                    control={form.control}
                    name="use3DMemoryScrapbook"
                    render={({ field }) => (
                      <FormItem className="flex flex-col space-y-4 rounded-md border p-4 bg-gradient-to-r from-blue-50 to-teal-50 border-slate-200">
                        <div className="flex flex-row items-start space-x-3">
                          <FormControl>
                            <Checkbox
                              checked={field ? field.value : false}
                              onCheckedChange={(checked) => {
                                field.onChange(checked);
                                // Set default value if not already defined in schema
                                if (checked && !form.getValues().memoryScrapbookStyle) {
                                  form.setValue('memoryScrapbookStyle', 'floating');
                                }
                              }}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <div className="flex items-center">
                              <FormLabel className="font-medium cursor-pointer mr-2">
                                Interactive 3D Memory Display
                              </FormLabel>
                              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100">
                                <span className="text-blue-600 text-xs">3D</span>
                              </div>
                            </div>
                            <FormDescription className="text-xs md:text-sm">
                              Transform your memories into an interactive 3D display that recipients can explore.
                              Perfect for creating immersive time capsule experiences.
                            </FormDescription>
                          </div>
                        </div>
                        
                        {field.value && (
                          <div className="mt-2 p-4 bg-blue-50/80 backdrop-blur border border-blue-200 rounded-md shadow-inner">
                            <div className="flex items-center justify-between mb-3">
                              <p className="text-sm font-medium text-blue-800">3D Display Style</p>
                              <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                Premium Feature
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                              <div className="relative cursor-pointer group">
                                <div className="aspect-square bg-white rounded-md border border-blue-200 overflow-hidden p-2 flex items-center justify-center group-hover:border-blue-500 transition-colors">
                                  <div className="relative w-full h-full">
                                    <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-blue-100 rounded-md transform rotate-12 shadow-sm"></div>
                                    <div className="absolute top-1/3 left-1/3 w-1/3 h-1/3 bg-teal-100 rounded-md transform -rotate-12 shadow-sm"></div>
                                  </div>
                                </div>
                                <p className="text-xs text-center mt-1 text-blue-700">Floating</p>
                                <div className="absolute inset-0 bg-blue-500/10 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="absolute top-2 right-2 h-3 w-3 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                              </div>
                              
                              <div className="relative cursor-pointer group">
                                <div className="aspect-square bg-white rounded-md border border-blue-200 overflow-hidden p-2 flex items-center justify-center group-hover:border-blue-500 transition-colors">
                                  <div className="relative w-full h-full flex flex-col justify-between">
                                    <div className="w-full h-1/3 bg-gradient-to-r from-blue-100 to-teal-100 rounded-sm"></div>
                                    <div className="w-full h-1/3 bg-gradient-to-r from-teal-100 to-blue-100 rounded-sm"></div>
                                    <div className="w-full h-1/3 bg-gradient-to-r from-blue-100 to-teal-100 rounded-sm"></div>
                                  </div>
                                </div>
                                <p className="text-xs text-center mt-1 text-blue-700">Timeline</p>
                                <div className="absolute inset-0 bg-blue-500/10 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
                              </div>
                              
                              <div className="relative cursor-pointer group">
                                <div className="aspect-square bg-white rounded-md border border-blue-200 overflow-hidden p-2 flex items-center justify-center group-hover:border-blue-500 transition-colors">
                                  <div className="relative w-full h-full">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                      <div className="w-1/2 h-1/2 rounded-full border-4 border-blue-100 flex items-center justify-center">
                                        <div className="w-2/3 h-2/3 rounded-full border-4 border-teal-100"></div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <p className="text-xs text-center mt-1 text-blue-700">Orbit</p>
                                <div className="absolute inset-0 bg-blue-500/10 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
                              </div>
                              
                              <div className="relative cursor-pointer group">
                                <div className="aspect-square bg-white rounded-md border border-blue-200 overflow-hidden p-2 flex items-center justify-center group-hover:border-blue-500 transition-colors">
                                  <div className="relative w-full h-full grid grid-cols-2 grid-rows-2 gap-1">
                                    <div className="bg-blue-100 rounded-sm"></div>
                                    <div className="bg-teal-100 rounded-sm"></div>
                                    <div className="bg-teal-100 rounded-sm"></div>
                                    <div className="bg-blue-100 rounded-sm"></div>
                                  </div>
                                </div>
                                <p className="text-xs text-center mt-1 text-blue-700">Gallery</p>
                                <div className="absolute inset-0 bg-blue-500/10 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
                              </div>
                            </div>
                            
                            <div className="bg-white/80 rounded-md border border-blue-200 p-3 mb-4">
                              <p className="text-xs text-blue-800 mb-2">Interactive Preview</p>
                              <div className="h-32 bg-gradient-to-r from-blue-100/50 to-teal-100/50 rounded flex items-center justify-center relative overflow-hidden">
                                <div className="absolute -left-6 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/80 rounded-full flex items-center justify-center shadow-sm cursor-pointer hover:bg-white transition-colors">
                                  <div className="border-r-2 border-blue-400 w-2 h-4 ml-1"></div>
                                </div>
                                <div className="absolute -right-6 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/80 rounded-full flex items-center justify-center shadow-sm cursor-pointer hover:bg-white transition-colors">
                                  <div className="border-l-2 border-blue-400 w-2 h-4 mr-1"></div>
                                </div>
                                <div className="text-center">
                                  <p className="text-xs text-blue-500">3D Memory Preview</p>
                                  <p className="text-[10px] text-blue-400 mt-1">Will activate after creating capsule</p>
                                </div>
                              </div>
                            </div>
                            
                            <div className="text-xs text-blue-700 bg-blue-100/50 p-2 rounded-md">
                              Recipients will be able to interact with your memories in 3D space, rotating and exploring each item in your time capsule.
                            </div>
                          </div>
                        )}
                      </FormItem>
                    )}
                  />

                  {/* AR Capsule Placement */}
                  <FormField
                    control={form.control}
                    name="useARPlacement"
                    render={({ field }) => (
                      <FormItem className="flex flex-col space-y-4 rounded-md border p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-slate-200">
                        <div className="flex flex-row items-start space-x-3">
                          <FormControl>
                            <Checkbox
                              checked={field ? field.value : false}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <div className="flex items-center">
                              <FormLabel className="font-medium cursor-pointer mr-2">
                                AR Capsule Placement
                              </FormLabel>
                              <div className="flex items-center justify-center rounded-md bg-green-100 px-1.5 py-0.5">
                                <span className="text-green-700 text-xs font-medium">AR</span>
                              </div>
                            </div>
                            <FormDescription className="text-xs md:text-sm">
                              Anchor your time capsule to a real-world location using AR. Recipients will need to physically 
                              visit the location to uncover your capsule.
                            </FormDescription>
                          </div>
                        </div>
                        
                        {field.value && (
                          <div className="mt-2 space-y-4 p-4 bg-green-50/80 backdrop-blur border border-green-200 rounded-md shadow-inner">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-green-800">Location Details</p>
                              <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                Modern Feature
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-3">
                                <div className="space-y-2">
                                  <Label className="text-xs text-green-700">Choose Location Method</Label>
                                  <div className="grid grid-cols-2 gap-2">
                                    <Button 
                                      type="button" 
                                      variant="outline" 
                                      size="sm"
                                      className="text-xs h-8 bg-white/80 border-green-200 text-green-700 hover:bg-green-100 hover:text-green-800"
                                    >
                                      Current Location
                                    </Button>
                                    <Button 
                                      type="button" 
                                      variant="outline" 
                                      size="sm"
                                      className="text-xs h-8 bg-white/80 border-green-200 text-green-700 hover:bg-green-100 hover:text-green-800"
                                    >
                                      Search Map
                                    </Button>
                                  </div>
                                </div>
                                
                                <div className="space-y-2">
                                  <Label className="text-xs text-green-700">Coordinates</Label>
                                  <div className="grid grid-cols-2 gap-2">
                                    <Input 
                                      placeholder="Latitude" 
                                      className="text-xs h-8 bg-white/80 border-green-200" 
                                    />
                                    <Input 
                                      placeholder="Longitude" 
                                      className="text-xs h-8 bg-white/80 border-green-200" 
                                    />
                                  </div>
                                </div>
                                
                                <div className="space-y-2">
                                  <Label className="text-xs text-green-700">Location Name (Optional)</Label>
                                  <Input 
                                    placeholder="e.g. Central Park, New York" 
                                    className="text-xs h-8 bg-white/80 border-green-200 w-full" 
                                  />
                                </div>
                              </div>
                              
                              <div className="relative overflow-hidden rounded-md bg-white border border-green-200">
                                <div className="absolute inset-0 bg-gradient-to-br from-green-100/50 to-emerald-100/50"></div>
                                <div className="relative h-full flex flex-col items-center justify-center p-4">
                                  <div className="bg-white/80 rounded-md p-2 shadow-sm text-center mb-2">
                                    <p className="text-xs font-medium text-green-800">AR Location Marker</p>
                                    <p className="text-[10px] text-green-600">Set your capsule's location on the map</p>
                                  </div>
                                  <Button 
                                    type="button" 
                                    variant="outline" 
                                    size="sm"
                                    className="text-xs h-8 bg-white border-green-200 text-green-700 hover:bg-green-100 hover:text-green-800"
                                  >
                                    Place Marker
                                  </Button>
                                </div>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <Label className="text-xs text-green-700">Discover Radius (meters)</Label>
                              <div className="flex items-center gap-2">
                                <Input 
                                  type="range" 
                                  min="10" 
                                  max="1000" 
                                  step="10" 
                                  defaultValue="100"
                                  className="h-8" 
                                />
                                <div className="bg-white w-12 h-8 rounded-md border border-green-200 flex items-center justify-center">
                                  <span className="text-xs text-green-800">100m</span>
                                </div>
                              </div>
                              <p className="text-[10px] text-green-700">Recipients must be within this radius to discover your capsule</p>
                            </div>
                            
                            <div className="bg-white/80 rounded-md border border-green-200 p-3">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                <p className="text-xs font-medium text-green-800">How It Works</p>
                              </div>
                              <p className="text-xs text-green-700">
                                When recipients are near your designated location, they'll receive a notification. 
                                Using AR, they'll see your capsule appear in the real world through their phone's camera.
                              </p>
                            </div>
                          </div>
                        )}
                      </FormItem>
                    )}
                  />

                  {/* Global Challenge participation option */}
                  <FormField
                    control={form.control}
                    name="isPartOfChallenge"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-slate-50 border-slate-200">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <div className="flex items-center">
                            <FormLabel className="font-medium cursor-pointer mr-2">
                              Join a Global Challenge
                            </FormLabel>
                            <Globe2 className="h-4 w-4 text-blue-600" />
                          </div>
                          <FormDescription className="text-xs md:text-sm">
                            Contribute to a collective time capsule with people around the world.
                            Your capsule will be part of a larger global initiative.
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  {/* Challenge selection dropdown (only if isPartOfChallenge is true) */}
                  {isPartOfChallenge && (
                    <FormField
                      control={form.control}
                      name="challengeId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Select Challenge</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a global challenge" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="climate-2050">Climate Action 2050</SelectItem>
                              <SelectItem value="heritage-project">Cultural Heritage Preservation</SelectItem>
                              <SelectItem value="future-tech">Future Technology Predictions</SelectItem>
                              <SelectItem value="peace-initiative">Global Peace Initiative</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Choose which global challenge you want to contribute to.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <Separator />
                  
                  <div className="border-b pb-4 mb-4">
                    <h2 className="text-xl font-semibold">Delivery Settings</h2>
                    <p className="text-muted-foreground text-sm">When and how should your capsule be delivered?</p>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    {/* Updated privacy settings with generational option */}
                    <FormField
                      control={form.control}
                      name="privacy"
                      render={({ field }) => (
                        <FormItem className="bg-muted/40 p-4 rounded-md border border-muted">
                          <FormLabel className="text-lg font-medium">Privacy Setting</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <SelectTrigger className="w-full">
                                <Lock className="h-4 w-4 mr-2 opacity-70" />
                                <SelectValue placeholder="Select privacy level" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="private" className="font-medium">Private (Only for you)</SelectItem>
                                <SelectItem value="specific">Specific People (Invite only)</SelectItem>
                                <SelectItem value="public">Public (Anyone can view)</SelectItem>
                                <SelectItem value="generational">Generational Chain (Family legacy)</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormDescription className="mt-2">
                            {field.value === "private" && (
                              <div className="flex items-start gap-2 mt-1">
                                <ShieldCheck className="h-4 w-4 mt-0.5 text-green-600" />
                                <span>
                                  <strong>Private:</strong> Only you can access this capsule. It will never appear in public listings or search results.
                                </span>
                              </div>
                            )}
                            {field.value === "specific" && (
                              <div className="flex items-start gap-2 mt-1">
                                <ShieldCheck className="h-4 w-4 mt-0.5 text-blue-600" />
                                <span>
                                  <strong>Specific People:</strong> Only people you invite can access this capsule. You'll be able to add recipients in the next step.
                                </span>
                              </div>
                            )}
                            {field.value === "public" && (
                              <div className="flex items-start gap-2 mt-1">
                                <Globe2 className="h-4 w-4 mt-0.5 text-amber-600" />
                                <span>
                                  <strong>Public:</strong> Your capsule will be visible to everyone and may appear in the explore page and search results.
                                </span>
                              </div>
                            )}
                            {field.value === "generational" && (
                              <div className="flex items-start gap-2 mt-1">
                                <ShieldCheck className="h-4 w-4 mt-0.5 text-purple-600" />
                                <span>
                                  <strong>Generational Chain:</strong> Creates a family legacy capsule that can be passed down through generations.
                                </span>
                              </div>
                            )}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Conditional Lock Option */}
                    <FormField
                      control={form.control}
                      name="useConditionalLock"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Unlock Condition</FormLabel>
                          <div className="flex items-center space-x-2">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              Use conditional lock
                            </FormLabel>
                          </div>
                          <FormDescription>
                            Set special conditions for when and how this capsule can be unlocked.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Conditional unlock fields (only if useConditionalLock is true) */}
                  {useConditionalLock && (
                    <div className="border p-4 rounded-md bg-slate-50">
                      <FormField
                        control={form.control}
                        name="unlockCondition"
                        render={({ field }) => (
                          <FormItem className="mb-4">
                            <FormLabel>Unlock Method</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex flex-wrap gap-4"
                              >
                                <FormItem className="flex items-center space-x-2 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="date" />
                                  </FormControl>
                                  <FormLabel className="font-normal cursor-pointer">
                                    Date Only
                                  </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-2 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="location" />
                                  </FormControl>
                                  <FormLabel className="font-normal cursor-pointer">
                                    Location Based
                                  </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-2 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="event" />
                                  </FormControl>
                                  <FormLabel className="font-normal cursor-pointer">
                                    Event Triggered
                                  </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-2 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="biometric" />
                                  </FormControl>
                                  <FormLabel className="font-normal cursor-pointer">
                                    Biometric Verification
                                  </FormLabel>
                                </FormItem>
                              </RadioGroup>
                            </FormControl>
                            <FormDescription>
                              Choose how recipients will be able to unlock your capsule.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Location data field */}
                      {unlockCondition === "location" && (
                        <FormField
                          control={form.control}
                          name="locationData"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Location Coordinates</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. 40.7128° N, 74.0060° W" {...field} />
                              </FormControl>
                              <FormDescription>
                                Enter the coordinates where the capsule can be opened. Recipients must be within 100 meters.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}

                      {/* Event condition field */}
                      {unlockCondition === "event" && (
                        <FormField
                          control={form.control}
                          name="eventCondition"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Event Condition</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. When humans land on Mars" {...field} />
                              </FormControl>
                              <FormDescription>
                                Describe the event that must occur for this capsule to be unlocked.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}

                      {unlockCondition === "biometric" && (
                        <div className="bg-yellow-50 p-3 rounded-md border border-yellow-200 text-yellow-800 text-sm">
                          <p>Biometric verification will require the recipient to verify their identity using facial recognition or other biometric methods.</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Standard delivery date picker */}
                  {(!useConditionalLock || unlockCondition === "date") && (
                    <FormField
                      control={form.control}
                      name="scheduledFor"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Delivery Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  type="button"
                                  variant="outline"
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
                                  {field.value ? (
                                    (() => {
                                      try {
                                        return format(new Date(field.value), "PPP");
                                      } catch (error) {
                                        console.error("Date formatting error:", error);
                                        return "Select a future date";
                                      }
                                    })()
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value instanceof Date ? field.value : new Date(field.value)}
                                onSelect={(date) => {
                                  try {
                                    if (date) {
                                      // Ensure the date is in the future
                                      const safeDate = ensureFutureDate(date);
                                      field.onChange(safeDate);
                                    }
                                  } catch (error) {
                                    console.error("Date selection error:", error);
                                    // Fall back to tomorrow if there's an error
                                    const tomorrow = new Date();
                                    tomorrow.setDate(tomorrow.getDate() + 1);
                                    tomorrow.setHours(0, 0, 0, 0);
                                    field.onChange(tomorrow);
                                  }
                                }}
                                disabled={(date) => {
                                  const today = new Date();
                                  today.setHours(0, 0, 0, 0);
                                  return date < today;
                                }}
                                initialFocus
                                fromDate={new Date()}
                                toDate={new Date(new Date().setFullYear(new Date().getFullYear() + 100))}
                              />
                            </PopoverContent>
                          </Popover>
                          <FormDescription>
                            When should this capsule be delivered? Select a future date.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {/* Reply option */}
                  <FormField
                    control={form.control}
                    name="allowReplies"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <div className="flex items-center">
                            <FormLabel className="font-medium cursor-pointer mr-2">
                              Enable Capsule Echoes
                            </FormLabel>
                            <MessageSquare className="h-4 w-4 text-blue-600" />
                          </div>
                          <FormDescription>
                            Allow recipients to record responses to your capsule, creating a conversation across time.
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  {/* Blockchain security option */}
                  <FormField
                    control={form.control}
                    name="isBlockchainSecured"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 mt-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <div className="flex items-center">
                            <FormLabel className="font-medium cursor-pointer mr-2">
                              Blockchain Security
                            </FormLabel>
                            <ShieldCheck className="h-4 w-4 text-green-600" />
                          </div>
                          <FormDescription>
                            Secure your time capsule with blockchain technology for
                            tamper-proof storage and enhanced privacy protection.
                          </FormDescription>
                          
                          {field.value && (
                            <div className="mt-3 flex items-center p-2 bg-green-50 border border-green-100 rounded text-xs text-green-800">
                              <ShieldCheck className="h-3 w-3 mr-2 text-green-600" />
                              Your content will be cryptographically sealed on our secure blockchain network
                            </div>
                          )}
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </Card>

              {/* Feature Summary Section */}
              <div className="rounded-lg border border-slate-200 p-4 bg-gradient-to-r from-slate-50 to-gray-50 shadow-sm mt-8">
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-sm font-semibold text-slate-900">Your Enhanced Capsule</h3>
                  <div className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                    Special Features
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <p className="text-xs text-slate-600">You've selected these premium features for your time capsule:</p>
                    
                    <div className="space-y-2">
                      {form.watch('useAIFutureVisual') && (
                        <div className="flex items-center p-2 bg-white rounded-md border border-purple-200">
                          <div className="h-6 w-6 bg-purple-100 rounded-full flex items-center justify-center mr-2">
                            <Brain className="h-3 w-3 text-purple-600" />
                          </div>
                          <div>
                            <p className="text-xs font-medium text-slate-800">AI Future Visualization</p>
                            <p className="text-[10px] text-slate-500">AI-generated vision of the future</p>
                          </div>
                        </div>
                      )}
                      
                      {form.watch('use3DMemoryScrapbook') && (
                        <div className="flex items-center p-2 bg-white rounded-md border border-blue-200">
                          <div className="h-6 w-6 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                            <span className="text-blue-600 text-[10px] font-bold">3D</span>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-slate-800">Interactive 3D Memory Display</p>
                            <p className="text-[10px] text-slate-500">3D interactive memory experience</p>
                          </div>
                        </div>
                      )}
                      
                      {form.watch('useARPlacement') && (
                        <div className="flex items-center p-2 bg-white rounded-md border border-green-200">
                          <div className="h-6 w-6 bg-green-100 rounded-full flex items-center justify-center mr-2">
                            <span className="text-green-600 text-[10px] font-bold">AR</span>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-slate-800">AR Capsule Placement</p>
                            <p className="text-[10px] text-slate-500">Location-based AR experience</p>
                          </div>
                        </div>
                      )}
                      
                      {form.watch('useTimeTravelEffect') && (
                        <div className="flex items-center p-2 bg-white rounded-md border border-amber-200">
                          <div className="h-6 w-6 bg-amber-100 rounded-full flex items-center justify-center mr-2">
                            <CalendarIcon className="h-3 w-3 text-amber-600" />
                          </div>
                          <div>
                            <p className="text-xs font-medium text-slate-800">Time Travel Effect</p>
                            <p className="text-[10px] text-slate-500">Simulated aging of your media</p>
                          </div>
                        </div>
                      )}
                      
                      {form.watch('useMemorySoundscape') && (
                        <div className="flex items-center p-2 bg-white rounded-md border border-indigo-200">
                          <div className="h-6 w-6 bg-indigo-100 rounded-full flex items-center justify-center mr-2">
                            <Music className="h-3 w-3 text-indigo-600" />
                          </div>
                          <div>
                            <p className="text-xs font-medium text-slate-800">Memory Soundscapes</p>
                            <p className="text-[10px] text-slate-500">Immersive audio experience</p>
                          </div>
                        </div>
                      )}
                      
                      {form.watch('isBlockchainSecured') && (
                        <div className="flex items-center p-2 bg-white rounded-md border border-green-200">
                          <div className="h-6 w-6 bg-green-100 rounded-full flex items-center justify-center mr-2">
                            <ShieldCheck className="h-3 w-3 text-green-600" />
                          </div>
                          <div>
                            <p className="text-xs font-medium text-slate-800">Blockchain Security</p>
                            <p className="text-[10px] text-slate-500">Tamper-proof storage</p>
                          </div>
                        </div>
                      )}
                      
                      {form.watch('useConditionalLock') && (
                        <div className="flex items-center p-2 bg-white rounded-md border border-blue-200">
                          <div className="h-6 w-6 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                            <Lock className="h-3 w-3 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-xs font-medium text-slate-800">Conditional Lock</p>
                            <p className="text-[10px] text-slate-500">Special unlock conditions</p>
                          </div>
                        </div>
                      )}
                      
                      {!form.watch('useAIFutureVisual') && 
                        !form.watch('use3DMemoryScrapbook') && 
                        !form.watch('useARPlacement') && 
                        !form.watch('useTimeTravelEffect') && 
                        !form.watch('useMemorySoundscape') && 
                        !form.watch('isBlockchainSecured') && 
                        !form.watch('useConditionalLock') && (
                        <div className="flex items-center p-2 bg-white rounded-md border border-slate-200">
                          <div className="h-6 w-6 bg-slate-100 rounded-full flex items-center justify-center mr-2">
                            <span className="text-slate-400 text-[10px]">?</span>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-slate-600">No Special Features Selected</p>
                            <p className="text-[10px] text-slate-500">Try adding features from above</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="bg-white p-3 rounded-md border border-slate-200 h-full">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="text-xs font-medium text-slate-800">Capsule Summary</p>
                        <p className="text-[10px] text-slate-500">
                          Scheduled for delivery on {format(form.watch('scheduledFor'), 'PPP')}
                        </p>
                      </div>
                      <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-[10px] font-medium px-2 py-1 rounded-full">
                        {(() => {
                          const featuresCount = [
                            form.watch('useAIFutureVisual'),
                            form.watch('use3DMemoryScrapbook'),
                            form.watch('useARPlacement'),
                            form.watch('useTimeTravelEffect'),
                            form.watch('useMemorySoundscape'),
                            form.watch('isBlockchainSecured'),
                            form.watch('useConditionalLock')
                          ].filter(Boolean).length;
                          
                          if (featuresCount >= 5) return 'Premium+';
                          if (featuresCount >= 3) return 'Premium';
                          if (featuresCount >= 1) return 'Enhanced';
                          return 'Standard';
                        })()}
                      </div>
                    </div>
                    
                    <div className="relative h-32 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-md mb-3 overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <p className="text-xs text-slate-400">
                            {(() => {
                              const featuresCount = [
                                form.watch('useAIFutureVisual'),
                                form.watch('use3DMemoryScrapbook'),
                                form.watch('useARPlacement'),
                                form.watch('useTimeTravelEffect'),
                                form.watch('useMemorySoundscape'),
                                form.watch('isBlockchainSecured'),
                                form.watch('useConditionalLock')
                              ].filter(Boolean).length;
                              
                              return featuresCount > 0 
                                ? 'Your time capsule includes special features' 
                                : 'Standard time capsule';
                            })()}
                          </p>
                          <p className="text-[10px] text-slate-400 mt-1">
                            {form.watch('title') || 'My Time Capsule'}
                          </p>
                        </div>
                      </div>
                      
                      {/* Decorative elements based on selected features */}
                      {form.watch('useAIFutureVisual') && (
                        <div className="absolute top-2 right-2 bg-purple-100 rounded-full h-4 w-4 flex items-center justify-center">
                          <Brain className="h-2 w-2 text-purple-500" />
                        </div>
                      )}
                      
                      {form.watch('use3DMemoryScrapbook') && (
                        <div className="absolute bottom-2 left-2 bg-blue-100 rounded-full h-4 w-4 flex items-center justify-center">
                          <span className="text-blue-500 text-[8px] font-bold">3D</span>
                        </div>
                      )}
                      
                      {form.watch('useARPlacement') && (
                        <div className="absolute bottom-2 right-2 bg-green-100 rounded-full h-4 w-4 flex items-center justify-center">
                          <span className="text-green-500 text-[8px] font-bold">AR</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="text-center">
                      <p className="text-[10px] text-blue-600">
                        You're creating an extraordinary time capsule experience!
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sticky form submission footer */}
              <div className="fixed bottom-0 left-0 right-0 border-t bg-white bg-opacity-90 backdrop-blur-lg p-4 z-50 shadow-[0_-8px_30px_rgb(0,0,0,0.08)]">
                <div className="container max-w-screen-lg mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "h-3 w-3 rounded-full",
                      form.formState.isDirty ? "bg-amber-500" : "bg-green-500"
                    )}></div>
                    <div>
                      <p className="text-sm font-medium text-slate-800">
                        {form.formState.isDirty ? "Unsaved changes" : "Ready to submit"}
                      </p>
                      <p className="text-xs text-slate-500 hidden sm:block">
                        {form.formState.isDirty 
                          ? "Your time capsule has unsaved changes" 
                          : `Capsule will be delivered on ${format(form.watch('scheduledFor'), 'MMMM d, yyyy')}`
                        }
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 w-full sm:w-auto">
                    {form.formState.isDirty && (
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => form.reset()}
                        disabled={isSubmitting || !form.formState.isDirty}
                        className="flex-1 sm:flex-none"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Reset
                      </Button>
                    )}
                    
                    <Button 
                      type="submit" 
                      disabled={isSubmitting || (!form.formState.isDirty && !defaultValues)}
                      className="flex-1 sm:flex-none bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="h-4 w-4 mr-2 rounded-full border-2 border-current border-t-transparent animate-spin" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <CalendarIcon className="h-4 w-4 mr-2" />
                          Create Time Capsule
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
} 