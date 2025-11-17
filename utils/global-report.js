// GLOBAL REPORTER FOR AUTOMATIC REPORT GENERATION
// This runs BEFORE and AFTER every test without modifying test files.

import path from "path";
import fs from "fs";
import { ReportUtils } from "./reportUtils.js";

class GlobalReport {
  onTestBegin(test) {
    try {
      // Generate a clean folder name based on test title
      const safeName = test.title.replace(/\s+/g, "_");

      // Each test gets its own auto-report folder
      const folderName = `AutoReport_${safeName}`;

      // Create ReportUtils object without requiring a page object
      this.report = new ReportUtils(null, folderName);

      // Reset results
      this.report.results = [];

      console.log(`🟢 Global Report Started: ${folderName}`);
    } catch (err) {
      console.log("⚠️ Error in onTestBegin:", err.message);
    }
  }

  onTestEnd(test, result) {
    try {
      console.log("📄 Generating Global Reports...");

      // Always generate reports even if empty
      this.report.generateCSVReport();
      this.report.generateHTMLReport();
      this.report.generateFieldHTMLReport();

      console.log("✅ Global Reports generated successfully!");
    } catch (err) {
      console.log("❌ Report generation failed:", err.message);
    }
  }
}

export default GlobalReport;
