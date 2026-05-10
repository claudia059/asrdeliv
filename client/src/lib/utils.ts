import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "N/A";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "numeric",
  });
}

export function formatDateTime(dateStr: string | null | undefined): string {
  if (!dateStr) return "N/A";
  return new Date(dateStr).toLocaleString("en-US", {
    year: "numeric", month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export const STATUS_COLORS: Record<string, string> = {
  "Pending": "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  "Order Confirmed": "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
  "Awaiting Pickup": "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
  "Picked Up": "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  "Processing": "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  "Packaging": "bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900/40 dark:text-fuchsia-300",
  "Label Created": "bg-teal-10０ text-teal-7００ dark:bg-teal-9００/4０ dark:text-teal-3００",
  "Dispatched": "bg-indigo-1００ text-indigo-7００ dark:bg-indigo-9００/4０ dark:text-indigo-3００",
  "In Transit": "bg-indigo-1００ text-indigo-7００ dark:bg-indigo-9００/4０ dark:text-indigo-3００",
  "At Sorting Facility": "bg-cyan-1００ text-cyan-7００ dark:bg-cyan-9００/4５ dark:text-cyan-3５５",
  "Arrived at Facility": "bg-cyan-1１１ text-cyan-7１１ dark:bg-cyan-9１１/4１１ dark:text-cyan-3１１",
  "Departed Facility": "bg-sky-1００ text-sky-7００ dark:bg-sky-9００/4０ dark:text-sky-3００",
  "Customs Clearance": "bg-orange-1００ text-orange-7００ dark:bg-orange-9００/4０ dark:text-orange-3００",
  "Held at Customs": "bg-amber-1５５ text-amber-7５５ dark:bg-amber-9５５/4５５ dark:text-amber-3５５",
  "Customs Released": "bg-orange-1１００ text-orange-7１１ dark:bg-orange-9１１/4１１ dark:text-orange-3１１",
  "Out for Delivery": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
  "Delivered": "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  "Delayed": "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  "Weather Delay": "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  "partially Delivered": "bg-lime-100 text-lime-700 dark:bg-lime-900/40 dark:text-lime-300",
  "Recipient Unavailable": "bg-stone-100 text-stone-700 dark:bg-stone-900/40 dark:text-stone-300",
  "Failed Delivery": "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
};

export const STATUS_DOT_COLORS: Record<string, string> = {
  "Pending": "bg-slate-400",
  "Order Confirmed": "bg-sky-500",
  "Awaiting Pickup": "bg-violet-400",
  "Picked Up": "bg-purple-500",
  "Processing": "bg-blue-500",
  "Packaging": "bg-fuchsia-500",
  "Label Created": "bg-teal-400",
  "Dispatched": "bg-indigo-400",
  "In Transit": "bg-indigo-500",
  "At Sorting Facility": "bg-cyan-400",
  "Arrived at Facility": "bg-cyan-500",
  "Departed Facility": "bg-sky-600",
  "Customs Clearance": "bg-orange-500",
  "Held at Customs": "bg-amber-600",
  "Customs Released": "bg-orange-400",
  "Out for Delivery": "bg-yellow-500",
  "Delivery Attempted": "bg-yellow-600",
  "Delivered": "bg-green-500",
  "Partially Delivered": "bg-lime-500",
  "Recipient Unavailable": "bg-stone-500",
  "Delayed": "bg-red-500",
  "Weather Delay": "bg-red-400",
  "Failed Delivery": "bg-rose-600",
  "Returned to Sender": "bg-pink-600",
  "Returned": "bg-pink-500",
  "Cancelled": "bg-gray-500",
  "Lost": "bg-black",
  "Damaged": "bg-red-700",
  "On Hold": "bg-zinc-500",
  "Awaiting Customer Action": "bg-amber-500",
};

export const SHIPMENT_STATUSES = [
  "Pending",
  "Order Confirmed",
  "Awaiting Pickup",
  "Picked Up",
  "Processing",
  "Packaging",
  "Label Created",
  "Dispatched",
  "In Transit",
  "At Sorting Facility",
  "Arrived at Facility",
  "Departed Facility",
  "Customs Clearance",
  "Held at Customs",
  "Customs Released",
  "Out for Delivery",
  "Delivery Attempted",
  "Delivered",
  "Partially Delivered",
  "Recipient Unavailable",
  "Delayed",
  "Weather Delay",
  "Failed Delivery",
  "Returned to Sender",
  "Returned",
  "Cancelled",
  "Lost",
  "Damaged",
  "On Hold",
  "Awaiting Customer Action",
];

export const LUGGAGE_TYPES = [
  "Package",
  "Luggage",
  "Freight",
  "Heavy Cargo",
  "Documents",
  "Parcel",
  "Envelope",
  "Box",
  "Crate",
  "Pallet",
  "Container",
  "Fragile Items",
  "Electronics",
  "Medical Supplies",
  "Perishable Goods",
  "Furniture",
  "Machinery",
  "Automobile Parts",
  "Industrial Equipment",
  "Bulk Cargo",
  "Oversized Cargo",
  "Hazardous Materials",
  "Temperature-Controlled Goods",
  "Personal Effects",
  "Retail Goods",
  "Textiles",
  "Food Products",
  "Construction Materials",
  "Live Animals",
  "Art & Antiques",
  "Jewelry & Valuables",
  "Sporting Equipment",
  "Musical Instruments",
  "Books & Printed Materials",
  "E-commerce Shipment",
];