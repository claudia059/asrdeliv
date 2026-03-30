import { Outlet, useNavigate } from "react-router";
import { Sidebar } from "./sidebar";
import { Footer } from "./footer";
import { ThemeConfigurator } from "@/components/theme-configurator";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {LoaderIcon, LogOut, Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { AuthContext } from "@/hooks/use-context";
import { toast } from "@/hooks/use-toast";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [themeConfigOpen, setThemeConfigOpen] = useState(false);
  const {fetchUser, logout} = useAuth();
  const [user, setUser] = useState<string | null>(null);
  const navigation = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  

  useEffect(() => {
    const getUser = async () => {
      try{
        const r = await fetchUser();
        if(r){
          setUser(r?.email || null);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }finally{
        setIsLoading(false);
      }
    }
    
    getUser();
  } ,[]);

  if (isLoading) {
    return <LoaderIcon/>;
  }
  
  if(!user){
    return navigation("/login", { replace: true });
  }
  
  const HandleLogout = async function (){
    try {
      const r =  await logout();
      if(r?.logout){
        toast({
          title: r?.message,
          description: r?.message,
          variant: "default"
        })
        setUser(null);
      }
      return navigation("/login", { replace: true });
     } catch (error) {
      console.log(error);
     }
  }

  return (
    <div className="flex h-screen bg-stone-50 grain-texture">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 lg:z-10
        transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
        transition-transform duration-300 ease-in-out
      `}>
        <Sidebar onClose={() => setSidebarOpen(false)} />

      </div>
      
      <main className="flex-1 overflow-y-auto p-3 lg:p-6 relative z-10 flex flex-col">
        {/* Mobile header with burger menu */}
        <div className="flex items-center justify-between lg:hidden mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100"
          >
            <Menu className="h-6 w-6" />
          </Button>
          
          <div className="mt-auto pt-4 border-t border-stone-200">
            <button onClick={HandleLogout}>
              <div className="flex items-center text-sm font-normal rounded-lg cursor-pointer px-3 py-2 text-stone-700 hover:bg-stone-100 transition-colors duration-200">
                <LogOut className="mr-3 w-4 h-4" />
                Logout
              </div>
            </button>
          </div>



        </div>
        
        <Card className="flex-1 border border-stone-200 bg-white relative z-20">
          <AuthContext.Provider value={user}>
             <Outlet/>
          </AuthContext.Provider>
        </Card>
        <Footer />
      </main>
      
      {/* Theme Configurator Modal - Outside sidebar for proper z-index */}
      <ThemeConfigurator 
        isOpen={themeConfigOpen} 
        onClose={() => setThemeConfigOpen(false)} 
      />
    </div>
  );
}