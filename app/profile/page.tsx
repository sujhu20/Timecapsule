"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BarChart,
  Clock,
  Key,
  Lock,
  Settings2,
  Shield,
  User,
  Bell,
  ImagePlus,
  LogOut,
  CreditCard
} from "lucide-react";
import { useTheme } from "next-themes";

// Mock user data for when no authenticated user is available
const MOCK_USER = {
  id: "1",
  name: "Demo User",
  email: "demo@example.com",
  image: "https://i.pravatar.cc/300",
  joinDate: new Date("2023-01-15"),
  capsuleCount: 5,
  isPremium: true,
  storageUsed: 256.5
};

export default function ProfilePage() {
  const { user: authUser, updateUser, signOut } = useAuth();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  
  // Use mock user if no authenticated user is available
  const [user, setUser] = useState(MOCK_USER);
  
  useEffect(() => {
    // If authenticated user exists, use it instead of mock
    if (authUser) {
      setUser(authUser);
    }
  }, [authUser]);
  
  const [isEditing, setIsEditing] = useState(false);
  const [activeImage, setActiveImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(user?.image || null);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Format the join date
  const joinDate = user.joinDate instanceof Date 
    ? format(user.joinDate, "MMMM d, yyyy") 
    : "Unknown";
  
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // If authenticated user exists, update through auth
      if (authUser && updateUser) {
        updateUser({ name, email, image: imagePreview });
      } else {
        // For demo, just update the local state
        setUser(prev => ({
          ...prev,
          name,
          email,
          image: imagePreview
        }));
      }
      
      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setActiveImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      // In a real app, this would call an API to delete the account
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Account deleted");
      
      if (authUser && signOut) {
        signOut();
      }
      
      router.push("/");
    }
  };
  
  const handleSignOut = () => {
    if (authUser && signOut) {
      signOut();
    } else {
      // For demo, just show a toast
      toast.info("Signed out in demo mode");
    }
  };
  
  return (
    <div className="container max-w-6xl py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3 space-y-6">
          <Card>
            <CardHeader className="flex flex-col items-center text-center">
              <div className="relative group">
                <Avatar className="h-24 w-24 border-2 border-primary">
                  <AvatarImage src={imagePreview || user.image} alt={user.name} />
                  <AvatarFallback className="text-2xl">{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                {isEditing && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <label htmlFor="avatar-upload" className="cursor-pointer p-2 bg-white rounded-full">
                      <ImagePlus className="h-5 w-5" />
                      <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={handleImageChange}
                      />
                    </label>
                  </div>
                )}
              </div>
              <CardTitle className="mt-4">{user.name}</CardTitle>
              <CardDescription>{user.email}</CardDescription>
              <Badge variant="outline" className="mt-2">{user.isPremium ? "Premium" : "Basic"} Plan</Badge>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="flex flex-col space-y-1">
                <div className="text-sm text-muted-foreground">Member since</div>
                <div>{joinDate}</div>
              </div>
              <div className="flex flex-col space-y-1">
                <div className="text-sm text-muted-foreground">Time Capsules</div>
                <div className="flex items-center justify-center">
                  <span className="text-3xl font-bold">{user.capsuleCount}</span>
                  <span className="text-xs ml-1 text-muted-foreground">/ {user.isPremium ? "20" : "3"}</span>
                </div>
                <Progress value={(user.capsuleCount / (user.isPremium ? 20 : 3)) * 100} className="h-2 mt-1" />
              </div>
              <div className="flex flex-col space-y-1">
                <div className="text-sm text-muted-foreground">Storage Used</div>
                <div className="flex items-center justify-center">
                  <span>{(user.storageUsed || 0).toFixed(1)} MB</span>
                  <span className="text-xs ml-1 text-muted-foreground">/ {user.isPremium ? "1 GB" : "100 MB"}</span>
                </div>
                <Progress 
                  value={(user.storageUsed || 0) / (user.isPremium ? 1024 : 100) * 100} 
                  className="h-2 mt-1" 
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button 
                variant={isEditing ? "outline" : "default"} 
                className="w-full" 
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? "Cancel" : "Edit Profile"}
              </Button>
              <Button variant="outline" className="w-full" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </CardFooter>
          </Card>
          
          {user.isPremium && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Subscription</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Premium Plan</span>
                    <Badge>Active</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Next billing</span>
                    <span>Dec 12, 2023</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Amount</span>
                    <span>$9.99/month</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">
                  <CreditCard className="h-4 w-4 mr-2" /> 
                  Manage Subscription
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
        
        <div className="md:w-2/3">
          <Tabs defaultValue="profile">
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="profile">
                <User className="h-4 w-4 mr-2" /> Profile
              </TabsTrigger>
              <TabsTrigger value="activity">
                <BarChart className="h-4 w-4 mr-2" /> Activity
              </TabsTrigger>
              <TabsTrigger value="privacy">
                <Shield className="h-4 w-4 mr-2" /> Privacy
              </TabsTrigger>
              <TabsTrigger value="settings">
                <Settings2 className="h-4 w-4 mr-2" /> Settings
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>{isEditing ? "Edit Profile" : "Profile Information"}</CardTitle>
                  <CardDescription>
                    {isEditing 
                      ? "Update your personal information" 
                      : "Your personal information and settings"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input 
                          id="name" 
                          value={name} 
                          onChange={(e) => setName(e.target.value)}
                          required 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          value={email} 
                          onChange={(e) => setEmail(e.target.value)}
                          required 
                        />
                      </div>
                      <div className="pt-4">
                        <Button 
                          type="submit" 
                          disabled={isSubmitting}
                          className="mr-2"
                        >
                          {isSubmitting ? "Saving..." : "Save Changes"}
                        </Button>
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => {
                            setName(user.name);
                            setEmail(user.email);
                            setImagePreview(user.image);
                            setIsEditing(false);
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Personal Information</h3>
                        <Separator className="my-2" />
                        <dl className="space-y-4 mt-4">
                          <div className="flex flex-col md:flex-row md:justify-between">
                            <dt className="font-medium">Full Name</dt>
                            <dd className="text-muted-foreground">{user.name}</dd>
                          </div>
                          <div className="flex flex-col md:flex-row md:justify-between">
                            <dt className="font-medium">Email Address</dt>
                            <dd className="text-muted-foreground">{user.email}</dd>
                          </div>
                          <div className="flex flex-col md:flex-row md:justify-between">
                            <dt className="font-medium">Member Since</dt>
                            <dd className="text-muted-foreground">{joinDate}</dd>
                          </div>
                        </dl>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Account Activity</h3>
                        <Separator className="my-2" />
                        <dl className="space-y-4 mt-4">
                          <div className="flex flex-col md:flex-row md:justify-between">
                            <dt className="font-medium">Time Capsules Created</dt>
                            <dd className="text-muted-foreground">{user.capsuleCount}</dd>
                          </div>
                          <div className="flex flex-col md:flex-row md:justify-between">
                            <dt className="font-medium">Last Login</dt>
                            <dd className="text-muted-foreground">Today</dd>
                          </div>
                        </dl>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="activity">
              <Card>
                <CardHeader>
                  <CardTitle>Capsule Activity</CardTitle>
                  <CardDescription>View your time capsule creation and delivery activity</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <div className="text-3xl font-bold">{user.capsuleCount}</div>
                          <div className="text-sm text-muted-foreground">Total Capsules</div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <div className="text-3xl font-bold">2</div>
                          <div className="text-sm text-muted-foreground">Delivered</div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <div className="text-3xl font-bold">{user.capsuleCount - 2}</div>
                          <div className="text-sm text-muted-foreground">Pending</div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-3">Recent Activity</h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-4 p-4 border rounded-lg">
                        <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
                          <Clock className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between mb-1">
                            <div className="font-medium">Created Time Capsule</div>
                            <div className="text-sm text-muted-foreground">2 days ago</div>
                          </div>
                          <div className="text-sm text-muted-foreground">You created a new time capsule "Birthday Wishes 2025"</div>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4 p-4 border rounded-lg">
                        <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full">
                          <Clock className="h-4 w-4 text-green-600 dark:text-green-300" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between mb-1">
                            <div className="font-medium">Updated Delivery Date</div>
                            <div className="text-sm text-muted-foreground">1 week ago</div>
                          </div>
                          <div className="text-sm text-muted-foreground">You changed the delivery date for "Future Me" to Dec 31, 2024</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="privacy">
              <Card>
                <CardHeader>
                  <CardTitle>Privacy & Security</CardTitle>
                  <CardDescription>Manage your privacy and security settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-3">Security</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-4 border rounded-lg">
                        <div className="flex gap-4">
                          <div className="bg-amber-100 dark:bg-amber-900 p-2 rounded-full">
                            <Key className="h-4 w-4 text-amber-600 dark:text-amber-300" />
                          </div>
                          <div>
                            <div className="font-medium">Change Password</div>
                            <div className="text-sm text-muted-foreground">Update your account password</div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">Change</Button>
                      </div>
                      
                      <div className="flex justify-between items-center p-4 border rounded-lg">
                        <div className="flex gap-4">
                          <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
                            <Lock className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                          </div>
                          <div>
                            <div className="font-medium">Two-Factor Authentication</div>
                            <div className="text-sm text-muted-foreground">Add an extra layer of security</div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">Enable</Button>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-3">Privacy Controls</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-4 border rounded-lg">
                        <div className="flex gap-4">
                          <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-full">
                            <Shield className="h-4 w-4 text-purple-600 dark:text-purple-300" />
                          </div>
                          <div>
                            <div className="font-medium">Profile Visibility</div>
                            <div className="text-sm text-muted-foreground">Control who can see your profile</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">Private</span>
                          <Switch id="profile-visibility" />
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center p-4 border rounded-lg">
                        <div className="flex gap-4">
                          <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full">
                            <Bell className="h-4 w-4 text-green-600 dark:text-green-300" />
                          </div>
                          <div>
                            <div className="font-medium">Email Notifications</div>
                            <div className="text-sm text-muted-foreground">Receive updates about your capsules</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">On</span>
                          <Switch id="email-notifications" defaultChecked />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>Manage your account preferences and settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 border rounded-lg">
                      <div>
                        <div className="font-medium">Automatically generate AI memory suggestions</div>
                        <div className="text-sm text-muted-foreground">We'll suggest memories to preserve based on significant dates</div>
                      </div>
                      <Switch id="ai-suggestions" defaultChecked />
                    </div>
                    
                    <div className="flex justify-between items-center p-4 border rounded-lg">
                      <div>
                        <div className="font-medium">Dark Mode</div>
                        <div className="text-sm text-muted-foreground">Toggle between light and dark theme</div>
                      </div>
                      <Switch 
                        id="dark-mode" 
                        checked={theme === "dark"}
                        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                      />
                    </div>
                    
                    <div className="flex justify-between items-center p-4 border rounded-lg">
                      <div>
                        <div className="font-medium">Language</div>
                        <div className="text-sm text-muted-foreground">Choose your preferred language</div>
                      </div>
                      <select className="px-2 py-1 rounded border">
                        <option>English</option>
                        <option>Spanish</option>
                        <option>French</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-3 text-red-600">Danger Zone</h3>
                    <div className="space-y-4">
                      <div className="p-4 border border-red-200 dark:border-red-800 rounded-lg bg-red-50 dark:bg-red-900/20">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium">Delete Account</div>
                            <div className="text-sm text-muted-foreground">Permanently delete your account and all data</div>
                          </div>
                          <Button variant="destructive" size="sm" onClick={handleDeleteAccount}>
                            Delete Account
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
} 