import { motion } from "framer-motion";
import { Globe, Award, Users, Package } from "lucide-react";
import { PublicLayout } from "@/components/public-layout";

export default function AboutPage() {
  return (
    <PublicLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl font-bold text-foreground mb-4">About AsR Logistics</h1>
          <p className="text-lg text-muted-foreground">A premier international logistics tracking platform, purpose-built for businesses and individuals who demand full visibility into their global shipments.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 className="text-2xl font-bold text-foreground mb-4">Our Mission</h2>
            <p className="text-muted-foreground mb-4">AsR Logistics was founded on a simple belief: every shipment deserves to be tracked with precision, transparency, and care. We built a platform that gives shippers, receivers, and logistics teams the tools they need to stay informed at every step.</p>
            <p className="text-muted-foreground">From international freight to personal luggage, every package in our system gets a unique tracking identity, a real-time location feed, and a complete journey history — viewable by anyone with the tracking number.</p>
          </motion.div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Globe, label: "Global Network", value: "120+ Countries" },
              { icon: Package, label: "Shipments", value: "50,000+" },
              { icon: Users, label: "Clients", value: "2,500+" },
              { icon: Award, label: "On-time Rate", value: "99.8%" },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="bg-card border border-card-border rounded-xl p-5 text-center">
                <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <p className="text-2xl font-bold text-foreground">{value}</p>
                <p className="text-xs text-muted-foreground mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-secondary/40 rounded-2xl p-10 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Built for the Modern World</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">AsR Logistics combines enterprise-grade reliability with a clean, modern interface. Whether you are an individual tracking one bag or a business managing thousands of daily shipments, our platform scales to your needs.</p>
        </div>
      </div>
    </PublicLayout>
  );
}
