import React, { useEffect, useState } from "react";
import { User, Mail, Phone, Globe, Shield, Calendar, Save, CheckCircle } from "lucide-react";
import { authService } from "../services/authService";

export const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    authService
      .getProfile()
      .then((data) => setProfile(data))
      .catch(() => setProfile(null))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const updated = await authService.updateProfile({
        first_name: profile.first_name,
        last_name: profile.last_name,
        phone_number: profile.phone_number,
        preferred_language: profile.preferred_language,
        time_zone: profile.time_zone,
      });
      setProfile(updated);
      setMessage("Profile updated successfully!");
    } catch (err) {
      setMessage("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-xs text-slate-400">Loading user profile...</div>;
  }

  if (!profile) {
    return <div className="p-8 text-center text-xs text-slate-400">Please sign in to view your profile.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl shadow-lg flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-xl">
            {profile.first_name?.[0] || profile.email[0].toUpperCase()}
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100">{profile.full_name || profile.email}</h2>
            <p className="text-xs text-slate-400 font-mono">{profile.email}</p>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${profile.is_email_verified ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                {profile.is_email_verified ? 'Verified Email' : 'Unverified Email'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {message && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="p-6 bg-slate-900 border border-slate-800 rounded-xl shadow-lg space-y-4">
        <h3 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-3">Personal Details</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">First Name</label>
            <input
              type="text"
              value={profile.first_name || ""}
              onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Last Name</label>
            <input
              type="text"
              value={profile.last_name || ""}
              onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Phone Number</label>
            <input
              type="text"
              value={profile.phone_number || ""}
              onChange={(e) => setProfile({ ...profile, phone_number: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Time Zone</label>
            <input
              type="text"
              value={profile.time_zone || "UTC"}
              onChange={(e) => setProfile({ ...profile, time_zone: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="pt-3 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save Profile Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};
