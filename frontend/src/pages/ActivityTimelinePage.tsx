import React, { useEffect, useState } from "react";
import { History, Activity, ShieldAlert, UserCheck } from "lucide-react";
import { profileService } from "../services/profileService";

export const ActivityTimelinePage: React.FC = () => {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    profileService
      .getTimeline()
      .then((data) => setActivities(data.results || data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <History className="w-6 h-6 text-indigo-400" />
          Chronological Activity Timeline
        </h1>
        <p className="text-xs text-slate-400">Audit trail of identity, security, and profile events.</p>
      </div>

      {loading ? (
        <div className="p-8 text-center text-xs text-slate-400">Loading activity timeline...</div>
      ) : activities.length === 0 ? (
        <div className="p-8 text-center text-xs text-slate-400">No profile activity recorded yet.</div>
      ) : (
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-6">
          <div className="relative border-l border-slate-800 ml-4 space-y-6 pl-6">
            {activities.map((item) => (
              <div key={item.id} className="relative">
                <div className="absolute -left-[31px] top-0 p-1.5 bg-slate-900 border border-indigo-500/40 text-indigo-400 rounded-full">
                  <Activity className="w-3.5 h-3.5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200">{item.description}</span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {new Date(item.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 text-[11px] text-slate-400">
                    <span className="capitalize font-mono text-indigo-400">[{item.activity_type}]</span>
                    {item.ip_address && <span>IP: {item.ip_address}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
