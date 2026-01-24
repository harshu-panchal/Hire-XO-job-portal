import { describe, it, expect } from "vitest";
import { generateCertificate, isCertificateExpired } from "../lib/certificate-utils";

describe("Certificate Utilities", () => {
  it("should generate a certificate with 6 months validity", () => {
    const name = "Test Certificate";
    const successRate = 80;
    const cert = generateCertificate(name, successRate);

    expect(cert.name).toBe(name);
    expect(cert.successRate).toBe(successRate);
    expect(cert.status).toBe("Active");

    const issueDate = new Date(cert.issueDate);
    const expiryDate = new Date(cert.expiryDate);

    // Check if expiry is exactly 6 months after issue
    const expectedExpiry = new Date(issueDate);
    expectedExpiry.setMonth(issueDate.getMonth() + 6);

    expect(expiryDate.toISOString()).toBe(expectedExpiry.toISOString());
  });

  it("should correctly identify expired certificates", () => {
    const pastDate = new Date();
    pastDate.setFullYear(pastDate.getFullYear() - 1);

    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);

    expect(isCertificateExpired(pastDate.toISOString())).toBe(true);
    expect(isCertificateExpired(futureDate.toISOString())).toBe(false);
  });
});
