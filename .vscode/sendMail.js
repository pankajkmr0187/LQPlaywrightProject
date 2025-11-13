import nodemailer from "nodemailer";
import fs from "fs";

async function sendEmail() {
  const html = fs.readFileSync("playwright-report/index.html", "utf8");

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === "true",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_TO,
    subject: "📄 Playwright Test Report",
    html: html,
  });

  console.log("📧 Email sent successfully!");
}

sendEmail();
