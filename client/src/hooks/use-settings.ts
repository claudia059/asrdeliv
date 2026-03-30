import api from "@/lib/queryClient";
import type { SettingsState } from "@/lib/types";


// useFetchSettings
export const useFetchSettings = async () =>  {
    try {
      const r = await api.get("/auth/settings");
      if(!r) return null;
      return r.data?.settings[0];
    } catch (error) {
      console.log(`ASRerror: ${error}`);
      return null;
    }
  }
  
  // useUpdateSettings
  
  export const useUpdateSetting = async (setting:string, settingVal: string) => {
    try {
      const r = await api.patch("/auth/patch/settings", {setting, settingVal});
      if(!r) return null;
      return r.data;
    } catch (error) {
    console.log(`ASRerror: ${error}`);
    return null;
    
  }
}

// useUpdateSettings

export const updateSettings = async (settings: SettingsState) => {
    try {
      const r = await api.put("/auth/update/settings", settings);
      if(!r) return null;
      return r.data;
    } catch (error) {
    console.log(`ASRerror: ${error}`);
    return null;
    
  }
}


