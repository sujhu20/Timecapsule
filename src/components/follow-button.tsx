"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { UserPlus, UserCheck, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface FollowButtonProps {
    targetUserId: string;
    initialIsFollowing: boolean;
    onFollowChange?: (isFollowing: boolean) => void;
    className?: string;
}

export function FollowButton({
    targetUserId,
    initialIsFollowing,
    onFollowChange,
    className
}: FollowButtonProps) {
    const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleToggleFollow = async () => {
        setIsLoading(true);

        try {
            const method = isFollowing ? 'DELETE' : 'POST';
            const response = await fetch(`/api/users/${targetUserId}/follow`, {
                method,
            });

            if (response.status === 401) {
                toast.error("Please sign in to follow users");
                router.push('/signin');
                return;
            }

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to update follow status');
            }

            const newState = !isFollowing;
            setIsFollowing(newState);

            if (onFollowChange) {
                onFollowChange(newState);
            }

            toast.success(newState ? "Following user" : "Unfollowed user");

            // Refresh the page to update stats if necessary
            router.refresh();
        } catch (error) {
            console.error('Error toggling follow:', error);
            toast.error('Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button
            variant={isFollowing ? "outline" : "default"}
            size="sm"
            onClick={handleToggleFollow}
            disabled={isLoading}
            className={className}
        >
            {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-1" />
            ) : isFollowing ? (
                <UserCheck className="h-4 w-4 mr-1" />
            ) : (
                <UserPlus className="h-4 w-4 mr-1" />
            )}
            {isFollowing ? "Following" : "Follow"}
        </Button>
    );
}
