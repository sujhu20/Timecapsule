import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

// Define a simple Badge component since it's missing
const Badge = ({ 
  children, 
  className = "", 
  ...props 
}: { 
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}) => {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80 ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

export const metadata = {
  title: "Pricing - TimeCapsule",
  description: "Choose the perfect plan for preserving your legacy with TimeCapsule.",
};

export default function PricingPage() {
  return (
    <div className="container max-w-5xl py-12 md:py-16 lg:py-24">
      <div className="mx-auto flex flex-col items-center space-y-4 text-center mb-12">
        <Badge className="mb-2">Pricing</Badge>
        <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
          Preserve Your Legacy
        </h1>
        <p className="max-w-[700px] text-muted-foreground md:text-xl">
          Affordable plans designed for everyone, from personal time capsules to family legacies.
        </p>
      </div>

      <Tabs defaultValue="monthly" className="mb-12">
        <div className="flex justify-center mb-8">
          <TabsList>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="yearly">Yearly (Save 20%)</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="monthly" className="space-y-8">
          <div className="grid gap-8 md:grid-cols-3">
            {/* Free Plan */}
            <Card className="flex flex-col border-gray-200 transition-all duration-200 hover:shadow-md">
              <CardHeader>
                <CardTitle className="text-xl">
                  Basic
                </CardTitle>
                <div className="flex flex-col gap-2">
                  <span className="text-3xl font-bold">$0</span>
                  <CardDescription>Forever free</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>3 time capsules</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>100MB storage per capsule</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>Text and image content</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>5-year preservation</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>Email notifications</span>
                  </li>
                  <li className="flex items-center opacity-50">
                    <X className="mr-2 h-4 w-4 text-red-500" />
                    <span>Advanced privacy controls</span>
                  </li>
                  <li className="flex items-center opacity-50">
                    <X className="mr-2 h-4 w-4 text-red-500" />
                    <span>Blockchain backup</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant="outline" asChild>
                  <Link href="/signup">Get Started</Link>
                </Button>
              </CardFooter>
            </Card>

            {/* Premium Plan */}
            <Card className="flex flex-col border-gray-200 relative overflow-hidden transition-all duration-200 hover:shadow-md transform hover:-translate-y-1 z-10 shadow-lg">
              <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-medium px-3 py-1 rounded-bl-lg">
                Popular
              </div>
              <CardHeader>
                <CardTitle className="text-xl">
                  Premium
                </CardTitle>
                <div className="flex flex-col gap-2">
                  <span className="text-3xl font-bold">$9.99</span>
                  <CardDescription>per month</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>20 time capsules</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>1GB storage per capsule</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>Text, image, audio content</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>25-year preservation</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>Email & SMS notifications</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>Advanced privacy controls</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>AI content suggestions</span>
                  </li>
                  <li className="flex items-center opacity-50">
                    <X className="mr-2 h-4 w-4 text-red-500" />
                    <span>Blockchain backup</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" asChild>
                  <Link href="/signup?plan=premium">Subscribe Now</Link>
                </Button>
              </CardFooter>
            </Card>

            {/* Legacy Plan */}
            <Card className="flex flex-col border-gray-200 transition-all duration-200 hover:shadow-md">
              <CardHeader>
                <CardTitle className="text-xl">
                  Legacy
                </CardTitle>
                <div className="flex flex-col gap-2">
                  <span className="text-3xl font-bold">$299</span>
                  <CardDescription>one-time payment</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>Unlimited time capsules</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>10GB storage per capsule</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>All media types (incl. video, VR)</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>Lifetime preservation</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>Priority support</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>Blockchain backup</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>NFT minting capabilities</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>AR/VR content creation</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant="outline" asChild>
                  <Link href="/signup?plan=legacy">Purchase Legacy</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="yearly" className="space-y-8">
          <div className="grid gap-8 md:grid-cols-3">
            {/* Free Plan (Yearly) */}
            <Card className="flex flex-col border-gray-200 transition-all duration-200 hover:shadow-md">
              <CardHeader>
                <CardTitle className="text-xl">
                  Basic
                </CardTitle>
                <div className="flex flex-col gap-2">
                  <span className="text-3xl font-bold">$0</span>
                  <CardDescription>Forever free</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>3 time capsules</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>100MB storage per capsule</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>Text and image content</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>5-year preservation</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>Email notifications</span>
                  </li>
                  <li className="flex items-center opacity-50">
                    <X className="mr-2 h-4 w-4 text-red-500" />
                    <span>Advanced privacy controls</span>
                  </li>
                  <li className="flex items-center opacity-50">
                    <X className="mr-2 h-4 w-4 text-red-500" />
                    <span>Blockchain backup</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant="outline" asChild>
                  <Link href="/signup">Get Started</Link>
                </Button>
              </CardFooter>
            </Card>

            {/* Premium Plan (Yearly) */}
            <Card className="flex flex-col border-gray-200 relative overflow-hidden transition-all duration-200 hover:shadow-md transform hover:-translate-y-1 z-10 shadow-lg">
              <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-medium px-3 py-1 rounded-bl-lg">
                Popular
              </div>
              <CardHeader>
                <CardTitle className="text-xl">
                  Premium
                </CardTitle>
                <div className="flex flex-col gap-2">
                  <span className="text-3xl font-bold">$95.90</span>
                  <CardDescription>per year (save $23.98)</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>20 time capsules</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>1GB storage per capsule</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>Text, image, audio content</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>25-year preservation</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>Email & SMS notifications</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>Advanced privacy controls</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>AI content suggestions</span>
                  </li>
                  <li className="flex items-center opacity-50">
                    <X className="mr-2 h-4 w-4 text-red-500" />
                    <span>Blockchain backup</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" asChild>
                  <Link href="/signup?plan=premium-yearly">Subscribe Yearly</Link>
                </Button>
              </CardFooter>
            </Card>

            {/* Legacy Plan (Still one-time) */}
            <Card className="flex flex-col border-gray-200 transition-all duration-200 hover:shadow-md">
              <CardHeader>
                <CardTitle className="text-xl">
                  Legacy
                </CardTitle>
                <div className="flex flex-col gap-2">
                  <span className="text-3xl font-bold">$299</span>
                  <CardDescription>one-time payment</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>Unlimited time capsules</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>10GB storage per capsule</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>All media types (incl. video, VR)</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>Lifetime preservation</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>Priority support</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>Blockchain backup</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>NFT minting capabilities</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>AR/VR content creation</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant="outline" asChild>
                  <Link href="/signup?plan=legacy">Purchase Legacy</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Feature comparison table */}
      <div className="mt-16 mb-12">
        <h2 className="text-2xl font-bold text-center mb-8">Compare All Features</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800">
                <th className="px-4 py-3 text-left">Feature</th>
                <th className="px-4 py-3 text-center">Basic</th>
                <th className="px-4 py-3 text-center">Premium</th>
                <th className="px-4 py-3 text-center">Legacy</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr>
                <td className="px-4 py-3 font-medium">Time Capsules</td>
                <td className="px-4 py-3 text-center">3</td>
                <td className="px-4 py-3 text-center">20</td>
                <td className="px-4 py-3 text-center">Unlimited</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Storage per Capsule</td>
                <td className="px-4 py-3 text-center">100MB</td>
                <td className="px-4 py-3 text-center">1GB</td>
                <td className="px-4 py-3 text-center">10GB</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Content Types</td>
                <td className="px-4 py-3 text-center">Text, Images</td>
                <td className="px-4 py-3 text-center">Text, Images, Audio</td>
                <td className="px-4 py-3 text-center">All Types (incl. Video, AR/VR)</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Preservation Period</td>
                <td className="px-4 py-3 text-center">5 Years</td>
                <td className="px-4 py-3 text-center">25 Years</td>
                <td className="px-4 py-3 text-center">Lifetime</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Notifications</td>
                <td className="px-4 py-3 text-center">Email</td>
                <td className="px-4 py-3 text-center">Email & SMS</td>
                <td className="px-4 py-3 text-center">Email, SMS & Priority</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Advanced Privacy</td>
                <td className="px-4 py-3 text-center">
                  <X className="mx-auto h-4 w-4 text-red-500" />
                </td>
                <td className="px-4 py-3 text-center">
                  <Check className="mx-auto h-4 w-4 text-green-500" />
                </td>
                <td className="px-4 py-3 text-center">
                  <Check className="mx-auto h-4 w-4 text-green-500" />
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">AI Content Assistance</td>
                <td className="px-4 py-3 text-center">
                  <X className="mx-auto h-4 w-4 text-red-500" />
                </td>
                <td className="px-4 py-3 text-center">
                  <Check className="mx-auto h-4 w-4 text-green-500" />
                </td>
                <td className="px-4 py-3 text-center">
                  <Check className="mx-auto h-4 w-4 text-green-500" />
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Blockchain Backup</td>
                <td className="px-4 py-3 text-center">
                  <X className="mx-auto h-4 w-4 text-red-500" />
                </td>
                <td className="px-4 py-3 text-center">
                  <X className="mx-auto h-4 w-4 text-red-500" />
                </td>
                <td className="px-4 py-3 text-center">
                  <Check className="mx-auto h-4 w-4 text-green-500" />
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">NFT Minting</td>
                <td className="px-4 py-3 text-center">
                  <X className="mx-auto h-4 w-4 text-red-500" />
                </td>
                <td className="px-4 py-3 text-center">
                  <X className="mx-auto h-4 w-4 text-red-500" />
                </td>
                <td className="px-4 py-3 text-center">
                  <Check className="mx-auto h-4 w-4 text-green-500" />
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">AR/VR Content Creation</td>
                <td className="px-4 py-3 text-center">
                  <X className="mx-auto h-4 w-4 text-red-500" />
                </td>
                <td className="px-4 py-3 text-center">
                  <X className="mx-auto h-4 w-4 text-red-500" />
                </td>
                <td className="px-4 py-3 text-center">
                  <Check className="mx-auto h-4 w-4 text-green-500" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-12 md:mt-16 space-y-6">
        <h2 className="text-2xl font-bold text-center">Frequently Asked Questions</h2>
        
        <div className="space-y-4 max-w-3xl mx-auto">
          <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
            <h3 className="font-medium mb-2">How long will my time capsules be preserved?</h3>
            <p className="text-muted-foreground">
              Each plan has a different preservation period. Basic plans are guaranteed for 5 years, Premium for 25 years, and Legacy plans come with lifetime preservation backed by our trust fund and blockchain technology.
            </p>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
            <h3 className="font-medium mb-2">What happens if TimeCapsule ceases operations?</h3>
            <p className="text-muted-foreground">
              Legacy plan capsules are backed up on decentralized storage systems and blockchain networks, ensuring they'll survive regardless of our company's status. For other plans, we maintain an operational continuity fund that will transfer your data to partner organizations.
            </p>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
            <h3 className="font-medium mb-2">Can I upgrade my plan later?</h3>
            <p className="text-muted-foreground">
              Yes, you can upgrade your plan at any time. When upgrading, your existing capsules will automatically receive the benefits of your new plan, including extended preservation periods and increased storage capacity.
            </p>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
            <h3 className="font-medium mb-2">Are there any additional fees?</h3>
            <p className="text-muted-foreground">
              No hidden fees. The prices shown include all features described. Legacy plan is a one-time payment for lifetime service. For Premium plans, you can save 20% by paying annually ($95.90/year) instead of monthly.
            </p>
          </div>
        </div>
      </div>
      
      <div className="mt-16 text-center">
        <div className="p-8 bg-blue-50 dark:bg-blue-950 rounded-xl">
          <h2 className="text-2xl font-bold mb-4">Ready to preserve your legacy?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Start creating time capsules today and share your memories with future generations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/contact">Contact Sales</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 