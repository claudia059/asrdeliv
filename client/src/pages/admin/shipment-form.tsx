import { useState, useEffect } from "react";
import { useParams, useLocation, Link } from "wouter";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { AdminLayout } from "@/components/admin-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  useCreateShipment, useUpdateShipment, useGetShipment,
} from "@/lib/api-client-react/src";
import { useToast } from "@/hooks/use-toast";
import { SHIPMENT_STATUSES, LUGGAGE_TYPES } from "@/lib/utils";

interface FormData {
  trackingNumber: string;
  senderName: string;
  senderAddress: string;
  senderPhone: string;
  senderEmail: string;
  receiverName: string;
  receiverPhone: string;
  receiverEmail: string;
  receiverAddress: string;
  origin: string;
  destination: string;
  currentLocation: string;
  status: string;
  luggageType: string;
  weight: string;
  estimatedDelivery: string;
  description: string;
  latitude: string;
  longitude: string;
}

const defaultForm: FormData = {
  trackingNumber: "", senderName: "", senderAddress: "", senderPhone: "", senderEmail: "",
  receiverName: "", receiverPhone: "", receiverEmail: "", receiverAddress: "",
  origin: "", destination: "", currentLocation: "",
  status: "Pending", luggageType: "Package", weight: "", estimatedDelivery: "",
  description: "", latitude: "", longitude: "",
};

function Field({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}{required && <span className="text-destructive ml-0.5">*</span>}</Label>
      {children}
    </div>
  );
}

