import type { Certificate } from "../types";

export const generateCertificate = (name: string, successRate: number): Certificate => {
  const now = new Date();
  const expiryDate = new Date(now);
  expiryDate.setMonth(now.getMonth() + 6);

  return {
    id: `CERT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    name,
    issueDate: now.toISOString(),
    expiryDate: expiryDate.toISOString(),
    successRate,
    status: "Active",
  };
};

export const isCertificateExpired = (expiryDate: string): boolean => {
  return new Date(expiryDate) < new Date();
};
