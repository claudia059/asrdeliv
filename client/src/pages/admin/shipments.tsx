import { useState, useRef } from "react";
import { Link } from "wouter";
import { Search, Plus, ChevronLeft, ChevronRight, Download, Filter } from "lucide-react";
import { AdminLayout } from "@/components/admin-layout";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useListShipments } from "@/lib/api-client-react/src";
import { formatDate, SHIPMENT_STATUSES } from "@/lib/utils";

const PAGE_SIZE = 10;

export default function AdminShipmentsPage() {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null!);

  const handleSearchChange = (val: string) => {
    setSearch(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(val);
      setPage(0);
    }, 400);
  };

  const { data, isLoading } = useListShipments({
    limit: PAGE_SIZE,
    offset: page * PAGE_SIZE,
    ...(debouncedSearch ? { search: debouncedSearch } : {}),
    ...(statusFilter && statusFilter !== "all" ? { status: statusFilter } : {}),
  });

  const shipments = data?.shipments ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">All Shipments</h1>
            <p className="text-sm text-muted-foreground mt-0.5">{total} total shipments</p>
          </div>
          <div className="flex gap-2">
            <a
              href="/api/shipments/export/csv"
              download
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-secondary transition-colors"
            >
              <Download className="h-4 w-4" /> CSV
            </a>
            <Link href="/admin/shipments/new">
              <Button><Plus className="h-4 w-4 mr-1.5" /> New Shipment</Button>
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tracking #, sender, receiver..."
              value={search}
              onChange={e => handleSearchChange(e.target.value)}
              className="pl-10"
              data-testid="input-search"
            />
          </div>
          <Select value={statusFilter} onValueChange={v => { setStatusFilter(v); setPage(0); }}>
            <SelectTrigger className="w-[200px]" data-testid="select-status-filter">
              <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {SHIPMENT_STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="bg-card border border-card-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-card-border bg-secondary/30">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Tracking #</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Sender</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Receiver</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Origin → Dest</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Est. Delivery</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading && Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="border-b border-card-border animate-pulse">
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j} className="px-5 py-3.5">
                        <div className="h-4 bg-secondary rounded w-24" />
                      </td>
                    ))}
                  </tr>
                ))}
                {!isLoading && shipments.map(s => (
                  <tr key={s.id} className="border-b border-card-border last:border-0 hover:bg-secondary/30 transition-colors">
                    <td className="px-5 py-3.5">
                      <Link href={`/admin/shipments/${s.id}`} className="font-mono font-semibold text-primary hover:underline">
                        {s.trackingNumber}
                      </Link>
                    </td>
                    <td className="px-5 py-3.5 text-foreground">{s.senderName}</td>
                    <td className="px-5 py-3.5 text-foreground">{s.receiverName}</td>
                    <td className="px-5 py-3.5 text-muted-foreground text-xs">{s.origin} → {s.destination}</td>
                    <td className="px-5 py-3.5"><StatusBadge status={s.status} /></td>
                    <td className="px-5 py-3.5 text-muted-foreground">{formatDate(s.estimatedDelivery)}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex gap-2">
                        <Link href={`/admin/shipments/${s.id}`} className="text-xs px-2.5 py-1 rounded border border-border hover:bg-secondary transition-colors">View</Link>
                        <Link href={`/admin/shipments/${s.id}/edit`} className="text-xs px-2.5 py-1 rounded border border-border hover:bg-secondary transition-colors">Edit</Link>
                      </div>
                    </td>
                  </tr>
                ))}
                {!isLoading && shipments.length === 0 && (
                  <tr><td colSpan={7} className="px-5 py-12 text-center text-muted-foreground">No shipments found</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-card-border">
              <p className="text-sm text-muted-foreground">
                Showing {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, total)} of {total}
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
