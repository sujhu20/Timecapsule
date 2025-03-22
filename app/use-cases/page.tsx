import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const metadata = {
  title: "Use Cases - TimeCapsule",
  description: "Discover the many ways TimeCapsule can preserve your legacy and connect generations.",
};

export default function UseCasesPage() {
  return (
    <div className="container max-w-4xl py-12 md:py-16 lg:py-24">
      <div className="mx-auto flex flex-col items-center space-y-4 text-center mb-12">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
          Use Cases
        </h1>
        <p className="max-w-[700px] text-muted-foreground md:text-xl">
          Discover the many ways TimeCapsule can help preserve memories, share wisdom, and connect generations.
        </p>
      </div>

      <div className="space-y-16">
        <section>
          <h2 className="text-2xl font-bold mb-6">Personal Legacy</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Parents to Children</CardTitle>
                <CardDescription>Create meaningful messages for future milestones</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Parents can create capsules for their kids to open on their 18th birthday, wedding day, 
                  or other significant life milestones. Share wisdom, memories, and hopes for their future.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Future Self</CardTitle>
                <CardDescription>Connect with your future self</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Write letters to your future self, reflecting on your current life, goals, and dreams.
                  Set delivery dates for significant birthdays or anniversaries to reflect on your journey.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Elderly Individuals</CardTitle>
                <CardDescription>Preserve life stories and wisdom</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Older adults can document their life stories, wisdom, and memories for future generations,
                  ensuring their experiences and knowledge aren't lost to time.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Life Milestones</CardTitle>
                <CardDescription>Capture significant moments</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Document weddings, graduations, births, and other major life events with
                  messages, photos, and videos to revisit years later.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        <section>
          <h2 className="text-2xl font-bold mb-6">Cultural & Historical Preservation</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Indigenous Communities</CardTitle>
                <CardDescription>Preserve cultural heritage</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Preserve cultural traditions, languages, and stories that might otherwise be lost.
                  Create a digital archive of cultural knowledge for future generations.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Historical Events</CardTitle>
                <CardDescription>Document personal experiences</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Document personal experiences of major events (e.g., pandemics, wars, or space exploration) 
                  for future historians, providing first-hand accounts of history as it happens.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        <section>
          <h2 className="text-2xl font-bold mb-6">Educational Purposes</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Time Capsule Projects</CardTitle>
                <CardDescription>Engage students in reflection</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Schools can use the app for students to create capsules about their lives, predictions, 
                  or local history, encouraging reflection and historical thinking.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Research</CardTitle>
                <CardDescription>Study societal evolution</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Universities can use the app to collect data on societal trends, personal stories, 
                  or cultural shifts over time, creating valuable research resources.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        <section>
          <h2 className="text-2xl font-bold mb-6">Corporate & Organizational Use</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Company Milestones</CardTitle>
                <CardDescription>Commemorate important achievements</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Businesses can create capsules for anniversaries, product launches, or employee achievements,
                  building a corporate history that preserves the company's journey.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Brand Legacy</CardTitle>
                <CardDescription>Document brand evolution</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Brands can document their journey and values for future customers or employees,
                  creating an authentic record of their mission and impact.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        <section>
          <h2 className="text-2xl font-bold mb-6">Global Collaboration</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Climate Change</CardTitle>
                <CardDescription>Document environmental observations</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Collect global perspectives on climate change and potential solutions for future generations,
                  creating a worldwide archive of environmental observations and ideas.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Peace & Unity</CardTitle>
                <CardDescription>Share messages of hope</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Encourage people worldwide to share messages of hope, unity, and peace,
                  building a global archive of human aspirations and values.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
} 