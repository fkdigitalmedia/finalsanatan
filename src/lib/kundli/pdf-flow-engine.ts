// ============================================================
// PDF Flow Layout Engine (Reusable Flow Manager)
// ------------------------------------------------------------
// Replaces manual/hardcoded Y coordinates with a flow layout manager.
// Every component reports its rendered height, and the flow manager
// automatically positions the next component and manages page breaks.
// ============================================================

import { jsPDF } from "jspdf";

export interface ComponentRenderOptions {
  pageTitle: string;
  pageSubtitle?: string;
  spacingAfter?: number;
}

export class PdfFlowEngine<TCtx = any> {
  public doc: jsPDF;
  public ctx: TCtx;
  public currentY: number;
  public readonly safeTopY: number = 28;
  public readonly safeBottomY: number;

  constructor(doc: jsPDF, ctx: TCtx) {
    this.doc = doc;
    this.ctx = ctx;
    this.safeBottomY = doc.internal.pageSize.height - 15;
    this.currentY = this.safeTopY;
  }

  /**
   * Initializes a new page header and sets cursorY to the safe top area.
   */
  public startPage(
    title: string,
    subtitle?: string,
    renderHeaderFn?: (doc: jsPDF, t: string, st: string | undefined, ctx: TCtx) => void
  ): number {
    if (renderHeaderFn) {
      renderHeaderFn(this.doc, title, subtitle, this.ctx);
    }
    this.currentY = this.safeTopY;
    return this.currentY;
  }

  /**
   * Checks if required height fits on current page; if not, triggers a clean page break.
   */
  public ensureSpace(
    heightNeeded: number,
    opts: ComponentRenderOptions,
    renderHeaderFn?: (doc: jsPDF, t: string, st: string | undefined, ctx: TCtx) => void
  ): boolean {
    if (this.currentY + heightNeeded > this.safeBottomY) {
      this.doc.addPage();
      this.startPage(opts.pageTitle, opts.pageSubtitle, renderHeaderFn);
      return true; // New page added
    }
    return false; // Fits on current page
  }

  /**
   * Adds a component to the layout flow.
   * Render function receives currentY and MUST return the rendered height.
   */
  public addComponent(
    renderFn: (y: number) => number,
    estimatedHeight: number,
    opts: ComponentRenderOptions,
    renderHeaderFn?: (doc: jsPDF, t: string, st: string | undefined, ctx: TCtx) => void
  ): number {
    this.ensureSpace(estimatedHeight, opts, renderHeaderFn);
    const renderedHeight = renderFn(this.currentY);
    const spacing = opts.spacingAfter ?? 6;
    this.currentY += renderedHeight + spacing;
    return this.currentY;
  }

  /**
   * Manually advances cursorY by a spacing gap.
   */
  public addGap(gap: number): number {
    this.currentY += gap;
    return this.currentY;
  }
}
