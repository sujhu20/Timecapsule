"use client";

import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FilePlus, Image, Film, Music, Shapes, Layers } from "lucide-react";

const testFormSchema = z.object({
  type: z.enum(["text", "image", "video", "audio", "mixed", "ar-vr"]),
});

type FormValues = z.infer<typeof testFormSchema>;

export default function TestContentTypePage() {
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(testFormSchema),
    defaultValues: {
      type: "text",
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log("Form submitted:", data);
    toast.success(`Selected content type: ${data.type}`);
  };

  // Optimized type change handling with debounce
  const handleTypeChange = (value: string) => {
    // Use requestAnimationFrame for performance
    requestAnimationFrame(() => {
      console.log(`Type changed to: ${value}`);
      setSelectedType(value);
      form.setValue("type", value as any);
    });
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Test Content Type Selection</h1>
      
      <Card className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-medium">Content Type</FormLabel>
                  <FormControl>
                    <RadioGroup
                      defaultValue={field.value}
                      className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2"
                      onValueChange={handleTypeChange}
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="text" id="type-text" />
                        </FormControl>
                        <FormLabel htmlFor="type-text" className="font-normal cursor-pointer flex items-center gap-2">
                          <FilePlus className="h-4 w-4" />
                          <span>Text</span>
                        </FormLabel>
                      </FormItem>
                      
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="image" id="type-image" />
                        </FormControl>
                        <FormLabel htmlFor="type-image" className="font-normal cursor-pointer flex items-center gap-2">
                          <Image className="h-4 w-4" />
                          <span>Image</span>
                        </FormLabel>
                      </FormItem>
                      
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="video" id="type-video" />
                        </FormControl>
                        <FormLabel htmlFor="type-video" className="font-normal cursor-pointer flex items-center gap-2">
                          <Film className="h-4 w-4" />
                          <span>Video</span>
                        </FormLabel>
                      </FormItem>
                      
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="audio" id="type-audio" />
                        </FormControl>
                        <FormLabel htmlFor="type-audio" className="font-normal cursor-pointer flex items-center gap-2">
                          <Music className="h-4 w-4" />
                          <span>Audio</span>
                        </FormLabel>
                      </FormItem>
                      
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="mixed" id="type-mixed" />
                        </FormControl>
                        <FormLabel htmlFor="type-mixed" className="font-normal cursor-pointer flex items-center gap-2">
                          <Shapes className="h-4 w-4" />
                          <span>Mixed</span>
                        </FormLabel>
                      </FormItem>
                      
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="ar-vr" id="type-ar-vr" />
                        </FormControl>
                        <FormLabel htmlFor="type-ar-vr" className="font-normal cursor-pointer flex items-center gap-2">
                          <Layers className="h-4 w-4" />
                          <span>AR/VR</span>
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />
            
            <div className="pt-4">
              <Button type="submit">Submit</Button>
            </div>
            
            {selectedType && (
              <div className="mt-4 p-4 bg-muted rounded-md">
                <p>Currently selected: <strong>{selectedType}</strong></p>
              </div>
            )}
          </form>
        </Form>
      </Card>
    </div>
  );
} 