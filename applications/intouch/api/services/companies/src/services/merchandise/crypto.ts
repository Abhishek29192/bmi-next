import CryptoJS from "crypto-js";

const { MERCHANDISE_ENCRYPTION_KEY, MERCHANDISE_IV_KEY } = process.env;

export const encrypt = (value) => {
  const key = CryptoJS.enc.Utf8.parse(MERCHANDISE_ENCRYPTION_KEY);
  const iv = CryptoJS.enc.Utf8.parse(MERCHANDISE_IV_KEY);
  const encrypted = CryptoJS.AES.encrypt(
    CryptoJS.enc.Utf8.parse(value.toString()),
    key,
    {
      keySize: 32,
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    }
  );

  return encrypted.toString();
};

export const decrypt = (value) => {
  const key = CryptoJS.enc.Utf8.parse(MERCHANDISE_ENCRYPTION_KEY);
  const iv = CryptoJS.enc.Utf8.parse(MERCHANDISE_IV_KEY);
  const decrypted = CryptoJS.AES.decrypt(value, key, {
    keySize: 32,
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });

  return decrypted.toString(CryptoJS.enc.Utf8);
};
