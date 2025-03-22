import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container flex flex-col items-center justify-center min-h-[70vh] py-16 text-center">
      <div className="rounded-full bg-muted p-6 mb-6">
        <FileQuestion className="h-16 w-16 text-muted-foreground" />
      </div>
      
      <h1 className="text-4xl font-bold tracking-tight mb-2">Page not found</h1>
      <p className="text-muted-foreground text-lg max-w-md mb-8">
        Sorry, we couldn't find the page you're looking for. It might have been removed or doesn't exist.
      </p>
      
      <div className="flex flex-wrap gap-4 justify-center">
        <Button asChild>
          <Link href="/">
            Return Home
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/capsules">
            My Capsules
          </Link>
        </Button>
      </div>
    </div>
  );
} 