import { useState } from "react";
import { useTranslation } from "@/i18n/I18nProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { PhotonPlacePicker } from "@/components/tools/PhotonPlacePicker";
import type { LatLon } from "@/lib/panchang";
import type { UserKundli, UserKundliInsert } from "@/lib/workspace/types";

export interface KundliFormValue {
  name: string;
  gender: string;
  birth_date: string;
  birth_time: string;
  language: string;
  notes: string;
  loc: LatLon;
}

export function emptyKundliForm(): KundliFormValue {
  return {
    name: "",
    gender: "male",
    birth_date: "",
    birth_time: "12:00",
    language: "en",
    notes: "",
    loc: { lat: 28.6139, lon: 77.209, label: "New Delhi, India", tz: "Asia/Kolkata" },
  };
}

export function toFormValue(row: UserKundli): KundliFormValue {
  return {
    name: row.name,
    gender: row.gender,
    birth_date: row.birth_date,
    birth_time: String(row.birth_time).slice(0, 5),
    language: row.language,
    notes: row.notes ?? "",
    loc: { lat: row.latitude, lon: row.longitude, label: row.place_name, tz: row.timezone },
  };
}

export function toInsert(v: KundliFormValue, userId: string, id?: string): UserKundliInsert {
  return {
    ...(id ? { id } : {}),
    user_id: userId,
    name: v.name.trim(),
    gender: v.gender,
    birth_date: v.birth_date,
    birth_time: v.birth_time,
    place_name: v.loc.label,
    latitude: v.loc.lat,
    longitude: v.loc.lon,
    timezone: v.loc.tz,
    language: v.language,
    notes: v.notes.trim() || null,
  };
}

const LANGS = ["en", "hi", "mr", "gu", "ta", "te", "kn", "ml", "pa", "bn"];

export function KundliForm({
  initial,
  submitting,
  onCancel,
  onSubmit,
}: {
  initial: KundliFormValue;
  submitting?: boolean;
  onCancel: () => void;
  onSubmit: (v: KundliFormValue) => void;
}) {
  const { t } = useTranslation();
  const [v, setV] = useState<KundliFormValue>(initial);
  const valid = v.name.trim().length > 1 && !!v.birth_date;

  return (
    <Card className="p-6">
      <form
        className="grid md:grid-cols-2 gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (valid) onSubmit(v);
        }}
      >
        <div>
          <Label htmlFor="k-name">{t("kundli.form.name")}</Label>
          <Input
            id="k-name"
            value={v.name}
            onChange={(e) => setV({ ...v, name: e.target.value })}
            className="mt-1.5"
            required
          />
        </div>
        <div>
          <Label htmlFor="k-gender">{t("kundli.form.gender")}</Label>
          <select
            id="k-gender"
            value={v.gender}
            onChange={(e) => setV({ ...v, gender: e.target.value })}
            className="mt-1.5 h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="male">{t("kundli.form.gender_male")}</option>
            <option value="female">{t("kundli.form.gender_female")}</option>
            <option value="other">{t("kundli.form.gender_other")}</option>
          </select>
        </div>
        <div>
          <Label htmlFor="k-date">{t("kundli.form.date_of_birth")}</Label>
          <Input
            id="k-date"
            type="date"
            value={v.birth_date}
            onChange={(e) => setV({ ...v, birth_date: e.target.value })}
            className="mt-1.5"
            required
          />
        </div>
        <div>
          <Label htmlFor="k-time">{t("kundli.form.time_of_birth")}</Label>
          <Input
            id="k-time"
            type="time"
            value={v.birth_time}
            onChange={(e) => setV({ ...v, birth_time: e.target.value })}
            className="mt-1.5"
          />
        </div>
        <div className="md:col-span-2">
          <PhotonPlacePicker value={v.loc} onChange={(loc) => setV({ ...v, loc })} />
        </div>
        <div>
          <Label htmlFor="k-lang">{t("kundli.form.report_language")}</Label>
          <select
            id="k-lang"
            value={v.language}
            onChange={(e) => setV({ ...v, language: e.target.value })}
            className="mt-1.5 h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          >
            {LANGS.map((l) => (
              <option key={l} value={l}>
                {l.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="k-notes">{t("kundli.form.notes")}</Label>
          <Textarea
            id="k-notes"
            rows={2}
            value={v.notes}
            onChange={(e) => setV({ ...v, notes: e.target.value })}
            className="mt-1.5"
          />
        </div>
        <div className="md:col-span-2 flex gap-3">
          <Button type="submit" disabled={!valid || submitting}>
            {submitting ? t("kundli.form.saving") : t("kundli.form.save_chart")}
          </Button>
          <Button type="button" variant="ghost" onClick={onCancel}>
            {t("kundli.form.cancel")}
          </Button>
        </div>
      </form>
    </Card>
  );
}
