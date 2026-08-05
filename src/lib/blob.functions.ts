import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { uploadReportToBlob, deleteReportFromBlob, listReportBlobs } from "./blob-storage";

// ============================================================
// TanStack Start Server Functions for Vercel Blob Storage
// ============================================================

export const uploadReportBlobFn = createServerFn({ method: "POST" })
  .inputValidator((i: unknown) =>
    z
      .object({
        filename: z.string().min(1),
        content: z.string(),
        contentType: z.string().optional(),
        folder: z.string().optional(),
      })
      .parse(i),
  )
  .handler(async ({ data }) => {
    return uploadReportToBlob(data.filename, data.content, {
      contentType: data.contentType,
      folder: data.folder,
    });
  });

export const deleteReportBlobFn = createServerFn({ method: "POST" })
  .inputValidator((i: unknown) => z.object({ url: z.string() }).parse(i))
  .handler(async ({ data }) => {
    await deleteReportFromBlob(data.url);
    return { ok: true };
  });

export const listReportBlobsFn = createServerFn({ method: "GET" }).handler(async () => {
  return listReportBlobs();
});
