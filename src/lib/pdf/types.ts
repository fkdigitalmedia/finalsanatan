// ============================================================
// Universal PDF Report Engine — Shared Types
// ------------------------------------------------------------
// NOTHING in this engine is hardcoded per report. A report is a
// JSON template (paper + theme + branding + ordered sections)
// plus a data context. New reports = new template rows, never
// new source code.
// ============================================================

// ---------- Reports ----------
export const REPORT_TYPES = [
  "janam-kundli",
  "kundli-matching",
  "daily-horoscope",
  "weekly-horoscope",
  "monthly-horoscope",
  "yearly-horoscope",
  "personalized-horoscope",
  "career-report",
  "business-report",
  "marriage-compatibility",
  "muhurat-report",
  "numerology-report",
  "vastu-report",
  "varshphal",
  "festival-report",
] as const;
/** Report keys are open-ended on purpose — future reports need no code change. */
export type PdfReportType = (typeof REPORT_TYPES)[number] | (string & {});

// ---------- Languages ----------
export const PDF_LANGUAGES = [
  "en",
  "hi",
  "mr",
  "gu",
  "ta",
  "te",
  "kn",
  "ml",
  "pa",
  "bn",
  "or",
  "as",
] as const;
export type PdfLanguage = (typeof PDF_LANGUAGES)[number] | (string & {});

// ---------- Paper ----------
export type PaperSize = "a4" | "letter" | "legal" | "custom";
export type Orientation = "portrait" | "landscape";

export interface PaperConfig {
  size: PaperSize;
  orientation: Orientation;
  /** mm — required when size === "custom" */
  width?: number;
  height?: number;
  margins: { top: number; right: number; bottom: number; left: number };
}

// ---------- Theme ----------
export const BUILT_IN_THEMES = [
  "classic",
  "premium",
  "luxury",
  "modern",
  "minimal",
  "temple",
] as const;
export type BuiltInTheme = (typeof BUILT_IN_THEMES)[number];
export type ThemeName = BuiltInTheme | (string & {});

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  ink: string;
  muted: string;
  paper: string;
  surface: string;
  divider: string;
  success: string;
  warning: string;
  danger: string;
}

export interface ThemeTypography {
  headingFont: string;
  bodyFont: string;
  baseSize: number; // pt
  scale: number; // heading scale multiplier
  lineHeight: number; // multiple of font size
  letterSpacing: number; // mm
  rtl: boolean;
}

export interface ThemeDecoration {
  sectionBackground: boolean;
  decorativeBorder: boolean;
  borderWidth: number;
  cornerRadius: number;
  dividerStyle: "line" | "ornament" | "none";
}

export interface PdfTheme {
  name: ThemeName;
  label: string;
  colors: ThemeColors;
  typography: ThemeTypography;
  decoration: ThemeDecoration;
}

// ---------- Branding ----------
export interface PdfBranding {
  company: string;
  website: string;
  email: string;
  supportNumber: string;
  copyright: string;
  /** data URL or absolute https URL */
  logoUrl?: string;
  watermarkUrl?: string;
  backgroundUrl?: string;
  socialLinks?: { label: string; url: string }[];
  customFooter?: string;
}

// ---------- Header / Footer / Watermark ----------
export interface HeaderConfig {
  enabled: boolean;
  showOnCover: boolean;
  left?: string;
  center?: string;
  right?: string;
  showLogo: boolean;
  rule: boolean;
  height: number; // mm
}

export interface FooterConfig {
  enabled: boolean;
  showOnCover: boolean;
  left?: string;
  center?: string;
  right?: string;
  pageNumbers: boolean;
  /** e.g. "Page {{page}} of {{pages}}" */
  pageNumberFormat: string;
  rule: boolean;
  height: number; // mm
}

export interface WatermarkConfig {
  enabled: boolean;
  text?: string;
  imageUrl?: string;
  opacity: number; // 0..1
  angle: number; // degrees
  scale: number; // 0..1 of page width
}

export interface QrConfig {
  enabled: boolean;
  /** template string, e.g. "{{shareUrl}}" */
  value: string;
  size: number; // mm
  position: "cover-bottom-right" | "cover-bottom-left" | "footer-right" | "last-page";
  caption?: string;
}

export interface SignatureConfig {
  enabled: boolean;
  name?: string;
  title?: string;
  imageUrl?: string;
  note?: string;
}

export interface SecurityConfig {
  password?: string;
  ownerPassword?: string;
  disableCopy: boolean;
  disablePrint: boolean;
}

export interface ExportConfig {
  /** print = no compression, high dpi images; compressed = jpeg + compress */
  quality: "standard" | "high" | "print" | "compressed";
  imageDpi: number;
  compress: boolean;
}

