"use client";

import { useState } from "react";
import { CapsuleFormData, CapsulePrivacy, CapsuleType } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";

interface CapsuleFormProps {
  onSubmit: (data: CapsuleFormData) => void;
  initialData?: Partial<CapsuleFormData>;
  isEditing?: boolean;
}

export function CapsuleForm({ onSubmit, initialData, isEditing = false }: CapsuleFormProps) {
  const [formData, setFormData] = useState<Partial<CapsuleFormData>>({
    title: "",
    description: "",
    content: "",
    type: "text",
    privacy: "private",
    scheduledFor: new Date(Date.now() + 3600 * 24 * 365 * 1000), // Default to 1 year from now
    isBlockchainSecured: false,
    ...initialData,
  });

  const [activeTab, setActiveTab] = useState<string>("content");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    // Handle checkboxes
    if (type === "checkbox") {
      const checkbox = e.target as HTMLInputElement;
      setFormData({
        ...formData,
        [name]: checkbox.checked,
      });
      return;
    }

    // Handle date
    if (name === "scheduledFor") {
      setFormData({
        ...formData,
        [name]: new Date(value),
      });
      return;
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleTypeChange = (type: CapsuleType) => {
    setFormData({
      ...formData,
      type,
    });
  };

  const handlePrivacyChange = (privacy: CapsulePrivacy) => {
    setFormData({
      ...formData,
      privacy,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData as CapsuleFormData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="delivery">Delivery Settings</TabsTrigger>
          <TabsTrigger value="security">Security Options</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="Give your time capsule a meaningful title"
              value={formData.title || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Add a brief description of your time capsule"
              value={formData.description || ""}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <div className="space-y-2 mb-4">
            <Label>Content Type</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {(["text", "image", "video", "mixed"] as CapsuleType[]).map((type) => (
                <Button
                  key={type}
                  type="button"
                  variant={formData.type === type ? "default" : "outline"}
                  onClick={() => handleTypeChange(type)}
                  className="capitalize"
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Message Content</Label>
            <Textarea
              id="content"
              name="content"
              placeholder="Write your message for the future..."
              value={formData.content || ""}
              onChange={handleChange}
              required
              rows={10}
            />
          </div>

          <div className="space-y-2">
            <Label>Attachments</Label>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-center border-2 border-dashed rounded-lg p-12">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">
                      Drag and drop files here, or click to select files
                    </p>
                    <Button type="button" variant="secondary" size="sm">
                      Upload Files
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="delivery" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="scheduledFor">Delivery Date</Label>
            <Input
              id="scheduledFor"
              name="scheduledFor"
              type="date"
              value={formData.scheduledFor ? format(new Date(formData.scheduledFor), 'yyyy-MM-dd') : ""}
              onChange={handleChange}
              min={format(new Date(), 'yyyy-MM-dd')}
              required
            />
            <p className="text-sm text-muted-foreground">
              When should this time capsule be delivered?
            </p>
          </div>

          <div className="space-y-2 mb-4">
            <Label>Privacy Setting</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {(["private", "public", "specific"] as CapsulePrivacy[]).map((privacy) => (
                <Button
                  key={privacy}
                  type="button"
                  variant={formData.privacy === privacy ? "default" : "outline"}
                  onClick={() => handlePrivacyChange(privacy)}
                  className="capitalize"
                >
                  {privacy}
                </Button>
              ))}
            </div>
            <p className="text-sm text-muted-foreground bg-muted p-2 rounded mt-2">
              <strong>Privacy notice:</strong> Private capsules are only visible to you and specified recipients. 
              Public capsules can be discovered by anyone. Choose wisely based on your content's sensitivity.
            </p>
          </div>

          {formData.privacy === "specific" && (
            <div className="space-y-2">
              <Label htmlFor="recipients">Recipients (Email Addresses)</Label>
              <Textarea
                id="recipients"
                name="recipients"
                placeholder="Enter email addresses (one per line)"
                rows={3}
              />
              <p className="text-sm text-muted-foreground">
                These contacts will receive your time capsule on the delivery date.
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isBlockchainSecured"
                name="isBlockchainSecured"
                checked={formData.isBlockchainSecured || false}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <Label htmlFor="isBlockchainSecured">Secure with Blockchain</Label>
            </div>
            <p className="text-sm text-muted-foreground">
              Store your time capsule on the blockchain for enhanced security and permanence.
              This ensures your message cannot be altered and will be preserved far into the future.
              Additional fee may apply.
            </p>
          </div>

          {formData.isBlockchainSecured && (
            <div className="rounded-lg bg-blue-50 p-4 mt-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">Blockchain Security Benefits</h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Immutable - Cannot be altered once created</li>
                      <li>Permanent - Will survive even if our service doesn't</li>
                      <li>Verifiable - Cryptographically secure</li>
                      <li>Optional NFT creation for collectible capsules</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline">
          Save as Draft
        </Button>
        <Button type="submit">
          {isEditing ? "Update Time Capsule" : "Create Time Capsule"}
        </Button>
      </div>
    </form>
  );
} 