import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const metadata = {
  title: "Terms of Service - TimeCapsule",
  description: "The terms and conditions for using the TimeCapsule service",
};

export default function TermsOfService() {
  return (
    <div className="container py-10 md:py-16 space-y-10 max-w-4xl mx-auto">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Terms of Service</h1>
        <p className="text-muted-foreground text-lg">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Acceptance of Terms</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            By accessing or using TimeCapsule, you agree to be bound by these Terms of Service and all applicable laws and regulations.
            If you do not agree with any of these terms, you are prohibited from using or accessing this site.
          </p>
          <p>
            We reserve the right to update or modify these Terms of Service at any time without prior notice.
            Your continued use of the service following any changes constitutes your acceptance of the new Terms of Service.
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Description of Service</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            TimeCapsule is a platform that allows users to create, encrypt, and schedule the delivery of digital content
            to specified recipients at future dates. The service provides end-to-end encryption to ensure the privacy and
            security of user content.
          </p>
          <p>
            We reserve the right to modify, suspend, or discontinue the service (or any part thereof) at any time with or without notice.
            We shall not be liable to you or any third party for any modification, suspension, or discontinuance of the service.
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>User Accounts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            To use certain features of TimeCapsule, you must create an account. You are responsible for maintaining
            the confidentiality of your account credentials and for all activities that occur under your account.
          </p>
          <p>
            You agree to provide accurate and complete information when creating your account and to update your
            information to keep it accurate and current. We reserve the right to suspend or terminate your account
            if any information provided proves to be inaccurate, false, or outdated.
          </p>
          <p>
            Each account is for a single user only. You may not share your account credentials with others or allow
            others to access your account.
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>User Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            You retain all rights to the content you upload, create, or share through TimeCapsule. By using our service,
            you grant us a limited license to store, process, and transmit your content as necessary to provide the service.
          </p>
          <p>
            You are solely responsible for the content you create and share through TimeCapsule. You agree not to use the
            service to create or transmit any content that:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Is illegal, harmful, threatening, abusive, harassing, tortious, defamatory, vulgar, or invasive of another's privacy</li>
            <li>Infringes any patent, trademark, trade secret, copyright, or other intellectual property rights</li>
            <li>Contains software viruses or any other computer code designed to interfere with the functionality of any computer system</li>
            <li>Constitutes unsolicited or unauthorized advertising or promotional materials</li>
          </ul>
          <p>
            We reserve the right to remove any content that, in our judgment, violates these terms or is otherwise objectionable.
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Subscription and Payments</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            TimeCapsule offers both free and premium subscription plans. By subscribing to a premium plan, you agree to pay
            the subscription fees as described at the time of purchase.
          </p>
          <p>
            Subscription fees are billed in advance and are non-refundable. You may cancel your subscription at any time,
            but the cancellation will take effect at the end of your current billing cycle.
          </p>
          <p>
            We reserve the right to change our subscription fees at any time. If we change our fees, we will provide notice
            of the change on the website or by email, at our discretion.
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Intellectual Property</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            The TimeCapsule service, including all of its features, functionality, content, and design elements, is owned
            by us and is protected by copyright, trademark, and other intellectual property laws.
          </p>
          <p>
            You may not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform,
            republish, download, store, or transmit any of the material on our website, except as necessary to use
            the service as intended.
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Limitation of Liability</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            In no event shall TimeCapsule be liable for any indirect, incidental, special, consequential, or punitive damages,
            including without limitation, loss of profits, data, or other intangible losses, resulting from:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Your use of or inability to use the service</li>
            <li>Any unauthorized access to or use of our servers and/or any personal information stored therein</li>
            <li>Any interruption or cessation of transmission to or from the service</li>
            <li>Any bugs, viruses, or the like that may be transmitted to or through the service</li>
          </ul>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Governing Law</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            These Terms of Service shall be governed by and construed in accordance with the laws of [Jurisdiction],
            without regard to its conflict of law provisions.
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Contact Us</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            If you have any questions about these Terms of Service, please contact us at:
          </p>
          <p className="mt-2 font-medium">legal@timecapsule.app</p>
        </CardContent>
      </Card>
      
      <Separator />
      
      <p className="text-sm text-muted-foreground">
        By using TimeCapsule, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
      </p>
    </div>
  );
} 