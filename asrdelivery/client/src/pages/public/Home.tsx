import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
// import WorldMapSection from "./WorldMapSection"; // currently unused
// import LogisticsCommandCenter from "./LogisticsCommandCenter"; // not currently used

// `url` is a CSS function and not a JS import. we construct it as a string below.

export default function Home() {
  const [tracking, setTracking] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tracking.trim() === "") {
      alert("Please enter your package tracking number");
      return;
    }
    if (tracking.trim()) {
      // redirect to a tracking result page (implement later)
      navigate(`/track/${tracking.trim()}`);
    }
  };

  return (
  <main className="flex flex-col bg-white dark:bg-stone-950">

    {/* HERO SECTION */}
    <section className="relative overflow-hidden bg-gradient-to-br from-stone-900 via-stone-800 to-black text-white py-28">
      <div

        className="absolute"
      />
      
      <div className="relative container mx-auto px-6 text-center max-w-4xl">
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
          Fast. Reliable. <span className="text-blue-400">Delivered.</span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-stone-300 max-w-2xl mx-auto">
          Track shipments in real time, manage deliveries effortlessly, and
          stay informed with ASR Delivery’s next-generation logistics platform.
        </p>

        {/* Tracking Card */}
        <form
          onSubmit={handleSubmit}
          className="mt-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row gap-3 justify-center"
        >
          <Input
            placeholder="Enter tracking number"
            value={tracking}
            onChange={(e) => setTracking(e.target.value)}
            className="bg-white text-black"
          />
          <Button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6"
          >
            Track Shipment
          </Button>
        </form>
      </div>
    </section>

    {/* <WorldMapSection /> */}
    {/* <LogisticsCommandCenter /> */}

    {/* FEATURES */}
    <section className="py-24 bg-stone-50 dark:bg-stone-900">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 dark:text-white">
            Why Choose ASR Delivery?
          </h2>
          <p className="mt-4 text-stone-600 dark:text-stone-400">
            Designed for speed, reliability, and total transparency.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <Card className="p-8 rounded-2xl border bg-white dark:bg-stone-800 shadow-sm hover:shadow-lg transition">
            <CardTitle className="text-lg font-semibold">
              🚚 Real-Time Tracking
            </CardTitle>
            <CardContent className="mt-3 text-stone-600 dark:text-stone-400">
              Live shipment updates with minute-by-minute precision.
            </CardContent>
          </Card>

          <Card className="p-8 rounded-2xl border bg-white dark:bg-stone-800 shadow-sm hover:shadow-lg transition">
            <CardTitle className="text-lg font-semibold">
              🕒 24/7 Dedicated Support
            </CardTitle>
            <CardContent className="mt-3 text-stone-600 dark:text-stone-400">
              Our logistics experts are available around the clock.
            </CardContent>
          </Card>

          <Card className="p-8 rounded-2xl border bg-white dark:bg-stone-800 shadow-sm hover:shadow-lg transition">
            <CardTitle className="text-lg font-semibold">
              🔒 Fast & Secure
            </CardTitle>
            <CardContent className="mt-3 text-stone-600 dark:text-stone-400">
              On-time delivery with industry-leading parcel protection.
            </CardContent>
          </Card>

        </div>
      </div>
    </section>

    {/* CTA SECTION */}
    <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
      <div className="container mx-auto px-6 text-center max-w-3xl">
        <h3 className="text-3xl font-bold">
          Ready to streamline your deliveries?
        </h3>
        <p className="mt-4 text-blue-100">
          Create an account and start tracking shipments with confidence.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <Button
            variant="secondary"
            className="bg-white text-blue-600 hover:bg-gray-100 font-semibold"
            onClick={() => navigate("/auth/sign-up")}
          >
            Create Account
          </Button>
          <Button
            className="bg-black/30 hover:bg-black/40 border border-white/40"
            onClick={() => navigate("/login")}
          >
            Log In
          </Button>
        </div>
      </div>
    </section>

  </main>
);
}