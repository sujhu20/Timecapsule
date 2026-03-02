"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Calendar } from "lucide-react";
import { FollowButton } from "@/components/follow-button";
import { notFound } from "next/navigation";

interface UserProfile {
    id: string;
    name: string | null;
    image: string | null;
    joinedAt: string;
    stats: {
        followers: number;
        following: number;
        publicCapsules: number;
    };
    isFollowing: boolean;
    isOwnProfile: boolean;
}

export default function PublicProfilePage({ params }: { params: { id: string } }) {
    const { data: session } = useSession();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchProfile() {
            try {
                const response = await fetch(`/api/users/${params.id}`);

                if (response.status === 404) {
                    setError('User not found');
                    return;
                }

                if (!response.ok) {
                    throw new Error('Failed to fetch profile');
                }

                const data = await response.json();
                setProfile(data.user);
            } catch (err) {
                console.error('Error fetching profile:', err);
                setError('Failed to load profile');
            } finally {
                setLoading(false);
            }
        }

        fetchProfile();
    }, [params.id, session]); // Refetch when session changes (to update isFollowing state from server if needed)

    if (loading) {
        return (
            <div className="container py-8 max-w-4xl mx-auto px-4">
                <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                        <Skeleton className="h-24 w-24 rounded-full" />
                        <div className="space-y-2">
                            <Skeleton className="h-6 w-[200px]" />
                            <Skeleton className="h-4 w-[150px]" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="container py-12 max-w-4xl mx-auto px-4 text-center">
                <h1 className="text-2xl font-bold mb-4">User Not Found</h1>
                <p className="text-muted-foreground">The user you are looking for does not exist.</p>
                <Button className="mt-4" asChild>
                    <a href="/">Go to Feed</a>
                </Button>
            </div>
        );
    }

    return (
        <div className="container py-8 max-w-4xl mx-auto px-4">
            {/* Profile Header */}
            <Card className="mb-8 overflow-hidden">
                <div className="h-32 bg-gradient-to-r from-blue-400 to-purple-500 opacity-20"></div>
                <CardContent className="relative pt-0">
                    <div className="flex flex-col md:flex-row items-start md:items-end -mt-12 mb-6 gap-6">
                        <Avatar className="h-24 w-24 border-4 border-white dark:border-slate-900 shadow-lg">
                            <AvatarImage src={profile.image || ""} />
                            <AvatarFallback className="text-2xl">
                                {profile.name?.charAt(0).toUpperCase() || "U"}
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 space-y-1">
                            <h1 className="text-3xl font-bold">{profile.name || "Time Traveler"}</h1>
                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    Joined {new Date(profile.joinedAt).toLocaleDateString()}
                                </div>
                                <div className="flex items-center gap-1">
                                    <Users className="w-4 h-4" />
                                    <span className="font-semibold text-foreground">{profile.stats.followers}</span> followers
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="font-semibold text-foreground">{profile.stats.following}</span> following
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 md:mt-0">
                            {!profile.isOwnProfile && (
                                <FollowButton
                                    targetUserId={profile.id}
                                    initialIsFollowing={profile.isFollowing}
                                    onFollowChange={(isFollowing) => {
                                        // Optimistically update local state
                                        setProfile(prev => prev ? {
                                            ...prev,
                                            isFollowing,
                                            stats: {
                                                ...prev.stats,
                                                followers: prev.stats.followers + (isFollowing ? 1 : -1)
                                            }
                                        } : null);
                                    }}
                                    className="w-full md:w-auto"
                                />
                            )}
                            {profile.isOwnProfile && (
                                <Button variant="outline" asChild>
                                    <a href="/profile">Edit Profile</a>
                                </Button>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 border-t border-slate-200 dark:border-slate-800 pt-6">
                        <div className="text-center">
                            <div className="text-2xl font-bold">{profile.stats.publicCapsules}</div>
                            <div className="text-sm text-muted-foreground">Public Capsules</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold">{profile.stats.followers}</div>
                            <div className="text-sm text-muted-foreground">Followers</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold">{profile.stats.following}</div>
                            <div className="text-sm text-muted-foreground">Following</div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* TODO: Add Public Capsules Feed Here */}
            <div className="space-y-4">
                <h2 className="text-xl font-bold">Public Capsules</h2>
                <div className="p-12 text-center border border-dashed rounded-lg text-muted-foreground">
                    User's public capsules will appear here.
                </div>
            </div>
        </div>
    );
}
