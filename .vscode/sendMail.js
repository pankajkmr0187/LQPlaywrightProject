// CommonJS (safe for GitHub Actions)
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");

(async () => {
  try {
    // --- Read env (set in workflow secrets) ---
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

    // --- Possible report locations (check in order) ---
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

    // --- Prepare transporter ---
    const transporter = nodemailer.createTransport({
      host: EMAIL_HOST || "smtp.gmail.com",
      port: EMAIL_PORT ? Number(EMAIL_PORT) : 587,
      secure: EMAIL_SECURE === "true" || EMAIL_SECURE === "1" ? true : false,
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });

    // --- Compose mail ---
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
        mailOptions.text = "Playwright HTML report attached. Open in a browser to view details.";
        mailOptions.html = `<p>Playwright HTML report attached. <br/>Download and open <b>index.html</b> to view.</p>`;
        mailOptions.attachments.push({
          filename: "playwright-report.html",
          path: foundPath,
          contentType: "text/html",
        });
      } else if (ext === ".json") {
        const jsonContent = fs.readFileSync(foundPath, "utf8");
        mailOptions.text = "Playwright JSON results attached.";
        mailOptions.html = `<p>Playwright JSON results attached.</p>`;
        mailOptions.attachments.push({
          filename: "results.json",
          content: jsonContent,
          contentType: "application/json",
        });
      } else {
        // generic attach
        mailOptions.text = "Playwright report attached.";
        mailOptions.attachments.push({
          filename: path.basename(foundPath),
          path: foundPath,
        });
      }
    } else {
      // fallback: no report found
      mailOptions.text =
        "Playwright finished but no HTML report was found at expected locations. Check the CI logs.";
      mailOptions.html = `<p>Playwright finished but no HTML report was found at expected locations.</p>
                         <p>Checked: ${possibleReports.join("<br/>")}</p>`;
    }

    // --- Send mail ---
    console.log("Sending email to:", EMAIL_TO, "attachment:", foundPath || "none");
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId || info);

    process.exit(0);
  } catch (err) {
    console.error("Error sending email:", err);
    process.exit(1);
  }
})();
