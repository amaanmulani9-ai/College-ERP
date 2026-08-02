import React, { useEffect, useState } from "react";
import { Settings, Save, CheckCircle, Moon, Sun, Clock, Calendar, Globe } from "lucide-react";
import { profileService } from "../services/profileService";

export const UserPreferencesPage: React.FC = () => {
  const [prefs, setPrefs] = useState<any>({
    theme: "dark",
    dark_mode: true,
    time_format: "12h",
    date_format: "YYYY-MM-DD",
    language: "en",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    profileService
      .getPreferences()
      .then((data) => setPrefs(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const updated = await profileService.updatePreferences(prefs);
      setPrefs(updated);
      setMessage("Preferences saved successfully!");
    } catch (err) {
      setMessage("Failed to save preferences.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-xs text-slate-400">Loading user preferences...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Settings className="w-6 h-6 text-indigo-400" />
          User Interface & Display Preferences
        </h1>
        <p className="text-xs text-slate-400">Customize theme, time format, and localization settings.</p>
      </div>

      {message && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>{message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Theme Option */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
            <div className="flex items-center space-x-2 text-slate-200 text-xs font-bold">
              <Moon className="w-4 h-4 text-indigo-400" />
              <span>Appearance & Mode</span>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Theme Selection</label>
              <select
                value={prefs.theme}
                onChange={(e) => setPrefs({ ...prefs, theme: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="dark">Enterprise Dark (Default)</option>
                <option value="glassmorphic">Liquid Glass</option>
                <option value="light">Midnight Slate</option>
              </select>
            </div>
          </div>

          {/* Time & Date Format */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
            <div className="flex items-center space-x-2 text-slate-200 text-xs font-bold">
              <Clock className="w-4 h-4 text-indigo-400" />
              <span>Time & Date Formats</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Time Format</label>
                <select
                  value={prefs.time_format}
                  onChange={(e) => setPrefs({ ...prefs, time_format: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="12h">12-Hour (02:30 PM)</option>
                  <option value="24h">24-Hour (14:30)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Date Format</label>
                <select
                  value={prefs.date_format}
                  onChange={(e) => setPrefs({ ...prefs, date_format: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors shadow-md shadow-indigo-600/20"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save Preferences"}
          </button>
        </div>
      </form>
    </div>
  );
};
