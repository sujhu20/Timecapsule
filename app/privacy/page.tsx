import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const metadata = {
  title: "Privacy Policy - TimeCapsule",
  description: "How we protect your data and privacy at TimeCapsule",
};

export default function PrivacyPolicy() {
  return (
    <div className="container py-10 md:py-16 space-y-10 max-w-4xl mx-auto">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
        <p className="text-muted-foreground text-lg">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Our Commitment to Privacy</CardTitle>
          <CardDescription>
            TimeCapsule is built on the foundation of privacy and security
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p>
            At TimeCapsule, we take your privacy seriously. Our service is built around the concept of end-to-end encryption,
            meaning that your time capsule content is encrypted on your device before it's sent to our servers,
            and can only be decrypted by the intended recipients.
          </p>
          
          <p>
            We collect only the minimal amount of information needed to provide our service.
            This privacy policy explains what information we collect, how we use it, and the choices you have regarding your data.
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Information We Collect</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-medium mb-2">Account Information</h3>
            <p className="text-muted-foreground">
              When you create an account, we collect your email address, name, and password (which is stored in an encrypted format).
            </p>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Capsule Metadata</h3>
            <p className="text-muted-foreground">
              We store metadata about your time capsules, such as creation date, scheduled delivery date, recipient information,
              and capsule status. However, the content of your capsules is end-to-end encrypted and cannot be accessed by us.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Usage Information</h3>
            <p className="text-muted-foreground">
              We collect anonymous usage data to help improve our service, such as feature usage patterns,
              performance metrics, and error data. This information does not identify you personally.
            </p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>How We Use Your Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-medium mb-2">Providing the Service</h3>
            <p className="text-muted-foreground">
              We use your information to deliver the core functionality of TimeCapsule: storing your encrypted time capsules
              and delivering them according to your specifications.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Service Improvements</h3>
            <p className="text-muted-foreground">
              We analyze usage patterns to improve our features, user interface, and overall experience.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Communication</h3>
            <p className="text-muted-foreground">
              We may send you service-related emails, such as capsule delivery notifications, security alerts,
              and important updates about the service.
            </p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Data Security</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p>
            TimeCapsule employs end-to-end encryption for all capsule content. This means:
          </p>
          
          <ul className="list-disc pl-6 space-y-2">
            <li>Your content is encrypted on your device before being sent to our servers</li>
            <li>The encryption keys remain on your device and are never sent to our servers</li>
            <li>Only intended recipients with the proper keys can decrypt the content</li>
            <li>Even in the event of a data breach, your capsule contents remain encrypted and inaccessible</li>
          </ul>
          
          <p>
            Additionally, we implement industry-standard security measures to protect your account information
            and capsule metadata, including secure data transmission, regular security audits, and robust access controls.
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Your Rights and Choices</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p>You have the following rights regarding your personal information:</p>
          
          <ul className="list-disc pl-6 space-y-2">
            <li>Access and download your personal data</li>
            <li>Correct inaccurate personal information</li>
            <li>Delete your account and associated data</li>
            <li>Object to certain processing of your data</li>
            <li>Withdraw consent where applicable</li>
          </ul>
          
          <p>
            To exercise these rights, please visit your account settings or contact us directly.
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Contact Us</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            If you have any questions about this Privacy Policy or our data practices, please contact us at:
          </p>
          <p className="mt-2 font-medium">privacy@timecapsule.app</p>
        </CardContent>
      </Card>
      
      <Separator />
      
      <p className="text-sm text-muted-foreground">
        This Privacy Policy may be updated from time to time. We will notify you of any significant changes by
        email or through a notice on our website.
      </p>
    </div>
  );
} 