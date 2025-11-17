// ✅ FINAL ReportUtils.js — Auto Folder Naming + Field/Link Routing (ZERO BREAKING)
import fs from "fs";
import path from "path";

export class ReportUtils {
  constructor(page, rawName) {
    this.page = page;
    this.baseDir = "test-reports";

    // Detect calling method (parent)
    const parentMethod = this.getCallerMethodName();

    // Auto folder naming rules
    this.folderName = this.getSmartFolderName(rawName, parentMethod);

    // Timestamp IST
    const now = new Date();
    const istTime = new Date(now.getTime() + 5.5 * 60 * 60 * 1000);
    this.timestamp = istTime
      .toISOString()
      .replace(/T/, "_")
      .replace(/[:.]/g, "-")
      .replace("Z", "");

    // Folder
    this.folderPath = path.join(this.baseDir, this.folderName);
    this.screenshotDir = path.join(this.folderPath, "screenshots");

    [this.baseDir, this.folderPath, this.screenshotDir].forEach((dir) => {
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    });

    // File names
    const mainPrefix = `${this.folderName}_${this.timestamp}`;
    this.csvFile = path.join(this.folderPath, `${mainPrefix}.csv`);
    this.htmlFile = path.join(this.folderPath, `${mainPrefix}.html`);
    this.fieldHtmlFile = path.join(
      this.folderPath,
      `${this.folderName}_FIELD_REPORT_${this.timestamp}.html`
    );

    this.results = [];

    console.log(`📁 Using folder: ${this.folderName}`);
  }

  // ---------------------------------------------------------------------
  // 🔥 Auto detect parent method name
  // ---------------------------------------------------------------------
  getCallerMethodName() {
    const stack = new Error().stack.split("\n");
    if (stack.length < 4) return "UnknownMethod";

    const line = stack[3];
    const match = line.match(/at\s+(.+?)\s/);
    return match ? match[1].replace("async ", "").trim() : "UnknownMethod";
  }

  // ---------------------------------------------------------------------
  // 🔥 Smart folder naming logic
  // ---------------------------------------------------------------------
  getSmartFolderName(rawName, method) {
    const m = method.toLowerCase();

    // Field Reports
    if (m.includes("schedule")) return "ScheduleDemoField";
    if (m.includes("tryforfree")) return "TryForFreeField";

    // Link Verification
    if (m.includes("landing") || m.includes("homepage")) return "HomePageLinkVerification";
    if (m.includes("blog")) return "BlogsLinkVerification";

    // Default fallback (old behaviour)
    return rawName;
  }

  // ---------------------------------------------------------------------
  // 🔗 LINK LOGGING
  // ---------------------------------------------------------------------
  async logLinkResult(index, linkName, linkUrl, status, statusCode, error = "") {
    this.results.push({
      index,
      linkName,
      linkUrl,
      status,
      statusCode,
      error,
      timestamp: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
      screenshot: "",
    });

    try {
      await this.page.evaluate((url, status) => {
        const el = document.querySelector(`a[href="${url}"]`);
        if (el) {
          el.style.outline =
            status === "VERIFIED"
              ? "3px solid green"
              : status === "FAILED"
              ? "3px solid red"
              : "3px solid orange";

          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, linkUrl, status);
    } catch {}

    await this.page.waitForTimeout(300);
  }

  // ---------------------------------------------------------------------
  // 🧾 FIELD LEVEL LOGGING
  // ---------------------------------------------------------------------
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

  // ---------------------------------------------------------------------
  // CSV Report
  // ---------------------------------------------------------------------
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
      ...rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")),
    ].join("\n");

    fs.writeFileSync(this.csvFile, csvContent, "utf-8");
    console.log(`📄 CSV saved → ${this.csvFile}`);
  }

  // ---------------------------------------------------------------------
  // HTML Report (Links)
  // ---------------------------------------------------------------------
  generateHTMLReport() {
    const total = this.results.filter((r) => r.linkUrl !== "-").length;
    const pass = this.results.filter((r) => r.status === "VERIFIED").length;
    const fail = this.results.filter((r) => r.status === "FAILED").length;
    const error = total - pass - fail;

    let rows = this.results
      .filter((r) => r.linkUrl !== "-")
      .map(
        (r) => `
<tr class="${r.status.toLowerCase()}">
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

    const html = `
<!DOCTYPE html><html><head><title>${this.folderName} Report</title></head>
<body>
<h2>${this.folderName} - Link Report</h2>
<p>Total: ${total}, Passed: ${pass}, Failed: ${fail}, Errors: ${error}</p>
<table border="1" cellspacing="0" cellpadding="6">
<tr><th>#</th><th>Name</th><th>URL</th><th>Status</th><th>Status Code</th><th>Error</th><th>Time</th></tr>
${rows}
</table>
</body></html>`;

    fs.writeFileSync(this.htmlFile, html, "utf-8");
    console.log(`📄 HTML saved → ${this.htmlFile}`);
  }

  // ---------------------------------------------------------------------
  // HTML Report (Field-Level)
  // ---------------------------------------------------------------------
  generateFieldHTMLReport() {
    const fields = this.results.filter((r) => r.linkUrl === "-");
    const total = fields.length;
    const success = fields.filter((r) => r.status === "Success").length;

    let rows = fields
      .map(
        (r) => `
<tr class="${r.status}">
<td>${r.index}</td>
<td>${r.linkName}</td>
<td>${r.status}</td>
<td>${r.error}</td>
<td>${r.timestamp}</td>
<td>${r.screenshot ? `<img src="${r.screenshot}" width="120">` : ""}</td>
</tr>`
      )
      .join("");

    const html = `
<!DOCTYPE html><html><head><title>${this.folderName} Field Report</title></head>
<body>
<h2>${this.folderName} - Field Report</h2>
<p>Total: ${total}, Success: ${success}, Failed: ${total - success}</p>
<table border="1" cellspacing="0" cellpadding="6">
<tr><th>#</th><th>Field</th><th>Status</th><th>Error</th><th>Time</th><th>Screenshot</th></tr>
${rows}
</table>
</body></html>`;

    fs.writeFileSync(this.fieldHtmlFile, html, "utf-8");
    console.log(`📄 Field HTML saved → ${this.fieldHtmlFile}`);
  }
}
