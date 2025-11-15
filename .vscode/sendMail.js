import fs from "fs";
import path from "path";
import nodemailer from "nodemailer";
import archiver from "archiver";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async () => {
  try {
    const {
      EMAIL_USER,
      EMAIL_PASS,
      EMAIL_TO,
      EMAIL_CC,
      EMAIL_BCC,
      EMAIL_HOST,
      EMAIL_PORT,
      EMAIL_SECURE
    } = process.env;

    if (!EMAIL_USER || !EMAIL_PASS || !EMAIL_TO) {
      console.error("Missing email credentials.");
      process.exit(1);
    }

    const projectRoot = process.cwd();
    const reportsDir = path.join(projectRoot, "test-reports");
    const zipPath = path.join(projectRoot, "test-reports", "playwright_full_report.zip");

    // ---------------------------
    // 1️⃣ Read Test Status
    // ---------------------------
    const statusFile = path.join(projectRoot, "test-results", "status.txt");
    let testStatus = "PASSED";

    if (fs.existsSync(statusFile)) {
      testStatus = fs.readFileSync(statusFile, "utf8").trim();
    }

    const isFailed = testStatus === "FAILED";

    // ---------------------------
    // 2️⃣ Create ZIP including ALL reports
    // ---------------------------
    const zipAllReports = () =>
      new Promise((resolve, reject) => {
        const output = fs.createWriteStream(zipPath);
        const archive = archiver("zip", { zlib: { level: 9 } });

        output.on("close", resolve);
        archive.on("error", reject);

        archive.pipe(output);
        archive.directory(reportsDir, false);
        archive.finalize();
      });

    console.log("Creating FULL ZIP (test-reports folder)...");
    await zipAllReports();

    // ---------------------------
    // 3️⃣ Custom HTML Email Body
    // ---------------------------

    const timestamp = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
    });

    const emailHTML = `
    <div style="font-family:Arial; padding:20px;">
      <h2 style="color:#0056d6;">📱 LearnQoch Mobile Automation Report</h2>
      <p><b>Execution Time:</b> ${timestamp}</p>

      <div style="display:flex; gap:20px; margin-top:20px;">
        <div style="padding:15px; background:#d4ffd4; border-radius:10px;">
          <b style="color:green;">🟢 Status:</b> ${testStatus}
        </div>
        <div style="padding:15px; background:#fff3cd; border-radius:10px;">
          <b>📁 Attached Zip:</b> All Reports + Screenshots
        </div>
      </div>

      <h3 style="margin-top:30px;">📊 Report Contents</h3>
      <ul>
        <li>✔ Default Playwright Report</li>
        <li>✔ Custom Link Verification Report</li>
        <li>✔ Custom Field-Level Report</li>
        <li>✔ All Screenshots</li>
        <li>✔ CSV logs</li>
      </ul>

      <p>Regards,<br><b>Playwright CI</b></p>
    </div>
    `;

    // ---------------------------
    // 4️⃣ Email Transporter
    // ---------------------------
    const transporter = nodemailer.createTransport({
      host: EMAIL_HOST || "smtp.gmail.com",
      port: EMAIL_PORT ? Number(EMAIL_PORT) : 465,
      secure: EMAIL_SECURE === "true",
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS
      }
    });

    // ---------------------------
    // 5️⃣ Build Subject
    // ---------------------------
    const subject = `${isFailed ? "❌ FAILED" : "✔ PASSED"} – Playwright Automation Report (${timestamp})`;

    // ---------------------------
    // 6️⃣ Send Email
    // ---------------------------
    const mailOptions = {
      from: `"Playwright CI" <${EMAIL_USER}>`,
      to: EMAIL_TO,
      cc: EMAIL_CC || "",
      bcc: EMAIL_BCC || "",
      subject,
      html: emailHTML,
      attachments: [
        {
          filename: "playwright_full_report.zip",
          path: zipPath,
          contentType: "application/zip"
        }
      ]
    };

    console.log("Sending email...");
    await transporter.sendMail(mailOptions);

    console.log("📩 Email sent successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
})();
