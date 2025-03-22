import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export const metadata = {
  title: "Partnerships - TimeCapsule",
  description: "Collaborate with TimeCapsule to preserve cultural heritage and create meaningful legacy projects.",
};

export default function PartnershipsPage() {
  return (
    <div className="container max-w-4xl py-12 md:py-16 lg:py-24">
      <div className="mx-auto flex flex-col items-center space-y-4 text-center mb-12">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
          Partner With Us
        </h1>
        <p className="max-w-[700px] text-muted-foreground md:text-xl">
          Join TimeCapsule in preserving cultural heritage, educational initiatives, and creating meaningful legacy projects.
        </p>
      </div>

      <div className="space-y-16">
        <section>
          <h2 className="text-2xl font-bold mb-6">Cultural Institutions</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Museums & Archives</CardTitle>
                <CardDescription>Create digital time capsule exhibits</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Partner with TimeCapsule to create interactive exhibits that capture visitor stories and perspectives 
                  on current events, exhibitions, or cultural phenomena.
                </p>
                <Button variant="outline" asChild>
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Libraries</CardTitle>
                <CardDescription>Community history preservation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Work with local libraries to collect and preserve community histories, stories, and cultural knowledge
                  using TimeCapsule's advanced preservation technology.
                </p>
                <Button variant="outline" asChild>
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6">Educational Institutions</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>K-12 Schools</CardTitle>
                <CardDescription>Engage students with history</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Our educational program provides schools with free access to TimeCapsule for classroom 
                  projects, history lessons, and developing students' understanding of time and legacy.
                </p>
                <Button variant="outline" asChild>
                  <Link href="/contact">Get Started</Link>
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Universities</CardTitle>
                <CardDescription>Research and innovation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Collaborate with TimeCapsule on research projects involving digital preservation, cultural
                  anthropology, sociology, or historical documentation.
                </p>
                <Button variant="outline" asChild>
                  <Link href="/contact">Research Inquiries</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6">Technology Partners</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Blockchain Companies</CardTitle>
                <CardDescription>Decentralized preservation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  We partner with blockchain and decentralized storage solutions to enhance our
                  capsule preservation guarantees and provide immutable record-keeping.
                </p>
                <Button variant="outline" asChild>
                  <Link href="/contact">Explore Partnerships</Link>
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>AR/VR Developers</CardTitle>
                <CardDescription>Immersive experiences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Create next-generation immersive time capsule experiences that bring memories
                  to life through augmented and virtual reality technologies.
                </p>
                <Button variant="outline" asChild>
                  <Link href="/contact">Collaborate</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6">Global Initiatives</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Climate Action</CardTitle>
                <CardDescription>Document environmental change</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Join our initiative to document environmental changes, solutions, and perspectives
                  on climate change from people around the world for future generations.
                </p>
                <Button variant="outline" asChild>
                  <Link href="/global-capsules/climate">Learn More</Link>
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Cultural Heritage Preservation</CardTitle>
                <CardDescription>Save endangered traditions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  We work with indigenous communities and cultural organizations to preserve
                  endangered languages, traditions, and knowledge systems.
                </p>
                <Button variant="outline" asChild>
                  <Link href="/global-capsules/heritage">Join Initiative</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="bg-slate-50 p-8 rounded-lg">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Become a Partner</h2>
            <p className="text-muted-foreground">
              We're always looking for new partnerships to expand the impact of TimeCapsule.
            </p>
          </div>
          <div className="flex justify-center">
            <Button size="lg" asChild>
              <Link href="/contact">Contact Our Partnership Team</Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
} 