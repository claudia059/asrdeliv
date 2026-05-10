import { Link, useLocation } from "wouter";
import { Package, Menu, X, Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useGoogleTranslate } from "./useGoogleTranslate";
import LanguageSwitcher from "./LanguageSwitcher";

function ThemeToggle() {
  const [dark, setDark] = useState(() =>
    document.documentElement.classList.contains("dark")
  );
  const toggle = () => {
    const next = !dark;
    setDark(next);
    if (next) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };
  return (
    <button onClick={toggle} className="p-2 rounded-lg hover:bg-secondary transition-colors" aria-label="Toggle theme">
      {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}

export function PublicLayout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [location] = useLocation();
  useGoogleTranslate("en");

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/track", label: "Track" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Package className="h-4 w-4" />
              </div>
              <span>AsR Logistics</span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                    location === href
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  )}
                >
                  {label}
                </Link>
              ))}
              <ThemeToggle />
              {/* <Link href="/admin" className="ml-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
                Admin
              </Link> */}
              <LanguageSwitcher/>
            </nav>

            <div className="flex md:hidden items-center gap-2">
              <ThemeToggle />
              <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 rounded-lg hover:bg-secondary">
                {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t border-border px-4 py-3 space-y-1">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-2 rounded-lg text-sm font-medium hover:bg-secondary transition-colors"
              >
                {label}
              </Link>
            ))}
            {/* <Link href="/admin" onClick={() => setMenuOpen(false)} className="block px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground text-center">
              Admin
            </Link> */}
            <LanguageSwitcher/>
          </div>
        )}
      </header>

      <main>{children}</main>

      <footer className="border-t border-border mt-20 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 font-bold text-lg mb-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Package className="h-3.5 w-3.5" />
                </div>
                AsR Logistics
              </div>
              <p className="text-sm text-muted-foreground">Premium international freight and luggage tracking. Real-time visibility into your shipments, anywhere in the world.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-sm">Services</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>International Freight</li>
                <li>Luggage Tracking</li>
                <li>Express Delivery</li>
                <li>Customs Clearance</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-sm">Navigation</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {navLinks.map(({ href, label }) => (
                  <li key={href}>
                    <Link href={href} className="hover:text-foreground transition-colors">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-border pt-6 text-center text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} AsR Logistics. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
