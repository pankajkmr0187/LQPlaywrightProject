// utils/reportUtils.js
// Final colorful ReportUtils with method-based auto folder naming and Option C thumbnails + full image
import fs from "fs";
import path from "path";

export class ReportUtils {
  constructor(page, providedName = "", parentFolder = "") {
    this.page = page || null;
    this.providedName = (providedName || "").toString();
    this.parentFolder = parentFolder || "";
    this.baseDir = "test-reports";

    // Timestamp (IST)
    const now = new Date();
    const ist = new Date(now.getTime() + 5.5 * 60 * 60 * 1000);
    this.timestamp = ist.toISOString().replace(/T/, "_").replace(/[:.]/g, "-").replace("Z", "");

    // Decide folder & shortName
    const { folderName, shortName, type } = this._decideFolderAndType();
    this.folderName = folderName;
    this.shortName = shortName;
    this.reportType = type; // "field" | "link" | "generic"

    // Paths
    this.folderPath = this.parentFolder
      ? path.join(this.baseDir, this.parentFolder, this.folderName)
      : path.join(this.baseDir, this.folderName);

    this.screenshotDir = path.join(this.folderPath, "screenshots");
    if (!fs.existsSync(this.baseDir)) fs.mkdirSync(this.baseDir, { recursive: true });
    if (!fs.existsSync(this.folderPath)) fs.mkdirSync(this.folderPath, { recursive: true });
    if (!fs.existsSync(this.screenshotDir)) fs.mkdirSync(this.screenshotDir, { recursive: true });

    // File names
    if (this.reportType === "field") {
      this.csvFile = path.join(this.folderPath, `fieldReport_${this.shortName}_${this.timestamp}.csv`);
      this.htmlFile = path.join(this.folderPath, `fieldReport_${this.shortName}_${this.timestamp}.html`);
      this.fieldHtmlFile = this.htmlFile;
    } else if (this.reportType === "link") {
      this.csvFile = path.join(this.folderPath, `${this.folderName}_${this.timestamp}.csv`);
      this.htmlFile = path.join(this.folderPath, `${this.folderName}_${this.timestamp}.html`);
      this.fieldHtmlFile = this.htmlFile;
    } else {
      this.csvFile = path.join(this.folderPath, `${this.folderName}_${this.timestamp}.csv`);
      this.htmlFile = path.join(this.folderPath, `${this.folderName}_${this.timestamp}.html`);
      this.fieldHtmlFile = this.htmlFile;
    }

    this.results = [];

    console.log(`🧾 Report Mode: ${this.reportType.toUpperCase()}`);
    console.log(`📂 Reports saved in: ${this.folderPath}`);
  }

  // -------------------------
  // Decide folder name & type by providedName OR stack caller
  // -------------------------
  _decideFolderAndType() {
    // helper mapper
    const mapFrom = (key) => {
      const k = key.toLowerCase();
      if (k.includes("schedule") || k.includes("demo")) return { folderName: "ScheduleDemoField", shortName: "ScheduleDemo", type: "field" };
      if (k.includes("try") || k.includes("free")) return { folderName: "TryForFreeField", shortName: "TryForFree", type: "field" };
      if (k.includes("verify") && (k.includes("link") || k.includes("landing") || k.includes("home"))) return { folderName: "HomePageLinkVerification", shortName: "HomePageLinkVerification", type: "link" };
      if (k.includes("blog")) return { folderName: "BlogsLinkVerification", shortName: "BlogsLinkVerification", type: "link" };
      if (k.includes("about")) return { folderName: "AboutLinkVerification", shortName: "AboutLinkVerification", type: "link" };
      if (k.includes("contact")) return { folderName: "ContactLinkVerification", shortName: "ContactLinkVerification", type: "link" };
      if (k.includes("admission")) return { folderName: "AdmissionLinkVerification", shortName: "AdmissionLinkVerification", type: "link" };
      // fallback
      return null;
    };

    // 1) If providedName is useful (like "HomePage" or "ScheduleDemo")
    if (this.providedName && this.providedName.trim()) {
      const m = mapFrom(this.providedName);
      if (m) return m;
      // if user passed "FieldReport" try to detect parent method
      if (this.providedName.toLowerCase().includes("field")) {
        const caller = this._getCallerMethodName();
        if (caller) {
          const mm = mapFrom(caller);
          if (mm) return mm;
        }
        return { folderName: "GenericField", shortName: "GenericField", type: "field" };
      }
      // default: try mapping the provided string itself
      const mm = mapFrom(this.providedName);
      if (mm) return mm;
    }

    // 2) Use caller method name from stack
    const caller = this._getCallerMethodName();
    if (caller) {
      const mm = mapFrom(caller);
      if (mm) return mm;
    }

    // 3) final fallback
    return { folderName: this.providedName || "GenericReport", shortName: this.providedName || "GenericReport", type: "generic" };
  }

