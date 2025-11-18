import fs from "fs";
import path from "path";
import { ReportUtils } from "./reportUtils.js";

class GlobalReport {

  _cleanupOldReports(baseDir) {
    try {
      if (!fs.existsSync(baseDir)) return;

      const all = fs.readdirSync(baseDir);
      all.forEach(folder => {
        if (folder.startsWith("AutoReport_")) {
          fs.rmSync(path.join(baseDir, folder), { recursive: true, force: true });
        }
      });

      console.log("🧹 Old AutoReport_* folders deleted.");
    } catch (err) {
      console.log("⚠️ Cleanup Error:", err.message);
    }
  }

  onTestBegin(test) {

    const safeName = test.title
      .split("(")[0]
      .trim()
      .replace(/[^a-zA-Z0-9 ]/g, "")
      .replace(/\s+/g, "_");

    const baseDir = path.join(process.cwd(), "test-reports");

    this._cleanupOldReports(baseDir);

    if (!fs.existsSync(baseDir)) fs.mkdirSync(baseDir, { recursive: true });

    this.folder = path.join(baseDir, `AutoReport_${safeName}`);

    if (!fs.existsSync(this.folder)) {
      fs.mkdirSync(this.folder, { recursive: true });
    }

    // 🟢 FIXED → we pass ONLY safeName
    this.report = new ReportUtils(
      { screenshot: async () => {} },
      safeName
    );

    console.log(`🟢 Global Reporter Started → ${safeName}`);
  }

  onTestEnd(test, result) {
    console.log("📄 Global Reporter: Generating ALL reports...");

    try {
      this.report.generateCSVReport();
      this.report.generateHTMLReport();
      this.report.generateFieldHTMLReport();
    } catch (err) {
      console.log("❌ Report generation error:", err.message);
    }

    console.log("✅ Global Reporter: Done!");
  }
}

export default GlobalReport;
