import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Smartphone, MessageCircle} from "lucide-react";
import type { SettingsState } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFetchSettings, updateSettings } from "@/hooks/use-settings";
import { toast } from "@/hooks/use-toast";

export default function Settings() {
  const [settings, setSettings] = useState<SettingsState>({
    companyName: "",
    companyAddress: "",
    companyPhone: "",
    companyEmail: "",
    TrackingPrefix: "",
  });

 const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // send settings to server and update
    try {     
      const r = await updateSettings(settings);
      if(!r) {
        toast({
          title: "Unable To Update",
          description: "unable to update company settings",
          variant: "destructive"
        });
        return;
      }
      return toast({
        title: "Settings Updated",
        description: "company settings have been updated successfully",
        variant: "default"
      }); 
      
    } catch (error) {
      console.error(error);
      toast({
        title: "Unable To Update",
        description: "unable to update company settings",
        variant: "destructive"
      });
      return;
    }

  };

  useEffect(() => {
      const fetchSettings =  async () => {
        try {
            const r =  await useFetchSettings();
            setSettings(r);
            return;
          } catch (error) {
            console.error(error);
            return;
          };
      }
      fetchSettings();
  }, []);

  return (
    <div className="h-full overflow-y-auto p-6 custom-scrollbar">
      <div className="max-w-7xl mx-auto">
        {/* Profile Header */}
        <div className="bg-stone-900 rounded-xl p-8 mb-6 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Avatar className="w-16 h-16 border-2 border-white/20">
                  <AvatarFallback className="bg-stone-700 text-white">
                    {settings.companyName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="ml-4">
                  <h2 className="text-2xl font-bold text-white">{settings.companyName}</h2>
                  <p className="text-white/80">{settings.companyAddress}</p>
                </div>
              </div>
              <div className="flex space-x-3">
                <Button variant="secondary" className="bg-white/10 text-white hover:bg-white/20 hover:text-white border-0">
                  <Smartphone className="mr-2 w-4 h-4" />
                  App
                </Button>
                <Button variant="secondary" className="bg-white/10 text-white hover:bg-white/20 hover:text-white border-0">
                  <MessageCircle className="mr-2 w-4 h-4" />
                  Message
                </Button>
                <Button variant="secondary" className="bg-white/10 text-white hover:bg-white/20 hover:text-white border-0">
                  Settings
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Platform Settings */}
          <Card className="border-stone-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-stone-900">Company Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* form feilds for settings like company name, address, phone, email, tracking prefix etc */}
              <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companyName" className="text-sm font-normal text-gray-700">
                  company name
                </Label>
                <Input
                  id="companyName"
                  name="companyName"
                  type="text"
                  required
                  value={settings.companyName}
                  onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Electronics"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyAddress" className="text-sm font-normal text-gray-700">
                  company address
                </Label>
                <Input
                  id="companyAddress"
                  name="companyAddress"
                  type="text"
                  required
                  value={settings.companyAddress}
                  onChange={(e) => setSettings({ ...settings, companyAddress: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="123 Main St, Cityville"
                />  
              </div>  
              <div className="space-y-2">
                <Label htmlFor="companyPhone" className="text-sm font-normal text-gray-700">
                  company phone
                </Label>
                <Input
                  id="companyPhone"
                  name="companyPhone"
                  type="text"
                  required
                  value={settings.companyPhone}
                  onChange={(e) => setSettings({ ...settings, companyPhone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="+1 (555) 123-4567"
                />  
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyEmail" className="text-sm font-normal text-gray-700">
                  company email
                </Label>
                <Input
                  id="companyEmail"
                  name="companyEmail"
                  type="email"
                  required
                  value={settings.companyEmail}
                  onChange={(e) => setSettings({ ...settings, companyEmail: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="info@company.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="trackingPrefix" className="text-sm font-normal text-gray-700">
                  tracking prefix
                </Label>
                <Input
                  id="trackingPrefix"
                  name="trackingPrefix"
                  type="text"
                  required
                  value={settings.TrackingPrefix}
                  onChange={(e) => setSettings({ ...settings, TrackingPrefix: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="TRK"
                />    
              </div>  

              </div>
              <Button
                type="submit"
                className="w-full"
              >
                Update Settings
              </Button>
            </form>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