export default function ShipmentFormPage({ isEdit = false }: { isEdit?: boolean }) {
  const { id } = useParams<{ id?: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [form, setForm] = useState<FormData>(defaultForm);

  const { data: existing } = useGetShipment(Number(id), {
    query: { enabled: isEdit && !!id && !isNaN(Number(id)) },
  });

  useEffect(() => {
    if (existing && isEdit) {
      setForm({
        trackingNumber: existing.trackingNumber ?? "",
        senderName: existing.senderName ?? "",
        senderAddress: existing.senderAddress ?? "",
        senderPhone: existing.senderPhone ?? "",
        senderEmail: existing.senderEmail ?? "",
        receiverName: existing.receiverName ?? "",
        receiverPhone: existing.receiverPhone ?? "",
        receiverEmail: existing.receiverEmail ?? "",
        receiverAddress: existing.receiverAddress ?? "",
        origin: existing.origin ?? "",
        destination: existing.destination ?? "",
        currentLocation: existing.currentLocation ?? "",
        status: existing.status ?? "Pending",
        luggageType: existing.luggageType ?? "Package",
        weight: existing.weight?.toString() ?? "",
        estimatedDelivery: existing.estimatedDelivery ? existing.estimatedDelivery.split("T")[0] : "",
        description: existing.description ?? "",
        latitude: existing.latitude?.toString() ?? "",
        longitude: existing.longitude?.toString() ?? "",
      });
    }
  }, [existing, isEdit]);

  const createMutation = useCreateShipment();
  const updateMutation = useUpdateShipment();

  const set = (key: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [key]: e.target.value }));

  const setSelect = (key: keyof FormData) => (val: string) =>
    setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      trackingNumber: form.trackingNumber,
      senderName: form.senderName,
      senderAddress: form.senderAddress,
      senderPhone: form.senderPhone || undefined,
      senderEmail: form.senderEmail || undefined,
      receiverName: form.receiverName,
      receiverAddress: form.receiverAddress,
      receiverPhone: form.receiverPhone || undefined,
      receiverEmail: form.receiverEmail || undefined,
      origin: form.origin,
      destination: form.destination,
      currentLocation: form.currentLocation,
      status: form.status,
      luggageType: form.luggageType,
      weight: form.weight ? parseFloat(form.weight) : undefined,
      estimatedDelivery: form.estimatedDelivery || undefined,
      description: form.description || undefined,
      latitude: form.latitude ? parseFloat(form.latitude) : undefined,
      longitude: form.longitude ? parseFloat(form.longitude) : undefined,
    };

    if (isEdit && id) {
      updateMutation.mutate(
        { id: Number(id), data: payload },
        {
          onSuccess: (s) => {
            toast({ title: "Shipment updated", description: s.trackingNumber });
            setLocation(`/admin/shipments/${id}`);
          },
          onError: () => toast({ title: "Update failed", variant: "destructive" }),
        }
      );
    } else {
      createMutation.mutate(
        { data: payload },
        {
          onSuccess: (s) => {
            toast({ title: "Shipment created", description: s.trackingNumber });
            setLocation(`/admin/shipments/${s.id}`);
          },
          onError: () => toast({ title: "Create failed", variant: "destructive" }),
        }
      );
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <AdminLayout>
      <div className="max-w-4xl space-y-6">
        <div className="flex items-center gap-3">
          <Link href={isEdit ? `/admin/shipments/${id}` : "/admin/shipments"} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold text-foreground">
            {isEdit ? `Edit ${existing?.trackingNumber ?? "Shipment"}` : "New Shipment"}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Core */}
          <div className="bg-card border border-card-border rounded-xl p-6 space-y-4">
            <h2 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Shipment Info</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Tracking Number" required>
                <Input value={form.trackingNumber} onChange={set("trackingNumber")} placeholder="ASRLOGS009" required disabled={isEdit} data-testid="input-tracking-number" />
              </Field>
              <Field label="Luggage Type" required>
                <Select value={form.luggageType} onValueChange={setSelect("luggageType")}>
                  <SelectTrigger data-testid="select-luggage-type"><SelectValue /></SelectTrigger>
                  <SelectContent>{LUGGAGE_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </Field>
              <Field label="Status" required>
                <Select value={form.status} onValueChange={setSelect("status")}>
                  <SelectTrigger data-testid="select-status"><SelectValue /></SelectTrigger>
                  <SelectContent>{SHIPMENT_STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </Field>
              <Field label="Weight (kg)">
                <Input type="number" step="0.01" value={form.weight} onChange={set("weight")} placeholder="5.0" data-testid="input-weight" />
              </Field>
              <Field label="Est. Delivery Date">
                <Input type="date" value={form.estimatedDelivery} onChange={set("estimatedDelivery")} data-testid="input-est-delivery" />
              </Field>
            </div>
            <Field label="Description">
              <Textarea value={form.description} onChange={set("description")} placeholder="Fragile electronics, handle with care..." rows={2} data-testid="textarea-description" />
            </Field>
          </div>

          {/* Sender */}
          <div className="bg-card border border-card-border rounded-xl p-6 space-y-4">
            <h2 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Sender</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Sender Name" required>
                <Input value={form.senderName} onChange={set("senderName")} placeholder="John Smith" required data-testid="input-sender-name" />
              </Field>
              <Field label="Sender Address" required>
                <Input value={form.senderAddress} onChange={set("senderAddress")} placeholder="123 Main St" required data-testid="input-sender-address" />
              </Field>
              <Field label="Sender Phone">
                <Input value={form.senderPhone} onChange={set("senderPhone")} placeholder="+1 555 0100" data-testid="input-sender-phone" />
              </Field>
              <Field label="Sender Email">
                <Input type="email" value={form.senderEmail} onChange={set("senderEmail")} placeholder="john@example.com" data-testid="input-sender-email" />
              </Field>
              <Field label="Origin" required>
                <Input value={form.origin} onChange={set("origin")} placeholder="New York, USA" required data-testid="input-origin" />
              </Field>
            </div>
          </div>

          {/* Receiver */}
          <div className="bg-card border border-card-border rounded-xl p-6 space-y-4">
            <h2 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Receiver</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Receiver Name" required>
                <Input value={form.receiverName} onChange={set("receiverName")} placeholder="Jane Doe" required data-testid="input-receiver-name" />
              </Field>
              <Field label="Receiver Phone">
                <Input value={form.receiverPhone} onChange={set("receiverPhone")} placeholder="+44 20 7900 0000" data-testid="input-receiver-phone" />
              </Field>
              <Field label="Receiver Email">
                <Input type="email" value={form.receiverEmail} onChange={set("receiverEmail")} placeholder="jane@example.com" data-testid="input-receiver-email" />
              </Field>
              <Field label="Receiver Address" required>
                <Input value={form.receiverAddress} onChange={set("receiverAddress")} placeholder="221B Baker Street" required data-testid="input-receiver-address" />
              </Field>
              <Field label="Destination" required>
                <Input value={form.destination} onChange={set("destination")} placeholder="London, UK" required data-testid="input-destination" />
              </Field>
            </div>
          </div>

          {/* Location */}
          <div className="bg-card border border-card-border rounded-xl p-6 space-y-4">
            <h2 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Current Location</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              <Field label="Location Name" required>
                <Input value={form.currentLocation} onChange={set("currentLocation")} placeholder="Dubai, UAE" required data-testid="input-current-location" />
              </Field>
              <Field label="Latitude">
                <Input type="number" step="any" value={form.latitude} onChange={set("latitude")} placeholder="25.2048" data-testid="input-latitude" />
              </Field>
              <Field label="Longitude">
                <Input type="number" step="any" value={form.longitude} onChange={set("longitude")} placeholder="55.2708" data-testid="input-longitude" />
              </Field>
            </div>
          </div>

          <div className="flex gap-3">
            <Button type="submit" disabled={isPending} data-testid="button-submit">
              {isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</> : <><Save className="mr-2 h-4 w-4" />{isEdit ? "Save Changes" : "Create Shipment"}</>}
            </Button>
            <Link href={isEdit ? `/admin/shipments/${id}` : "/admin/shipments"}>
              <Button type="button" variant="outline">Cancel</Button>
            </Link>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
