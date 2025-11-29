// ✅ File: utils/linkVerificationUtils.js
import { ReportUtils } from "./reportUtils.js";
import fs from "fs";

export class LinkVerificationUtils {
  constructor(page) {
    this.page = page;
    this.tempCache = [];

    process.on("exit", () => this.generateHybridReports());
    process.on("SIGINT", () => {
      console.log("\n⚠️ Test interrupted — saving partial report...");
      this.generateHybridReports();
      process.exit(0);
    });
  }

  async verifyPageLinks(pageName, folderName = "HomePage") {
    console.log(`🔍 Starting smart link verification for ${pageName}...`);
    const reportUtils = new ReportUtils(this.page, folderName);

    const links = await this.page.evaluate(() => {
      const all = Array.from(document.querySelectorAll("a[href]"));
      return all
        .filter((a) => {
          const s = window.getComputedStyle(a);
          const r = a.getBoundingClientRect();
          return (
            r.width > 2 &&
            r.height > 2 &&
            s.display !== "none" &&
            s.visibility !== "hidden" &&
            a.offsetParent !== null &&
            !a.href.includes("javascript:void")
          );
        })
        .map((a, i) => ({
          index: i + 1,
          href: a.href,
          text: a.innerText.trim() || "Image Link",
        }));
    });

    console.log(`🔗 Found ${links.length} visible links.`);

    for (let i = 0; i < links.length; i++) {
      const { href, text } = links[i];
      console.log(`\n👉 [${i + 1}] Checking link: ${text}`);
      console.log(`🌐 URL: ${href}`);

      try {
        // ✅ Highlight before action
        await this.page.evaluate((target) => {
          const el = Array.from(document.querySelectorAll("a[href]")).find(
            (a) => a.href === target
          );
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
            el.style.border = "2px solid red";
            el.style.backgroundColor = "yellow";
          }
        }, href);

        // ✅ Handle external links separately (NO SCREENSHOTS unless failed)
        if (href.match(/linkedin|facebook|instagram|youtube|x\.com|twitter|whatsapp/)) {
          console.log(`🌐 Checking external link: ${href}`);
          
          const response = await this.page.request.get(href);
          const code = response.status();
          
          if (code >= 400) {
            console.log(`❌ External link failed: ${code}`);
            const screenshotPath = `${reportUtils.screenshotDir}/FAILED_${i + 1}.png`;
            await this.page.screenshot({ path: screenshotPath });
            reportUtils.results.push({
              index: i + 1,
              linkName: text,
              linkUrl: href,
              status: "FAILED",
              statusCode: code,
              error: "HTTP Error",
              screenshot: screenshotPath,
              timestamp: new Date().toISOString(),
            });
          } else {
            console.log(`✅ External link OK: ${code}`);
            reportUtils.results.push({
              index: i + 1,
              linkName: text,
              linkUrl: href,
              status: "VERIFIED",
              statusCode: code,
              error: "-",
              screenshot: "",
              timestamp: new Date().toISOString(),
            });
          }
        } else {
          // ✅ Internal link test (HTTP verification)
          const response = await this.page.request.get(href);
          const code = response.status();
          if (code >= 400) {
            console.log(`❌ Failed: ${code}`);
            const screenshotPath = `${reportUtils.screenshotDir}/FAILED_${i + 1}.png`;
            await this.page.screenshot({ path: screenshotPath });
            reportUtils.results.push({
              index: i + 1,
              linkName: text,
              linkUrl: href,
              status: "FAILED",
              statusCode: code,
              error: "HTTP Error",
              screenshot: screenshotPath,
              timestamp: new Date().toISOString(),
            });
          } else {
            console.log(`✅ OK: ${code}`);
            reportUtils.results.push({
              index: i + 1,
              linkName: text,
              linkUrl: href,
              status: "VERIFIED",
              statusCode: code,
              error: "-",
              screenshot: "",
              timestamp: new Date().toISOString(),
            });
          }
        }
      } catch (err) {
        console.warn(`⚠️ Link error: ${href}`);
        const screenshotPath = `${reportUtils.screenshotDir}/ERROR_${i + 1}.png`;
        await this.page.screenshot({ path: screenshotPath }).catch(() => {});
        reportUtils.results.push({
          index: i + 1,
          linkName: text,
          linkUrl: href,
          status: "ERROR",
          statusCode: 999,
          error: err.message,
          screenshot: screenshotPath,
          timestamp: new Date().toISOString(),
        });
      }

      await this.page.waitForTimeout(800);
    }

    const csv = reportUtils.generateCSVReport();
    const html = reportUtils.generateHTMLReport(pageName);
    console.log(`📊 CSV: ${csv}`);
    console.log(`📄 HTML: ${html}`);
    this.generateHybridReports();
  }

  generateHybridReports() {
    if (!this.tempCache.length) return;
    const dir = "test-reports/hybrid";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const csvFile = `${dir}/Partial_Report_${timestamp}.csv`;
    fs.writeFileSync(csvFile, "Partial data auto-saved", "utf-8");
    console.log(`🧾 Partial report saved: ${csvFile}`);
  }
}
