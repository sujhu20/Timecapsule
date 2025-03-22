"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Bell,
  Lock,
  Globe,
  Palette,
  CreditCard,
  UserCog,
  Download,
  HardDrive,
  LifeBuoy,
  Trash2,
  Mail,
  MessageSquare,
  Moon,
  SunMedium
} from "lucide-react";
import { useTheme } from "next-themes";

// Mock user for demonstration
const MOCK_USER = {
  id: "1",
  name: "Demo User",
  username: "demouser",
  email: "demo@example.com",
  image: "https://api.dicebear.com/7.x/initials/svg?seed=DU&backgroundColor=00897b",
  joinDate: new Date("2023-10-15"),
  capsuleCount: 5,
  isPremium: false
};

export default function SettingsPage() {
  const { user: authUser, signOut } = useAuth();
  const router = useRouter();
  const [user, setUser] = useState(MOCK_USER);
  const { theme, setTheme } = useTheme();
  
  // Use authenticated user if available, otherwise use mock user
  useEffect(() => {
    if (authUser) {
      setUser({
        ...authUser,
        username: authUser.name.toLowerCase().replace(/\s+/g, '.'),
        isPremium: false
      });
    }
  }, [authUser]);
  
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [language, setLanguage] = useState("en");
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      // In a real app, this would call an API to delete the account
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Account deleted successfully");
      if (authUser) signOut();
      router.push("/");
    } catch (error) {
      toast.error("Failed to delete account");
    } finally {
      setIsDeleting(false);
    }
  };
  
  const saveNotificationSettings = () => {
    toast.success("Notification settings saved");
  };
  
  const savePrivacySettings = () => {
    toast.success("Privacy settings saved");
  };
  
  const saveAppearanceSettings = () => {
    toast.success("Appearance settings saved");
  };
  
  return (
    <div className="container max-w-6xl py-8">
      <div className="flex flex-col space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences.
          </p>
        </div>
        
        <Tabs defaultValue="account" className="space-y-4">
          <TabsList className="grid grid-cols-5 w-full max-w-4xl">
            <TabsTrigger value="account">
              <UserCog className="h-4 w-4 mr-2" /> Account
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="h-4 w-4 mr-2" /> Notifications
            </TabsTrigger>
            <TabsTrigger value="privacy">
              <Lock className="h-4 w-4 mr-2" /> Privacy
            </TabsTrigger>
            <TabsTrigger value="appearance">
              <Palette className="h-4 w-4 mr-2" /> Appearance
            </TabsTrigger>
            <TabsTrigger value="billing">
              <CreditCard className="h-4 w-4 mr-2" /> Billing
            </TabsTrigger>
          </TabsList>
          
          {/* Account Settings */}
          <TabsContent value="account" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>
                  Update your account information and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <Label>Username</Label>
                  <div className="flex gap-4">
                    <Input value={user.username} readOnly className="max-w-sm" />
                    <Button variant="outline">Change</Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    This is your public display name.
                  </p>
                </div>
                
                <div className="space-y-1">
                  <Label>Email</Label>
                  <div className="flex gap-4">
                    <Input value={user.email} readOnly className="max-w-sm" />
                    <Button variant="outline">Change</Button>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-1">
                  <Label>Language</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger className="max-w-sm">
                      <SelectValue placeholder="Select Language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                      <SelectItem value="ja">Japanese</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <label 
                      htmlFor="ai-suggestions"
                      className="text-sm font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      AI Content Suggestions
                    </label>
                    <p className="text-xs text-muted-foreground">
                      Allow AI to suggest content for your time capsules
                    </p>
                  </div>
                  <Switch id="ai-suggestions" defaultChecked />
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save changes</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Export Data</CardTitle>
                <CardDescription>
                  Download a copy of all your data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  You can export all your time capsules and personal data. This includes
                  all content, delivery settings, and account information.
                </p>
                <div className="flex flex-col gap-2 mt-4">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="include-media" checked readOnly />
                    <label htmlFor="include-media" className="text-sm">Include media (images, videos, etc.)</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="include-metadata" checked readOnly />
                    <label htmlFor="include-metadata" className="text-sm">Include metadata</label>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="gap-1">
                  <Download className="h-4 w-4" /> 
                  Export Data
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="border-destructive">
              <CardHeader>
                <CardTitle className="text-destructive">Delete Account</CardTitle>
                <CardDescription>
                  Permanently delete your account and all your data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Once you delete your account, there is no going back. All of your time capsules, 
                  personal data, and account information will be permanently removed.
                </p>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="destructive" 
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete Account"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Notification Settings */}
          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Choose how you want to be notified
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email Notifications
                  </h3>
                  <Separator />
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <label className="text-sm font-medium">Capsule Delivery Notifications</label>
                        <p className="text-xs text-muted-foreground">
                          Receive notifications when your time capsules are delivered
                        </p>
                      </div>
                      <Switch 
                        checked={emailNotifications} 
                        onCheckedChange={setEmailNotifications} 
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <label className="text-sm font-medium">Security Alerts</label>
                        <p className="text-xs text-muted-foreground">
                          Get notified about security events like login attempts
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <label className="text-sm font-medium">Marketing Emails</label>
                        <p className="text-xs text-muted-foreground">
                          Receive offers, updates, and news about TimeCapsule
                        </p>
                      </div>
                      <Switch 
                        checked={marketingEmails} 
                        onCheckedChange={setMarketingEmails} 
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    SMS Notifications
                  </h3>
                  <Separator />
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <label className="text-sm font-medium">Capsule Delivery SMS</label>
                        <p className="text-xs text-muted-foreground">
                          Receive SMS when your time capsules are delivered
                        </p>
                      </div>
                      <Switch 
                        checked={smsNotifications} 
                        onCheckedChange={setSmsNotifications} 
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <label className="text-sm font-medium">Phone Number</label>
                        <Input 
                          placeholder="+1 (555) 123-4567" 
                          className="max-w-sm" 
                          disabled={!smsNotifications}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={saveNotificationSettings}>Save preferences</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Privacy Settings */}
          <TabsContent value="privacy" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
                <CardDescription>
                  Control how your information is used and shared
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-muted-foreground">Profile Privacy</h3>
                  <Separator />
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <label className="text-sm font-medium">Profile Visibility</label>
                        <p className="text-xs text-muted-foreground">
                          Choose who can see your profile
                        </p>
                      </div>
                      <Select defaultValue="private">
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">Public</SelectItem>
                          <SelectItem value="friends">Friends Only</SelectItem>
                          <SelectItem value="private">Private</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <label className="text-sm font-medium">Show My Capsules</label>
                        <p className="text-xs text-muted-foreground">
                          Allow others to see your public time capsules
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-muted-foreground">Security</h3>
                  <Separator />
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <label className="text-sm font-medium">Two-Factor Authentication</label>
                        <p className="text-xs text-muted-foreground">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Enable
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <label className="text-sm font-medium">Change Password</label>
                        <p className="text-xs text-muted-foreground">
                          Update your password regularly for better security
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Change
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-muted-foreground">Data Usage</h3>
                  <Separator />
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <label className="text-sm font-medium">Analytics Sharing</label>
                        <p className="text-xs text-muted-foreground">
                          Allow us to collect anonymous usage data to improve our service
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <label className="text-sm font-medium">Use AI to Enhance Content</label>
                        <p className="text-xs text-muted-foreground">
                          Allow our AI to analyze and enhance your capsule content
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={savePrivacySettings}>Save privacy settings</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Appearance Settings */}
          <TabsContent value="appearance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>
                  Customize how TimeCapsule looks for you
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-muted-foreground">Theme</h3>
                  <Separator />
                  
                  <RadioGroup 
                    value={theme}
                    onValueChange={setTheme}
                    className="grid grid-cols-3 gap-4"
                  >
                    <div>
                      <RadioGroupItem 
                        value="light" 
                        id="theme-light" 
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor="theme-light"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <SunMedium className="mb-3 h-6 w-6" />
                        Light
                      </Label>
                    </div>
                    
                    <div>
                      <RadioGroupItem 
                        value="dark" 
                        id="theme-dark" 
                        className="peer sr-only" 
                      />
                      <Label
                        htmlFor="theme-dark"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <Moon className="mb-3 h-6 w-6" />
                        Dark
                      </Label>
                    </div>
                    
                    <div>
                      <RadioGroupItem 
                        value="system" 
                        id="theme-system" 
                        className="peer sr-only" 
                      />
                      <Label
                        htmlFor="theme-system"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <Palette className="mb-3 h-6 w-6" />
                        System
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-muted-foreground">Font Size</h3>
                  <Separator />
                  
                  <RadioGroup defaultValue="medium" className="grid grid-cols-3 gap-4">
                    <div>
                      <RadioGroupItem 
                        value="small" 
                        id="font-small" 
                        className="peer sr-only" 
                      />
                      <Label
                        htmlFor="font-small"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <span className="text-sm">Aa</span>
                        Small
                      </Label>
                    </div>
                    
                    <div>
                      <RadioGroupItem 
                        value="medium" 
                        id="font-medium" 
                        className="peer sr-only" 
                      />
                      <Label
                        htmlFor="font-medium"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <span className="text-base">Aa</span>
                        Medium
                      </Label>
                    </div>
                    
                    <div>
                      <RadioGroupItem 
                        value="large" 
                        id="font-large" 
                        className="peer sr-only" 
                      />
                      <Label
                        htmlFor="font-large"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <span className="text-lg">Aa</span>
                        Large
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={saveAppearanceSettings}>Save appearance</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Billing Settings */}
          <TabsContent value="billing" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Subscription Plan</CardTitle>
                <CardDescription>
                  Manage your subscription and billing information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-md border p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">{user.isPremium ? "Premium Plan" : "Basic Plan"}</h3>
                      <p className="text-sm text-muted-foreground">
                        {user.isPremium ? "$9.99/month" : "Free"}
                      </p>
                      
                      {user.isPremium && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Next billing date: December 15, 2023
                        </p>
                      )}
                    </div>
                    <Button variant="outline" size="sm">
                      {user.isPremium ? "Manage" : "Upgrade"}
                    </Button>
                  </div>
                </div>
                
                {user.isPremium && (
                  <>
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-muted-foreground">Payment Method</h3>
                      <div className="rounded-md border p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="rounded-md bg-gray-100 p-2">
                              <CreditCard className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">•••• •••• •••• 4242</p>
                              <p className="text-xs text-muted-foreground">Expires 12/24</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">Edit</Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-muted-foreground">Billing History</h3>
                      <div className="rounded-md border divide-y">
                        <div className="p-3 flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">Premium Plan</p>
                            <p className="text-xs text-muted-foreground">November 15, 2023</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm">$9.99</p>
                            <Button variant="link" size="sm" className="h-auto p-0">
                              Receipt
                            </Button>
                          </div>
                        </div>
                        <div className="p-3 flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">Premium Plan</p>
                            <p className="text-xs text-muted-foreground">October 15, 2023</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm">$9.99</p>
                            <Button variant="link" size="sm" className="h-auto p-0">
                              Receipt
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
              <CardFooter className="flex flex-col items-start gap-2">
                {user.isPremium && (
                  <Button variant="outline" className="text-destructive">
                    Cancel Subscription
                  </Button>
                )}
                <p className="text-xs text-muted-foreground">
                  You can upgrade or downgrade your plan at any time.
                  {user.isPremium && " If you cancel, your plan will remain active until the end of your billing period."}
                </p>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 