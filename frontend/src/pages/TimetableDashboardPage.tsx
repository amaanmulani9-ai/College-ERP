import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  Clock,
  Building,
  DoorOpen,
  UserCheck,
  GraduationCap,
  AlertTriangle,
  Layers,
  Plus,
  ArrowRight,
} from "lucide-react";
import { timetableService, BuildingItem, ClassroomItem, TimeSlotItem, TimetableEntryItem } from "../services/timetableService";

export const TimetableDashboardPage: React.FC = () => {
  const [buildings, setBuildings] = useState<BuildingItem[]>([]);
  const [rooms, setRooms] = useState<ClassroomItem[]>([]);
  const [slots, setSlots] = useState<TimeSlotItem[]>([]);
  const [entries, setEntries] = useState<TimetableEntryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [bldRes, roomRes, slotRes, entryRes] = await Promise.all([
          timetableService.listBuildings(),
          timetableService.listClassrooms(),
          timetableService.listTimeSlots(),
          timetableService.listEntries({ status: "active" }),
        ]);
        setBuildings(bldRes.data.results ?? (bldRes.data as unknown as BuildingItem[]));
        setRooms(roomRes.data.results ?? (roomRes.data as unknown as ClassroomItem[]));
        setSlots(slotRes.data.results ?? (slotRes.data as unknown as TimeSlotItem[]));
        setEntries(entryRes.data.results ?? (entryRes.data as unknown as TimetableEntryItem[]));
      } catch (err) {
        console.error("Failed to load timetable dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24 min-h-[600px]">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 text-slate-100 p-2">
      {/* Hero Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-gradient-to-r from-purple-900/60 via-slate-900 to-slate-900 rounded-2xl border border-purple-500/20 shadow-xl backdrop-blur-md">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
            <Calendar className="w-7 h-7 text-purple-400" />
            Enterprise Timetable Management
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Master schedule control, conflict-free room allocation, period timeslots & multi-view schedules.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/timetable/conflict-checker"
            className="flex items-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-amber-600/20 transition-all"
          >
            <AlertTriangle className="w-4 h-4" />
            Conflict Checker
          </Link>
          <Link
            to="/timetable/weekly"
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/25 transition-all"
          >
            Weekly Schedule
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-slate-900/80 rounded-2xl border border-slate-800 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Campus Buildings</span>
            <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
              <Building className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white mt-3">{buildings.length}</p>
          <p className="text-[11px] text-slate-500 mt-1">Active infrastructure blocks</p>
        </div>

        <div className="p-5 bg-slate-900/80 rounded-2xl border border-slate-800 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Classrooms & Labs</span>
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
              <DoorOpen className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white mt-3">{rooms.length}</p>
          <p className="text-[11px] text-slate-500 mt-1">Configured lecture spaces</p>
        </div>

        <div className="p-5 bg-slate-900/80 rounded-2xl border border-slate-800 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Configured Time Slots</span>
            <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white mt-3">{slots.length}</p>
          <p className="text-[11px] text-slate-500 mt-1">Periods across days</p>
        </div>

        <div className="p-5 bg-slate-900/80 rounded-2xl border border-slate-800 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Active Scheduled Classes</span>
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white mt-3">{entries.length}</p>
          <p className="text-[11px] text-slate-500 mt-1">Timetable entries published</p>
        </div>
      </div>

      {/* Navigation Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/timetable/faculty-schedule"
          className="p-6 bg-slate-900/80 rounded-2xl border border-slate-800 hover:border-indigo-500/50 shadow-md transition-all space-y-3 group"
        >
          <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl w-fit group-hover:scale-110 transition-transform">
            <UserCheck className="w-6 h-6" />
          </div>
          <h2 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
            Faculty Schedule View
          </h2>
          <p className="text-xs text-slate-400">
            View individual instructor timetables, lecture workload, and assigned room locations.
          </p>
        </Link>

        <Link
          to="/timetable/student-schedule"
          className="p-6 bg-slate-900/80 rounded-2xl border border-slate-800 hover:border-purple-500/50 shadow-md transition-all space-y-3 group"
        >
          <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl w-fit group-hover:scale-110 transition-transform">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h2 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">
            Student Schedule View
          </h2>
          <p className="text-xs text-slate-400">
            Filter timetables by Program, Semester, and Batch for class attendance and schedules.
          </p>
        </Link>

        <Link
          to="/timetable/room-schedule"
          className="p-6 bg-slate-900/80 rounded-2xl border border-slate-800 hover:border-emerald-500/50 shadow-md transition-all space-y-3 group"
        >
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl w-fit group-hover:scale-110 transition-transform">
            <DoorOpen className="w-6 h-6" />
          </div>
          <h2 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
            Room Occupancy Schedule
          </h2>
          <p className="text-xs text-slate-400">
            Check classroom and laboratory utilization matrix across time periods.
          </p>
        </Link>
      </div>
    </div>
  );
};
