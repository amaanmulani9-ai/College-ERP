import React, { useState } from "react";
import { Building, Save, CheckCircle2, Globe, Mail, Phone, MapPin, Award } from "lucide-react";
import { MOCK_INSTITUTION_PROFILE } from "./mockInstitutionData";

export const InstitutionProfilePage: React.FC = () => {
  const [profile, setProfile] = useState(MOCK_INSTITUTION_PROFILE);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-xl shadow-md text-xs font-sans space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Building className="w-5 h-5 text-indigo-400" />
          <div>
            <h2 className="text-base font-bold text-slate-100">Institutional Profile & Accreditation</h2>
            <p className="text-slate-400 text-[11px]">Primary organizational identity, accreditation scores, and contact information.</p>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg shadow-md transition-colors text-xs"
        >
          {saved ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-white" />
              <span>Profile Saved!</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[11px] font-semibold text-slate-300 mb-1">
            Institution Full Name
          </label>
          <input
            type="text"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-xs font-semibold"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-300 mb-1">
            Short Name / Abbreviation
          </label>
          <input
            type="text"
            value={profile.shortName}
            onChange={(e) => setProfile({ ...profile, shortName: e.target.value })}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-xs font-mono font-bold text-indigo-400"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-[11px] font-semibold text-slate-300 mb-1">
            Accreditation & NIRF Rating Details
          </label>
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400 shrink-0" />
            <input
              type="text"
              value={profile.accreditation}
              onChange={(e) => setProfile({ ...profile, accreditation: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-xs font-semibold"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-300 mb-1">
            Official Email Address
          </label>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-xs font-mono"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-300 mb-1">
            Website URL
          </label>
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              value={profile.website}
              onChange={(e) => setProfile({ ...profile, website: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-xs font-mono"
            />
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-[11px] font-semibold text-slate-300 mb-1">
            Campus Address
          </label>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              value={profile.address}
              onChange={(e) => setProfile({ ...profile, address: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-xs"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
