import { motion } from "framer-motion";
import { Package, Truck, CheckCircle, AlertTriangle, TrendingUp, Clock, Download } from "lucide-react";
import { AdminLayout } from "@/components/admin-layout";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { useGetDashboardStats, useListShipments } from "@/lib/api-client-react/src";
import { formatDate } from "@/lib/utils";
import { Link } from "wouter";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";

const CHART_COLORS = ["#3b82f6", "#f59e0b", "#10b981", "#8b5cf6", "#ef4444", "#06b6d4", "#ec4899", "#84cc16", "#f97316"];

function StatCard({ icon: Icon, label, value, color }: {
  icon: typeof Package; label: string; value: string | number; color: string;
}) {
  return (
    <div className="bg-card border border-card-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">{label}</p>
        <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
    </div>
  );
}

export default function AdminDashboardPage() {
  const { data: stats, isLoading: statsLoading } = useGetDashboardStats();
  const { data: shipmentsData } = useListShipments({ limit: 5, offset: 0 });

  const statusData = stats?.byStatus?.map(s => ({ name: s.status, value: parseInt(s.count as any) })) ?? [];

  const trendData = stats?.recentTrend?.map(d => ({
    date: new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    count: parseInt(d.count as any),
  })) ?? [];

  if (statsLoading) {
    return (
      <AdminLayout>
        <div className="space-y-6 animate-pulse">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-28 bg-secondary rounded-xl" />
            ))}
          </div>
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="h-64 bg-secondary rounded-xl" />
            <div className="h-64 bg-secondary rounded-xl" />
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Overview of all shipment activity</p>
          </div>
          <div className="flex gap-2">
            <a
              href="/api/shipments/export/csv"
              download
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-secondary transition-colors"
            >
              <Download className="h-4 w-4" /> Export CSV
            </a>
            <Link href="/admin/shipments/new">
              <Button>+ New Shipment</Button>
            </Link>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
            <StatCard icon={Package} label="Total Shipments" value={stats?.totalShipments ?? 0} color="bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300" />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
            <StatCard icon={Truck} label="In Transit" value={stats?.inTransit ?? 0} color="bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-300" />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <StatCard icon={CheckCircle} label="Delivered" value={stats?.delivered ?? 0} color="bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-300" />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <StatCard icon={AlertTriangle} label="Delayed" value={stats?.delayed ?? 0} color="bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-300" />
          </motion.div>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-card border border-card-border rounded-xl p-6">
            <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" /> Shipments Created (Last 7 Days)
            </h2>
            {trendData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={trendData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                  <Tooltip contentStyle={{ fontSize: 12 }} />
                  <Area type="monotone" dataKey="count" stroke="#3b82f6" fill="url(#grad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-sm text-muted-foreground">No trend data available</div>
            )}
          </div>

          <div className="bg-card border border-card-border rounded-xl p-6">
            <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Clock className="h-4 w-4" /> Status Distribution
            </h2>
            {statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={statusData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" nameKey="name" paddingAngle={2}>
                    {statusData.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: 12 }} />
                  <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-sm text-muted-foreground">No data available</div>
            )}
          </div>
        </div>

        {/* Recent shipments table */}
        <div className="bg-card border border-card-border rounded-xl">
          <div className="flex items-center justify-between px-6 py-4 border-b border-card-border">
            <h2 className="font-semibold text-foreground">Recent Shipments</h2>
            <Link href="/admin/shipments" className="text-sm text-primary hover:underline">View all →</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-card-border">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Tracking #</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Sender → Receiver</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Est. Delivery</th>
                </tr>
              </thead>
              <tbody>
                {(shipmentsData?.shipments ?? []).map(s => (
                  <tr key={s.id} className="border-b border-card-border last:border-0 hover:bg-secondary/40 transition-colors">
                    <td className="px-6 py-3">
                      <Link href={`/admin/shipments/${s.id}`} className="font-mono font-semibold text-primary hover:underline">
                        {s.trackingNumber}
                      </Link>
                    </td>
                    <td className="px-6 py-3 text-muted-foreground">{s.senderName} → {s.receiverName}</td>
                    <td className="px-6 py-3"><StatusBadge status={s.status} /></td>
                    <td className="px-6 py-3 text-muted-foreground">{formatDate(s.estimatedDelivery)}</td>
                  </tr>
                ))}
                {(shipmentsData?.shipments ?? []).length === 0 && (
                  <tr><td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">No shipments found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
