import fs from "fs";
import path from "path";
import { ReportUtils } from "./reportUtils.js";

class GlobalReport {
  onTestBegin(test) {
    const safeName = test.title.replace(/\s+/g, "_");

    // Create base directory if missing
    const baseDir = path.join(process.cwd(), "test-reports");
    if (!fs.existsSync(baseDir)) fs.mkdirSync(baseDir, { recursive: true });

    // Create folder without using page object
    this.folder = path.join(baseDir, `AutoReport_${safeName}`);

    if (!fs.existsSync(this.folder)) {
      fs.mkdirSync(this.folder, { recursive: true });
    }

    // Create ReportUtils with mock page = {}
    this.report = new ReportUtils(
      { screenshot: async () => {} }, // fake page to prevent crash
      `AutoReport_${safeName}`
    );

    this.report.results = [];
    console.log(`🟢 Global Reporter: Started for ${safeName}`);
  }

  onTestEnd(test, result) {
    console.log("📄 Global Reporter: Generating reports...");

    try {
      this.report.generateCSVReport();
      this.report.generateHTMLReport();
      this.report.generateFieldHTMLReport();
    } catch (err) {
      console.log("❌ Global Reporter Error:", err.message);
    }

    console.log("✅ Global Reporter: Done!");
  }
}

export default GlobalReport;
