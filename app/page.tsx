import { LogoShowcase } from "@/components/logo-showcase";

export default function Home() {
  return (
    <main className="container py-10 md:py-16 lg:py-24">
      <div className="max-w-5xl mx-auto">
        <LogoShowcase />
        
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          <div className="border rounded-lg p-6 bg-background">
            <h3 className="text-lg font-semibold mb-2">Create</h3>
            <p className="text-muted-foreground mb-4">
              Create personalized time capsules with text, photos, videos, or documents.
            </p>
          </div>
          
          <div className="border rounded-lg p-6 bg-background">
            <h3 className="text-lg font-semibold mb-2">Encrypt</h3>
            <p className="text-muted-foreground mb-4">
              Your content is end-to-end encrypted, ensuring only intended recipients can access it.
            </p>
          </div>
          
          <div className="border rounded-lg p-6 bg-background">
            <h3 className="text-lg font-semibold mb-2">Deliver</h3>
            <p className="text-muted-foreground mb-4">
              Schedule your capsules to be delivered on specific dates or under certain conditions.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
