// ✅ FINAL ReportUtils.js (Full Link + Field Level Reporting)
import fs from "fs";
import path from "path";

export class ReportUtils {
  constructor(page, folderName, parentFolder = "") {
    this.page = page;
    this.baseDir = "test-reports";

    // 🕓 Indian Standard Time
    const now = new Date();
    const istTime = new Date(now.getTime() + 5.5 * 60 * 60 * 1000);
    this.timestamp = istTime
      .toISOString()
      .replace(/T/, "_")
      .replace(/[:.]/g, "-")
      .replace("Z", "");

    // 🗂 Folder structure
    this.folderPath = parentFolder
      ? path.join(this.baseDir, parentFolder, folderName)
      : path.join(this.baseDir, folderName);

    this.screenshotDir = path.join(this.folderPath, "screenshots");

    // 🧾 Ensure directories exist
    [this.baseDir, this.folderPath, this.screenshotDir].forEach((dir) => {
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    });

    // 📄 File names
    const reportName = `${folderName}_${this.timestamp}`;
    this.csvFile = path.join(this.folderPath, `${reportName}.csv`);
    this.htmlFile = path.join(this.folderPath, `${reportName}.html`);
    this.fieldHtmlFile = path.join(this.folderPath, `${folderName}_FIELD_REPORT_${this.timestamp}.html`);

    this.folderName = folderName;
    this.results = [];

    console.log(`🧾 Report Mode: INDIVIDUAL`);
    console.log(`📂 Reports saved in: ${this.folderPath}`);
  }

  // ======================================================================
  // 🔹 LINK LOGGING
  // ======================================================================
  async logLinkResult(index, linkName, linkUrl, status, statusCode, error = "") {
    const record = {
      index,
      linkName,
      linkUrl,
      status,
      statusCode,
      error,
      timestamp: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
      screenshot: ""
    };

    this.results.push(record);

    try {
      await this.page.evaluate((url, status) => {
        const el = document.querySelector(`a[href="${url}"]`);
        if (el) {
          const color =
            status === "VERIFIED"
              ? "3px solid green"
              : status === "FAILED"
              ? "3px solid red"
              : "3px solid orange";
          el.style.outline = color;
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, linkUrl, status);
    } catch {
      console.log(`⚠️ Highlight failed for ${linkName}`);
    }

    await this.page.waitForTimeout(300);
  }

  // ======================================================================
  // 🔹 FIELD LEVEL STEP LOGGING
  // ======================================================================
  async addStep(label, action, status, takeScreenshot = false) {
    let screenshotPath = "";

    if (takeScreenshot) {
      const safeName = label.replace(/\s+/g, "_");
      screenshotPath = path.join(this.screenshotDir, `${safeName}.png`);
      await this.page.screenshot({ path: screenshotPath });
      screenshotPath = screenshotPath.replace(/\\/g, "/");
    }

    this.results.push({
      index: this.results.length + 1,
      linkName: label,
      linkUrl: "-",
      action,
      status,
      statusCode: "-",
      error: status === "Success" ? "" : "Error filling field",
      screenshot: screenshotPath,
      timestamp: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
    });
  }

  // ======================================================================
  // 🔹 CSV REPORT (Links + Fields)
  // ======================================================================
  generateCSVReport() {
    const header = [
      "Index",
      "Name",
      "URL",
      "Action",
      "Status",
      "Status Code",
      "Error",
      "Screenshot",
      "Timestamp",
    ];

    const rows = this.results.map((r) => [
      r.index,
      r.linkName,
      r.linkUrl,
      r.action || "-",
      r.status,
      r.statusCode || "-",
      r.error || "-",
      r.screenshot,
      r.timestamp,
    ]);

    const csvContent = [
      header.join(","),
      ...rows.map((r) => r.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(",")),
    ].join("\n");

    fs.writeFileSync(this.csvFile, csvContent, "utf-8");
    console.log(`📊 CSV Report generated: ${this.csvFile}`);
  }

  // ======================================================================
  // 🔹 HTML REPORT (Links ONLY)
  // ======================================================================
  generateHTMLReport() {
    let rows = this.results
      .filter((r) => r.linkUrl !== "-")
      .map(
        (r) => `
      <tr class="${r.status === "VERIFIED" ? "pass" : r.status === "FAILED" ? "fail" : "error"}">
        <td>${r.index}</td>
        <td>${r.linkName}</td>
        <td><a href="${r.linkUrl}" target="_blank">${r.linkUrl}</a></td>
        <td>${r.status}</td>
        <td>${r.statusCode}</td>
        <td>${r.error}</td>
        <td>${r.timestamp}</td>
      </tr>`
      )
      .join("");

    let html = `
<!DOCTYPE html>
<html lang="en">
<head>
<title>${this.folderName} - Link Verification</title>
<style>
  body { font-family:Arial; margin:20px; }
  table { width:100%; border-collapse:collapse; }
  th,td { border:1px solid #ccc; padding:8px; }
  .pass { background:#d4ffd4; }
  .fail { background:#ffd4d4; }
  .error { background:#fff4d4; }
</style>
</head>
<body>
  <h2>${this.folderName} - Link Verification Report</h2>
  <table>
    <tr><th>#</th><th>Link Name</th><th>URL</th><th>Status</th><th>Status Code</th><th>Error</th><th>Timestamp</th></tr>
    ${rows}
  </table>
</body>
</html>
`;

    fs.writeFileSync(this.htmlFile, html, "utf-8");
    console.log(`📄 HTML Report generated: ${this.htmlFile}`);
  }

  // ======================================================================
  // 🔹 FIELD LEVEL HTML REPORT
  // ======================================================================
  generateFieldHTMLReport() {
    let rows = this.results
      .filter((r) => r.linkUrl === "-")
      .map(
        (r) => `
      <tr class="${r.status === "Success" ? "pass" : "fail"}">
        <td>${r.index}</td>
        <td>${r.linkName}</td>
        <td>${r.status}</td>
        <td>${r.error || "-"}</td>
        <td>${r.timestamp}</td>
        <td>${r.screenshot ? `<img src="${r.screenshot}" width="200"/>` : ""}</td>
      </tr>`
      )
      .join("");

    let html = `
<!DOCTYPE html>
<html lang="en">
<head>
<title>${this.folderName} - Field Level Report</title>
<style>
body { font-family:Arial; margin:20px; }
table { border-collapse:collapse; width:100%; }
th,td { border:1px solid #ccc; padding:8px; }
.pass { background:#d4ffd4; }
.fail { background:#ffd4d4; }
img { border:1px solid #222; }
</style>
</head>
<body>
  <h2>${this.folderName} - Field-Level Form Report</h2>
  <table>
    <tr>
      <th>#</th>
      <th>Field</th>
      <th>Status</th>
      <th>Error</th>
      <th>Timestamp</th>
      <th>Screenshot</th>
    </tr>
    ${rows}
  </table>
</body>
</html>
`;

    fs.writeFileSync(this.fieldHtmlFile, html, "utf-8");
    console.log(`📄 Field-Level HTML Report generated: ${this.fieldHtmlFile}`);
  }
}
