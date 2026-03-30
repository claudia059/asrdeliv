import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import Notifications from "@/pages/notifications";
import SignIn from "@/pages/auth/sign-in";
import SignUp from "@/pages/auth/sign-up";
import NotFound from "@/pages/not-found";
import Home from "./pages/public/Home";
import Track from "./pages/public/Track";
import AdminLayout from "./components/admin/layout/AdminLayout";
import Settings from "@/pages/admin/settings";
import Shippments from "@/pages/admin/shippments";
import NewShipment from "./pages/admin/new-shipment";
import EditShipment from "./pages/admin/edit-shipment";
import Profile from "./pages/admin/profile";



function Router() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/track/:id" element={<Track />} />

      <Route path="/login" element={<SignIn />} />
      <Route path="/register" element={<SignUp />} />

      {/* proctected routes */}
      <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="settings" element={<Settings />} />
          <Route path="shippments" element={<Shippments />} />
          <Route path="new-shipment" element={<NewShipment />} />
          <Route path="edit-shipment/:id" element={<EditShipment />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="profile" element={<Profile />} />
      </Route>
    
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
    </BrowserRouter>
  );
}

export default App;
