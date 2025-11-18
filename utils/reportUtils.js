import fs from "fs";
import path from "path";

export class ReportUtils {
  constructor(page, providedName = "", parentFolder = "") {
    this.page = page || null;
    this.providedName = (providedName || "").toString();
    this.parentFolder = parentFolder || "";
    this.baseDir = "test-reports";

    // IST Timestamp
    const now = new Date();
    const ist = new Date(now.getTime() + 5.5 * 60 * 60 * 1000);
    this.timestamp = ist
      .toISOString()
      .replace(/T/, "_")
      .replace(/[:.]/g, "-")
      .replace("Z", "");

    // Decide folder
    const { folderName, shortName, type } = this._decideFolderAndType();
    this.folderName = folderName;
    this.shortName = shortName;
    this.reportType = type;

    // Folder path
    this.folderPath = this.parentFolder
      ? path.join(this.baseDir, this.parentFolder, this.folderName)
      : path.join(this.baseDir, this.folderName);

    this.screenshotDir = path.join(this.folderPath, "screenshots");

    // Create folders
    if (!fs.existsSync(this.baseDir)) fs.mkdirSync(this.baseDir, { recursive: true });
    if (!fs.existsSync(this.folderPath)) fs.mkdirSync(this.folderPath, { recursive: true });
    if (!fs.existsSync(this.screenshotDir)) fs.mkdirSync(this.screenshotDir, { recursive: true });

    // File names
    this.csvFile = path.join(this.folderPath, `${this.shortName}_${this.timestamp}.csv`);
    this.htmlFile = path.join(this.folderPath, `${this.shortName}_${this.timestamp}.html`);
    this.fieldHtmlFile = this.htmlFile;

    this.results = [];

    console.log(`📁 Report Folder: ${this.folderPath}`);
  }

  // Decide folder name
  _decideFolderAndType() {
    const map = (key) => {
      const k = key.toLowerCase();

      // 🟢 MERGED FOLDER FOR BOTH FORMS
      if (
        k.includes("schedule") ||
        k.includes("demo") ||
        k.includes("try") ||
        k.includes("free")
      ) {
        return { folderName: "FieldsForm", shortName: "FieldsForm", type: "field" };
      }

      // Links
      if (k.includes("verify") || k.includes("link"))
        return { folderName: "HomePageLinkVerification", shortName: "LinkReport", type: "link" };

      return null;
    };

    // From providedName
    if (this.providedName) {
      const m = map(this.providedName);
      if (m) return m;
    }

    // From method name
    const caller = this._getCallerMethodName();
    if (caller) {
      const m = map(caller);
      if (m) return m;
    }

    return { folderName: "GenericReport", shortName: "GenericReport", type: "generic" };
  }

