import React, { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle2, Search, XCircle } from "lucide-react";
import { timetableService, BuildingItem, ClassroomItem, TimeSlotItem } from "../services/timetableService";
import { academicService, AcademicSessionItem, ProgramItem, SemesterItem } from "../services/academicService";
import { staffService, EmployeeItem } from "../services/staffService";

export const ConflictViewerPage: React.FC = () => {
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<{ has_conflicts: boolean; conflicts: any[] } | null>(null);

  // Selection states
  const [slot, setSlot] = useState("");
  const [room, setRoom] = useState("");
  const [faculty, setFaculty] = useState("");
  const [program, setProgram] = useState("");
  const [semester, setSemester] = useState("");
  const [batch, setBatch] = useState("all");

  // Options
  const [slots, setSlots] = useState<TimeSlotItem[]>([]);
  const [rooms, setRooms] = useState<ClassroomItem[]>([]);
  const [faculties, setFaculties] = useState<EmployeeItem[]>([]);
  const [programs, setPrograms] = useState<ProgramItem[]>([]);
  const [semesters, setSemesters] = useState<SemesterItem[]>([]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [slotRes, roomRes, facRes, progRes, semRes] = await Promise.all([
          timetableService.listTimeSlots(),
          timetableService.listClassrooms(),
          staffService.listEmployees(),
          academicService.listPrograms(),
          academicService.listSemesters(),
        ]);
        setSlots(slotRes.data.results ?? (slotRes.data as unknown as TimeSlotItem[]));
        setRooms(roomRes.data.results ?? (roomRes.data as unknown as ClassroomItem[]));
        setFaculties(facRes.data.results ?? (facRes.data as unknown as EmployeeItem[]));
        setPrograms(progRes.data.results ?? (progRes.data as unknown as ProgramItem[]));
        setSemesters(semRes.data.results ?? (semRes.data as unknown as SemesterItem[]));

        if (slotRes.data.results?.length) setSlot(slotRes.data.results[0].id);
        if (roomRes.data.results?.length) setRoom(roomRes.data.results[0].id);
        if (facRes.data.results?.length) setFaculty(facRes.data.results[0].id);
        if (progRes.data.results?.length) setProgram(progRes.data.results[0].id);
        if (semRes.data.results?.length) setSemester(semRes.data.results[0].id);
      } catch (err) {
        console.error("Failed to load options for conflict checker", err);
      }
    };
    fetchOptions();
  }, []);

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    setChecking(true);
    try {
      const res = await timetableService.checkConflicts({
        time_slot: slot,
        classroom: room,
        faculty,
        program,
        semester,
        batch,
      });
      setResult(res.data);
    } catch (err) {
      console.error("Conflict check failed", err);
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="space-y-6 text-slate-100 p-2 max-w-4xl mx-auto">
      <div className="p-6 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl space-y-6">
        <div className="border-b border-slate-800 pb-4">
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-amber-400" />
            Timetable Schedule Conflict Detection Engine
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Simulate proposed timetable slot assignments to test for faculty, room, or batch double-booking conflicts.
          </p>
        </div>

        <form onSubmit={handleCheck} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1">Time Slot *</label>
              <select
                value={slot}
                onChange={(e) => setSlot(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
              >
                {slots.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.day} — Period {s.period_number} ({s.start_time} - {s.end_time})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Classroom / Room *</label>
              <select
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
              >
                {rooms.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.building_code}-{r.room_number} ({r.room_type_display}, Cap: {r.capacity})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1">Faculty Instructor *</label>
              <select
                value={faculty}
                onChange={(e) => setFaculty(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
              >
                {faculties.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.employee_id} — {f.profile?.first_name} {f.profile?.last_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Batch</label>
              <input
                type="text"
                placeholder="e.g. all, Batch-A"
                value={batch}
                onChange={(e) => setBatch(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1">Program *</label>
              <select
                value={program}
                onChange={(e) => setProgram(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
              >
                {programs.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Semester *</label>
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
              >
                {semesters.map((sm) => (
                  <option key={sm.id} value={sm.id}>
                    {sm.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={checking}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 transition-all"
          >
            <Search className="w-4 h-4" />
            Run Conflict Engine Check
          </button>
        </form>

        {/* Results Panel */}
        {result && (
          <div className="pt-4 border-t border-slate-800 space-y-3">
            {result.has_conflicts ? (
              <div className="p-4 bg-rose-950/60 border border-rose-500/40 rounded-2xl space-y-3 text-xs">
                <div className="flex items-center gap-2 text-rose-300 font-bold text-sm">
                  <XCircle className="w-5 h-5 text-rose-400" />
                  Conflicts Detected ({result.conflicts.length})
                </div>
                <div className="space-y-2">
                  {result.conflicts.map((c, i) => (
                    <div key={i} className="p-3 bg-rose-900/30 rounded-xl border border-rose-500/20 text-rose-200">
                      <span className="font-mono uppercase text-[10px] bg-rose-500/20 px-2 py-0.5 rounded-full font-bold block w-fit mb-1">
                        {c.type}
                      </span>
                      <p>{c.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-4 bg-emerald-950/60 border border-emerald-500/40 rounded-2xl flex items-center gap-3 text-emerald-300 text-xs">
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                <div>
                  <div className="font-bold text-sm">Clear — No Conflicts Found!</div>
                  <div className="text-emerald-400/80">Proposed assignment is 100% safe to schedule.</div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
