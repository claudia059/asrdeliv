import { Button } from "@/components/ui/button";
import peopleBackground from "/images/material-persons.jpg";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";

export default function Profile() {
  return (
    <div className="h-full overflow-y-auto p-6 custom-scrollbar">
      {/* Hero Card with Background Image */}
      <Card className="relative mb-8 border border-stone-200 bg-white overflow-hidden">
        <div
          className="relative h-64 bg-cover bg-top bg-no-repeat"
          style={{ backgroundImage: `url(${peopleBackground})` }}
        >
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0"></div>

          {/* Content */}
          <div className="relative z-10 p-8 flex items-center h-full">
            <div className="max-w-lg">
              <h2 className="text-3xl font-bold text-white mb-4">
                Build Amazing Teams
              </h2>
              <p className="text-stone-200 text-lg mb-6 leading-relaxed">
                Connect with diverse talent and create inclusive workspaces that
                drive innovation. Discover how our platform helps you build
                stronger teams.
              </p>
              <Button
                size="lg"
                className="px-6 py-3 shadow-sm hover:shadow-md bg-stone-800 hover:bg-stone-700 relative bg-gradient-to-b from-stone-700 to-stone-800 border border-stone-900 text-stone-50 hover:bg-gradient-to-b hover:from-stone-800 hover:to-stone-800 hover:border-stone-900 after:absolute after:inset-0 after:rounded-[inherit] after:box-shadow after:shadow-[inset_0_1px_0px_rgba(255,255,255,0.25),inset_0_-2px_0px_rgba(0,0,0,0.35)] after:pointer-events-none duration-300 ease-in align-middle select-none font-sans text-center antialiased"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Platform Settings */}
          <Card className="border-stone-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-stone-900">Company Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
            <form  className="space-y-6">
              {/* form feilds for settings like company name, address, phone, email, tracking prefix etc */}
              <div className="grid grid-cols-2 gap-4">

              <div className="space-y-2">
                <Label htmlFor="companyAddress" className="text-sm font-normal text-gray-700">
                  company address
                </Label>
                <Input
                  id="companyAddress"
                  name="companyAddress"
                  type="text"
                  required
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
  );
}
