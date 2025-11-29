import fs from "fs";
import path from "path";
import { ReportUtils } from "./reportUtils.js";

class GlobalReport {

  onBegin(suite) {
    // Delete entire test-reports folder before test run starts
    const baseDir = path.join(process.cwd(), "test-reports");
    try {
      if (fs.existsSync(baseDir)) {
        fs.rmSync(baseDir, { recursive: true, force: true });
        console.log("🗑️  Cleaned up old test-reports folder");
      }
    } catch (err) {
      console.log("⚠️  Could not clean test-reports:", err.message);
    }
  }

  _cleanupOldReports(baseDir) {
    try {
      if (!fs.existsSync(baseDir)) return;

      const all = fs.readdirSync(baseDir);
      
      let deletedFiles = 0;
      all.forEach(folder => {
        const folderPath = path.join(baseDir, folder);
        
        // Skip playwright-html and test-results folders
        if (folder === 'playwright-html' || folder === 'test-results') return;
        
        // Clean old files inside ALL report folders
        if (fs.existsSync(folderPath) && fs.statSync(folderPath).isDirectory()) {
            try {
              const files = fs.readdirSync(folderPath);
              
              // Get HTML and CSV files with their timestamps
              const htmlFiles = files
                .filter(f => f.endsWith('.html') && f.includes('_'))
                .map(f => ({
                  name: f,
                  time: fs.statSync(path.join(folderPath, f)).mtime.getTime()
                }))
                .sort((a, b) => b.time - a.time); // Sort by newest first
              
              const csvFiles = files
                .filter(f => f.endsWith('.csv') && f.includes('_'))
                .map(f => ({
                  name: f,
                  time: fs.statSync(path.join(folderPath, f)).mtime.getTime()
                }))
                .sort((a, b) => b.time - a.time); // Sort by newest first
              
              // Delete all HTML files except the newest one
              if (htmlFiles.length > 1) {
                htmlFiles.slice(1).forEach(f => {
                  try {
                    fs.unlinkSync(path.join(folderPath, f.name));
                    deletedFiles++;
                  } catch (e) {}
                });
              }
              
              // Delete all CSV files except the newest one
              if (csvFiles.length > 1) {
                csvFiles.slice(1).forEach(f => {
                  try {
                    fs.unlinkSync(path.join(folderPath, f.name));
                    deletedFiles++;
                  } catch (e) {}
                });
              }
              
            } catch (e) {
              // Silently fail
            }
          }
      });

      if (deletedFiles > 0) {
        console.log(`🧹 Cleaned ${deletedFiles} old report file(s).`);
      }
    } catch (err) {
      // Silently handle cleanup errors
    }
  }

  onTestBegin(test) {
    // Cleanup at start with better retry mechanism
    const baseDir = path.join(process.cwd(), "test-reports");
    this._cleanupOldReports(baseDir);
    
    const safeName = test.title
      .split("(")[0]
      .trim()
      .replace(/[^a-zA-Z0-9 ]/g, "")
      .replace(/\s+/g, "_");

    console.log(`🟢 Global Reporter Started → ${safeName}`);
  }

  onTestEnd(test, result) {
    console.log("✅ Global Reporter: Test completed!");
  }

  onEnd(result) {
    // Always generate master summary report, even for single test
    this._generateMasterSummary();
  }

