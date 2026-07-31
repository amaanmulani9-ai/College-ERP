import React, { useEffect, useState } from "react";
import { CheckSquare, Plus } from "lucide-react";
import { academicService, OfferingItem } from "../services/academicService";

export const SubjectOfferingsPage: React.FC = () => {
  const [offerings, setOfferings] = useState<OfferingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOfferings();
  }, []);

  const fetchOfferings = async () => {
    try {
      const data = await academicService.getOfferings();
      setOfferings(data.results || data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <CheckSquare className="w-6 h-6 text-indigo-400" />
          Active Subject Offerings
        </h1>
        <p className="text-xs text-slate-400">Offered subjects for current academic sessions & departments.</p>
      </div>

      {loading ? (
        <div className="p-8 text-center text-xs text-slate-400">Loading offerings...</div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase">
              <tr>
                <th className="p-3.5">Subject Code</th>
                <th className="p-3.5">Subject Name</th>
                <th className="p-3.5">Academic Session</th>
                <th className="p-3.5">Department</th>
                <th className="p-3.5">Capacity</th>
                <th className="p-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {offerings.map((off) => (
                <tr key={off.id} className="hover:bg-slate-800/40">
                  <td className="p-3.5 font-mono text-indigo-400 font-bold">{off.subject_code}</td>
                  <td className="p-3.5 font-semibold text-slate-200">{off.subject_name}</td>
                  <td className="p-3.5 font-medium">{off.session_name}</td>
                  <td className="p-3.5">{off.department_name}</td>
                  <td className="p-3.5 font-mono">{off.capacity} Students</td>
                  <td className="p-3.5">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 capitalize">
                      {off.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
