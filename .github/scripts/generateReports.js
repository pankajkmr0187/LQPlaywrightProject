// 📌 generateReports.js
// Generates EXACT SAME reports as ReportUtils.js WITHOUT Playwright

import fs from "fs";
import path from "path";

// -----------------------------
// 📌 1) Generate IST Timestamp
// -----------------------------
function getISTTimestamp() {
  const now = new Date();
  const ist = new Date(now.getTime() + 5.5 * 60 * 60 * 1000);
  return ist
    .toISOString()
    .replace("T", "_")
    .replace(/[:.]/g, "-")
    .replace("Z", "");
}

// -----------------------------------------
// 📌 2) STATIC DATA (You can modify later)
// -----------------------------------------
const results = [
  {
    index: 1,
    linkName: "Home Page",
    linkUrl: "https://learnqoch.com",
    action: "-",
    status: "VERIFIED",
    statusCode: "200",
    error: "-",
    screenshot: "",
    timestamp: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
  },
  {
    index: 2,
    linkName: "Contact Page",
    linkUrl: "https://learnqoch.com/contact",
    action: "-",
    status: "FAILED",
    statusCode: "404",
    error: "Page not found",
    screenshot: "",
    timestamp: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
  },
  {
    index: 3,
    linkName: "Student Name Field",
    linkUrl: "-",
    action: "Typing",
    status: "Success",
    statusCode: "-",
    error: "",
    screenshot: "",
    timestamp: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
  }
];

// -----------------------------------------
// 📌 3) Create folder structure
// -----------------------------------------
const folderName = "mobHomePage";
const timestamp = getISTTimestamp();

const baseDir = "test-reports";
const folderPath = path.join(baseDir, `${folderName}_${timestamp}`);
const screenshotDir = path.join(folderPath, "screenshots");

// Create all folders
[baseDir, folderPath, screenshotDir].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// -----------------------------------------
// 📌 4) Generate CSV (EXACT same as Pankaj ReportUtils.js)
// -----------------------------------------
const csvFile = path.join(folderPath, `${folderName}_${timestamp}.csv`);

const csvHeader = [
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

const csvRows = results.map((r) => [
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
  csvHeader.join(","),
  ...csvRows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")),
].join("\n");

fs.writeFileSync(csvFile, csvContent, "utf-8");

console.log(`📊 CSV created: ${csvFile}`);

// -----------------------------------------
// 📌 5) Generate HTML REPORT (links only)
// -----------------------------------------
const htmlFile = path.join(folderPath, `${folderName}_${timestamp}.html`);

const linkRows = results
  .filter((r) => r.linkUrl !== "-")
  .map(
    (r) => `
      <tr class="${r.status === "VERIFIED" ? "pass" : "fail"}">
        <td>${r.index}</td>
        <td>${r.linkName}</td>
        <td><a href="${r.linkUrl}" target="_blank">${r.linkUrl}</a></td>
        <td><span class="badge ${r.status.toLowerCase()}">${r.status}</span></td>
        <td>${r.statusCode}</td>
        <td>${r.error}</td>
        <td>${r.timestamp}</td>
      </tr>`
  )
  .join("");

const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
<title>${folderName} - Link Verification</title>
<style>
  body { font-family: Arial; margin: 20px; background:#f3f7fb; }
  table { width: 100%; border-collapse: collapse; background: white; }
  th, td { border: 1px solid #ddd; padding: 10px; }
  th { background:#222; color:white; }
  tr.pass { background:#d4ffd4; }
  tr.fail { background:#ffd4d4; }
  .badge { padding:4px 10px; border-radius:12px; color:white; }
  .verified { background:#28a745; }
  .failed { background:#dc3545; }
</style>
</head>
<body>

<h2>🔗 ${folderName} - Link Verification Report</h2>

<table>
<tr>
  <th>#</th>
  <th>Link Name</th>
  <th>URL</th>
  <th>Status</th>
  <th>Status Code</th>
  <th>Error</th>
  <th>Timestamp</th>
</tr>
${linkRows}
</table>

</body>
</html>
`;

fs.writeFileSync(htmlFile, htmlTemplate, "utf-8");
console.log(`📄 HTML created: ${htmlFile}`);

// -------------------------------------------------
// 📌 6) FIELD LEVEL HTML REPORT (EXACT same style)
// -------------------------------------------------
const fieldFile = path.join(folderPath, `${folderName}_FIELD_REPORT_${timestamp}.html`);

const fieldRows = results
  .filter((r) => r.linkUrl === "-")
  .map(
    (r) => `
<tr class="${r.status === "Success" ? "pass" : "fail"}">
  <td>${r.index}</td>
  <td>${r.linkName}</td>
  <td><span class="badge ${r.status === "Success" ? "success" : "failed"}">${r.status}</span></td>
  <td>${r.error || "-"}</td>
  <td>${r.timestamp}</td>
  <td></td>
</tr>`
  )
  .join("");

const fieldHtmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
<title>${folderName} - Field Level Report</title>
<style>
  body { font-family: Arial; margin: 20px; background:#f5f7fa; }
  table { width:100%; border-collapse: collapse; background:white; }
  th, td { border:1px solid #ddd; padding:10px; }
  th { background:#222; color:#fff; }
  tr.pass { background:#d4ffd4; }
  tr.fail { background:#ffd4d4; }
</style>
</head>
<body>

<h2>📋 ${folderName} - Field-Level Form Report</h2>

<table>
<tr>
  <th>#</th>
  <th>Field Name</th>
  <th>Status</th>
  <th>Error</th>
  <th>Timestamp</th>
  <th>Screenshot</th>
</tr>

${fieldRows}

</table>

</body>
</html>
`;

fs.writeFileSync(fieldFile, fieldHtmlTemplate, "utf-8");
console.log(`📄 FIELD HTML created: ${fieldFile}`);

console.log("\n🎉 All Reports Generated Successfully!");
