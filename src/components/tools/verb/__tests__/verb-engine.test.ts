import React from "react";
import { describe, expect, it } from "vitest";
import { renderToString } from "react-dom/server";
import {
  DHATU_REPOSITORY,
  getDhatuById,
  LAKARA_DATABASE,
} from "../verb-engine";
import { VerbConjugatorView } from "../VerbConjugatorView";

describe("verb-engine", () => {
  it("contains extensive Dhatu repository across all 5 major Lakarasa", () => {
    expect(DHATU_REPOSITORY.length).toBeGreaterThanOrEqual(10);
    const gam = getDhatuById("gam");
    expect(gam.root).toContain("गम्");
    expect(gam.conjugations.lat.prathama[0]).toBe("गच्छति");
    expect(gam.conjugations.lrit.prathama[0]).toBe("गमिष्यति");
    expect(gam.conjugations.lang.prathama[0]).toBe("अगच्छत्");
  });

  it("contains complete metadata for 5 Lakarasa", () => {
    const lakaras = Object.keys(LAKARA_DATABASE);
    expect(lakaras).toContain("lat");
    expect(lakaras).toContain("lang");
    expect(lakaras).toContain("lrit");
    expect(lakaras).toContain("lot");
    expect(lakaras).toContain("vidhiling");
  });

  it("renders VerbConjugatorView component without crashing", () => {
    const html = renderToString(React.createElement(VerbConjugatorView));
    expect(html).toContain("पाणिनीय धातु रूप");
    expect(html).toContain("प्रथम पुरुषः");
  });
});
