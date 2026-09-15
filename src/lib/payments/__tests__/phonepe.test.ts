import { describe, it, expect } from "vitest";
import {
  calculatePhonePeChecksum,
  verifyPhonePeChecksum,
  getPhonePeBaseUrl,
  PHONEPE_PROD_URL,
  PHONEPE_UAT_URL,
} from "../phonepe.server";

describe("PhonePe Payment Engine", () => {
  const saltKey = "sample-salt-key-1234";
  const saltIndex = "1";

  it("selects correct base URLs for test and live modes", () => {
    expect(getPhonePeBaseUrl("test")).toBe(PHONEPE_UAT_URL);
    expect(getPhonePeBaseUrl("live")).toBe(PHONEPE_PROD_URL);
  });

  it("calculates SHA256 checksum with salt key and index", () => {
    const payload = Buffer.from(JSON.stringify({ amount: 1000 })).toString("base64");
    const endpoint = "/pg/v1/pay";
    const checksum = calculatePhonePeChecksum(payload, endpoint, saltKey, saltIndex);

    expect(checksum).toContain("###1");
    expect(checksum.length).toBe(64 + 4); // 64 hex chars + '###1'
  });

  it("verifies valid checksum correctly", () => {
    const payload = "test-payload-base64";
    const endpoint = "/pg/v1/status/MID/TXN123";
    const validChecksum = calculatePhonePeChecksum(payload, endpoint, saltKey, saltIndex);

    const isValid = verifyPhonePeChecksum(payload, endpoint, saltKey, saltIndex, validChecksum);
    expect(isValid).toBe(true);
  });

  it("rejects tampered payload or incorrect salt key", () => {
    const payload = "original-payload";
    const endpoint = "/pg/v1/pay";
    const checksum = calculatePhonePeChecksum(payload, endpoint, saltKey, saltIndex);

    const tampered = verifyPhonePeChecksum(
      "tampered-payload",
      endpoint,
      saltKey,
      saltIndex,
      checksum,
    );
    expect(tampered).toBe(false);

    const wrongKey = verifyPhonePeChecksum(
      payload,
      endpoint,
      "wrong-salt-key",
      saltIndex,
      checksum,
    );
    expect(wrongKey).toBe(false);

    const empty = verifyPhonePeChecksum(payload, endpoint, saltKey, saltIndex, "");
    expect(empty).toBe(false);
  });
});