// ---------- Sections ----------
export const SECTION_TYPES = [
  "cover",
  "introduction",
  "summary",
  "toc",
  "divider",
  "heading",
  "paragraph",
  "markdown",
  "keyvalue",
  "table",
  "planet-table",
  "house-table",
  "planet-strength-table",
  "chart",
  "wheel-chart",
  "dasha-timeline",
  "transit-timeline",
  "timeline",
  "dosha-summary",
  "yoga-summary",
  "festival-calendar",
  "scorecards",
  "progress-bars",
  "badges",
  "recommendations",
  "image",
  "qrcode",
  "signature",
  "disclaimer",
  "appendix",
  "pagebreak",
  "spacer",
] as const;
export type SectionType = (typeof SECTION_TYPES)[number] | (string & {});

export interface TemplateSection {
  id: string;
  type: SectionType;
  /** Shown in TOC and as the section heading when present. */
  title?: string;
  enabled?: boolean;
  /** Include this section in the table of contents. */
  inToc?: boolean;
  /** Start the section on a fresh page. */
  newPage?: boolean;
  /** Only render when this template expression resolves truthy. */
  visibleWhen?: string;
  /** Free-form, component specific. Values may contain {{variables}}. */
  options?: Record<string, unknown>;
}

// ---------- Template ----------
export interface PdfTemplate {
  id: string;
  name: string;
  report: PdfReportType;
  version: number;
  status: "draft" | "published" | "archived";
  language?: PdfLanguage;
  theme: ThemeName;
  /** Partial overrides merged over the resolved theme. */
  themeOverrides?: DeepPartial<PdfTheme>;
  paper: PaperConfig;
  branding: PdfBranding;
  header: HeaderConfig;
  footer: FooterConfig;
  watermark: WatermarkConfig;
  qr: QrConfig;
  signature: SignatureConfig;
  security?: SecurityConfig;
  export: ExportConfig;
  sections: TemplateSection[];
  meta?: Record<string, unknown>;
}

export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

// ---------- Data context ----------
export interface PdfDataContext {
  /** Free-form values addressable as {{path.to.value}} in templates. */
  [key: string]: unknown;
}

export interface GenerateOptions {
  report: PdfReportType;
  data: PdfDataContext;
  templateId?: string;
  /** Inline template — skips the loader entirely. */
  template?: PdfTemplate;
  language?: PdfLanguage;
  theme?: ThemeName;
  filename?: string;
  bypassCache?: boolean;
  /** Overrides merged over whatever template is resolved. */
  overrides?: DeepPartial<PdfTemplate>;
}

export interface RenderResult {
  blob: Blob;
  dataUrl: string;
  pages: number;
  bytes: number;
  filename: string;
  meta: {
    templateId: string;
    templateVersion: number;
    report: PdfReportType;
    theme: ThemeName;
    language: PdfLanguage;
    cached: boolean;
    durationMs: number;
    generatedAt: string;
    sectionsRendered: number;
  };
}

// ---------- Renderer document abstraction ----------
/**
 * The subset of jsPDF the renderer relies on. Declared structurally so
 * components stay testable without a browser/jsPDF instance.
 */
export interface DocLike {
  setFont(family: string, style?: string): unknown;
  setFontSize(size: number): unknown;
  setTextColor(color: string): unknown;
  setFillColor(color: string): unknown;
  setDrawColor(color: string): unknown;
  setLineWidth(w: number): unknown;
  text(text: string | string[], x: number, y: number, opts?: Record<string, unknown>): unknown;
  rect(x: number, y: number, w: number, h: number, style?: string): unknown;
  roundedRect?(
    x: number,
    y: number,
    w: number,
    h: number,
    rx: number,
    ry: number,
    style?: string,
  ): unknown;
  line(x1: number, y1: number, x2: number, y2: number): unknown;
  circle?(x: number, y: number, r: number, style?: string): unknown;
  addPage(): unknown;
  setPage(n: number): unknown;
  getNumberOfPages(): number;
  addImage?(
    data: string,
    format: string,
    x: number,
    y: number,
    w: number,
    h: number,
    alias?: string,
    compression?: string,
    rotation?: number,
  ): unknown;
  splitTextToSize(text: string, width: number): string[];
  getTextWidth(text: string): number;
  saveGraphicsState?(): unknown;
  restoreGraphicsState?(): unknown;
  setGState?(g: unknown): unknown;
  GState?(o: Record<string, unknown>): unknown;
}

export interface TocEntry {
  title: string;
  page: number;
  level: number;
}

export interface RenderContext {
  doc: DocLike;
  template: PdfTemplate;
  theme: PdfTheme;
  data: PdfDataContext;
  language: PdfLanguage;
  page: { width: number; height: number };
  margins: PaperConfig["margins"];
  /** current writing cursor (mm) */
  cursorY: number;
  /** logical content bounds */
  contentTop: number;
  contentBottom: number;
  fonts: { heading: string; body: string };
  toc: TocEntry[];
  /** page index reserved for the TOC, if any */
  tocPage: number | null;
  images: Record<string, string>;
  sectionsRendered: number;
}

export type SectionRenderer = (
  ctx: RenderContext,
  section: TemplateSection,
) => void | Promise<void>;

export interface ValidationIssue {
  path: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  issues: ValidationIssue[];
}
