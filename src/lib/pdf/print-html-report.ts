/**
 * Universal Print / Download Helper for HTML Reports.
 * Opens HTML in a Blob URL tab, triggers print, and includes fallbacks (iframe + file download)
 * if pop-up blockers prevent window.open.
 */
export function printHtmlReport(htmlContent: string, title = "Report"): void {
  if (typeof window === "undefined") return;

  let htmlToRender = htmlContent;
  if (!htmlContent.includes("window.print()")) {
    const autoPrintScript = `
      <script>
        window.addEventListener('DOMContentLoaded', () => {
          setTimeout(() => {
            window.print();
          }, 800);
        });
      </script>
    `;
    htmlToRender = htmlContent.replace("</body>", `${autoPrintScript}</body>`);
  }

  const blob = new Blob([htmlToRender], { type: "text/html;charset=utf-8" });
  const blobUrl = URL.createObjectURL(blob);

  // 1. Try opening Blob URL in new window/tab
  try {
    const win = window.open(blobUrl, "_blank");
    if (win) {
      win.focus();
      setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
      return;
    }
  } catch (err) {
    console.warn("Pop-up window blocked, attempting iframe fallback...", err);
  }

  // 2. Fallback: Hidden iframe printing if pop-up blocked
  try {
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document || iframe.contentDocument;
    if (doc) {
      doc.open();
      doc.write(htmlToRender);
      doc.close();

      setTimeout(() => {
        try {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
        } catch (e) {
          console.error("Iframe print error", e);
        }
        setTimeout(() => {
          iframe.remove();
          URL.revokeObjectURL(blobUrl);
        }, 3000);
      }, 600);
      return;
    }
  } catch (err) {
    console.error("Iframe fallback failed", err);
  }

  // 3. Ultimate Fallback: Direct Download of HTML file
  const a = document.createElement("a");
  a.href = blobUrl;
  a.download = `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.html`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(blobUrl), 5000);
}
