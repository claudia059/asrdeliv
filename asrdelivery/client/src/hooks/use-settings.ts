import { useEffect, useState } from "react";
import api from "@/lib/queryClient";
import type { SettingsState } from "@/lib/types";

export const useFetchSettings = async () => {
  try {
    const r = await api.get("/auth/settings");
    if (!r) return null;
    return r.data?.settings?.[0] ?? null;
  } catch (error) {
    console.log(`ASRerror: ${error}`);
    return null;
  }
};

export const useSettingsMap = () => {
  const [settings, setSettings] = useState<SettingsState | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    useFetchSettings()
      .then((data) => {
        if (active) {
          setSettings(data);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return { settings, isLoading };
};

export const useUpdateSetting = async (setting: string, settingVal: string) => {
  try {
    const r = await api.patch("/auth/patch/settings", { setting, settingVal });
    if (!r) return null;
    return r.data;
  } catch (error) {
    console.log(`ASRerror: ${error}`);
    return null;
  }
};

export const useUpdateSettingsBulk = () => {
  return {
    mutateAsync: async (updates: { key: string; value: string }[]) => {
      const results = await Promise.all(
        updates.map((item) => useUpdateSetting(item.key, item.value))
      );
      return results;
    },
    isPending: false,
  };
};

export const updateSettings = async (settings: SettingsState) => {
  try {
    const r = await api.put("/auth/update/settings", settings);
    if (!r) return null;
    return r.data;
  } catch (error) {
    console.log(`ASRerror: ${error}`);
    return null;
  }
};


