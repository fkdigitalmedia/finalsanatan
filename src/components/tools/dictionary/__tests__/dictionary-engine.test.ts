import React from "react";
import { describe, expect, it } from "vitest";
import { renderToString } from "react-dom/server";
import {
  AMARAKOSHA_CLUSTERS,
  DICTIONARY_DATABASE,
  searchDictionary,
} from "../dictionary-engine";
import { SanskritDictionaryView } from "../SanskritDictionaryView";

describe("dictionary-engine", () => {
  it("contains extensive Sanskrit dictionary entries", () => {
    expect(DICTIONARY_DATABASE.length).toBeGreaterThanOrEqual(15);
    const dharma = DICTIONARY_DATABASE.find((w) => w.id === "dharma");
    expect(dharma).toBeDefined();
    expect(dharma?.devanagari).toBe("धर्मः");
    expect(dharma?.meaningHindi).toContain("कर्तव्य");
    expect(dharma?.rootDhatu).toContain("धृ");
  });

  it("searches dictionary across Devanagari, English, and IAST", () => {
    const resDev = searchDictionary("ब्रह्म");
    expect(resDev.length).toBeGreaterThan(0);

    const resEng = searchDictionary("liberation");
    expect(resEng.length).toBeGreaterThan(0);
    expect(resEng.some((w) => w.id === "moksha")).toBe(true);

    const resIast = searchDictionary("ahimsa");
    expect(resIast.length).toBeGreaterThan(0);
  });

  it("contains Amarakosha synonym clusters", () => {
    expect(AMARAKOSHA_CLUSTERS.length).toBeGreaterThanOrEqual(4);
    const surya = AMARAKOSHA_CLUSTERS.find((c) => c.concept.includes("Surya"));
    expect(surya?.synonyms).toContain("आदित्यः");
    expect(surya?.synonyms).toContain("भानुः");
  });

  it("renders SanskritDictionaryView component without crashing", () => {
    const html = renderToString(React.createElement(SanskritDictionaryView));
    expect(html).toContain("पाणिनीय संस्कृत महा-शब्दकोश");
    expect(html).toContain("अमरकोश पर्याय-चक्र");
  });
});
