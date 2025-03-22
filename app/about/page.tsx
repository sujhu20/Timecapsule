import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata = {
  title: "How It Works - TimeCapsule",
  description: "Learn how TimeCapsule allows you to share your legacy with the future.",
};

export default function AboutPage() {
  return (
    <div className="container max-w-4xl py-12 md:py-16 lg:py-24">
      <div className="mx-auto flex flex-col items-center space-y-4 text-center mb-12">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
          How TimeCapsule Works
        </h1>
        <p className="max-w-[700px] text-muted-foreground md:text-xl">
          A digital platform where you can create and store personal messages to be delivered
          in the future.
        </p>
      </div>

      <div className="space-y-16">
        <section>
          <h2 className="text-2xl font-bold mb-4">What is TimeCapsule?</h2>
          <p className="mb-4">
            TimeCapsule is a digital platform that allows you to create and store personal messages,
            videos, photos, or documents to be delivered to specific people (or the public) at a future
            date—years, decades, or even centuries later.
          </p>
          <p>
            Think of it as a digital time capsule that combines emotional storytelling, legacy
            preservation, and futuristic technology. It's a way to share your thoughts, wisdom,
            and memories with future generations.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Creating Your TimeCapsule</h2>
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h3 className="text-xl font-semibold mb-2">1. Sign Up</h3>
              <p>
                Create a free account to get started. We'll need some basic information to ensure
                your capsules can be properly delivered in the future.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">2. Create a Capsule</h3>
              <p>
                Choose what type of content you want to include: text messages, photos, videos,
                or audio recordings. You can create different capsules for different recipients.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">3. Set Delivery Date</h3>
              <p>
                Choose when your capsule should be delivered. This could be a specific date
                (like a child's 18th birthday) or a relative time (like 20 years from now).
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">4. Choose Recipients</h3>
              <p>
                Select who should receive your capsule. This could be specific individuals,
                or you can make it public for anyone to see in the future.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Security & Blockchain Technology</h2>
          <p className="mb-4">
            TimeCapsule uses blockchain technology to ensure your capsules are tamper-proof
            and securely stored for decades or centuries. This means:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>Your content cannot be altered once it's sealed in a capsule</li>
            <li>Delivery dates cannot be tampered with</li>
            <li>Your capsules will survive even if our company doesn't</li>
            <li>Optional NFT (Non-Fungible Token) creation for unique, collectible capsules</li>
          </ul>
          <p>
            We've built TimeCapsule with longevity in mind, ensuring your messages will reach
            their intended recipients no matter how far in the future.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">AI-Powered Legacy Builder</h2>
          <p className="mb-4">
            Not sure what to say? Our AI assistant can help you craft meaningful messages by:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Asking guided questions about what matters to you</li>
            <li>Suggesting themes based on your interests (life lessons, family history, etc.)</li>
            <li>Helping you structure your thoughts for maximum impact</li>
            <li>Creating interactive elements like quizzes or AR experiences</li>
          </ul>
        </section>

        <div className="pt-8 text-center">
          <Button size="lg" asChild>
            <Link href="/signup">Create Your First TimeCapsule</Link>
          </Button>
        </div>
      </div>
    </div>
  );
} 