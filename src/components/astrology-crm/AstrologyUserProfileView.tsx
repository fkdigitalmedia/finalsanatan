import React, { useState, useEffect } from "react";
import {
  User,
  MapPin,
  Calendar,
  Clock,
  Globe,
  Compass,
  Bell,
  Save,
  CheckCircle,
  Image as ImageIcon,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SUPPORTED_LANGUAGES, type ChartStyle, type SupportedLanguage, type UserAstrologyProfile } from "@/lib/astrology-crm/crm-types";
import { fetchUserAstrologyProfile, updateUserAstrologyProfile } from "@/lib/astrology-crm/crm-api";
import { getTranslation } from "@/lib/astrology-crm/i18n-astrology";

interface AstrologyUserProfileViewProps {
  language: SupportedLanguage;
  userId?: string;
  onLanguageChange?: (lang: SupportedLanguage) => void;
}

export function AstrologyUserProfileView({
  language,
  userId = "user-1",
  onLanguageChange,
}: AstrologyUserProfileViewProps) {
  const t = getTranslation(language);
  const [profile, setProfile] = useState<UserAstrologyProfile | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    void fetchUserAstrologyProfile(userId).then(setProfile);
  }, [userId]);

  if (!profile) return <div className="p-8 text-center text-sm text-muted-foreground">Loading profile...</div>;

  const handleSave = async () => {
    const updated = await updateUserAstrologyProfile(profile);
    setProfile(updated);
    if (onLanguageChange && updated.preferredLanguage) {
      onLanguageChange(updated.preferredLanguage);
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold flex items-center gap-2">
            <User className="size-6 text-accent" /> {t.userProfile}
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage your primary birth chart details, preferred language, chart style, and alert preferences.
          </p>
        </div>

        <Button className="gap-2 shadow-sm" onClick={handleSave}>
          <Save className="size-4" /> Save Profile
        </Button>
      </div>

      {savedSuccess && (
        <Card className="p-4 bg-emerald-500/10 border-emerald-500/30 text-emerald-600 flex items-center gap-2 text-sm">
          <CheckCircle className="size-5" /> Profile & birth parameters updated successfully!
        </Card>
      )}

      {/* Profile Avatar & Name */}
      <Card className="p-6">
        <h3 className="font-display font-bold text-lg mb-4">Personal Details</h3>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="relative group">
            {profile.photoUrl ? (
              <img
                src={profile.photoUrl}
                alt={profile.name}
                className="size-24 rounded-full object-cover border-2 border-accent shadow-md"
              />
            ) : (
              <div className="size-24 rounded-full border-2 border-accent bg-accent/20 text-accent font-bold font-display text-3xl flex items-center justify-center shadow-md">
                {profile.name ? profile.name.charAt(0).toUpperCase() : "U"}
              </div>
            )}
            <Button
              size="sm"
              variant="outline"
              className="mt-2 text-xs w-full gap-1"
              onClick={() => {
                const newUrl = prompt("Enter new photo URL:", profile.photoUrl);
                if (newUrl) setProfile({ ...profile, photoUrl: newUrl });
              }}
            >
              <ImageIcon className="size-3" /> Change Photo
            </Button>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 flex-1 w-full">
            <div>
              <label className="text-xs font-semibold block mb-1">Full Name</label>
              <Input
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              />
            </div>

            <div>
              <label className="text-xs font-semibold block mb-1">Timezone</label>
              <Input
                value={profile.timezone}
                onChange={(e) => setProfile({ ...profile, timezone: e.target.value })}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Primary Birth Chart Details */}
      <Card className="p-6">
        <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
          <MapPin className="size-5 text-accent" /> Primary Birth Details (Kundli Core)
        </h3>

        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-semibold block mb-1">Date of Birth</label>
            <Input
              type="date"
              value={profile.dob}
              onChange={(e) => setProfile({ ...profile, dob: e.target.value })}
            />
          </div>

          <div>
            <label className="text-xs font-semibold block mb-1">Birth Time</label>
            <Input
              type="time"
              value={profile.birthTime}
              onChange={(e) => setProfile({ ...profile, birthTime: e.target.value })}
            />
          </div>

          <div>
            <label className="text-xs font-semibold block mb-1">Birth Place</label>
            <Input
              value={profile.birthPlace}
              onChange={(e) => setProfile({ ...profile, birthPlace: e.target.value })}
            />
          </div>

          <div>
            <label className="text-xs font-semibold block mb-1">Latitude (°N)</label>
            <Input
              type="number"
              step="0.0001"
              value={profile.latitude}
              onChange={(e) =>
                setProfile({ ...profile, latitude: parseFloat(e.target.value) || 0 })
              }
            />
          </div>

          <div>
            <label className="text-xs font-semibold block mb-1">Longitude (°E)</label>
            <Input
              type="number"
              step="0.0001"
              value={profile.longitude}
              onChange={(e) =>
                setProfile({ ...profile, longitude: parseFloat(e.target.value) || 0 })
              }
            />
          </div>
        </div>
      </Card>

      {/* Astrology Preferences: Chart Style & Language */}
      <Card className="p-6">
        <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
          <Compass className="size-5 text-purple-500" /> Astrology Preferences
        </h3>

        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label className="text-xs font-semibold block mb-1">Preferred Chart Style</label>
            <Select
              value={profile.preferredChartStyle}
              onValueChange={(val: ChartStyle) =>
                setProfile({ ...profile, preferredChartStyle: val })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="north_indian">North Indian (Lagna Kundli Box)</SelectItem>
                <SelectItem value="south_indian">South Indian (Fixed Rashi Box)</SelectItem>
                <SelectItem value="east_indian">East Indian (Bengali Style)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-xs font-semibold block mb-1">Preferred Report Language</label>
            <Select
              value={profile.preferredLanguage}
              onValueChange={(val: SupportedLanguage) =>
                setProfile({ ...profile, preferredLanguage: val })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SUPPORTED_LANGUAGES.map((l) => (
                  <SelectItem key={l.code} value={l.code}>
                    {l.flag} {l.name} ({l.nativeName})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Notification Preferences */}
      <Card className="p-6">
        <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
          <Bell className="size-5 text-amber-500" /> Notification Preferences
        </h3>

        <div className="space-y-4 text-sm">
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium">Email Alerts & Weekly Horoscope</Label>
              <p className="text-xs text-muted-foreground">Receive weekly astrological forecasts via email.</p>
            </div>
            <Switch
              checked={profile.notificationPreferences.emailAlerts}
              onCheckedChange={(val) =>
                setProfile({
                  ...profile,
                  notificationPreferences: {
                    ...profile.notificationPreferences,
                    emailAlerts: val,
                  },
                })
              }
            />
          </div>

          <div className="flex items-center justify-between border-t border-border pt-3">
            <div>
              <Label className="font-medium">Dasha Change Alerts</Label>
              <p className="text-xs text-muted-foreground">Notify 14 days before any Antardasha transition.</p>
            </div>
            <Switch
              checked={profile.notificationPreferences.dashaChangeAlerts}
              onCheckedChange={(val) =>
                setProfile({
                  ...profile,
                  notificationPreferences: {
                    ...profile.notificationPreferences,
                    dashaChangeAlerts: val,
                  },
                })
              }
            />
          </div>

          <div className="flex items-center justify-between border-t border-border pt-3">
            <div>
              <Label className="font-medium">Planetary Transit (Gochar) Alerts</Label>
              <p className="text-xs text-muted-foreground">Notify when Saturn, Jupiter or Rahu changes house.</p>
            </div>
            <Switch
              checked={profile.notificationPreferences.transitChangeAlerts}
              onCheckedChange={(val) =>
                setProfile({
                  ...profile,
                  notificationPreferences: {
                    ...profile.notificationPreferences,
                    transitChangeAlerts: val,
                  },
                })
              }
            />
          </div>
        </div>
      </Card>
    </div>
  );
}
