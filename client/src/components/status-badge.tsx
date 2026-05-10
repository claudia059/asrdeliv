import { cn, STATUS_COLORS, STATUS_DOT_COLORS } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const colorClass = STATUS_COLORS[status] ?? "bg-gray-100 text-gray-700";
  const dotClass = STATUS_DOT_COLORS[status] ?? "bg-gray-400";

  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium", colorClass, className)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", dotClass)} />
      {status}
    </span>
  );
}
