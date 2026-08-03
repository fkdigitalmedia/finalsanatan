import React, { useState, useEffect } from "react";
import {
  HardDrive,
  FolderTree,
  FileCode,
  Zap,
  Trash2,
  RefreshCw,
  CheckCircle,
  ShieldCheck,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import type { PDFStoragePolicy, SupportedLanguage } from "@/lib/astrology-crm/crm-types";
import { fetchPDFStoragePolicy } from "@/lib/astrology-crm/crm-api";
import { getTranslation } from "@/lib/astrology-crm/i18n-astrology";

interface StorageManagerViewProps {
  language: SupportedLanguage;
}

export function StorageManagerView({ language }: StorageManagerViewProps) {
  const t = getTranslation(language);
  const [policy, setPolicy] = useState<PDFStoragePolicy | null>(null);

  useEffect(() => {
    void fetchPDFStoragePolicy().then(setPolicy);
  }, []);

  if (!policy) return <div className="p-8 text-center text-sm text-muted-foreground">Loading storage policy...</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-display text-2xl font-bold flex items-center gap-2">
          <HardDrive className="size-6 text-accent" /> {t.storage}
        </h2>
        <p className="text-sm text-muted-foreground">
          PDF Storage rules, automatic file naming schemes, compression parameters, and retention policies.
        </p>
      </div>

      {/* Storage Summary */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Card className="p-5">
          <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold block mb-1">
            Total PDFs Stored
          </span>
          <p className="font-display text-2xl font-bold">{policy.totalFilesCount} Files</p>
        </Card>

        <Card className="p-5">
          <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold block mb-1">
            Total Storage Size
          </span>
          <p className="font-display text-2xl font-bold text-accent">512 MB</p>
        </Card>

        <Card className="p-5">
          <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold block mb-1">
            Retention Policy
          </span>
          <p className="font-display text-2xl font-bold">{policy.retentionDays} Days</p>
        </Card>
      </div>

      {/* Automatic File Naming Schema */}
      <Card className="p-6">
        <h3 className="font-display font-bold text-lg mb-3 flex items-center gap-2">
          <FileCode className="size-5 text-accent" /> Automatic File Naming Schema
        </h3>

        <div className="bg-secondary p-4 rounded-lg font-mono text-sm border border-border">
          <code>{policy.namingScheme}</code>
        </div>

        <p className="text-xs text-muted-foreground mt-3">
          Example Output: <code>Kundli_RahulSharma_JanamKundli_EN_v2.1.pdf</code>
        </p>
      </Card>

      {/* Folder Structure */}
      <Card className="p-6">
        <h3 className="font-display font-bold text-lg mb-3 flex items-center gap-2">
          <FolderTree className="size-5 text-purple-500" /> Secure Folder Structure
        </h3>

        <pre className="bg-secondary/40 p-4 rounded-lg text-xs font-mono border border-border space-y-1">
{`/storage/v1/object/public/reports/
├── {user_id}/
│   ├── kundlis/
│   │   └── Kundli_Rahul_v2.1.pdf
│   ├── matching/
│   │   └── Ashtakoot_Rahul_Priya.pdf
│   └── versions/
│       ├── v1.0_archived.pdf
│       └── v2.0_previous.pdf`}
        </pre>
      </Card>

      {/* Policy Controls */}
      <Card className="p-6">
        <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
          <ShieldCheck className="size-5 text-emerald-500" /> Policy Rules & Compression
        </h3>

        <div className="space-y-4 text-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">Automatic PDF Compression</p>
              <p className="text-xs text-muted-foreground">Compress vector graphics to reduce file size without quality loss.</p>
            </div>
            <Switch
              checked={policy.compressionEnabled}
              onCheckedChange={(val) => setPolicy({ ...policy, compressionEnabled: val })}
            />
          </div>

          <div className="flex items-center justify-between border-t border-border pt-3">
            <div>
              <p className="font-semibold">Auto-Cleanup Unused Drafts</p>
              <p className="text-xs text-muted-foreground">Automatically prune un-downloaded temporary previews after 30 days.</p>
            </div>
            <Switch
              checked={policy.autoCleanupEnabled}
              onCheckedChange={(val) => setPolicy({ ...policy, autoCleanupEnabled: val })}
            />
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-border flex justify-end">
          <Button variant="destructive" size="sm" className="gap-1 text-xs">
            <Trash2 className="size-3.5" /> Run Manual Retention Cleanup
          </Button>
        </div>
      </Card>
    </div>
  );
}
