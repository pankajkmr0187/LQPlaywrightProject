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

      // 📁 Match test folder structure: tests/XX_folder_name/Y_pageName.spec.js
      // Report structure: test-reports/XX_folder_name/Y_pageName/
      
      // 01_mob_home page
      if (k.includes("homepage") || k.includes("schedule") || k.includes("demo") || k.includes("try") || k.includes("free") || k.includes("home")) {
        return { folderName: "01_mob_home/HomePage", shortName: "HomePage", type: "combined" };
      }
      
      // 02_mob_aboutus pages
      if (k.includes("visionmission") || k.includes("vision")) {
        return { folderName: "02_mob_aboutus/1_VisionMission", shortName: "VisionMission", type: "links" };
      }
      if (k.includes("whylearnqoch") || k.includes("whylearn")) {
        return { folderName: "02_mob_aboutus/2_WhyLearnQoch", shortName: "WhyLearnQoch", type: "links" };
      }
      if (k.includes("leadership")) {
        return { folderName: "02_mob_aboutus/3_LeadershipTeam", shortName: "LeadershipTeam", type: "links" };
      }
      
      // 03_mob_k12 pages
      if (k.includes("advancedlms") && k.includes("k12")) {
        return { folderName: "03_mob_k12/1_AdvancedLMS", shortName: "K12_AdvancedLMS", type: "links" };
      }
      if (k.includes("schoolerp") || (k.includes("erp") && k.includes("k12"))) {
        return { folderName: "03_mob_k12/2_SchoolERP", shortName: "K12_SchoolERP", type: "links" };
      }
      if (k.includes("coding") && k.includes("k12")) {
        return { folderName: "03_mob_k12/3_CodingForSchools", shortName: "K12_Coding", type: "links" };
      }
      if (k.includes("career") && k.includes("k12")) {
        return { folderName: "03_mob_k12/4_CareerAssessment", shortName: "K12_Career", type: "links" };
      }
      if (k.includes("digital") && k.includes("k12")) {
        return { folderName: "03_mob_k12/5_DigitalMarketing", shortName: "K12_Digital", type: "links" };
      }
      if (k.includes("website") && k.includes("k12")) {
        return { folderName: "03_mob_k12/6_WebsiteManagement", shortName: "K12_Website", type: "links" };
      }
      
      // 04_mob_highereducation pages
      if (k.includes("advancedlms") && k.includes("higher")) {
        return { folderName: "04_mob_highereducation/1_AdvancedLMS", shortName: "HEI_AdvancedLMS", type: "links" };
      }
      if (k.includes("heierp") || (k.includes("erp") && k.includes("higher"))) {
        return { folderName: "04_mob_highereducation/2_HEIERP", shortName: "HEI_ERP", type: "links" };
      }
      if (k.includes("exam") && k.includes("higher")) {
        return { folderName: "04_mob_highereducation/3_ExamManagement", shortName: "HEI_Exam", type: "links" };
      }
      if (k.includes("obe")) {
        return { folderName: "04_mob_highereducation/4_OBE", shortName: "HEI_OBE", type: "links" };
      }
      if (k.includes("naac") || k.includes("nba") || k.includes("nirf")) {
        return { folderName: "04_mob_highereducation/5_NAAC_NBA_NIRF", shortName: "HEI_NAAC", type: "links" };
      }
      if (k.includes("skill") && k.includes("higher")) {
        return { folderName: "04_mob_highereducation/6_SkillDevelopment", shortName: "HEI_Skill", type: "links" };
      }
      if (k.includes("career") && k.includes("higher")) {
        return { folderName: "04_mob_highereducation/7_CareerAssessment", shortName: "HEI_Career", type: "links" };
      }
      if (k.includes("digital") && k.includes("higher")) {
        return { folderName: "04_mob_highereducation/8_DigitalMarketing", shortName: "HEI_Digital", type: "links" };
      }
      if (k.includes("website") && (k.includes("higher") || k.includes("hei") || k.includes("websitemanagement"))) {
        return { folderName: "04_mob_highereducation/9_WebsiteManagement", shortName: "HEI_Website", type: "links" };
      }
      
      // 05_mob_blogs
      if (k.includes("blog")) {
        return { folderName: "05_mob_blogs/Blogs", shortName: "Blogs", type: "links" };
      }
      
      // 06_mob_support
      if (k.includes("support")) {
        return { folderName: "06_mob_support/Support", shortName: "Support", type: "links" };
      }

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

    // No mapping found - use UnmappedReports (should not happen with proper usage)
    return { folderName: "UnmappedReports", shortName: "Unmapped", type: "links" };
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
  async addStep(label, action, status, takeScreenshot = false, customScreenshotPath = "", errorMessage = "") {
    let screenshotPath = customScreenshotPath;

    if (takeScreenshot && !customScreenshotPath && this.page?.screenshot) {
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
      error: errorMessage || (status === "Success" ? "" : "Failed"),
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
  generateHTMLReport(pageTitle = "Link Report") {
    const links = this.results.filter(r => r.linkUrl !== "-");
    const verifiedCount = links.filter(l => l.status === "VERIFIED").length;
    const errorCount = links.filter(l => l.status !== "VERIFIED").length;

    const rows = links.map(r => `
<tr class="${r.status === "VERIFIED" ? "pass" : "fail"}">
  <td style="font-weight:bold;">${r.index}</td>
  <td style="text-align:left; font-size:14px;">${r.linkName}</td>
  <td style="text-align:left;"><a href="${r.linkUrl}" target="_blank">${r.linkUrl.substring(0,60)}...</a></td>
  <td><strong>${r.status === "VERIFIED" ? "✅ VERIFIED" : "❌ FAILED"}</strong></td>
  <td><span class="http-code code-${Math.floor(r.statusCode / 100)}xx">${r.statusCode}</span></td>
  <td style="text-align:left; font-size:13px;">${r.error || (r.status === "FAILED" ? "HTTP Error" : "-")}</td>
  <td style="font-size:12px;">${r.timestamp}</td>
  <td style="font-size:11px; word-break:break-all; max-width:200px;">${r.screenshot || "-"}</td>
</tr>`).join("");

    const html = `
<!doctype html>
<html>
<head>
<style>
body { font-family: 'Segoe UI', Arial, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); margin:0; padding:20px; }
.container { max-width: 1400px; margin: 0 auto; background: white; border-radius: 10px; padding: 30px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); }
table { width:100%; border-collapse:collapse; background:white; margin-bottom:30px; border-radius:8px; overflow:hidden; }
th { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding:14px 12px; text-align: left; font-weight: 600; font-size: 14px; }
td { border:1px solid #e0e0e0; padding:12px; font-size: 13px; line-height: 1.6; color: #333; }
.pass { background: linear-gradient(135deg, #d4ffd4 0%, #c8ffc8 100%); }
.fail { background: linear-gradient(135deg, #ffd4d4 0%, #ffc8c8 100%); }
h1 { color: #2196F3; text-align: center; margin-bottom: 20px; font-size: 36px; text-shadow: 2px 2px 4px rgba(0,0,0,0.1); }
.stats-container { display: flex; gap: 12px; margin-bottom: 30px; flex-wrap: wrap; }
.stat-box { flex: 1; min-width: 140px; padding: 12px; border-radius: 10px; color: white; box-shadow: 0 4px 15px rgba(0,0,0,0.2); }
.stat-box h3 { margin: 0 0 5px 0; font-size: 14px; opacity: 0.9; font-weight: 600; }
.stat-box .number { font-size: 32px; font-weight: bold; margin: 3px 0; }
.stat-box .label { font-size: 13px; opacity: 0.9; }
.stat-total { background: linear-gradient(135deg, #4776e6 0%, #8e54e9 100%); }
.stat-verified { background: linear-gradient(135deg, #0cebeb 0%, #20e3b2 100%); }
.stat-error { background: linear-gradient(135deg, #ff6a00 0%, #ee0979 100%); }
.http-code { padding: 4px 8px; border-radius: 4px; font-weight: bold; font-size: 12px; }
.code-2xx { background: #c8e6c9; color: #2e7d32; }
.code-3xx { background: #fff9c4; color: #f57f17; }
.code-4xx { background: #ffccbc; color: #d84315; }
.code-5xx { background: #ffcdd2; color: #c62828; }
tr:hover { background: #f5f5f5; transition: background 0.3s; }
a { color: #1976D2; text-decoration: none; }
a:hover { text-decoration: underline; }
</style>
</head>
<body>
<div class="container">
<h1>🔗 ${pageTitle}</h1>
<div class="stats-container">
  <div class="stat-box stat-total">
    <h3>🔗 Total Links</h3>
    <div class="number">${links.length}</div>
    <div class="label">Links Found</div>
  </div>
  <div class="stat-box stat-verified">
    <h3>✓ Verified</h3>
    <div class="number">${verifiedCount}</div>
    <div class="label">Working Links</div>
  </div>
  <div class="stat-box stat-error">
    <h3>⚠ Errors</h3>
    <div class="number">${errorCount}</div>
    <div class="label">Broken Links</div>
  </div>
</div>
<table>
<tr><th>#</th><th>Name</th><th>URL</th><th>Status</th><th>Code</th><th>Error</th><th>Time</th><th>Screenshot</th></tr>
${rows}
</table>
</div>
</body>
</html>`;

    fs.writeFileSync(this.htmlFile, html, "utf8");
    console.log(`📄 Link HTML saved: ${this.htmlFile}`);
    return this.htmlFile;
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
table{ width:100%; border-collapse:collapse; background:white; margin-bottom:30px; }
th,td{ border:1px solid #ddd; padding:10px; }
.pass{ background:#d4ffd4; }
.fail{ background:#ffd4d4; }
h2 { color: #333; border-bottom: 2px solid #4CAF50; padding-bottom: 10px; }
</style>
</head>
<body>
<h2>📋 Form Fields Report</h2>
<table>
<tr><th>#</th><th>Field</th><th>Status</th><th>Error</th><th>Time</th><th>Screenshot</th></tr>
${rows}
</table>
</body>
</html>`;

    fs.writeFileSync(this.fieldHtmlFile, html, "utf8");
    console.log(`📄 Field HTML saved: ${this.fieldHtmlFile}`);
  }

  // Combined Report (Fields + Links in one HTML)
  generateCombinedHTMLReport() {
    const fields = this.results.filter(r => r.linkUrl === "-");
    const links = this.results.filter(r => r.linkUrl !== "-");

    // Group fields by section
    const scheduleDemoFields = fields.filter(f => f.linkName.includes("Schedule Demo"));
    const tryForFreeFields = fields.filter(f => f.linkName.includes("Try for Free"));
    const otherFields = fields.filter(f => !f.linkName.includes("Schedule Demo") && !f.linkName.includes("Try for Free"));
    
    // Calculate stats
    const passedFields = fields.filter(f => f.status === "Success").length;
    const failedFields = fields.filter(f => f.status === "Failed").length;
    const warningsCount = fields.filter(f => f.status === "WARNING" || f.status === "SKIPPED").length;
    const verifiedLinks = links.filter(l => l.status === "VERIFIED").length;
    const failedLinks = links.filter(l => l.status === "FAILED").length;
    const errorLinks = links.filter(l => l.status === "ERROR").length;
    const totalBrokenLinks = failedLinks + errorLinks;

    const createFieldRows = (fieldsList) => fieldsList.map(r => {
      let rowClass = "pass";
      let statusIcon = "✅";
      if (r.status === "Failed") {
        rowClass = "fail";
        statusIcon = "❌";
      } else if (r.status === "WARNING" || r.status === "SKIPPED") {
        rowClass = "warning";
        statusIcon = "⚠️";
      }
      
      return `
<tr class="${rowClass}">
  <td style="font-weight: bold;">${r.index}</td>
  <td style="text-align: left; font-size: 14px; line-height: 1.6;">${r.linkName.replace(/\[.*?\]\s*/, '')}</td>
  <td>${r.action}</td>
  <td><strong>${statusIcon} ${r.status}</strong></td>
  <td style="text-align: left; font-size: 13px; line-height: 1.5; max-width: 300px; word-wrap: break-word; overflow-wrap: break-word;">${r.error || "-"}</td>
  <td style="font-size: 12px; white-space: nowrap;">${r.timestamp}</td>
  <td style="font-size: 11px; word-break: break-all; max-width: 200px;">${r.screenshot || "-"}</td>
</tr>`;
    }).join("");

    const linkRows = links.map(r => `
<tr class="${r.status === "VERIFIED" ? "pass" : "fail"}">
  <td>${r.index}</td>
  <td>${r.linkName}</td>
  <td><a href="${r.linkUrl}" target="_blank">${r.linkUrl.substring(0, 60)}...</a></td>
  <td><strong class="${r.status === "VERIFIED" ? "status-verified" : "status-failed"}">${r.status}</strong></td>
  <td><span class="http-code code-${Math.floor(r.statusCode / 100)}xx">${r.statusCode}</span></td>
  <td>${r.error || (r.status === "FAILED" ? "HTTP Error" : "-")}</td>
  <td>${r.timestamp}</td>
  <td style="font-size: 11px; word-break: break-all; max-width: 200px;">${r.screenshot || "-"}</td>
</tr>`).join("");

    const html = `
<!doctype html>
<html>
<head>
<style>
body { font-family: 'Segoe UI', Arial, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); margin:0; padding:20px; }
.container { max-width: 1400px; margin: 0 auto; background: white; border-radius: 10px; padding: 30px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); }
table { width:100%; border-collapse:collapse; background:white; margin-bottom:30px; border-radius: 8px; overflow: hidden; }
th { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding:14px 12px; text-align: left; font-weight: 600; font-size: 14px; }
td { border:1px solid #e0e0e0; padding:12px; font-size: 13px; line-height: 1.6; color: #333; }
.pass { background: linear-gradient(135deg, #d4ffd4 0%, #c8ffc8 100%); }
.fail { background: linear-gradient(135deg, #ffd4d4 0%, #ffc8c8 100%); }
.warning { background: linear-gradient(135deg, #fff4d4 0%, #ffe4a8 100%); }
h2 { color: #333; border-left: 5px solid #4CAF50; padding-left: 15px; margin-top: 30px; font-size: 24px; }
h3 { color: #555; border-left: 3px solid #2196F3; padding-left: 12px; margin-top: 20px; font-size: 18px; }
h1 { color: #2196F3; text-align: center; margin-bottom: 20px; font-size: 36px; text-shadow: 2px 2px 4px rgba(0,0,0,0.1); }
.summary { background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%); padding: 20px; border-radius: 8px; margin-bottom: 30px; border-left: 5px solid #2196F3; }
.summary strong { color: #1976D2; }
.status-verified { color: #4CAF50; }
.status-failed { color: #f44336; }
.http-code { padding: 4px 8px; border-radius: 4px; font-weight: bold; }
.code-2xx { background: #c8e6c9; color: #2e7d32; }
.code-3xx { background: #fff9c4; color: #f57f17; }
.code-4xx { background: #ffccbc; color: #d84315; }
.code-5xx { background: #ffcdd2; color: #c62828; }
tr:hover { background: #f5f5f5; transition: background 0.3s; }
a { color: #1976D2; text-decoration: none; }
a:hover { text-decoration: underline; }
.stats-container { display: flex; gap: 12px; margin-bottom: 30px; flex-wrap: wrap; }
.stat-box { flex: 1; min-width: 140px; padding: 12px; border-radius: 10px; color: white; box-shadow: 0 4px 15px rgba(0,0,0,0.2); }
.stat-box h3 { margin: 0 0 5px 0; font-size: 14px; opacity: 0.9; font-weight: 600; border: none; padding: 0; color: white; }
.stat-box .number { font-size: 32px; font-weight: bold; margin: 3px 0; }
.stat-box .label { font-size: 13px; opacity: 0.9; }
.stat-total { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
.stat-pass { background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); }
.stat-fail { background: linear-gradient(135deg, #eb3349 0%, #f45c43 100%); }
.stat-warning { background: linear-gradient(135deg, #ffa726 0%, #ffb74d 100%); }
.stat-links { background: linear-gradient(135deg, #4776e6 0%, #8e54e9 100%); }
.stat-verified { background: linear-gradient(135deg, #0cebeb 0%, #20e3b2 100%); }
.stat-error { background: linear-gradient(135deg, #ff6a00 0%, #ee0979 100%); }
</style>
</head>
<body>
<div class="container">
<h1>📱 LQ Website Mobile Test Report</h1>
<div class="stats-container">
  <div class="stat-box stat-total">
    <h3>📊 Total Fields</h3>
    <div class="number">${fields.length}</div>
    <div class="label">Fields Tested</div>
  </div>
  <div class="stat-box stat-pass">
    <h3>✅ Passed</h3>
    <div class="number">${fields.filter(f => f.status === "Success").length}</div>
    <div class="label">Successful</div>
  </div>
  <div class="stat-box stat-fail">
    <h3>❌ Failed</h3>
    <div class="number">${fields.filter(f => f.status === "Failed").length}</div>
    <div class="label">Failed Fields</div>
  </div>
  <div class="stat-box stat-warning">
    <h3>⚠️ Warnings</h3>
    <div class="number">${fields.filter(f => f.status === "WARNING" || f.status === "SKIPPED").length}</div>
    <div class="label">Warnings/Skips</div>
  </div>
  <div class="stat-box stat-links">
    <h3>🔗 Total Links</h3>
    <div class="number">${links.length}</div>
    <div class="label">Links Found</div>
  </div>
  <div class="stat-box stat-verified">
    <h3>✓ Verified</h3>
    <div class="number">${links.filter(l => l.status === "VERIFIED").length}</div>
    <div class="label">Working Links</div>
  </div>
  <div class="stat-box stat-error">
    <h3>⚠ Errors</h3>
    <div class="number">${totalBrokenLinks}</div>
    <div class="label">Broken Links</div>
  </div>
</div>

${scheduleDemoFields.length > 0 ? `
<h2>📋 Form Fields Report</h2>
<h3>📅 Schedule Demo Form</h3>
<table>
<tr><th>#</th><th>Field Name</th><th>Action</th><th>Status</th><th>Error</th><th>Time</th><th>Screenshot</th></tr>
${createFieldRows(scheduleDemoFields)}
</table>
` : ''}

${tryForFreeFields.length > 0 ? `
<h3>✨ Try for Free Form</h3>
<table>
<tr><th>#</th><th>Field Name</th><th>Action</th><th>Status</th><th>Error</th><th>Time</th><th>Screenshot</th></tr>
${createFieldRows(tryForFreeFields)}
</table>
` : ''}

${otherFields.length > 0 ? `
<h3>📄 Other Fields</h3>
<table>
<tr><th>#</th><th>Field Name</th><th>Action</th><th>Status</th><th>Error</th><th>Time</th><th>Screenshot</th></tr>
${createFieldRows(otherFields)}
</table>
` : ''}

${links.length > 0 ? `
<h2>🔗 Links Verification Report</h2>
<table>
<tr><th>#</th><th>Link Name</th><th>URL</th><th>Status</th><th>HTTP Code</th><th>Error</th><th>Time</th><th>Screenshot</th></tr>
${linkRows}
</table>
` : ''}

</div>
</body>
</html>`;

    fs.writeFileSync(this.htmlFile, html, "utf8");
    console.log(`📄 Combined HTML saved: ${this.htmlFile}`);
  }
}
