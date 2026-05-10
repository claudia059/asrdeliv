import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Search, Package, Globe, Shield, Zap, Clock, MapPin, TrendingUp, CheckCircle, ArrowRight } from "lucide-react";
import { PublicLayout } from "@/components/public-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const stats = [
  { value: "50K+", label: "Shipments Tracked" },
  { value: "120+", label: "Countries Covered" },
  { value: "99.8%", label: "Delivery Success" },
  { value: "24/7", label: "Live Monitoring" },
];

const features = [
  {
    icon: Globe,
    title: "Global Coverage",
    description: "Track shipments across 120+ countries with real-time updates from our worldwide partner network.",
  },
  {
    icon: MapPin,
    title: "Live Mapping",
    description: "Watch your package move on an interactive map powered by OpenStreetMap with precise coordinates.",
  },
  {
    icon: Zap,
    title: "Instant Updates",
    description: "Real-time status notifications the moment your shipment changes hands or crosses a checkpoint.",
  },
  {
    icon: Shield,
    title: "Secure & Reliable",
    description: "Enterprise-grade security with end-to-end tracking integrity and tamper-proof audit trails.",
  },
  {
    icon: Clock,
    title: "Precise ETAs",
    description: "AI-assisted delivery estimates that account for customs, weather, and carrier performance data.",
  },
  {
    icon: TrendingUp,
    title: "Analytics Dashboard",
    description: "Full admin control with analytics, bulk management, and exportable reports for your logistics team.",
  },
];

const steps = [
  { step: "01", title: "Enter Tracking Number", desc: "Input your unique AsR tracking number from your shipment confirmation." },
  { step: "02", title: "View Live Status", desc: "See real-time location, status, and the full journey timeline of your shipment." },
  { step: "03", title: "Receive Delivery", desc: "Get notified at each milestone until your package is safely in your hands." },
];

export default function HomePage() {
  const [trackingInput, setTrackingInput] = useState("");
  const [, setLocation] = useLocation();

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingInput.trim()) {
      setLocation(`/track/${trackingInput.trim()}`);
    }
  };

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-secondary/30 pt-20 pb-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_hsl(var(--primary)/0.08),_transparent_60%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border border-border bg-secondary text-muted-foreground mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
              Real-time global tracking
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-foreground mb-6 leading-[1.08]">
              Precision tracking<br />
              <span className="text-primary">for every shipment</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              AsR Logistics delivers real-time visibility into your international freight and luggage — from pickup to doorstep, on every continent.
            </p>

            <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Enter tracking number (e.g. ASRLOGS001)"
                  value={trackingInput}
                  onChange={e => setTrackingInput(e.target.value)}
                  className="pl-10 h-12 text-base"
                  data-testid="input-tracking-hero"
                />
              </div>
              <Button type="submit" size="lg" className="h-12 px-8" data-testid="button-track-hero">
                Track Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>

            <p className="mt-4 text-xs text-muted-foreground">
              Try: <button onClick={() => setTrackingInput("ASRLOGS001")} className="underline hover:text-foreground">ASRLOGS001</button>
              {" · "}
              <button onClick={() => setTrackingInput("ASRLOGS004")} className="underline hover:text-foreground">ASRLOGS004</button>
              {" · "}
              <button onClick={() => setTrackingInput("ASRLOGS005")} className="underline hover:text-foreground">ASRLOGS005</button>
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map(({ value, label }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="bg-card border border-card-border rounded-xl p-6 text-center shadow-sm"
            >
              <p className="text-3xl font-extrabold text-foreground">{value}</p>
              <p className="text-sm text-muted-foreground mt-1">{label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Built for global logistics</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">Everything you need to manage, track, and analyze international shipments at scale.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, description }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.4 }}
              className="bg-card border border-card-border rounded-xl p-6 hover:shadow-md transition-shadow"
            >
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-secondary/40 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">How it works</h2>
            <p className="text-muted-foreground">Three simple steps to full shipment visibility.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map(({ step, title, desc }, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="flex flex-col items-center text-center"
              >
                <div className="h-14 w-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-bold mb-4 shadow-lg">
                  {step}
                </div>
                <h3 className="font-semibold text-foreground mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <div className="bg-primary rounded-2xl px-8 py-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(255,255,255,0.08),_transparent_60%)]" />
          <div className="relative">
            <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-4">Ready to track your shipment?</h2>
            <p className="text-primary-foreground/80 mb-8 max-w-md mx-auto">Enter your tracking number and get instant, real-time updates on your package's journey.</p>
            <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                placeholder="Tracking number"
                value={trackingInput}
                onChange={e => setTrackingInput(e.target.value)}
                className="h-12 bg-white/10 border-white/20 text-white placeholder:text-white/50 flex-1"
                data-testid="input-tracking-cta"
              />
              <Button type="submit" variant="secondary" size="lg" className="h-12" data-testid="button-track-cta">
                Track <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
