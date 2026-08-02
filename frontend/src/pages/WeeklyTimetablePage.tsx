import React, { useEffect, useState } from "react";
import { Calendar, Plus, RefreshCw, Layers } from "lucide-react";
import { timetableService, TimetableEntryItem, TimeSlotItem } from "../services/timetableService";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export const WeeklyTimetablePage: React.FC = () => {
  const [entries, setEntries] = useState<TimetableEntryItem[]>([]);
  const [slots, setSlots] = useState<TimeSlotItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [slotRes, entryRes] = await Promise.all([
        timetableService.listTimeSlots(),
        timetableService.getWeeklySchedule(),
      ]);
      setSlots(slotRes.data.results ?? (slotRes.data as unknown as TimeSlotItem[]));
      setEntries(entryRes.data);
    } catch (err) {
      console.error("Failed to load weekly timetable data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter unique period numbers
  const periods = Array.from(new Set(slots.map((s) => s.period_number))).sort((a, b) => a - b);

  const getEntryForSlot = (day: string, periodNumber: number) => {
    return entries.filter(
      (e) => e.time_slot_detail?.day === day && e.time_slot_detail?.period_number === periodNumber
    );
  };

  return (
    <div className="space-y-6 text-slate-100 p-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Calendar className="w-6 h-6 text-indigo-400" />
            Weekly Master Timetable Matrix
          </h1>
          <p className="text-slate-400 text-xs mt-0.5">
            Full institutional weekly period schedule grid across all academic departments.
          </p>
        </div>

        <button
          onClick={fetchData}
          className="p-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-all self-start sm:self-auto"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Grid Table */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-slate-900/80 rounded-2xl border border-slate-800 overflow-x-auto shadow-xl">
          <table className="w-full text-left text-xs border-collapse min-w-[800px]">
            <thead className="bg-slate-950/90 border-b border-slate-800 text-slate-400 uppercase font-semibold">
              <tr>
                <th className="p-3 w-32 border-r border-slate-800">Day / Period</th>
                {periods.length > 0 ? (
                  periods.map((p) => (
                    <th key={p} className="p-3 text-center border-r border-slate-800 min-w-[140px]">
                      Period {p}
                    </th>
                  ))
                ) : (
                  <th className="p-3 text-center">Periods (None Configured)</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {DAYS.map((day) => (
                <tr key={day} className="hover:bg-slate-800/30">
                  <td className="p-3 font-bold text-indigo-300 bg-slate-950/40 border-r border-slate-800">
                    {day}
                  </td>
                  {periods.map((p) => {
                    const slotEntries = getEntryForSlot(day, p);
                    return (
                      <td key={`${day}-${p}`} className="p-2 border-r border-slate-800/60 align-top">
                        {slotEntries.length > 0 ? (
                          <div className="space-y-1.5">
                            {slotEntries.map((e) => (
                              <div
                                key={e.id}
                                className="p-2 bg-indigo-950/60 border border-indigo-500/30 rounded-xl space-y-1 text-[11px]"
                              >
                                <div className="font-bold text-white flex items-center justify-between">
                                  <span>{e.subject_detail?.code || e.subject}</span>
                                  <span className="text-[9px] px-1.5 py-0.5 bg-indigo-500/20 text-indigo-300 rounded-md">
                                    {e.batch}
                                  </span>
                                </div>
                                <div className="text-slate-300 text-[10px] truncate">
                                  {e.subject_detail?.name}
                                </div>
                                <div className="text-slate-400 text-[10px] flex items-center justify-between pt-1 border-t border-indigo-500/20">
                                  <span>{e.faculty_detail?.profile?.first_name} {e.faculty_detail?.profile?.last_name}</span>
                                  <span className="font-mono text-emerald-400 font-semibold">
                                    {e.classroom_detail?.building_code}-{e.classroom_detail?.room_number}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="h-14 flex items-center justify-center text-slate-700 text-[10px] italic">
                            Free
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
