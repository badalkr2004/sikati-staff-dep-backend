import { sendMail } from "./mailer";

const BRAND_NAME = "Sikati Services";

//
// CONTACT
//
export const notifyContact = async (data: {
  name: string;
  email: string;
  phone: string;
  message: string;
  company: string;
}) => {
  // 🔹 Notify Admin
  await sendMail({
    to: process.env.ADMIN_EMAIL!,
    subject: "📩 New Contact Form Submission",
    html: `
      <h2>New Contact Request</h2>
      <p><b>Name:</b> ${data.name}</p>
      <p><b>Email:</b> ${data.email}</p>
      <p><b>Phone:</b> ${data.phone}</p>
      <p><b>Company:</b> ${data.company}</p>
      <p><b>Message:</b> ${data.message}</p>
    `,
  });

  // 🔹 Acknowledge User
  await sendMail({
    to: data.email,
    subject: `Thanks for reaching out to ${BRAND_NAME}`,
    html: `
      <h2>Hello ${data.name},</h2>
      <p>Thanks for contacting <b>${BRAND_NAME}</b>! Our team has received your message and will get back to you shortly.</p>
      <br/>
      <p style="font-size:14px;color:#555;">– The ${BRAND_NAME} Team</p>
    `,
  });
};

//
// QUOTE REQUEST
//
export const notifyQuote = async (data: {
  contactName: string;
  companyName: string;
  email: string;
  phone: string;
  eventType: string;
  startDate: string;
  duration: string | undefined;
  staffNeeded: string;
  location: string;
  services: string[];
  specialRequirements: string;
  budgetRange: string;
}) => {
  // 🔹 Notify Admin
  await sendMail({
    to: process.env.ADMIN_EMAIL!,
    subject: "📝 New Quote Request",
    html: `
      <h2>Quote Request Details</h2>
      <p><b>Contact Name:</b> ${data.contactName}</p>
      <p><b>Company:</b> ${data.companyName}</p>
      <p><b>Email:</b> ${data.email}</p>
      <p><b>Phone:</b> ${data.phone}</p>
      <p><b>Event Type:</b> ${data.eventType}</p>
      <p><b>Start Date:</b> ${data.startDate}</p>
      <p><b>Duration:</b> ${data.duration}</p>
      <p><b>Staff Needed:</b> ${data.staffNeeded}</p>
      <p><b>Location:</b> ${data.location}</p>
      <p><b>Services:</b> ${data.services.join(", ")}</p>
      <p><b>Special Requirements:</b> ${data.specialRequirements}</p>
      <p><b>Budget Range:</b> ${data.budgetRange}</p>
    `,
  });

  // 🔹 Acknowledge User
  await sendMail({
    to: data.email,
    subject: `Your Quote Request with ${BRAND_NAME}`,
    html: `
      <h2>Hello ${data.contactName},</h2>
      <p>Thanks for submitting a quote request with <b>${BRAND_NAME}</b>. Our team is reviewing your details and will contact you soon.</p>
      <br/>
      <p style="font-size:14px;color:#555;">– The ${BRAND_NAME} Team</p>
    `,
  });
};

//
// EMERGENCY STAFFING
//
export const notifyEmergency = async (data: {
  name: string;
  phone: string;
  email: string;
  company: string;
  urgency: string;
  staffNeeded: string;
  location: string;
  startDateTime: Date;
  duration: string;
  workType: string;
  emergencyDescription: string;
  specialRequirements: string;
  contact: string;
}) => {
  // 🔹 Notify Admin
  await sendMail({
    to: process.env.ADMIN_EMAIL!,
    subject: "🚨 Emergency Staffing Request",
    html: `
      <h2>Emergency Staffing Request</h2>
      <p><b>Name:</b> ${data.name}</p>
      <p><b>Phone:</b> ${data.phone}</p>
      <p><b>Location:</b> ${data.location}</p>
      <p><b>Details:</b> ${data.emergencyDescription}</p>
    `,
  });

  // 🔹 Acknowledge User (only if email provided)
  if (data.email) {
    await sendMail({
      to: data.email,
      subject: `Emergency Request Received - ${BRAND_NAME}`,
      html: `
        <h2>Hello ${data.name},</h2>
        <p>We’ve received your <b>emergency staffing request</b> and our team will contact you immediately at ${data.phone}.</p>
        <br/>
        <p style="font-size:14px;color:#555;">– The ${BRAND_NAME} Rapid Response Team</p>
      `,
    });
  }
};
