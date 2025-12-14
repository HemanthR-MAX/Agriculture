// server/utils/smsService.js
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const sendOTP = async (phone, otp) => {
  // Implement actual SMS service (Twilio, AWS SNS, etc.)
  console.log(`Sending OTP ${otp} to ${phone}`);
  // For development, just log it
  return true;
};
