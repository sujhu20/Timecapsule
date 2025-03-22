import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Technology - TimeCapsule",
  description: "Learn about the advanced technologies that power TimeCapsule.",
};

export default function TechnologyPage() {
  return (
    <div className="container max-w-4xl py-12 md:py-16 lg:py-24">
      <div className="mx-auto flex flex-col items-center space-y-4 text-center mb-12">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
          Our Technology
        </h1>
        <p className="max-w-[700px] text-muted-foreground md:text-xl">
          Discover the advanced technologies that power TimeCapsule and ensure your legacy lasts for generations.
        </p>
      </div>

      <div className="space-y-12">
        <section>
          <h2 className="text-2xl font-bold mb-6">Blockchain Integration</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Decentralized Storage</CardTitle>
                <CardDescription>Ensuring data permanence</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  We use decentralized storage solutions like IPFS (InterPlanetary File System) to ensure data durability.
                  This means your capsules will survive even if our servers don't, providing true long-term preservation.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Smart Contracts</CardTitle>
                <CardDescription>Automation and security</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Automated capsule delivery based on predefined conditions (e.g., date, event) using smart contracts.
                  This ensures capsules are delivered exactly when intended, with no possibility of tampering.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>NFT Integration</CardTitle>
                <CardDescription>Unique digital collectibles</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Users can mint their capsules as NFTs (Non-Fungible Tokens), making them unique, verifiable, 
                  and potentially valuable. This creates a new dimension of digital legacy preservation.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Immutable Records</CardTitle>
                <CardDescription>Tamper-proof content</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Blockchain technology ensures that once a capsule is sealed, its contents cannot be altered,
                  providing confidence that your message will reach the future exactly as you intended.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6">AI/ML Features</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Natural Language Processing</CardTitle>
                <CardDescription>Enhanced content creation</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  We analyze user input to suggest improvements or generate prompts, helping you create
                  more meaningful and impactful messages for your capsules.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Predictive Analytics</CardTitle>
                <CardDescription>Future forecasting assistance</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Our AI uses historical data to help users make more informed predictions about the future,
                  enhancing the value of future-oriented capsules.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Sentiment Analysis</CardTitle>
                <CardDescription>Emotional tone matching</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Our system ensures the tone of the capsule matches your intent (e.g., hopeful, reflective),
                  helping convey your emotions accurately across time.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Content Generation</CardTitle>
                <CardDescription>Guided storytelling</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  AI-assisted content generation helps you tell your story by providing prompts and suggestions
                  based on the type of legacy you want to leave.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6">AR/VR Integration</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Augmented Reality Effects</CardTitle>
                <CardDescription>Enhanced immersive elements</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Add AR elements to your capsules, such as a 3D model of your home or a virtual tour of your city,
                  creating a more immersive experience for future recipients.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Virtual Reality Experiences</CardTitle>
                <CardDescription>Time travel through VR</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Create immersive "time travel" experiences where recipients can explore the past through VR,
                  making your memories come alive in three-dimensional space.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6">Infrastructure & Security</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Cloud Infrastructure</CardTitle>
                <CardDescription>Scalable and reliable storage</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  We use cloud providers like AWS and Google Cloud for reliable storage of large media files 
                  and user data, ensuring high availability and durability.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Advanced Encryption</CardTitle>
                <CardDescription>Military-grade security</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  All capsule content is protected with AES-256 encryption, the same standard used by financial
                  institutions and government agencies, keeping your personal messages secure.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Cross-Platform Development</CardTitle>
                <CardDescription>Access from anywhere</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  TimeCapsule is available on iOS, Android, and the web, ensuring you can create and manage
                  your legacy from any device, anywhere in the world.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Data Redundancy</CardTitle>
                <CardDescription>Multiple backup systems</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Your capsules are stored with multiple layers of redundancy across different geographical regions,
                  ensuring they survive even major disasters or system failures.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
} 