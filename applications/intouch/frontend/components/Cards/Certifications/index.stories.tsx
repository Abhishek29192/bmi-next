import React from "react";
import { CertificationsCard } from ".";

export default {
  title: "CertificationsCard",
  component: CertificationsCard
};

const title = "BMI Certifications";

export const Flat = () => (
  <CertificationsCard title={title} certifications={["FLAT"]} />
);
export const Pitched = () => (
  <CertificationsCard title={title} certifications={["PITCHED"]} />
);
export const Other = () => (
  <CertificationsCard title={title} certifications={["OTHER"]} />
);
export const FlatAndPitched = () => (
  <CertificationsCard title={title} certifications={["FLAT", "PITCHED"]} />
);
export const MultipleCertifications = () => (
  <CertificationsCard
    title={title}
    certifications={["FLAT", "PITCHED", "OTHER"]}
  />
);
