import React, { useEffect, useState } from "react";
import { Calendar, Plus, DoorOpen, UserCheck, RefreshCw } from "lucide-react";
import { examService, ExamScheduleItem } from "../services/examService";

export const ExamSchedulePage: React.FC = () => {
  const [schedules, setSchedules] = useState<ExamScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const res = await examService.listSchedules();
      setSchedules(res.data.results ?? (res.data as unknown as ExamScheduleItem[]));
    } catch (err) {
      console.error("Failed to load exam schedules", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  return (
    <div className="space-y-6 text-slate-100 p-2 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Calendar className="w-6 h-6 text-blue-400" />
            Exam Hall Timetable & Slot Schedules
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Master exam room matrix, invigilator assignments, and hall seating capacity.
          </p>
        </div>

        <button
          onClick={fetchSchedules}
          className="p-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-all"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4 shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-950/90 border-b border-slate-800 text-slate-400 uppercase font-semibold">
                <tr>
                  <th className="p-3">Exam Subject</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Time Window</th>
                  <th className="p-3">Hall / Classroom</th>
                  <th className="p-3">Invigilator</th>
                  <th className="p-3">Capacity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {schedules.map((sc) => (
                  <tr key={sc.id} className="hover:bg-slate-800/30">
                    <td className="p-3 font-bold text-white">
                      {sc.exam_detail?.subject_detail?.code} - {sc.exam_detail?.subject_detail?.name}
                    </td>
                    <td className="p-3 font-semibold text-blue-300">{sc.date}</td>
                    <td className="p-3 font-mono text-slate-300">
                      {sc.start_time} - {sc.end_time}
                    </td>
                    <td className="p-3 font-mono text-emerald-400">
                      {sc.classroom_detail?.building_code}-{sc.classroom_detail?.room_number}
                    </td>
                    <td className="p-3 text-slate-300">
                      {sc.invigilator_detail?.profile?.first_name ? (
                        `${sc.invigilator_detail.profile.first_name} ${sc.invigilator_detail.profile.last_name}`
                      ) : (
                        <span className="text-slate-600 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="p-3 font-semibold text-slate-300">{sc.capacity} seats</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
