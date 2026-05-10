import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

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
    <main className="flex flex-col">
      {/* Hero section */}
      <section className="bg-white dark:bg-stone-900 py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-stone-800 dark:text-white">
            Fast. Reliable. Everywhere.
          </h1>
          <p className="mt-4 text-lg text-stone-600 dark:text-stone-300 max-w-2xl mx-auto">
            Track your packages in real time, manage deliveries, and stay
            informed with ASR Delivery's state‑of‑the‑art logistics platform.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-2"
          >
            <Input
              placeholder="Enter tracking number"
              value={tracking}
              onChange={(e) => setTracking(e.target.value)}
              className="w-full sm:w-auto"
            />
            <Button type="submit" className="whitespace-nowrap">
              Track
            </Button>
          </form>
        </div>
      </section>

      {/* Features / benefits section */}
      <section className="py-20 bg-stone-50 dark:bg-stone-800">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-semibold text-stone-800 dark:text-white text-center">
            Why ASR Delivery?
          </h2>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-12">
            <Card className="shadow-none bg-transparent">
              <CardTitle className="text-xl font-medium text-stone-800 dark:text-white">
                Real‑Time Tracking
              </CardTitle>
              <CardContent className="text-stone-600 dark:text-stone-300">
                Know exactly where your shipment is—updated every minute.
              </CardContent>
            </Card>
            <Card className="shadow-none bg-transparent">
              <CardTitle className="text-xl font-medium text-stone-800 dark:text-white">
                24/7 Support
              </CardTitle>
              <CardContent className="text-stone-600 dark:text-stone-300">
                Our team is available around the clock to help you out.
              </CardContent>
            </Card>
            <Card className="shadow-none bg-transparent">
              <CardTitle className="text-xl font-medium text-stone-800 dark:text-white">
                Fast &amp; Secure
              </CardTitle>
              <CardContent className="text-stone-600 dark:text-stone-300">
                We deliver on time and handle your parcels with care.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to action / footer-like section */}
      <section className="bg-white dark:bg-stone-900 py-16">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-semibold text-stone-800 dark:text-white">
            Ready to get started?
          </h3>
          <p className="mt-2 text-stone-600 dark:text-stone-300">
            Sign up for an account and start tracking your deliveries today.
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <Button variant="outline" onClick={() => navigate("/auth/sign-up")}>Sign
            up</Button>
            <Button onClick={() => navigate("/auth/sign-in")}>Log
            in</Button>
          </div>
        </div>
      </section>
    </main>
  );
}