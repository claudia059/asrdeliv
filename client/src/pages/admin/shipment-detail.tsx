import { useState, Suspense, lazy } from "react";
import { useParams, useLocation, Link } from "wouter";
import { ArrowLeft, Edit, Trash2, MapPin, Clock, Package, User, FileText, Receipt, Loader2, Plus, ChevronDown, ChevronUp } from "lucide-react";
import { AdminLayout } from "@/components/admin-layout";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetShipment, useDeleteShipment, useAddTrackingHistory, getGetShipmentQueryKey } from "@/lib/api-client-react/src";
import { formatDate, formatDateTime, STATUS_DOT_COLORS, SHIPMENT_STATUSES } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { downloadPdf } from "@/lib/download-pdf";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between py-2.5 border-b border-card-border last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground text-right max-w-[60%]">{value}</span>
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

const EMPTY_UPDATE = { status: "", location: "", description: "", latitude: "", longitude: "" };

function AddUpdatePanel({ shipmentId, currentStatus }: { shipmentId: number; currentStatus: string }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const mutation = useAddTrackingHistory();
  const [open, setOpen] = useState(false);
  const [showCoords, setShowCoords] = useState(false);
  const [form, setForm] = useState({ ...EMPTY_UPDATE, status: currentStatus });

  const set = (k: keyof typeof EMPTY_UPDATE) => (v: string) =>
    setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.status || !form.location.trim() || !form.description.trim()) return;

    mutation.mutate(
      {
        id: shipmentId,
        data: {
          status: form.status,
          location: form.location.trim(),
          description: form.description.trim(),
          latitude: form.latitude ? Number(form.latitude) : null,
          longitude: form.longitude ? Number(form.longitude) : null,
        },
      },
      {
        onSuccess: () => {
          toast({ title: "Tracking update added", description: `Status set to "${form.status}" — receiver notified by email.` });
          queryClient.invalidateQueries({ queryKey: getGetShipmentQueryKey(shipmentId) });
          setForm({ ...EMPTY_UPDATE, status: form.status });
          setOpen(false);
        },
        onError: () => toast({ title: "Failed to add update", variant: "destructive" }),
      }
    );
  };

  return (
    <div className="bg-card border border-card-border rounded-xl overflow-hidden">
      {/* Header — always visible */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-secondary/50 transition-colors"
      >
        <span className="font-semibold text-foreground flex items-center gap-2 text-sm">
          <Plus className="h-4 w-4 text-primary" /> Add Tracking Update
        </span>
        {open
          ? <ChevronUp className="h-4 w-4 text-muted-foreground" />
          : <ChevronDown className="h-4 w-4 text-muted-foreground" />
        }
      </button>

      {/* Expandable form */}
      {open && (
        <form onSubmit={handleSubmit} className="px-5 pb-5 space-y-3 border-t border-card-border pt-4">
          {/* Status */}
          <div className="space-y-1.5">
            <Label className="text-xs">New Status <span className="text-destructive">*</span></Label>
            <Select value={form.status} onValueChange={set("status")}>
              <SelectTrigger className="h-9 text-sm">
                <SelectValue placeholder="Select status…" />
              </SelectTrigger>
              <SelectContent>
                {SHIPMENT_STATUSES.map(s => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Location */}
          <div className="space-y-1.5">
            <Label className="text-xs">Location <span className="text-destructive">*</span></Label>
            <Input
              className="h-9 text-sm"
              placeholder="e.g. Dubai International Airport Hub"
              value={form.location}
              onChange={e => set("location")(e.target.value)}
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label className="text-xs">Description <span className="text-destructive">*</span></Label>
            <Textarea
              className="text-sm resize-none"
              rows={2}
              placeholder="e.g. Package cleared customs and en route to final destination"
              value={form.description}
              onChange={e => set("description")(e.target.value)}
            />
          </div>

          {/* Optional coordinates */}
          <button
            type="button"
            onClick={() => setShowCoords(c => !c)}
            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
          >
            {showCoords ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            {showCoords ? "Hide" : "Add"} GPS coordinates (optional)
          </button>

          {showCoords && (
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <Label className="text-xs">Latitude</Label>
                <Input
                  className="h-9 text-sm"
                  placeholder="e.g. 25.2532"
                  type="number"
                  step="any"
                  value={form.latitude}
                  onChange={e => set("latitude")(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Longitude</Label>
                <Input
                  className="h-9 text-sm"
                  placeholder="e.g. 55.3657"
                  type="number"
                  step="any"
                  value={form.longitude}
                  onChange={e => set("longitude")(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-1">
            <Button
              type="submit"
              size="sm"
              className="flex-1"
              disabled={mutation.isPending || !form.status || !form.location.trim() || !form.description.trim()}
            >
              {mutation.isPending ? <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> : <Plus className="h-4 w-4 mr-1.5" />}
              Push Update
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => { setOpen(false); setForm({ ...EMPTY_UPDATE, status: currentStatus }); }}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}

export default function ShipmentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [showMap, setShowMap] = useState(false);
  const [downloading, setDownloading] = useState<"receipt" | "invoice" | null>(null);

  const { data: shipment, isLoading, error } = useGetShipment(Number(id), {
    query: { enabled: !!id },
  });

  const deleteMutation = useDeleteShipment();

  const handleDelete = () => {
    deleteMutation.mutate({ id: Number(id) }, {
      onSuccess: () => {
        toast({ title: "Shipment deleted", description: `${shipment?.trackingNumber} removed.` });
        setLocation("/admin/shipments");
      },
      onError: () => toast({ title: "Delete failed", variant: "destructive" }),
    });
  };

  const handleDownload = async (type: "receipt" | "invoice") => {
    if (!shipment) return;
    setDownloading(type);
    try {
      await downloadPdf(
        `/api/shipments/${id}/${type}`,
        `${type}-${shipment.trackingNumber}.pdf`
      );
    } catch {
      toast({ title: `Failed to download ${type}`, variant: "destructive" });
    } finally {
      setDownloading(null);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="space-y-4 animate-pulse">
          <div className="h-8 bg-secondary rounded w-64" />
          <div className="h-48 bg-secondary rounded-xl" />
          <div className="h-64 bg-secondary rounded-xl" />
        </div>
      </AdminLayout>
    );
  }

  if (error || !shipment) {
    return (
      <AdminLayout>
        <div className="text-center py-16">
          <p className="text-muted-foreground mb-4">Shipment not found.</p>
          <Button variant="outline" onClick={() => setLocation("/admin/shipments")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Shipments
          </Button>
        </div>
      </AdminLayout>
    );
  }

  const hasMap = shipment.latitude != null && shipment.longitude != null;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/admin/shipments" className="hover:text-foreground transition-colors">Shipments</Link>
          <span>/</span>
          <span className="font-mono font-semibold text-foreground">{shipment.trackingNumber}</span>
        </div>

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-foreground font-mono">{shipment.trackingNumber}</h1>
              <StatusBadge status={shipment.status} />
            </div>
            <p className="text-muted-foreground text-sm">{shipment?.luggageType} · {shipment?.origin} → {shipment?.destination}</p>
          </div>
          <div className="flex gap-2 shrink-0 flex-wrap">
            <Button
              variant="outline" size="sm"
              onClick={() => handleDownload("receipt")}
              disabled={downloading === "receipt"}
            >
              {downloading === "receipt" ? <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> : <Receipt className="h-4 w-4 mr-1.5" />}
              Receipt
            </Button>
            <Button
              variant="outline" size="sm"
              onClick={() => handleDownload("invoice")}
              disabled={downloading === "invoice"}
            >
              {downloading === "invoice" ? <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> : <FileText className="h-4 w-4 mr-1.5" />}
              Invoice
            </Button>
            <Link href={`/admin/shipments/${id}/edit`}>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-1.5" /> Edit
              </Button>
            </Link>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="text-destructive border-destructive/30 hover:bg-destructive/10">
                  <Trash2 className="h-4 w-4 mr-1.5" /> Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Shipment?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete shipment <strong>{shipment.trackingNumber}</strong> and all its tracking history. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card border border-card-border rounded-xl p-6">
              <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2"><Package className="h-4 w-4" /> Shipment Details</h2>
              <DetailRow label="Tracking Number" value={<span className="font-mono">{shipment.trackingNumber}</span>} />
              <DetailRow label="Status" value={<StatusBadge status={shipment.status} />} />
              <DetailRow label="Type" value={shipment?.luggageType} />
              <DetailRow label="Weight" value={shipment?.weight ? `${shipment.weight} kg` : "N/A"} />
              <DetailRow label="Origin" value={shipment?.origin} />
              <DetailRow label="Destination" value={shipment?.destination} />
              <DetailRow label="Current Location" value={shipment?.currentLocation} />
              <DetailRow label="Est. Delivery" value={formatDate(shipment?.estimatedDelivery)} />
              <DetailRow label="Created" value={formatDateTime(shipment?.createdAt)} />
              {shipment?.description && <DetailRow label="Description" value={shipment?.description} />}
            </div>

            <div className="bg-card border border-card-border rounded-xl p-6">
              <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2"><User className="h-4 w-4" /> Parties</h2>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide font-semibold">Sender</p>
                  <DetailRow label="Name" value={shipment?.senderName} />
                  <DetailRow label="Phone" value={shipment?.senderPhone ?? "N/A"} />
                  <DetailRow label="Email" value={shipment?.senderEmail ?? "N/A"} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide font-semibold">Receiver</p>
                  <DetailRow label="Name" value={shipment?.receiverName} />
                  <DetailRow label="Phone" value={shipment?.receiverPhone ?? "N/A"} />
                  <DetailRow label="Email" value={shipment?.receiverEmail ?? "N/A"} />
                </div>
              </div>
            </div>

            {/* Map */}
            {hasMap && (
              <div className="bg-card border border-card-border rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-foreground flex items-center gap-2"><MapPin className="h-4 w-4" /> Live Location</h2>
                  {!showMap && (
                    <Button variant="outline" size="sm" onClick={() => setShowMap(true)}>Load Map</Button>
                  )}
                </div>
                {showMap && (
                  <LazyMap
                    latitude={shipment.latitude!}
                    longitude={shipment.longitude!}
                    location={shipment.currentLocation}
                    status={shipment.status}
                    updatedAt={shipment.updatedAt}
                  />
                )}
              </div>
            )}
          </div>

          {/* Right column: Add Update + History */}
          <div className="space-y-4">
            {/* Add Tracking Update panel */}
            <AddUpdatePanel shipmentId={Number(id)} currentStatus={shipment.status} />

            {/* History timeline */}
            <div className="bg-card border border-card-border rounded-xl p-6">
              <h2 className="font-semibold text-foreground mb-5 flex items-center gap-2"><Clock className="h-4 w-4" /> History</h2>
              {shipment.history.length === 0 ? (
                <p className="text-sm text-muted-foreground">No history yet.</p>
              ) : (
                <div>
                  {[...shipment.history].reverse().map((h, i) => {
                    const isFirst = i === 0;
                    const dotColor = STATUS_DOT_COLORS[h.status] ?? "bg-gray-400";
                    return (
                      <div key={h.id} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className={cn("h-2.5 w-2.5 rounded-full mt-1 shrink-0", isFirst ? dotColor : "bg-border")} />
                          {i < shipment.history.length - 1 && <div className="w-px flex-1 bg-border my-1 min-h-[20px]" />}
                        </div>
                        <div className={cn("pb-4", i === shipment.history.length - 1 && "pb-0")}>
                          <p className={cn("text-xs font-semibold", isFirst ? "text-foreground" : "text-muted-foreground")}>{h.status}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{h.description}</p>
                          <p className="text-[10px] text-muted-foreground/60 mt-1">{h.location} · {formatDateTime(h.createdAt)}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
