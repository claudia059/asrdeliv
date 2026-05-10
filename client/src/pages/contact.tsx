import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";
import { PublicLayout } from "@/components/public-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function ContactPage() {
  const { toast } = useToast();
  const [sending, setSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      toast({ title: "Message sent", description: "We'll get back to you within 24 hours." });
    }, 1200);
  };

  return (
    <PublicLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-14">
          <h1 className="text-4xl font-bold text-foreground mb-4">Get in Touch</h1>
          <p className="text-lg text-muted-foreground">Questions about your shipment or our services? We're here to help.</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-6">Contact Information</h2>
            <div className="space-y-6">
              {[
                { icon: Mail, label: "Email", value: "support@asrlogistics.com" },
                { icon: Phone, label: "Phone", value: "+1 (800) 555-0199" },
                { icon: MapPin, label: "Headquarters", value: "100 Logistics Hub, Singapore 018960" },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-4">
                  <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{label}</p>
                    <p className="font-medium text-foreground">{value}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-10 p-6 bg-secondary/50 rounded-xl border border-border">
              <h3 className="font-semibold text-foreground mb-2">Support Hours</h3>
              <p className="text-sm text-muted-foreground">Monday – Friday: 8:00 AM – 8:00 PM (SGT)</p>
              <p className="text-sm text-muted-foreground">Weekends: 9:00 AM – 5:00 PM (SGT)</p>
              <p className="text-sm text-muted-foreground mt-2">Emergency tracking support available 24/7.</p>
            </div>
          </div>

          <div className="bg-card border border-card-border rounded-xl p-8">
            <h2 className="text-xl font-semibold text-foreground mb-6">Send a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="John" required data-testid="input-first-name" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Doe" required data-testid="input-last-name" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="john@example.com" required data-testid="input-email" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" placeholder="Tracking inquiry" data-testid="input-subject" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" placeholder="How can we help?" rows={5} required data-testid="textarea-message" />
              </div>
              <Button type="submit" className="w-full" disabled={sending} data-testid="button-send-message">
                {sending ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
