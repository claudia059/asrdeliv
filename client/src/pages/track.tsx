import { useState, Suspense, lazy } from "react";
import { useParams, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Search, Package, ArrowLeft, MapPin, Clock, Weight, User, Receipt, Loader2 } from "lucide-react";
import { PublicLayout } from "@/components/public-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/status-badge";
import { useTrackShipment, getTrackShipmentQueryKey } from "@/lib/api-client-react/src";
import { formatDate, formatDateTime, STATUS_DOT_COLORS } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { downloadPdf } from "@/lib/download-pdf";

function TrackForm() {
  const [input, setInput] = useState("");
  const [, setLocation] = useLocation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) setLocation(`/track/${input.trim()}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-2xl mx-auto text-center">
        <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <Package className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-3">Track Your Shipment</h1>
        <p className="text-muted-foreground mb-8">Enter your tracking number to see real-time updates on your package's location and status.</p>
        <form onSubmit={handleSubmit} className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="e.g. ASRLOGS001"
              value={input}
              onChange={e => setInput(e.target.value)}
              className="pl-10 h-12"
              data-testid="input-tracking"
            />
          </div>
          <Button type="submit" size="lg" className="h-12" data-testid="button-track">
            Track
          </Button>
        </form>
        <p className="mt-4 text-xs text-muted-foreground">Demo: ASRLOGS001 · ASRLOGS002 · ASRLOGS004 · ASRLOGS005</p>
      </div>
    </div>
  );
}

function ReceiptButton({ shipmentId, trackingNumber }: { shipmentId: number; trackingNumber: string }) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      await downloadPdf(
        `/api/shipments/${shipmentId}/receipt/public`,
        `receipt-${trackingNumber}.pdf`
      );
    } catch {
      // Silently fail — the button disappears if unavailable
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button variant="outline" size="sm" onClick={handleDownload} disabled={loading}>
      {loading ? <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> : <Receipt className="h-4 w-4 mr-1.5" />}
      Download Receipt
    </Button>
  );
}

function TrackResult({ trackingNumber }: { trackingNumber: string }) {
  const [, setLocation] = useLocation();
  const { data: shipment, isLoading, error } = useTrackShipment(trackingNumber, {
    query: { enabled: !!trackingNumber, queryKey: getTrackShipmentQueryKey(trackingNumber) },
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="animate-pulse space-y-4 max-w-2xl mx-auto">
          <div className="h-8 bg-secondary rounded-lg w-3/4 mx-auto" />
          <div className="h-4 bg-secondary rounded w-1/2 mx-auto" />
          <div className="h-48 bg-secondary rounded-xl mt-8" />
        </div>
      </div>
    );
  }

  if (error || !shipment) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
            <Package className="h-8 w-8 text-destructive" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">Shipment Not Found</h2>
          <p className="text-muted-foreground mb-6">No shipment found with tracking number <strong>{trackingNumber}</strong>. Please check the number and try again.</p>
          <Button onClick={() => setLocation("/track")} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Try Another
          </Button>
        </div>
      </div>
    );
  }

  const hasMap = shipment.latitude != null && shipment.longitude != null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <button onClick={() => setLocation("/track")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Track another shipment
      </button>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        {/* Header card */}
        <div className="bg-card border border-card-border rounded-xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="font-mono text-sm font-bold text-muted-foreground">{shipment.trackingNumber}</span>
                <StatusBadge status={shipment.status} />
              </div>
              <h1 className="text-2xl font-bold text-foreground">{shipment.luggageType} Shipment</h1>
            </div>
            <div className="flex flex-col sm:items-end gap-3">
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Estimated Delivery</p>
                <p className="text-lg font-bold text-foreground">{formatDate(shipment.estimatedDelivery)}</p>
              </div>
              {/* <ReceiptButton shipmentId={(shipment as any).id} trackingNumber={shipment.trackingNumber} /> */}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-start gap-3">
              <User className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Sender</p>
                <p className="text-sm font-medium">{shipment.senderName}</p>
                <p className="text-xs text-muted-foreground">{shipment.origin}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <User className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Receiver</p>
                <p className="text-sm font-medium">{shipment.receiverName}</p>
                <p className="text-xs text-muted-foreground">{shipment.destination}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Current Location</p>
                <p className="text-sm font-medium">{shipment.currentLocation}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Weight className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Weight</p>
                <p className="text-sm font-medium">{shipment.weight ? `${shipment.weight} kg` : "N/A"}</p>
                <p className="text-xs text-muted-foreground">{shipment.luggageType}</p>
              </div>
            </div>
          </div>
        </div>

        <div className={cn("grid gap-6", hasMap ? "lg:grid-cols-2" : "")}>
          {/* Timeline */}
          <div className="bg-card border border-card-border rounded-xl p-6">
            <h2 className="font-semibold text-foreground mb-5 flex items-center gap-2">
              <Clock className="h-4 w-4" /> Tracking History
            </h2>
            {shipment.history.length === 0 ? (
              <p className="text-sm text-muted-foreground">No tracking history available yet.</p>
            ) : (
              <div className="space-y-0">
                {[...shipment.history].reverse().map((h, i) => {
                  const isFirst = i === 0;
                  const dotColor = STATUS_DOT_COLORS[h.status] ?? "bg-gray-400";
                  return (
                    <div key={h.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={cn("h-3 w-3 rounded-full mt-0.5 shrink-0 border-2 border-background", isFirst ? `${dotColor} shadow-sm` : "bg-muted-foreground/30")} />
                        {i < shipment.history.length - 1 && (
                          <div className="w-px flex-1 bg-border min-h-[24px] my-1" />
                        )}
                      </div>
                      <div className={cn("pb-5", i === shipment.history.length - 1 && "pb-0")}>
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className={cn("text-sm font-semibold", isFirst ? "text-foreground" : "text-muted-foreground")}>{h.status}</p>
                          {isFirst && <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded font-medium">Latest</span>}
                        </div>
                        <p className={cn("text-sm", isFirst ? "text-muted-foreground" : "text-muted-foreground/70")}>{h.description}</p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground/60">
                          <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{h.location}</span>
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{formatDateTime(h.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Map */}
          {hasMap && (
            <div className="bg-card border border-card-border rounded-xl p-6">
              <h2 className="font-semibold text-foreground mb-5 flex items-center gap-2">
                <MapPin className="h-4 w-4" /> Live Location
              </h2>
              <LazyMap
                latitude={shipment.latitude!}
                longitude={shipment.longitude!}
                location={shipment.currentLocation}
                status={shipment.status}
                updatedAt={shipment.updatedAt}
              />
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

const ShipmentMapLazy = lazy(() =>
  import("@/components/shipment-map").then(m => ({ default: m.ShipmentMap }))
);

function LazyMap({ latitude, longitude, location, status, updatedAt }: {
  latitude: number; longitude: number; location: string; status: string; updatedAt: string;
}) {
  return (
    <Suspense fallback={<div className="h-[320px] flex items-center justify-center text-sm text-muted-foreground">Loading map...</div>}>
      <ShipmentMapLazy latitude={latitude} longitude={longitude} location={location} status={status} updatedAt={updatedAt} />
    </Suspense>
  );
}

export default function TrackPage() {
  const params = useParams<{ trackingNumber?: string }>();

  return (
    <PublicLayout>
      {params.trackingNumber ? (
        <TrackResult trackingNumber={params.trackingNumber} />
      ) : (
        <TrackForm />
      )}
    </PublicLayout>
  );
}
