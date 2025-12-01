import nodemailer from "nodemailer";

(async () => {
  try {
    const {
      EMAIL_USER,
      EMAIL_PASS,
      EMAIL_TO,
      EMAIL_CC,
      EMAIL_BCC,
      ARTIFACT_URL
    } = process.env;

    if (!EMAIL_USER || !EMAIL_PASS || !EMAIL_TO) {
      console.error("Missing email credentials");
      process.exit(1);
    }

    // --- READ PASS/FAIL STATUS ---
    const fs = await import("fs");
    let testStatus = "PASSED";
    if (fs.existsSync("test-results/status.txt")) {
      testStatus = fs.readFileSync("test-results/status.txt", "utf8").trim();
    }

    const timestamp = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

    const subject = `${testStatus === "FAILED" ? "❌ FAILED" : "✔ PASSED"} – Daily LQ Website Test Report (${timestamp})`;

    const html = `
      <div style="font-family:Arial;padding:20px;">
        <h2 style="color:#0056d6;">Playwright Automation Report</h2>

        <p><b>Status:</b> ${testStatus}</p>
        <p><b>Execution Time:</b> ${timestamp}</p>

        <h3>📥 Download Full Report</h3>
        <p>
          Click here to download the complete HTML + Screenshots report:<br>
          <a href="${ARTIFACT_URL}" target="_blank">
            ➜ OPEN REPORT ARTIFACT
          </a>
        </p>

        <p>Regards,<br><b>Playwright CI</b></p>
      </div>
    `;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: `"Playwright CI" <${EMAIL_USER}>`,
      to: EMAIL_TO,
      cc: EMAIL_CC || "",
      bcc: EMAIL_BCC || "",
      subject,
      html,
      attachments: [
        {
          filename: "MASTER_SUMMARY.html",
          path: "test-reports/MASTER_SUMMARY.html"
        }
      ]
    });

    console.log("📩 Email sent successfully!");
    process.exit(0);

  } catch (e) {
    console.error("Email Error:", e);
    process.exit(1);
  }
})();
