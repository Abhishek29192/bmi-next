"use strict";

const formatCert = (cert) => {
  return cert
    .replace("-----BEGIN CERTIFICATE-----", "-----BEGIN CERTIFICATE-----\\n")
    .replace("-----END CERTIFICATE-----", "\\n-----END CERTIFICATE-----");
};

const formatKey = (cert) => {
  return cert
    .replace(
      "-----BEGIN RSA PRIVATE KEY-----",
      "-----BEGIN RSA PRIVATE KEY-----\\n"
    )
    .replace(
      "-----END RSA PRIVATE KEY-----",
      "\\n-----END RSA PRIVATE KEY-----"
    );
};

module.exports = {
  formatCert,
  formatKey
};
