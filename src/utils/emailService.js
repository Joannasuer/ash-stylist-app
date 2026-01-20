import emailjs from '@emailjs/browser';

// 🔴 REPLACE THESE WITH YOUR KEYS FROM STEP 1
const SERVICE_ID = "service_ml57xxb";   // e.g. service_m9p...
const TEMPLATE_ID = "template_6r5lakh"; // e.g. template_2x...
const PUBLIC_KEY = "LPy1OeAoy9ILjCtIZ";   // e.g. aBcdE123...

export const sendWelcomeEmail = async (userEmail, userName) => {
  console.log(`🚀 Sending email to ${userEmail}...`);

  const templateParams = {
    to_email: userEmail,
    to_name: userName, // Matches {{name}} in your template
    message: "You have successfully subscribed to Ash X.",
  };

  try {
    await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
    console.log("✅ REAL EMAIL SENT!");
    return true;
  } catch (error) {
    console.error("❌ FAILED to send email:", error);
    alert("Email failed to send. Check console for errors.");
    return false;
  }
};