  _generateMasterSummary() {
    try {
      const baseDir = path.join(process.cwd(), "test-reports");
      if (!fs.existsSync(baseDir)) return;

      const folders = fs.readdirSync(baseDir).filter(f => {
        const p = path.join(baseDir, f);
        return fs.statSync(p).isDirectory() && f !== 'playwright-html';
      });

      let totalTests = 0;
      let totalFields = 0;
      let passedFields = 0;
      let failedFields = 0;
      let warningFields = 0;
      let totalLinks = 0;
      let verifiedLinks = 0;
      let failedLinks = 0;
      let errorLinks = 0;

      const folderDetails = [];

      folders.forEach(folder => {
        const folderPath = path.join(baseDir, folder);
        const subfolders = fs.readdirSync(folderPath).filter(f => {
          const p = path.join(folderPath, f);
          return fs.statSync(p).isDirectory();
        });

        subfolders.forEach(subfolder => {
          const subfolderPath = path.join(folderPath, subfolder);
          const csvFiles = fs.readdirSync(subfolderPath).filter(f => f.endsWith('.csv'));
          
          if (csvFiles.length > 0) {
            const latestCsv = csvFiles.sort().pop();
            const csvPath = path.join(subfolderPath, latestCsv);
            const htmlPath = csvPath.replace('.csv', '.html');
            
            try {
              const data = fs.readFileSync(csvPath, 'utf8');
              const lines = data.split('\n').filter(l => l.trim());
              
              if (lines.length > 1) {
                totalTests++;
                let fields = 0, passed = 0, failed = 0, warnings = 0;
                let links = 0, verified = 0, linkFailed = 0, errors = 0;
                
                lines.slice(1).forEach(line => {
                  if (!line.trim()) return;
                  
                  const parts = line.split(',').map(p => p.replace(/"/g, '').trim());
                  const status = parts[4] || '';
                  const url = parts[2] || '-';
                  
                  if (url === '-') {
                    // Field
                    fields++;
                    if (status === 'Success') passed++;
                    else if (status === 'Failed') failed++;
                    else if (status === 'WARNING' || status === 'SKIPPED') warnings++;
                  } else {
                    // Link
                    links++;
                    if (status === 'VERIFIED') verified++;
                    else if (status === 'FAILED') linkFailed++;
                    else if (status === 'ERROR') errors++;
                  }
                });
                
                totalFields += fields;
                passedFields += passed;
                failedFields += failed;
                warningFields += warnings;
                totalLinks += links;
                verifiedLinks += verified;
                failedLinks += linkFailed;
                errorLinks += errors;
                
                folderDetails.push({
                  folder: `${folder}/${subfolder}`,
                  htmlPath: htmlPath.replace(process.cwd() + '\\\\', '').replace(/\\\\/g, '/'),
                  fields, passed, failed, warnings,
                  links, verified, linkFailed, errors
                });
              }
            } catch (e) {
              // Skip on error
            }
          }
        });
      });

      // Always generate master summary, even if no tests (will show 0s)
      // if (totalTests === 0) return;

      // Generate Master Summary HTML
      this._writeMasterSummaryHTML(folderDetails, {
        totalTests, totalFields, passedFields, failedFields, warningFields,
        totalLinks, verifiedLinks, failedLinks, errorLinks
      });

    } catch (err) {
      console.error('Error generating master summary:', err.message);
    }
  }

  _writeMasterSummaryHTML(folderDetails, stats) {
    const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    const totalBrokenLinks = stats.failedLinks + stats.errorLinks;
    
    const folderRows = folderDetails.map((f, i) => `
<tr>
  <td style="font-weight:bold;">${i + 1}</td>
  <td style="text-align:left;"><a href="${f.htmlPath}" target="_blank">${f.folder}</a></td>
  <td>${f.fields}</td>
  <td style="color:#4CAF50;font-weight:bold;">${f.passed}</td>
  <td style="color:#f44336;font-weight:bold;">${f.failed}</td>
  <td style="color:#FF9800;font-weight:bold;">${f.warnings}</td>
  <td>${f.links}</td>
  <td style="color:#4CAF50;font-weight:bold;">${f.verified}</td>
  <td style="color:#FF9800;font-weight:bold;">${f.linkFailed}</td>
  <td style="color:#f44336;font-weight:bold;">${f.errors}</td>
</tr>`).join('');

    const html = `
<!doctype html>
<html>
<head>
<meta charset="UTF-8">
<title>Master Test Summary Report</title>
<style>
body { font-family: 'Segoe UI', Arial, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); margin:0; padding:20px; }
.container { max-width: 1600px; margin: 0 auto; background: white; border-radius: 10px; padding: 30px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); }
h1 { color: #2196F3; text-align: center; margin-bottom: 20px; font-size: 36px; text-shadow: 2px 2px 4px rgba(0,0,0,0.1); }
.meta { text-align: center; color: #666; margin-bottom: 30px; font-size: 14px; }
table { width:100%; border-collapse:collapse; background:white; margin-bottom:30px; border-radius:8px; overflow:hidden; }
th { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding:14px 12px; text-align: center; font-weight: 600; font-size: 14px; }
td { border:1px solid #e0e0e0; padding:12px; font-size: 13px; text-align: center; color: #333; }
tr:hover { background: #f5f5f5; transition: background 0.3s; }
a { color: #1976D2; text-decoration: none; font-weight: 500; }
a:hover { text-decoration: underline; }
.stats-container { display: flex; gap: 12px; margin-bottom: 30px; flex-wrap: wrap; justify-content: center; }
.stat-box { min-width: 160px; padding: 16px; border-radius: 10px; color: white; box-shadow: 0 4px 15px rgba(0,0,0,0.2); text-align: center; }
.stat-box h3 { margin: 0 0 8px 0; font-size: 14px; opacity: 0.9; font-weight: 600; }
.stat-box .number { font-size: 36px; font-weight: bold; margin: 5px 0; }
.stat-box .label { font-size: 13px; opacity: 0.9; }
.stat-tests { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
.stat-fields { background: linear-gradient(135deg, #4776e6 0%, #8e54e9 100%); }
.stat-passed { background: linear-gradient(135deg, #0cebeb 0%, #20e3b2 100%); }
.stat-failed { background: linear-gradient(135deg, #ff6a00 0%, #ee0979 100%); }
.stat-warning { background: linear-gradient(135deg, #f2994a 0%, #f2c94c 100%); }
.stat-links { background: linear-gradient(135deg, #4776e6 0%, #8e54e9 100%); }
.stat-verified { background: linear-gradient(135deg, #0cebeb 0%, #20e3b2 100%); }
.stat-broken { background: linear-gradient(135deg, #ff6a00 0%, #ee0979 100%); }
</style>
</head>
<body>
<div class="container">
<h1>📊 Master Test Summary Report</h1>
<div class="meta">Generated: ${timestamp}</div>

<div class="stats-container">
  <div class="stat-box stat-tests">
    <h3>📁 Total Tests</h3>
    <div class="number">${stats.totalTests}</div>
    <div class="label">Test Suites</div>
  </div>
  <div class="stat-box stat-fields">
    <h3>📝 Total Fields</h3>
    <div class="number">${stats.totalFields}</div>
    <div class="label">Form Fields</div>
  </div>
  <div class="stat-box stat-passed">
    <h3>✅ Passed</h3>
    <div class="number">${stats.passedFields}</div>
    <div class="label">Fields</div>
  </div>
  <div class="stat-box stat-failed">
    <h3>❌ Failed</h3>
    <div class="number">${stats.failedFields}</div>
    <div class="label">Fields</div>
  </div>
  <div class="stat-box stat-warning">
    <h3>⚠️ Warnings</h3>
    <div class="number">${stats.warningFields}</div>
    <div class="label">Fields</div>
  </div>
  <div class="stat-box stat-links">
    <h3>🔗 Total Links</h3>
    <div class="number">${stats.totalLinks}</div>
    <div class="label">Links Found</div>
  </div>
  <div class="stat-box stat-verified">
    <h3>✓ Verified</h3>
    <div class="number">${stats.verifiedLinks}</div>
    <div class="label">Working Links</div>
  </div>
  <div class="stat-box stat-broken">
    <h3>⚠ Broken</h3>
    <div class="number">${totalBrokenLinks}</div>
    <div class="label">Failed + Errors</div>
  </div>
</div>

<h2 style="color: #333; border-left: 5px solid #4CAF50; padding-left: 15px; margin-top: 30px;">Test Suite Details</h2>
<table>
<tr>
  <th>#</th>
  <th>Test Suite</th>
  <th>Fields</th>
  <th>Passed</th>
  <th>Failed</th>
  <th>Warnings</th>
  <th>Links</th>
  <th>Verified</th>
  <th>Failed</th>
  <th>Errors</th>
</tr>
${folderRows}
</table>

</div>
</body>
</html>`;

    const outputPath = path.join(process.cwd(), 'test-reports', 'MASTER_SUMMARY.html');
    fs.writeFileSync(outputPath, html, 'utf8');
    console.log(`\\n📊 Master Summary Report: ${outputPath}`);
  }
}

export default GlobalReport;
