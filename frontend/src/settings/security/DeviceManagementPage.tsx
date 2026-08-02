import React, { useState } from "react";
import { Laptop, LogOut } from "lucide-react";
import { ActiveDeviceItem } from "./types";
import { MOCK_ACTIVE_DEVICES } from "./mockSecurityData";

export const DeviceManagementPage: React.FC = () => {
  const [devices, setDevices] = useState<ActiveDeviceItem[]>(MOCK_ACTIVE_DEVICES);

  const handleTerminate = (id: string) => {
    setDevices(devices.filter((d) => d.id !== id));
  };

  return (
    <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-xl shadow-md text-xs font-sans space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Laptop className="w-5 h-5 text-indigo-400" />
          <h2 className="text-base font-bold text-slate-100">Active User Sessions & Device Token Revocation</h2>
        </div>
      </div>

      <div className="space-y-3 font-mono">
        {devices.map((dev) => (
          <div key={dev.id} className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-xl">
            <div>
              <div className="flex items-center gap-2">
                {dev.isCurrent && (
                  <span className="text-[9px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded uppercase font-mono">
                    Current Session
                  </span>
                )}
                <h3 className="font-bold text-slate-100 text-sm font-sans">{dev.deviceType}</h3>
              </div>
              <p className="text-[11px] text-slate-400 font-sans mt-1">
                {dev.browser} on {dev.platform} • IP: {dev.ipAddress}
              </p>
            </div>

            {!dev.isCurrent && (
              <button
                onClick={() => handleTerminate(dev.id)}
                className="flex items-center gap-1 px-3 py-1.5 bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800 rounded-lg text-xs font-sans font-bold transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Revoke Session</span>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
