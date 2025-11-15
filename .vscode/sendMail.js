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
      EMAIL_SECURE,
    } = process.env;

    if (!EMAIL_USER || !EMAIL_PASS || !EMAIL_TO) {
      console.error("Missing email environment variables. Exiting.");
      process.exit(1);
    }

    const projectRoot = process.cwd();
    const reportHTML = path.join(projectRoot, "test-reports", "playwright-html", "index.html");
    const reportZIP = path.join(projectRoot, "test-reports", "playwright_report.zip");

    // ZIP Creation Logic
    const zipHTMLReport = async () => {
      return new Promise((resolve, reject) => {
        const output = fs.createWriteStream(reportZIP);
        const archive = archiver("zip", { zlib: { level: 9 } });

        archive.pipe(output);
        archive.file(reportHTML, { name: "playwright-report.html" });

        output.on("close", resolve);
        archive.on("error", reject);

        archive.finalize();
      });
    };

    // check if report exists
    if (fs.existsSync(reportHTML)) {
      console.log("Found HTML report → zipping...");
      await zipHTMLReport();
    } else {
      console.error("HTML report not found:", reportHTML);
      process.exit(1);
    }

    // EMAIL Transporter
    const transporter = nodemailer.createTransport({
      host: EMAIL_HOST || "smtp.gmail.com",
      port: EMAIL_PORT ? Number(EMAIL_PORT) : 465,
      secure: EMAIL_SECURE === "true",
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Playwright CI" <${EMAIL_USER}>`,
      to: EMAIL_TO,
      cc: EMAIL_CC || "",
      bcc: EMAIL_BCC || "",
      subject: `Playwright CI – ZIP Report ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}`,
      text: "Playwright ZIP report attached.",
      html: `<p>Playwright ZIP report attached.</p>`,
      attachments: [
        {
          filename: "playwright_report.zip",
          path: reportZIP,
          contentType: "application/zip"
        }
      ]
    };

    console.log("Sending email to →", EMAIL_TO);
    if (EMAIL_CC) console.log("CC →", EMAIL_CC);
    if (EMAIL_BCC) console.log("BCC →", EMAIL_BCC);

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);

    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
})();
