import { useState } from "react";

import { AIRunner } from "@/components/tools/AIToolShell";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

function Field({
  label,
  children,
  hint,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm">{label}</Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

/* ─── AI Dharma Assistant ─── */
export function AIDharmaAssistant() {
  const [q, setQ] = useState("");
  return (
    <AIRunner
      mode="dharma-assistant"
      getInput={() => (q.trim() ? { question: q } : null)}
      submitLabel="Ask the assistant"
      examples={[
        {
          label: "What is dharma?",
          apply: () => setQ("What is dharma according to the Bhagavad Gita?"),
        },
        {
          label: "Meaning of Om",
          apply: () => setQ("What is the meaning of Om (ॐ) in the Upanishads?"),
        },
        {
          label: "Karma yoga vs bhakti",
          apply: () => setQ("What is the difference between karma yoga and bhakti yoga?"),
        },
      ]}
    >
      <Field
        label="Your question"
        hint="Ask anything about Sanatan Dharma — scripture, ritual, philosophy, festivals."
      >
        <Textarea
          value={q}
          onChange={(e) => setQ(e.target.value)}
          rows={4}
          placeholder="e.g. What does the Isha Upanishad teach about renunciation?"
        />
      </Field>
    </AIRunner>
  );
}

/* ─── AI Gita Summary ─── */
export function AIGitaSummary() {
  const [chapter, setChapter] = useState("2");
  const [focus, setFocus] = useState("");
  return (
    <AIRunner
      mode="gita-summary"
      getInput={() => (chapter.trim() ? { chapter, focus } : null)}
      submitLabel="Summarize chapter"
      examples={[
        {
          label: "Ch. 2 — Sankhya Yoga",
          apply: () => {
            setChapter("2");
            setFocus("");
          },
        },
        {
          label: "Ch. 12 — Bhakti Yoga",
          apply: () => {
            setChapter("12");
            setFocus("");
          },
        },
        {
          label: "Ch. 18 — Moksha",
          apply: () => {
            setChapter("18");
            setFocus("");
          },
        },
      ]}
    >
      <div className="grid md:grid-cols-[160px_1fr] gap-4">
        <Field label="Chapter (1–18)">
          <Input
            type="number"
            min={1}
            max={18}
            value={chapter}
            onChange={(e) => setChapter(e.target.value)}
          />
        </Field>
        <Field
          label="Focus (optional)"
          hint="e.g. 'verses on the eternal soul' or 'lessons for daily life'"
        >
          <Input
            value={focus}
            onChange={(e) => setFocus(e.target.value)}
            placeholder="Leave blank for a full summary"
          />
        </Field>
      </div>
    </AIRunner>
  );
}

/* ─── AI Shlok Explainer ─── */
export function AIShlokExplainer() {
  const [shlok, setShlok] = useState("");
  return (
    <AIRunner
      mode="shlok-explainer"
      getInput={() => (shlok.trim() ? { shlok } : null)}
      submitLabel="Explain shloka"
      examples={[
        {
          label: "Karmanyevadhikaraste",
          apply: () =>
            setShlok(
              "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥",
            ),
        },
        {
          label: "Vasudhaiva Kutumbakam",
          apply: () =>
            setShlok("अयं निजः परो वेति गणना लघुचेतसाम्।\nउदारचरितानां तु वसुधैव कुटुम्बकम्॥"),
        },
      ]}
    >
      <Field label="Paste the shloka" hint="Devanagari, IAST, or plain transliteration — all work.">
        <Textarea
          value={shlok}
          onChange={(e) => setShlok(e.target.value)}
          rows={5}
          className="font-devanagari"
          placeholder="कर्मण्येवाधिकारस्ते…"
        />
      </Field>
    </AIRunner>
  );
}

/* ─── AI Festival Guide ─── */
export function AIFestivalGuide() {
  const [festival, setFestival] = useState("");
  const [region, setRegion] = useState("");
  return (
    <AIRunner
      mode="festival-guide"
      getInput={() => (festival.trim() ? { festival, region } : null)}
      submitLabel="Get festival guide"
      examples={[
        {
          label: "Diwali",
          apply: () => {
            setFestival("Diwali");
            setRegion("");
          },
        },
        {
          label: "Makar Sankranti",
          apply: () => {
            setFestival("Makar Sankranti");
            setRegion("");
          },
        },
        {
          label: "Onam (Kerala)",
          apply: () => {
            setFestival("Onam");
            setRegion("Kerala");
          },
        },
      ]}
    >
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Festival name">
          <Input
            value={festival}
            onChange={(e) => setFestival(e.target.value)}
            placeholder="e.g. Navratri"
          />
        </Field>
        <Field label="Region (optional)">
          <Input
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            placeholder="e.g. Bengal, Tamil Nadu"
          />
        </Field>
      </div>
    </AIRunner>
  );
}

/* ─── AI Puja Planner ─── */
export function AIPujaPlanner() {
  const [occasion, setOccasion] = useState("");
  const [deity, setDeity] = useState("");
  const [duration, setDuration] = useState("");
  return (
    <AIRunner
      mode="puja-planner"
      getInput={() => (occasion.trim() || deity.trim() ? { occasion, deity, duration } : null)}
      submitLabel="Plan my puja"
      examples={[
        {
          label: "Griha Pravesh",
          apply: () => {
            setOccasion("Griha Pravesh (housewarming)");
            setDeity("Ganesha & Lakshmi");
            setDuration("2 hours");
          },
        },
        {
          label: "Satyanarayan Katha",
          apply: () => {
            setOccasion("Satyanarayan Katha at home");
            setDeity("Vishnu");
            setDuration("90 minutes");
          },
        },
      ]}
    >
      <div className="grid md:grid-cols-3 gap-4">
        <Field label="Occasion">
          <Input
            value={occasion}
            onChange={(e) => setOccasion(e.target.value)}
            placeholder="Birthday, new business, etc."
          />
        </Field>
        <Field label="Primary deity">
          <Input
            value={deity}
            onChange={(e) => setDeity(e.target.value)}
            placeholder="Ganesha, Shiva, Devi…"
          />
        </Field>
        <Field label="Time available">
          <Input
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="30 min, 1 hr, 2 hrs"
          />
        </Field>
      </div>
    </AIRunner>
  );
}

/* ─── AI Mantra Meaning ─── */
export function AIMantraMeaning() {
  const [mantra, setMantra] = useState("");
  return (
    <AIRunner
      mode="mantra-meaning"
      getInput={() => (mantra.trim() ? { mantra } : null)}
      submitLabel="Reveal meaning"
      examples={[
        {
          label: "Gayatri Mantra",
          apply: () =>
            setMantra(
              "ॐ भूर्भुवः स्वः। तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि। धियो यो नः प्रचोदयात्॥",
            ),
        },
        {
          label: "Mahamrityunjaya",
          apply: () =>
            setMantra(
              "ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्।\nउर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय माऽमृतात्॥",
            ),
        },
        {
          label: "Om Namah Shivaya",
          apply: () => setMantra("ॐ नमः शिवाय"),
        },
      ]}
    >
      <Field label="Paste the mantra">
        <Textarea
          value={mantra}
          onChange={(e) => setMantra(e.target.value)}
          rows={4}
          className="font-devanagari"
          placeholder="ॐ नमः शिवाय"
        />
      </Field>
    </AIRunner>
  );
}

/* ─── AI Sanskrit Helper ─── */
export function AISanskritHelper() {
  const [query, setQuery] = useState("");
  const [direction, setDirection] = useState("English → Sanskrit");
  return (
    <AIRunner
      mode="sanskrit-helper"
      getInput={() => (query.trim() ? { query, direction } : null)}
      submitLabel="Get help"
      examples={[
        {
          label: "Translate 'peace'",
          apply: () => {
            setQuery("Translate 'inner peace' into Sanskrit.");
            setDirection("English → Sanskrit");
          },
        },
        {
          label: "Explain 'सत्यमेव जयते'",
          apply: () => {
            setQuery("Explain the phrase सत्यमेव जयते grammatically.");
            setDirection("Sanskrit grammar");
          },
        },
      ]}
    >
      <Field label="What do you need?">
        <Textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          rows={4}
          placeholder="Translate, explain grammar, break down sandhi, or ask about a word."
        />
      </Field>
      <Field label="Mode">
        <select
          value={direction}
          onChange={(e) => setDirection(e.target.value)}
          className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
        >
          <option>English → Sanskrit</option>
          <option>Sanskrit → English</option>
          <option>Hindi → Sanskrit</option>
          <option>Sanskrit grammar</option>
          <option>Pronunciation help</option>
        </select>
      </Field>
    </AIRunner>
  );
}
