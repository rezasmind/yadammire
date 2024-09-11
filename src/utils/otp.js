import crypto from "crypto";

export function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function hashOtp(otp) {
  return String(crypto.createHash("sha256").update(otp).digest("hex"))
}

export function validateOtpHash(otp, otpHash) {
  const hash = hashOtp(otp);
  return hash === otpHash;
}
