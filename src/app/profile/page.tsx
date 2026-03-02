"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import Link from "next/link";
import { ExternalLink, Users, Camera, Upload } from "lucide-react";

interface ProfileData {
  totalCapsules: number;
  publicCapsules: number;
  privateCapsules: number;
  lastActive: string | null;
  followers: number;
  following: number;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(session?.user?.name || "");
  const [bio, setBio] = useState("");
  const [profileImage, setProfileImage] = useState(session?.user?.image || "");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function fetchProfileData() {
      if (status !== "authenticated" || !session?.user?.id) return;

      try {
        // Fetch detailed profile data including stats
        const response = await fetch(`/api/users/${session.user.id}`);

        if (!response.ok) {
          throw new Error('Failed to fetch profile data');
        }

        const data = await response.json();
        const user = data.user || data.data?.user || data;

        // Fetch capsules to get accurate counts
        const capsulesResponse = await fetch('/api/capsules');
        const capsulesData = await capsulesResponse.ok ? await capsulesResponse.json() : { data: { capsules: [] } };

        // Handle new nested API response structure
        // API returns: { success: true, data: { capsules: [...] } }
        const capsules = capsulesData.data?.capsules || capsulesData.capsules || [];

        const publicCount = capsules.filter((c: any) => c.privacy === 'public').length;
        const privateCount = capsules.filter((c: any) => c.privacy === 'private').length;

        const stats = {
          totalCapsules: capsules.length, // ✅ Correct total
          publicCapsules: publicCount, // ✅ Count from actual data
          privateCapsules: privateCount, // ✅ Count from actual data
          lastActive: capsules.length > 0
            ? new Date(Math.max(...capsules.map((c: any) => new Date(c.createdAt).getTime()))).toLocaleDateString()
            : null,
          followers: user.stats?.followers || 0,
          following: user.stats?.following || 0
        };

        setProfileData(stats);
        if (session.user.name) setDisplayName(session.user.name);
      } catch (err) {
        console.error('Error fetching profile data:', err);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    }

    if (status === "authenticated") {
      fetchProfileData();
    }
  }, [session, status]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    setIsUploadingImage(true);

    try {
      // Convert to base64 for preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
        toast.success('Profile picture updated!');
      };
      reader.readAsDataURL(file);

      // TODO: Upload to server/storage service
      // const formData = new FormData();
      // formData.append('image', file);
      // await fetch('/api/upload/profile-image', { method: 'POST', body: formData });
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSaveProfile = async () => {
    // Profile editing functionality can be implemented later
    // For now, just show a message
    toast.info('Profile editing coming soon!');
    setIsEditing(false);
  };

  if (status === "loading" || loading) {
    return (
      <div className="container py-8 max-w-4xl mx-auto px-4">
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-20 w-20 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[150px]" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="container py-8 max-w-4xl mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>Please sign in to view your profile.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => window.location.href = "/signin"}>
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-4xl mx-auto px-4">
      <div className="space-y-6">
        {/* Profile Header */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                {/* Profile Picture with Upload */}
                <div className="relative group">
                  <Avatar className="h-24 w-24 border-4 border-slate-200 dark:border-slate-700">
                    <AvatarImage src={profileImage || session?.user?.image || ""} />
                    <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                      {session?.user?.name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>

                  {/* Upload Overlay */}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingImage}
                    className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    {isUploadingImage ? (
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Camera className="w-8 h-8 text-white" />
                    )}
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>

                <div>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    {isEditing ? (
                      <Input
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="w-[200px]"
                      />
                    ) : (
                      session?.user?.name
                    )}
                  </CardTitle>
                  <CardDescription className="text-slate-500 dark:text-slate-400 mt-1">
                    @{session?.user?.name?.toLowerCase().replace(/\s+/g, '') || 'user'}
                  </CardDescription>
                  <div className="flex gap-4 mt-2 text-sm text-slate-500">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span className="font-semibold text-slate-900 dark:text-slate-100">{profileData?.followers || 0}</span> followers
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-slate-900 dark:text-slate-100">{profileData?.following || 0}</span> following
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" asChild>
                  <Link href={`/profile/${session?.user?.id}`}>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Public Profile
                  </Link>
                </Button>
                <Button
                  variant={isEditing ? "default" : "outline"}
                  onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                >
                  {isEditing ? "Save Changes" : "Edit Profile"}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Input
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about yourself..."
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {bio || "No bio yet. Click 'Edit Profile' to add one."}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Total Capsules</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{profileData?.totalCapsules || 0}</div>
              <p className="text-xs text-muted-foreground">
                {profileData?.publicCapsules || 0} public, {profileData?.privateCapsules || 0} private
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Community Impact</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{profileData?.followers || 0}</div>
              <p className="text-xs text-muted-foreground">
                People following your journey
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Member Since</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2024</div>
              <p className="text-xs text-muted-foreground">
                Time Traveler Level 1
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              {profileData?.lastActive
                ? `Last capsule created on ${profileData.lastActive}`
                : "No capsules created yet"}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
