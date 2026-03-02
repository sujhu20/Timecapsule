"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Calendar, Clock, Image, File, Film, Upload, ArrowLeft, Save, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { createCapsule } from "@/lib/capsules";
import { getUserId } from "@/lib/session-utils";
import { toast } from "react-hot-toast";

export default function CreateCapsulePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const totalSteps = 3;
  const [privacySetting, setPrivacySetting] = useState<"private" | "recipients" | "public">("private");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    deliveryDate: "",
    deliveryPeriod: {
      value: 1,
      unit: "Years"
    },
    recipients: [] as string[],
    media: {
      images: [] as { file: File, preview: string }[],
      videos: [] as { file: File, preview: string }[],
      documents: [] as { file: File, name: string, type: string }[]
    }
  });

  // Refs for file inputs
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);

  // Handle authentication
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    }
  }, [status, router]);

  // Show loading state while checking authentication
  if (status === "loading") {
    return (
      <div className="flex min-h-[calc(100vh-14rem)] items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-lg text-slate-700 dark:text-slate-300">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, don't render the form
  if (status !== "authenticated") {
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleDeliveryPeriodChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      deliveryPeriod: {
        ...formData.deliveryPeriod,
        [name]: value
      }
    });
  };

  const addRecipient = (email: string) => {
    if (email && !formData.recipients.includes(email)) {
      setFormData({
        ...formData,
        recipients: [...formData.recipients, email]
      });
    }
  };

  const removeRecipient = (email: string) => {
    setFormData({
      ...formData,
      recipients: formData.recipients.filter(r => r !== email)
    });
  };

  // Handle image uploads
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files).map(file => ({
        file,
        preview: URL.createObjectURL(file)
      }));

      setFormData({
        ...formData,
        media: {
          ...formData.media,
          images: [...formData.media.images, ...newImages]
        }
      });
    }
  };

  // Handle video uploads
  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newVideos = Array.from(e.target.files).map(file => ({
        file,
        preview: URL.createObjectURL(file)
      }));

      setFormData({
        ...formData,
        media: {
          ...formData.media,
          videos: [...formData.media.videos, ...newVideos]
        }
      });
    }
  };

  // Handle document uploads
  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newDocuments = Array.from(e.target.files).map(file => ({
        file,
        name: file.name,
        type: file.type
      }));

      setFormData({
        ...formData,
        media: {
          ...formData.media,
          documents: [...formData.media.documents, ...newDocuments]
        }
      });
    }
  };

  // Remove media items
  const removeImage = (index: number) => {
    const newImages = [...formData.media.images];
    URL.revokeObjectURL(newImages[index].preview);
    newImages.splice(index, 1);

    setFormData({
      ...formData,
      media: {
        ...formData.media,
        images: newImages
      }
    });
  };

  const removeVideo = (index: number) => {
    const newVideos = [...formData.media.videos];
    URL.revokeObjectURL(newVideos[index].preview);
    newVideos.splice(index, 1);

    setFormData({
      ...formData,
      media: {
        ...formData.media,
        videos: newVideos
      }
    });
  };

  const removeDocument = (index: number) => {
    const newDocuments = [...formData.media.documents];
    newDocuments.splice(index, 1);

    setFormData({
      ...formData,
      media: {
        ...formData.media,
        documents: newDocuments
      }
    });
  };

  const nextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const saveCapsule = async () => {
    try {
      setIsSubmitting(true);

      // Get the current user ID or use email as fallback
      let userId = getUserId(session);

      // If getUserId returns null but we have session with email, use email directly
      if (!userId && session?.user?.email) {
        userId = `email:${session.user.email}`;
        console.log("Using email directly as user ID:", userId);
      }

      if (!userId) {
        toast.error("Not authenticated. Please sign in.");
        router.push("/signin");
        return;
      }

      console.log("Creating capsule with user ID:", userId);

      // Calculate scheduled date
      const now = new Date();
      let scheduledFor = new Date();

      if (formData.deliveryDate) {
        scheduledFor = new Date(formData.deliveryDate);
      } else {
        // Calculate based on delivery period
        switch (formData.deliveryPeriod.unit) {
          case "Days":
            scheduledFor.setDate(now.getDate() + formData.deliveryPeriod.value);
            break;
          case "Weeks":
            scheduledFor.setDate(now.getDate() + (formData.deliveryPeriod.value * 7));
            break;
          case "Months":
            scheduledFor.setMonth(now.getMonth() + formData.deliveryPeriod.value);
            break;
          case "Years":
            scheduledFor.setFullYear(now.getFullYear() + formData.deliveryPeriod.value);
            break;
        }
      }

      // Prepare capsule data
      const capsuleData = {
        title: formData.title,
        description: formData.description || "",
        content: formData.content || "No content provided",
        mediaUrl: "", // You would upload media and get URLs separately
        type: 'text' as const,
        privacy: privacySetting === 'recipients' ? 'private' : privacySetting as 'private' | 'public',
        scheduledDate: scheduledFor.toISOString(),
        userId: userId,
      };

      console.log("Creating capsule with data:", capsuleData);

      // Call the createCapsule server action directly
      const result = await createCapsule(capsuleData);

      if (!result.success) {
        throw new Error(result.error || 'Failed to create capsule');
      }

      console.log("Capsule created successfully:", result.capsuleId);

      toast.success("Capsule created successfully!");
      router.push("/dashboard");
    } catch (error) {
      console.error("Error creating capsule:", error);

      // Check if the error message indicates a database setup issue
      const errorMessage = error instanceof Error ? error.message : String(error);

      if (errorMessage.includes("database") || errorMessage.includes("table") || errorMessage.includes("relation")) {
        toast.error(
          <div>
            <p>Database setup required.</p>
            <Link href="/setup" className="underline text-blue-500">
              Click here to setup your database
            </Link>
          </div>
        );
      } else {
        toast.error(`Error: ${errorMessage}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <Link
        href="/dashboard"
        className="flex items-center text-blue-600 hover:text-blue-700 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        <span>Back to Dashboard</span>
      </Link>

      <h1 className="text-3xl font-bold gradient-text mb-2">Create New Time Capsule</h1>
      <p className="text-slate-600 dark:text-slate-400 mb-8">
        Preserve your memories to be rediscovered in the future
      </p>

      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {[1, 2, 3].map((stepNumber) => (
            <div key={stepNumber} className="flex items-center">
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center font-medium ${step >= stepNumber
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                  }`}
              >
                {stepNumber}
              </div>
              <span className="ml-2 text-sm font-medium hidden sm:block">
                {stepNumber === 1 && "Basics"}
                {stepNumber === 2 && "Contents"}
                {stepNumber === 3 && "Delivery"}
              </span>
            </div>
          ))}
        </div>
        <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full">
          <div
            className="h-2 bg-blue-600 rounded-full transition-all duration-300"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Step 1: Basic Information */}
      {step === 1 && (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>

          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Capsule Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-slate-700"
                placeholder="e.g. My College Memories"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-slate-700"
                placeholder="Tell us about this time capsule..."
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Privacy Setting *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div
                  onClick={() => setPrivacySetting("private")}
                  className={`border ${privacySetting === "private"
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-slate-300 dark:border-slate-600"
                    } hover:border-blue-500 dark:hover:border-blue-500 rounded-md p-3 cursor-pointer`}
                >
                  <h3 className="font-medium">Private</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Only you can access it</p>
                </div>
                <div
                  onClick={() => setPrivacySetting("recipients")}
                  className={`border ${privacySetting === "recipients"
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-slate-300 dark:border-slate-600"
                    } hover:border-blue-500 dark:hover:border-blue-500 rounded-md p-3 cursor-pointer`}
                >
                  <h3 className="font-medium">Recipients</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Shared with specific people</p>
                </div>
                <div
                  onClick={() => setPrivacySetting("public")}
                  className={`border ${privacySetting === "public"
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-slate-300 dark:border-slate-600"
                    } hover:border-blue-500 dark:hover:border-blue-500 rounded-md p-3 cursor-pointer`}
                >
                  <h3 className="font-medium">Public</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Anyone can discover it</p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={nextStep}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Continue to Contents
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Capsule Contents */}
      {step === 2 && (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-xl font-semibold mb-4">Capsule Contents</h2>

          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {/* Image upload */}
              <div
                onClick={() => imageInputRef.current?.click()}
                className="border border-dashed border-slate-300 dark:border-slate-600 hover:border-blue-500 dark:hover:border-blue-500 rounded-md p-4 flex flex-col items-center justify-center text-center cursor-pointer h-40 relative overflow-hidden"
              >
                <input
                  type="file"
                  ref={imageInputRef}
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageUpload}
                />
                <Image className="h-8 w-8 text-slate-400" />
                <p className="mt-2 font-medium">Add Images</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">JPG, PNG, GIF</p>
              </div>

              {/* Video upload */}
              <div
                onClick={() => videoInputRef.current?.click()}
                className="border border-dashed border-slate-300 dark:border-slate-600 hover:border-blue-500 dark:hover:border-blue-500 rounded-md p-4 flex flex-col items-center justify-center text-center cursor-pointer h-40"
              >
                <input
                  type="file"
                  ref={videoInputRef}
                  accept="video/*"
                  multiple
                  className="hidden"
                  onChange={handleVideoUpload}
                />
                <Film className="h-8 w-8 text-slate-400" />
                <p className="mt-2 font-medium">Add Videos</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">MP4, MOV, WebM</p>
              </div>

              {/* Document upload */}
              <div
                onClick={() => documentInputRef.current?.click()}
                className="border border-dashed border-slate-300 dark:border-slate-600 hover:border-blue-500 dark:hover:border-blue-500 rounded-md p-4 flex flex-col items-center justify-center text-center cursor-pointer h-40"
              >
                <input
                  type="file"
                  ref={documentInputRef}
                  accept=".pdf,.doc,.docx,.txt"
                  multiple
                  className="hidden"
                  onChange={handleDocumentUpload}
                />
                <File className="h-8 w-8 text-slate-400" />
                <p className="mt-2 font-medium">Add Document</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">PDF, DOC, TXT</p>
              </div>
            </div>

            {/* Display uploaded media */}
            {(formData.media.images.length > 0 || formData.media.videos.length > 0 || formData.media.documents.length > 0) && (
              <div className="mt-6">
                <h3 className="text-md font-medium mb-3">Uploaded Media</h3>

                {/* Images preview */}
                {formData.media.images.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Images</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {formData.media.images.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={image.preview}
                            alt={`Preview ${index}`}
                            className="w-full h-24 object-cover rounded-md"
                          />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeImage(index);
                            }}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Videos preview */}
                {formData.media.videos.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Videos</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {formData.media.videos.map((video, index) => (
                        <div key={index} className="relative group">
                          <video
                            src={video.preview}
                            className="w-full h-24 object-cover rounded-md"
                            controls
                          />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeVideo(index);
                            }}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Documents preview */}
                {formData.media.documents.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Documents</h4>
                    <div className="space-y-2">
                      {formData.media.documents.map((doc, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-slate-50 dark:bg-slate-700 p-2 rounded-md"
                        >
                          <div className="flex items-center">
                            <File className="h-5 w-5 text-slate-400 mr-2" />
                            <span className="text-sm truncate max-w-xs">{doc.name}</span>
                          </div>
                          <button
                            onClick={() => removeDocument(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Add a Message
              </label>
              <textarea
                id="message"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                rows={5}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-slate-700"
                placeholder="Write a message to include in your time capsule..."
              ></textarea>
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={prevStep}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-md hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
              >
                Back
              </button>
              <button
                onClick={nextStep}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Continue to Delivery
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Delivery Options */}
      {step === 3 && (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-xl font-semibold mb-4">Delivery Options</h2>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                When should this capsule be delivered? *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="border border-slate-300 dark:border-slate-600 hover:border-blue-500 dark:hover:border-blue-500 rounded-md p-4 cursor-pointer">
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 mr-2 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Specific Date</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Choose an exact date for delivery</p>
                      <input
                        type="date"
                        name="deliveryDate"
                        value={formData.deliveryDate}
                        onChange={handleInputChange}
                        className="mt-2 w-full px-3 py-1.5 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-slate-700"
                      />
                    </div>
                  </div>
                </div>

                <div className="border border-slate-300 dark:border-slate-600 hover:border-blue-500 dark:hover:border-blue-500 rounded-md p-4 cursor-pointer">
                  <div className="flex items-start">
                    <Clock className="h-5 w-5 mr-2 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Time Period</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Deliver after a specific time period</p>
                      <div className="mt-2 flex items-center gap-2">
                        <input
                          type="number"
                          min="1"
                          name="value"
                          value={formData.deliveryPeriod.value}
                          onChange={handleDeliveryPeriodChange}
                          className="w-20 px-3 py-1.5 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-slate-700"
                        />
                        <select
                          name="unit"
                          value={formData.deliveryPeriod.unit}
                          onChange={handleDeliveryPeriodChange}
                          className="px-3 py-1.5 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-slate-700"
                        >
                          <option>Days</option>
                          <option>Months</option>
                          <option>Years</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                Add Recipients {privacySetting === "recipients" ? "(Required)" : "(Optional)"}
              </label>
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="email"
                  id="recipient-email"
                  className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-slate-700"
                  placeholder="Email address"
                />
                <button
                  onClick={() => {
                    const email = (document.getElementById('recipient-email') as HTMLInputElement).value;
                    addRecipient(email);
                    (document.getElementById('recipient-email') as HTMLInputElement).value = '';
                  }}
                  type="button"
                  className="px-3 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-md hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                >
                  Add
                </button>
              </div>

              {formData.recipients.length > 0 && (
                <div className="mt-2 space-y-1">
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Recipients:</p>
                  <div className="flex flex-wrap gap-2">
                    {formData.recipients.map((email, index) => (
                      <div
                        key={index}
                        className="inline-flex items-center bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-md text-xs"
                      >
                        <span>{email}</span>
                        <button
                          onClick={() => removeRecipient(email)}
                          className="ml-1 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                Recipients will receive an email notification when your capsule is ready to be opened.
              </p>
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={prevStep}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-md hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
              >
                Back
              </button>
              <button
                onClick={saveCapsule}
                disabled={isSubmitting}
                className={`inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
              >
                <Save className="h-4 w-4 mr-2" />
                {isSubmitting ? 'Creating...' : 'Create Time Capsule'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 