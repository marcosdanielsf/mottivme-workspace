/**
 * UI Component Examples
 *
 * This file demonstrates how to use the UI components together.
 * Copy these examples as starting points for your features.
 */

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";
import { Button } from "./button";
import { Input } from "./input";
import { Badge } from "./badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { Slider } from "./slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./accordion";

// Example 1: Pricing Card
export function PricingCardExample() {
  return (
    <Card className="max-w-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Professional Plan</CardTitle>
          <Badge variant="success">Popular</Badge>
        </div>
        <CardDescription>Perfect for growing businesses</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold text-blue-600">
          $99<span className="text-lg text-slate-500">/month</span>
        </div>
        <ul className="mt-4 space-y-2 text-sm text-slate-600">
          <li>✓ Unlimited contacts</li>
          <li>✓ Advanced analytics</li>
          <li>✓ Priority support</li>
        </ul>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Get Started</Button>
      </CardFooter>
    </Card>
  );
}

// Example 2: Settings Form
export function SettingsFormExample() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Settings</CardTitle>
        <CardDescription>Manage your account preferences</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          label="Display Name"
          type="text"
          placeholder="John Doe"
        />

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Timezone
          </label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select timezone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="est">Eastern Time (EST)</SelectItem>
              <SelectItem value="cst">Central Time (CST)</SelectItem>
              <SelectItem value="pst">Pacific Time (PST)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Email Frequency
          </label>
          <Slider defaultValue={[2]} max={5} step={1} />
          <p className="text-xs text-slate-500 mt-1">
            Receive 2 emails per week
          </p>
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        <Button variant="outline">Cancel</Button>
        <Button>Save Changes</Button>
      </CardFooter>
    </Card>
  );
}

// Example 3: Tabbed Interface
export function TabbedContentExample() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-lg border p-4">
                <p className="text-sm text-slate-500">Total Users</p>
                <p className="text-2xl font-bold">1,234</p>
              </div>
              <div className="rounded-lg border p-4">
                <p className="text-sm text-slate-500">Revenue</p>
                <p className="text-2xl font-bold">$12,345</p>
              </div>
              <div className="rounded-lg border p-4">
                <p className="text-sm text-slate-500">Growth</p>
                <p className="text-2xl font-bold text-green-600">+15%</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <p className="text-slate-600">Analytics content goes here...</p>
          </TabsContent>

          <TabsContent value="reports">
            <p className="text-slate-600">Reports content goes here...</p>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

// Example 4: FAQ Accordion
export function FAQExample() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Frequently Asked Questions</CardTitle>
        <CardDescription>Find answers to common questions</CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>What is your refund policy?</AccordionTrigger>
            <AccordionContent>
              We offer a 30-day money-back guarantee. If you're not satisfied,
              contact us for a full refund.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger>How do I upgrade my plan?</AccordionTrigger>
            <AccordionContent>
              Go to Settings → Billing and select your desired plan. Changes
              take effect immediately.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger>Can I cancel anytime?</AccordionTrigger>
            <AccordionContent>
              Yes, you can cancel your subscription at any time. No questions
              asked.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}

// Example 5: Status Dashboard with Tooltips
export function StatusDashboardExample() {
  return (
    <TooltipProvider>
      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">API</span>
            <Tooltip>
              <TooltipTrigger>
                <Badge variant="success">Operational</Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>All systems running normally</p>
              </TooltipContent>
            </Tooltip>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Database</span>
            <Tooltip>
              <TooltipTrigger>
                <Badge variant="warning">Degraded</Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>Experiencing higher than normal latency</p>
              </TooltipContent>
            </Tooltip>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">CDN</span>
            <Tooltip>
              <TooltipTrigger>
                <Badge variant="success">Operational</Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>Content delivery running smoothly</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}

// Example 6: Button Variants Showcase
export function ButtonVariantsExample() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Button Variants</CardTitle>
        <CardDescription>All available button styles</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button variant="default">Default</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
        </div>

        <div className="flex gap-2 items-center">
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
        </div>

        <div className="flex gap-2">
          <Button disabled>Disabled</Button>
          <Button variant="outline" disabled>
            Disabled Outline
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Example 7: Form with Validation States
export function FormValidationExample() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Form</CardTitle>
        <CardDescription>Get in touch with us</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input label="Name" type="text" placeholder="John Doe" />
        <Input
          label="Email"
          type="email"
          placeholder="john@example.com"
          className="border-green-500"
        />
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Message
          </label>
          <textarea
            className="flex min-h-[100px] w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Your message..."
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="ghost">Cancel</Button>
        <Button>Send Message</Button>
      </CardFooter>
    </Card>
  );
}

// Example 8: Pricing Calculator
export function PricingCalculatorExample() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pricing Calculator</CardTitle>
        <CardDescription>
          Estimate your monthly costs
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Number of Users
          </label>
          <Slider defaultValue={[5]} max={50} step={1} />
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>1 user</span>
            <span>5 users</span>
            <span>50 users</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Plan Type
          </label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select plan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="basic">Basic - $9/user</SelectItem>
              <SelectItem value="pro">Professional - $19/user</SelectItem>
              <SelectItem value="enterprise">Enterprise - $29/user</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="pt-4 border-t">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">Estimated Total</span>
            <span className="text-3xl font-bold text-blue-600">$95/mo</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" size="lg">
          Start Free Trial
        </Button>
      </CardFooter>
    </Card>
  );
}
