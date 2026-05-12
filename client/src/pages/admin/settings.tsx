import { useState } from "react";
import { AdminLayout } from "@/components/admin-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { useUpdateProfile, getGetMeQueryKey } from "@/lib/api-client-react/src";
import { useQueryClient } from "@tanstack/react-query";
import { User, Shield, Bell, Database, Mail, CheckCircle, Eye, EyeOff, Loader2, Save } from "lucide-react";

function Section({ icon: Icon, title, description, children }: {
  icon: typeof User;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-card border border-card-border rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-card-border">
        <h2 className="font-semibold text-foreground flex items-center gap-2 text-sm">
          <Icon className="h-4 w-4 text-muted-foreground" /> {title}
        </h2>
        {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm">{label}</Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

function PasswordInput({ value, onChange, placeholder, id }: {
  value: string; onChange: (v: string) => void; placeholder?: string; id?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Input
        id={id}
        type={show ? "text" : "password"}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="pr-10"
      />
      <button
        type="button"
        onClick={() => setShow(s => !s)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
        tabIndex={-1}
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}

export default function AdminSettingsPage() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const mutation = useUpdateProfile();

  // Profile fields
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");

  // Password fields
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { toast({ title: "Name is required", variant: "destructive" }); return; }
    if (!email.trim()) { toast({ title: "Email is required", variant: "destructive" }); return; }

    const hasChanges = name.trim() !== user?.name || email.trim() !== user?.email;
    if (!hasChanges) { toast({ title: "No changes to save" }); return; }

    setSavingProfile(true);
    mutation.mutate(
      { data: { name: name.trim(), email: email.trim() } },
      {
        onSuccess: (updated) => {
          toast({ title: "Profile updated", description: "Your name and email have been saved." });
          queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
        },
        onError: (err: any) => {
          const msg = err?.response?.data?.error ?? "Failed to update profile";
          toast({ title: msg, variant: "destructive" });
          // Reset fields if email conflict
          setEmail(user?.email ?? "");
        },
        onSettled: () => setSavingProfile(false),
      }
    );
  };

  const handlePasswordSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) { toast({ title: "Enter your current password", variant: "destructive" }); return; }
    if (newPassword.length < 6) { toast({ title: "New password must be at least 6 characters", variant: "destructive" }); return; }
    if (newPassword !== confirmPassword) { toast({ title: "Passwords do not match", variant: "destructive" }); return; }

    setSavingPassword(true);
    mutation.mutate(
      { data: { currentPassword, newPassword } },
      {
        onSuccess: () => {
          toast({ title: "Password changed", description: "Your password has been updated." });
          setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
        },
        onError: (err: any) => {
          const msg = err?.response?.data?.error ?? "Failed to change password";
          toast({ title: msg, variant: "destructive" });
        },
        onSettled: () => setSavingPassword(false),
      }
    );
  };

  return (
    <AdminLayout>
      <div className="max-w-2xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage your account and system preferences</p>
        </div>

        {/* Profile */}
        <Section icon={User} title="Profile" description="Update your display name and email address">
          <form onSubmit={handleProfileSave} className="space-y-4">
            <Field label="Display Name">
              <Input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your name"
                data-testid="input-name"
              />
            </Field>
            <Field label="Email Address" hint="Changing your email will require you to sign in again with the new address.">
              <Input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@example.com"
                data-testid="input-email"
              />
            </Field>
            <Field label="Role">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border bg-secondary text-sm text-foreground capitalize font-medium">
                  <Shield className="h-3.5 w-3.5 text-muted-foreground" />
                  {user?.role ?? "admin"}
                </span>
                <span className="text-xs text-muted-foreground">Role cannot be changed here</span>
              </div>
            </Field>
            <div className="pt-1">
              <Button type="submit" disabled={savingProfile} data-testid="button-save-profile">
                {savingProfile ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                Save Profile
              </Button>
            </div>
          </form>
        </Section>

        {/* Password */}
        <Section icon={Shield} title="Change Password" description="Use a strong password of at least 6 characters">
          <form onSubmit={handlePasswordSave} className="space-y-4">
            <Field label="Current Password">
              <PasswordInput
                id="current-password"
                value={currentPassword}
                onChange={setCurrentPassword}
                placeholder="Enter your current password"
              />
            </Field>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="New Password" hint="Min. 6 characters">
                <PasswordInput
                  id="new-password"
                  value={newPassword}
                  onChange={setNewPassword}
                  placeholder="New password"
                />
              </Field>
              <Field label="Confirm New Password">
                <PasswordInput
                  id="confirm-password"
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  placeholder="Repeat new password"
                />
              </Field>
            </div>
            {newPassword && confirmPassword && newPassword !== confirmPassword && (
              <p className="text-xs text-destructive font-medium">Passwords do not match</p>
            )}
            <div className="pt-1">
              <Button
                type="submit"
                variant="outline"
                disabled={savingPassword}
                data-testid="button-save-password"
              >
                {savingPassword ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Shield className="h-4 w-4 mr-2" />}
                Change Password
              </Button>
            </div>
          </form>
        </Section>

        {/* Security */}
        <Section icon={Shield} title="Session">
          <div className="space-y-0 divide-y divide-border">
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium text-foreground">Current Session</p>
                <p className="text-xs text-muted-foreground">Signed in as {user?.email}</p>
              </div>
              <Button variant="outline" size="sm" onClick={logout} data-testid="button-logout">Sign Out</Button>
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium text-foreground">API Access</p>
                <p className="text-xs text-muted-foreground">JWT token expires every 24 hours</p>
              </div>
              <span className="text-xs bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 px-2.5 py-0.5 rounded-full font-medium">Active</span>
            </div>
          </div>
        </Section>

        {/* Data */}
        <Section icon={Database} title="Data Management" description="Export and manage shipment data">
          <a
            href="/api/shipments/export/csv"
            download
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-secondary transition-colors"
          >
            Export All Shipments (CSV)
          </a>
        </Section>

        {/* Email */}
        <Section icon={Mail} title="Email Notifications" description="Automatic emails sent to receivers on shipment events">
          <div className="space-y-4">
            <div className="rounded-lg border border-border bg-secondary/50 p-4 space-y-3">
              <p className="text-xs font-semibold text-foreground uppercase tracking-wide">SMTP Configuration — set via Replit Secrets</p>
              <div className="space-y-1.5">
                {[
                  ["SMTP_HOST", "e.g. smtp.gmail.com"],
                  ["SMTP_PORT", "e.g. 587"],
                  ["SMTP_USER", "your SMTP username"],
                  ["SMTP_PASS", "your SMTP password"],
                  ["SMTP_SECURE", "true / false"],
                  ["SMTP_FROM", 'AsR Logistics <no-reply@…>'],
                ].map(([key, hint]) => (
                  <div key={key} className="flex items-center gap-2 text-xs font-mono">
                    <span className="text-primary bg-primary/10 px-1.5 py-0.5 rounded shrink-0">{key}</span>
                    <span className="text-muted-foreground">{hint}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground pt-1">If not configured, email previews are logged to the server console.</p>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
              <span className="text-sm text-foreground">Triggers: shipment registration and every status/location update</span>
            </div>
          </div>
        </Section>

        {/* Socket */}
        <Section icon={Bell} title="Real-time Notifications">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse shrink-0" />
            <span className="text-sm text-foreground">Socket.io connected — live shipment updates active</span>
          </div>
        </Section>
      </div>
    </AdminLayout>
  );
}
