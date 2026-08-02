import React, { useEffect, useState } from "react";
import { User, Mail, Phone, MapPin, Globe, Camera, Edit3, Settings, Clock, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { profileService, ProfileData } from "../services/profileService";
import { ProfileCompletionWidget } from "../components/ProfileCompletionWidget";

export const MyProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await profileService.getMyProfile();
      setProfile(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    try {
      await profileService.uploadAvatar(e.target.files[0]);
      fetchProfile();
    } catch (err) {
      alert("Failed to upload profile photo.");
    }
  };

  const handleDeleteAvatar = async () => {
    if (!confirm("Are you sure you want to remove your profile photo?")) return;
    try {
      await profileService.deleteAvatar();
      fetchProfile();
    } catch (err) {
      alert("Failed to remove profile photo.");
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-xs text-slate-400">Loading identity profile...</div>;
  }

  if (!profile) {
    return <div className="p-8 text-center text-xs text-slate-400">Please sign in to view your profile.</div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Cover & Avatar Header */}
      <div className="relative bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="h-32 bg-gradient-to-r from-indigo-900/60 via-slate-900 to-indigo-950/80 border-b border-slate-800" />
        <div className="px-6 pb-6 pt-0 flex flex-col md:flex-row md:items-end justify-between gap-4 -mt-12">
          <div className="flex items-end space-x-4">
            <div className="relative group">
              {profile.profile_photo ? (
                <img
                  src={profile.profile_photo}
                  alt={profile.full_name}
                  className="w-24 h-24 rounded-full border-4 border-slate-900 object-cover shadow-xl"
                />
              ) : (
                <div className="w-24 h-24 rounded-full border-4 border-slate-900 bg-indigo-600/30 text-indigo-400 font-bold text-3xl flex items-center justify-center shadow-xl">
                  {profile.full_name[0]?.toUpperCase() || profile.email[0]?.toUpperCase()}
                </div>
              )}
              <label className="absolute bottom-0 right-0 p-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full cursor-pointer shadow-lg transition-colors">
                <Camera className="w-4 h-4" />
                <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
              </label>
            </div>

            <div className="pb-1">
              <h1 className="text-xl font-bold text-slate-100">{profile.full_name}</h1>
              <p className="text-xs text-slate-400 font-mono">{profile.email}</p>
              {profile.code && <p className="text-[10px] text-indigo-400 font-mono mt-0.5">Code: {profile.code}</p>}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {profile.profile_photo && (
              <button
                onClick={handleDeleteAvatar}
                className="p-2 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 border border-slate-800 rounded-lg text-xs transition-colors"
                title="Remove Photo"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <Link
              to="/profile/edit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-md shadow-indigo-600/20"
            >
              <Edit3 className="w-4 h-4" /> Edit Profile
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Completion & Contact */}
        <div className="space-y-6">
          <ProfileCompletionWidget completion={profile.completion} />

          <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider border-b border-slate-800 pb-2">
              Contact Details
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-center space-x-2.5 text-slate-300">
                <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
                <span className="truncate">{profile.email}</span>
              </div>
              <div className="flex items-center space-x-2.5 text-slate-300">
                <Phone className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>{profile.contact?.mobile_number || "No phone added"}</span>
              </div>
              <div className="flex items-center space-x-2.5 text-slate-300">
                <Globe className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>{profile.nationality || "Not specified"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Personal Bio & Preferences Quick Link */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
            <h3 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-3">Biography</h3>
            <p className="text-xs text-slate-400 leading-relaxed whitespace-pre-line">
              {profile.biography || "No biography added yet."}
            </p>
          </div>

          <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
            <h3 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-3">Identity Attributes</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Gender</span>
                <span className="text-slate-200 font-medium capitalize">{profile.gender}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Date of Birth</span>
                <span className="text-slate-200 font-medium">{profile.date_of_birth || "N/A"}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Blood Group</span>
                <span className="text-slate-200 font-medium font-mono">{profile.blood_group || "N/A"}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Preferred Language</span>
                <span className="text-slate-200 font-medium uppercase">{profile.preferred_language}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Time Zone</span>
                <span className="text-slate-200 font-medium font-mono">{profile.time_zone}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
