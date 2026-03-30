import {NavLink, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  User, 
  Table, 
  Bell,
  X,
  HomeIcon,
  User2Icon
} from "lucide-react";
import { Button } from "@/components/ui/button";

const goto = () => {
  window.location.href='/';
}

const navItems = [
  {
    title: "Dashboard",
    href: "/admin/",
    icon: LayoutDashboard,
  },
  {
    title: "Shippments",
    href: "/admin/shippments",
    icon: Table,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: User,
  },
  {
    title: "Notifications",
    href: "/admin/notifications",
    icon: Bell,
  },
  {
    title: "Admin",
    href: "/admin/profile",
    icon: User2Icon,
  },
];

export function Sidebar({ onClose }: { onClose?: () => void }) {

  return (
    <aside className="w-60 bg-white lg:bg-transparent flex flex-col relative z-10 h-full border-r border-stone-200 lg:border-0">
      {/* Brand Header */}
      <div className="p-6 pb-0 relative z-10 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-stone-900">
          Admin Portal
        </h1>
        {/* Close button for mobile */}
        {onClose && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="lg:hidden p-1 text-stone-600 hover:text-stone-900 hover:bg-stone-100"
          >
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 relative z-10">
        {navItems.map((item) => {
          const Icon = item.icon;
          
          return (
            <NavLink key={item.href} to={item.href}>
              <div
                className={
                  "flex items-center text-sm font-normal rounded-lg cursor-pointer px-3 py-2 text-stone-700 hover:bg-stone-100 transition-colors duration-200 border border-transparent"
                }
              >
                <Icon className="mr-3 w-4 h-4" />
                {item.title}
              </div>
            </NavLink>
          );
        })}

        {/* Documentation Link */}
        <div className="mt-auto pt-4 border-t border-stone-200">
          <button onClick={goto}>
            <div className="flex items-center text-sm font-normal rounded-lg cursor-pointer px-3 py-2 text-stone-700 hover:bg-stone-100 transition-colors duration-200">
              <HomeIcon className="mr-3 w-4 h-4" />
              go website
            </div>
          </button>
        </div>
      </nav>

    </aside>
  );
}
