import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">TimeCapsule</h3>
            <p className="text-sm text-muted-foreground">
              Share your legacy with the future through digital time capsules.
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-foreground">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/explore" className="text-muted-foreground hover:text-foreground">
                  Explore
                </Link>
              </li>
              <li>
                <Link href="/global-capsules" className="text-muted-foreground hover:text-foreground">
                  Global Capsules
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/use-cases" className="text-muted-foreground hover:text-foreground">
                  Use Cases
                </Link>
              </li>
              <li>
                <Link href="/technology" className="text-muted-foreground hover:text-foreground">
                  Technology
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-muted-foreground hover:text-foreground">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/partnerships" className="text-muted-foreground hover:text-foreground">
                  Partnerships
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="mailto:support@timecapsule.app"
                  className="text-muted-foreground hover:text-foreground"
                >
                  support@timecapsule.app
                </a>
              </li>
              <li>
                <a
                  href="https://twitter.com/timecapsule"
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Twitter
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} TimeCapsule. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
} 