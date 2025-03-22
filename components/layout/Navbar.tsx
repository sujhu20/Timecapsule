"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/logo";

export function Navbar() {
  const { user, signOut } = useAuth();
  const pathname = usePathname();

  return (
    <header className="border-b bg-background">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center">
            <Logo size="sm" />
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="/explore" className="text-sm font-medium hover:underline">
              Explore
            </Link>
            <Link href="/challenges" className="text-sm font-medium hover:underline">
              Global Challenges
            </Link>
            <Link href="/about" className="text-sm font-medium hover:underline">
              How It Works
            </Link>
            <Link href="/use-cases" className="text-sm font-medium hover:underline">
              Use Cases
            </Link>
            <Link href="/technology" className="text-sm font-medium hover:underline">
              Technology
            </Link>
            <Link href="/pricing" className="text-sm font-medium hover:underline">
              Pricing
            </Link>
            <Link href="/partnerships" className="text-sm font-medium hover:underline">
              Partnerships
            </Link>
            <Link
              href="/capsules"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === "/capsules" ? "text-primary" : "text-muted-foreground"
              )}
            >
              Encrypted Capsules
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Button variant="outline" asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <Button asChild>
                <Link href="/capsules/new">Create Capsule</Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="h-8 w-8 cursor-pointer">
                    <AvatarImage src={user.image} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
                  <DropdownMenuLabel className="text-xs text-muted-foreground">
                    {user.email}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/capsules">My Capsules</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut}>
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="outline" asChild>
                <Link href="/signin">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
} 