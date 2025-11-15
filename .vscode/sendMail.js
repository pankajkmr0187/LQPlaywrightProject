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
      console.error("Missing email env variables.");
      process.exit(1);
    }

    const projectRoot = process.cwd();
    const reportsDir = path.join(projectRoot, "test-reports");
    const zipPath = path.join(projectRoot, "test-reports", "playwright_full_report.zip");

    // --------------------------
    // Read PASS/FAIL status
    // --------------------------
    const statusFile = path.join(projectRoot, "test-results", "status.txt");
    let testStatus = "PASSED";

    if (fs.existsSync(statusFile)) {
      testStatus = fs.readFileSync(statusFile, "utf8").trim();
    }

    const isFailed = testStatus === "FAILED";

    // --------------------------
    // ZIP entire test-reports
    // --------------------------
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

    console.log("Zipping test-reports...");
    await zipAllReports();

    // --------------------------
    // Gmail-safe renamed file
    // --------------------------
    const safeZipPath = zipPath + ".zp1";  // e.g. report.zip.zp1

    if (fs.existsSync(safeZipPath)) {
      fs.unlinkSync(safeZipPath);
    }

    fs.renameSync(zipPath, safeZipPath);

    // --------------------------
    // Safe Email HTML Body
    // --------------------------
    const timestamp = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
    });

    const emailHTML = `
      <div style="font-family:Arial;padding:20px;">
        <h2 style="color:#0056d6;">Playwright Automation Report</h2>
        <p><b>Status:</b> ${testStatus}</p>
        <p><b>Execution Time:</b> ${timestamp}</p>
        <p><b>Note:</b> Rename attached file to <b>.zip</b> before opening (Gmail safe mode).</p>
      </div>
    `;

    // --------------------------
    // Nodemailer Transport
    // --------------------------
    const transporter = nodemailer.createTransport({
      host: EMAIL_HOST || "smtp.gmail.com",
      port: EMAIL_PORT ? Number(EMAIL_PORT) : 465,
      secure: EMAIL_SECURE === "true",
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS
      }
    });

    // --------------------------
    // Email subject
    // --------------------------
    const subject = `${isFailed ? "FAILED" : "PASSED"} – Playwright Automation Report (${timestamp})`;

    // --------------------------
    // Send Email
    // --------------------------
    const mailOptions = {
      from: `"Playwright CI" <${EMAIL_USER}>`,
      to: EMAIL_TO,
      cc: EMAIL_CC || "",
      bcc: EMAIL_BCC || "",
      subject,
      html: emailHTML,
      attachments: [
        {
          filename: "playwright_full_report.zp1",
          path: safeZipPath,
          contentType: "application/octet-stream"
        }
      ]
    };

    console.log("Sending email...");
    await transporter.sendMail(mailOptions);

    console.log("Email sent successfully!");
    process.exit(0);

  } catch (err) {
    console.error("ERROR:", err);
    process.exit(1);
  }
})();