  // Detect calling method (UNIVERSAL FIX)
  _getCallerMethodName() {
    try {
      const stack = new Error().stack.split("\n");

      for (const line of stack) {
        // pattern:  at scheduleDemoForm (/path/file.js:line)
        const match = line.match(/at\s+(\w+)\s+\(/);
        if (match && match[1]) {
          return match[1];
        }
      }
    } catch {}

    return null;
  }

  // Log link results
  async logLinkResult(index, name, url, status, statusCode, error = "") {
    this.results.push({
      index,
      linkName: name,
      linkUrl: url,
      action: "-",
      status,
      statusCode,
      error,
      screenshot: "",
      timestamp: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
    });

    try {
      if (this.page?.evaluate) {
        await this.page.evaluate((url, status) => {
          const el = document.querySelector(`a[href="${url}"]`);
          if (el) {
            el.style.outline = `3px solid ${status === "VERIFIED" ? "green" : "red"}`;
          }
        }, url, status);
      }
    } catch {}

    if (this.page?.waitForTimeout) await this.page.waitForTimeout(200);
  }

  // Field steps
  async addStep(label, action, status, takeScreenshot = false) {
    let screenshotPath = "";

    if (takeScreenshot && this.page?.screenshot) {
      const safe = label.replace(/\s+/g, "_");
      const file = `${safe}_${this.results.length + 1}.png`;
      const full = path.join(this.screenshotDir, file);
      await this.page.screenshot({ path: full });
      screenshotPath = full.replace(/\\/g, "/");
    }

    this.results.push({
      index: this.results.length + 1,
      linkName: label,
      linkUrl: "-",
      action,
      status,
      statusCode: "-",
      error: status === "Success" ? "" : "Failed",
      screenshot: screenshotPath,
      timestamp: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
    });
  }

  // CSV
  generateCSVReport() {
    const header = [
      "Index", "Name", "URL", "Action",
      "Status", "Status Code", "Error", "Screenshot", "Timestamp"
    ];

    const rows = this.results.map(r =>
      [
        r.index, r.linkName, r.linkUrl, r.action,
        r.status, r.statusCode, r.error, r.screenshot, r.timestamp
      ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")
    );

    const csv = [header.join(","), ...rows].join("\n");
    fs.writeFileSync(this.csvFile, csv, "utf8");
    console.log(`📊 CSV saved: ${this.csvFile}`);
  }

  // Link HTML
  generateHTMLReport() {
    const links = this.results.filter(r => r.linkUrl !== "-");

    const rows = links.map(r => `
<tr class="${r.status === "VERIFIED" ? "pass" : "fail"}">
  <td>${r.index}</td>
  <td>${r.linkName}</td>
  <td><a href="${r.linkUrl}" target="_blank">${r.linkUrl}</a></td>
  <td>${r.status}</td>
  <td>${r.statusCode}</td>
  <td>${r.error}</td>
  <td>${r.timestamp}</td>
</tr>`).join("");

    const html = `
<!doctype html>
<html>
<head>
<style>
body { font-family: Arial; background:#f3f7fb; margin:20px; }
table{ width:100%; border-collapse:collapse; background:white; }
th,td{ border:1px solid #ddd; padding:10px; }
.pass{ background:#d4ffd4; }
.fail{ background:#ffd4d4; }
</style>
</head>
<body>
<h2>🔗 Link Report</h2>
<table>
<tr><th>#</th><th>Name</th><th>URL</th><th>Status</th><th>Code</th><th>Error</th><th>Time</th></tr>
${rows}
</table>
</body>
</html>`;

    fs.writeFileSync(this.htmlFile, html, "utf8");
    console.log(`📄 Link HTML saved: ${this.htmlFile}`);
  }

  // Field HTML
  generateFieldHTMLReport() {
    const fields = this.results.filter(r => r.linkUrl === "-");

    const rows = fields.map(r => `
<tr class="${r.status === "Success" ? "pass" : "fail"}">
  <td>${r.index}</td>
  <td>${r.linkName}</td>
  <td>${r.status}</td>
  <td>${r.error}</td>
  <td>${r.timestamp}</td>
  <td>${r.screenshot ? `<img src="${r.screenshot}" width="150">` : ""}</td>
</tr>`).join("");

    const html = `
<!doctype html>
<html>
<head>
<style>
body { font-family: Arial; background:#f5f7fa; margin:20px; }
table{ width:100%; border-collapse:collapse; background:white; }
th,td{ border:1px solid #ddd; padding:10px; }
.pass{ background:#d4ffd4; }
.fail{ background:#ffd4d4; }
</style>
</head>
<body>
<h2>📋 Field Report</h2>
<table>
<tr><th>#</th><th>Field</th><th>Status</th><th>Error</th><th>Time</th><th>Screenshot</th></tr>
${rows}
</table>
</body>
</html>`;

    fs.writeFileSync(this.fieldHtmlFile, html, "utf8");
    console.log(`📄 Field HTML saved: ${this.fieldHtmlFile}`);
  }
}