  // Try to read calling method from stack
  _getCallerMethodName() {
    try {
      const stack = new Error().stack || "";
      const lines = stack.split("\n").map(l => l.trim());
      // find first line that is outside this file (skip lines containing reportUtils)
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (!line) continue;
        if (line.toLowerCase().includes("reportutils") || line.toLowerCase().includes("utils/reportutils")) continue;
        // match typical "at Class.method (file:line:col)" or "at method (file:line:col)"
        const m = line.match(/at\s+(.+?)\s+\(/);
        if (m && m[1]) {
          const full = m[1]; // might be Class.method
          const parts = full.split(".");
          const candidate = parts[parts.length - 1];
          if (candidate && candidate !== "new" && candidate !== "Object") return candidate;
        }
      }
    } catch (e) {
      // ignore
    }
    return null;
  }

  // -------------------------
  // log link results (used in your code)
  // -------------------------
  async logLinkResult(index, linkName, linkUrl, status, statusCode, error = "") {
    this.results.push({
      index,
      linkName,
      linkUrl,
      action: "-",
      status,
      statusCode,
      error,
      screenshot: "",
      timestamp: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
    });

    // highlight on page if possible
    try {
      if (this.page && typeof this.page.evaluate === "function") {
        await this.page.evaluate((url, status) => {
          const el = document.querySelector(`a[href="${url}"]`);
          if (el) {
            const color = status === "VERIFIED" ? "3px solid green" : status === "FAILED" ? "3px solid red" : "3px solid orange";
            el.style.outline = color;
            el.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }, linkUrl, status);
      }
    } catch (e) {
      // non-fatal
    }

    if (this.page && this.page.waitForTimeout) await this.page.waitForTimeout(200);
  }

  // -------------------------
  // addStep for fields (used in your code)
  // -------------------------
  async addStep(label, action, status, takeScreenshot = false) {
    let screenshotPath = "";
    if (takeScreenshot && this.page && typeof this.page.screenshot === "function") {
      try {
        const safeLabel = label.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_\-]/g, "");
        const filename = `${safeLabel}_${this.results.length + 1}.png`;
        const fullPath = path.join(this.screenshotDir, filename);
        await this.page.screenshot({ path: fullPath });
        screenshotPath = fullPath.replace(/\\/g, "/");
      } catch (e) {
        screenshotPath = "";
      }
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

  // -------------------------
  // CSV generation (common)
  // -------------------------
  generateCSVReport() {
    try {
      const header = [
        "Index",
        "Name",
        "URL",
        "Action",
        "Status",
        "Status Code",
        "Error",
        "Screenshot",
        "Timestamp"
      ];
      const rows = this.results.map(r => [
        r.index || "",
        r.linkName || "",
        r.linkUrl || "",
        r.action || "-",
        r.status || "",
        r.statusCode || "-",
        r.error || "-",
        r.screenshot || "",
        r.timestamp || ""
      ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(","));

      const csv = [header.join(","), ...rows].join("\n");
      fs.writeFileSync(this.csvFile, csv, "utf8");
      console.log(`📊 CSV Report generated: ${this.csvFile}`);
    } catch (err) {
      console.log("❌ CSV generation error:", err.message);
    }
  }

  // -------------------------
  // Colorful HTML generation for links
  // -------------------------
  generateHTMLReport() {
    try {
      const links = this.results.filter(r => r.linkUrl && r.linkUrl !== "-");
      const total = links.length;
      const pass = links.filter(l => l.status === "VERIFIED").length;
      const fail = links.filter(l => l.status === "FAILED").length;
      const other = total - pass - fail;

      const rows = links.map(r => `
<tr class="${r.status === "VERIFIED" ? "pass" : r.status === "FAILED" ? "fail" : "error"}">
  <td>${r.index}</td>
  <td>${this._escapeHtml(r.linkName)}</td>
  <td><a href="${r.linkUrl}" target="_blank" rel="noopener noreferrer">${this._escapeHtml(r.linkUrl)}</a></td>
  <td><span class="badge ${r.status.toLowerCase()}">${r.status}</span></td>
  <td>${r.statusCode || "-"}</td>
  <td>${this._escapeHtml(r.error || "-")}</td>
  <td>${r.timestamp}</td>
</tr>`).join("\n");

      const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<title>${this.folderName} - Link Verification</title>
<style>
  body{font-family:Inter,Arial,Helvetica,sans-serif;background:#f3f7fb;margin:20px;color:#222}
  h2{margin-bottom:6px}
  .summary{display:flex;gap:12px;margin:12px 0 18px}
  .card{padding:14px 18px;border-radius:12px;color:#fff;font-weight:700;box-shadow:0 4px 10px rgba(2,6,23,0.08)}
  .card.pass{background:linear-gradient(90deg,#28a745,#2ecc71)}
  .card.fail{background:linear-gradient(90deg,#dc3545,#ff6b6b)}
  .card.other{background:linear-gradient(90deg,#ffc107,#ffd66b);color:#000}
  table{width:100%;border-collapse:collapse;background:#fff;box-shadow:0 6px 18px rgba(2,6,23,0.06)}
  th,td{padding:10px;border:1px solid #e6e9ef;text-align:left;font-size:13px}
  th{background:#222;color:#fff}
  tr.pass{background:#e9fff0}
  tr.fail{background:#fff0f0}
  tr.error{background:#fffaf0}
  .badge{padding:6px 10px;border-radius:18px;color:#fff;font-weight:700;font-size:12px}
  .badge.verified{background:#28a745}
  .badge.failed{background:#dc3545}
  .badge.error{background:#ffb020;color:#000}
  a{color:#0366d6;word-break:break-all}
  .meta{color:#666;font-size:13px;margin-bottom:8px}
</style>
</head>
<body>
  <h2>🔗 ${this.folderName} — Link Verification Report</h2>
  <div class="meta">Generated: ${this.timestamp}</div>
  <div class="summary">
    <div class="card pass">Passed: ${pass}</div>
    <div class="card fail">Failed: ${fail}</div>
    <div class="card other">Other: ${other}</div>
  </div>

  <table>
    <thead>
      <tr><th>#</th><th>Link Name</th><th>URL</th><th>Status</th><th>Code</th><th>Error</th><th>Timestamp</th></tr>
    </thead>
    <tbody>
      ${rows || `<tr><td colspan="7" style="text-align:center;padding:18px">No links recorded</td></tr>`}
    </tbody>
  </table>
</body>
</html>`;

      fs.writeFileSync(this.htmlFile, html, "utf8");
      console.log(`📄 HTML Report generated: ${this.htmlFile}`);
    } catch (err) {
      console.log("❌ HTML generation error:", err.message);
    }
  }

  // -------------------------
  // Colorful Field HTML (with thumbnail -> full image links)
  // -------------------------
  generateFieldHTMLReport() {
    try {
      const fields = this.results.filter(r => r.linkUrl === "-");
      const total = fields.length;
      const success = fields.filter(f => f.status === "Success").length;
      const failed = total - success;

      const rows = fields.map(r => {
        const thumb = r.screenshot ? `<a href="${r.screenshot}" target="_blank" rel="noopener noreferrer"><img src="${r.screenshot}" width="150" style="border-radius:6px;border:1px solid #ccc"/></a>` : "";
        return `<tr class="${r.status === "Success" ? "pass" : "fail"}">
  <td>${r.index}</td>
  <td>${this._escapeHtml(r.linkName)}</td>
  <td><span class="badge ${r.status === "Success" ? "success" : "failed"}">${r.status}</span></td>
  <td>${this._escapeHtml(r.error || "-")}</td>
  <td>${r.timestamp}</td>
  <td>${thumb}</td>
</tr>`;
      }).join("\n");

      const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<title>${this.folderName} - Field Report</title>
<style>
  body{font-family:Inter,Arial,Helvetica,sans-serif;background:#f5f7fa;margin:18px;color:#222}
  h2{margin-bottom:6px}
  .summary{display:flex;gap:12px;margin:12px 0 18px}
  .card{padding:14px 18px;border-radius:12px;color:#fff;font-weight:700;box-shadow:0 4px 10px rgba(2,6,23,0.06)}
  .card.total{background:linear-gradient(90deg,#007bff,#4aa3ff)}
  .card.success{background:linear-gradient(90deg,#28a745,#2ecc71)}
  .card.fail{background:linear-gradient(90deg,#dc3545,#ff6b6b)}
  table{width:100%;border-collapse:collapse;background:#fff;box-shadow:0 6px 18px rgba(2,6,23,0.06)}
  th,td{padding:10px;border:1px solid #e6e9ef;text-align:left;font-size:13px}
  th{background:#222;color:#fff}
  tr.pass{background:#e9fff0}
  tr.fail{background:#fff0f0}
  .badge{padding:6px 10px;border-radius:18px;color:#fff;font-weight:700;font-size:12px}
  .badge.success{background:#28a745}
  .badge.failed{background:#dc3545}
  img{border-radius:6px}
</style>
</head>
<body>
  <h2>📋 ${this.folderName} - Field Report</h2>
  <div class="meta">Generated: ${this.timestamp}</div>
  <div class="summary">
    <div class="card total">Total: ${total}</div>
    <div class="card success">Success: ${success}</div>
    <div class="card fail">Failed: ${failed}</div>
  </div>

  <table>
    <thead><tr><th>#</th><th>Field Name</th><th>Status</th><th>Error</th><th>Timestamp</th><th>Screenshot</th></tr></thead>
    <tbody>
      ${rows || `<tr><td colspan="6" style="text-align:center;padding:18px">No field steps recorded</td></tr>`}
    </tbody>
  </table>
</body>
</html>`;

      fs.writeFileSync(this.fieldHtmlFile, html, "utf8");
      console.log(`📄 Field HTML Report generated: ${this.fieldHtmlFile}`);
    } catch (err) {
      console.log("❌ Field HTML generation error:", err.message);
    }
  }

  // -------------------------
  // Utility escape
  // -------------------------
  _escapeHtml(s) {
    if (!s && s !== 0) return "";
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
}
