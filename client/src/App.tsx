import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/auth";
import { AuthGuard } from "@/components/auth-guard";
import { setAuthTokenGetter } from "@/lib/api-client-react/src";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home";
import TrackPage from "@/pages/track";
import AboutPage from "@/pages/about";
import ContactPage from "@/pages/contact";
import AdminLoginPage from "@/pages/login";
import AdminDashboardPage from "@/pages/admin/dashboard";
import AdminShipmentsPage from "@/pages/admin/shipments";
import ShipmentDetailPage from "@/pages/admin/shipment-detail";
import ShipmentFormPage from "@/pages/admin/shipment-form";
import AdminSettingsPage from "@/pages/admin/settings";

setAuthTokenGetter(() => localStorage.getItem("asr_token"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, retry: 1 },
  },
});

function Router() {
  return (
    <Switch>
      {/* Public */}
      <Route path="/" component={HomePage} />
      <Route path="/track" component={TrackPage} />
      <Route path="/track/:trackingNumber" component={TrackPage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/contact" component={ContactPage} />

      {/* Admin auth */}
      <Route path="/asr/login" component={AdminLoginPage} />

      {/* Admin protected */}
      <Route path="/admin">
        {() => (
          <AuthGuard>
            <AdminDashboardPage />
          </AuthGuard>
        )}
      </Route>
      <Route path="/admin/shipments">
        {() => (
          <AuthGuard>
            <AdminShipmentsPage />
          </AuthGuard>
        )}
      </Route>
      <Route path="/admin/shipments/new">
        {() => (
          <AuthGuard>
            <ShipmentFormPage isEdit={false} />
          </AuthGuard>
        )}
      </Route>
      <Route path="/admin/shipments/:id/edit">
        {() => (
          <AuthGuard>
            <ShipmentFormPage isEdit={true} />
          </AuthGuard>
        )}
      </Route>
      <Route path="/admin/shipments/:id">
        {() => (
          <AuthGuard>
            <ShipmentDetailPage />
          </AuthGuard>
        )}
      </Route>
      <Route path="/admin/settings">
        {() => (
          <AuthGuard>
            <AdminSettingsPage />
          </AuthGuard>
        )}
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <div id="google_translate_element" style={{ display: "none" }} />
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
