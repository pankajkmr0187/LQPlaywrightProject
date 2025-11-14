// ESM compatible imports
import fs from "fs";
import path from "path";
import nodemailer from "nodemailer";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async () => {
  try {
    const {
      EMAIL_USER,
      EMAIL_PASS,
      EMAIL_TO,
      EMAIL_HOST,
      EMAIL_PORT,
      EMAIL_SECURE,
    } = process.env;

    if (!EMAIL_USER || !EMAIL_PASS || !EMAIL_TO) {
      console.error("Missing email environment variables. Exiting.");
      process.exit(1);
    }

    const projectRoot = process.cwd();
    const possibleReports = [
      path.join(projectRoot, "test-reports", "playwright-html", "index.html"),
      path.join(projectRoot, "playwright-report", "index.html"),
      path.join(projectRoot, "test-reports", "playwright-html", "results.json"),
    ];

    let foundPath = null;
    for (const p of possibleReports) {
      if (fs.existsSync(p)) {
        foundPath = p;
        break;
      }
    }

    const transporter = nodemailer.createTransport({
      host: EMAIL_HOST || "smtp.gmail.com",
      port: EMAIL_PORT ? Number(EMAIL_PORT) : 587,
      secure: EMAIL_SECURE === "true" || EMAIL_SECURE === "1",
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Playwright CI" <${EMAIL_USER}>`,
      to: EMAIL_TO,
      subject: `Playwright Test Report - ${new Date().toLocaleString()}`,
      text: "",
      html: "",
      attachments: [],
    };

    if (foundPath) {
      const ext = path.extname(foundPath).toLowerCase();

      if (ext === ".html") {
        mailOptions.text =
          "Playwright HTML report attached. Open in browser to view.";
        mailOptions.html = `<p>HTML report attached: <b>index.html</b></p>`;
        mailOptions.attachments.push({
          filename: "playwright-report.html",
          path: foundPath,
          contentType: "text/html",
        });
      } else if (ext === ".json") {
        const jsonContent = fs.readFileSync(foundPath, "utf8");
        mailOptions.text = "Playwright JSON results attached.";
        mailOptions.attachments.push({
          filename: "results.json",
          content: jsonContent,
          contentType: "application/json",
        });
      }
    } else {
      mailOptions.text = "No report found. Check CI logs.";
      mailOptions.html = `<p>No report found. Checked:<br>${possibleReports.join(
        "<br/>"
      )}</p>`;
    }

    console.log("Sending email to:", EMAIL_TO, "attachment:", foundPath);
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);

    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
})();
