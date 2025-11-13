// 📁 File: pages/02_mob_aboutus/1_mobVisionMissionPage.js
import { BasePage } from "../BasePage.js";
import { ReportUtils } from "../../utils/reportUtils.js";

export class MobVisionMissionPage extends BasePage {
  constructor(page) {
    super(page);

    // 🔹 Navigation locators
    this.aboutUsLink = 'a.hfe-menu-item:has-text("About Us")';
    this.visionMissionLink =
      'ul.sub-menu li a.hfe-sub-menu-item[href*="vision-and-mission"]';
  }

  // ✅ Step 1: Open and click hamburger
  async openAndClickHamburger() {
    console.log("📱 Setting mobile viewport...");
    await this.page.setViewportSize({ width: 390, height: 844 });
    await this.wait(2);
    console.log("🖱️ Clicking hamburger using BasePage method...");
    await this.clickHamburgerUntilCrossVisible();
    console.log("✅ Hamburger opened successfully!");
  }

  // ✅ Step 2: Navigate to Vision & Mission
  async navigateToVisionMission() {
    console.log("📂 Clicking About Us...");
    await this.page.locator(this.aboutUsLink).click();
    await this.wait(1);

    console.log("🧭 Clicking Vision and Mission...");
    await this.page.locator(this.visionMissionLink).click();
    await this.wait(3);

    console.log("✅ Vision and Mission page opened successfully!");
  }

  // ✅ Step 3: Verify content and run link verification
  async verifyVisionMissionPageContentAndLinks() {
    console.log("🔍 Verifying Vision & Mission page content...");

    const currentUrl = this.page.url();
    console.log(`🌐 Current URL: ${currentUrl}`);

    // Capture heading
    const heading = await this.page.locator("h1, h2, h3").first().textContent();
    console.log(`📝 Found heading: ${heading.trim()}`);

    const paragraphCount = await this.page.locator("p").count();
    console.log(`🧾 Found ${paragraphCount} text paragraphs.`);

    console.log("✅ Vision & Mission basic content verified.");

    // ========== LINK VERIFICATION + REPORT ==========
    console.log("\n🔗 Starting link verification on Vision & Mission page...");

    const reportUtils = new ReportUtils(this.page, "VisionMission");
    const links = await this.page.evaluate(() => {
      const all = Array.from(document.querySelectorAll("a[href]"));
      const list = [];
      all.forEach((a, i) => {
        const s = window.getComputedStyle(a);
        const r = a.getBoundingClientRect();
        const isVisible =
          r.width > 2 && r.height > 2 && s.display !== "none" && s.visibility !== "hidden";
        if (isVisible && a.href && !a.href.includes("javascript:void")) {
          list.push({
            index: i + 1,
            href: a.href,
            text: a.innerText.trim() || "Unnamed Link",
            y: r.top + window.scrollY,
          });
        }
      });
      return list.sort((a, b) => a.y - b.y);
    });

    console.log(`📋 Total visible links found: ${links.length}`);

    let previousY = 0;

    for (let i = 0; i < links.length; i++) {
      const { href, text, y } = links[i];
      console.log(`\n🔹 [${i + 1}] ${text}`);
      console.log(`   URL: ${href}`);

      let status = "VERIFIED";
      let statusCode = 200;
      let error = null;

      try {
        const response = await this.page.request.get(href);
        statusCode = response.status();

        if (statusCode >= 400) {
          status = "FAILED";
          const screenshotPath = `test-reports/VisionMission/screenshots/FAILED_${i + 1}_${text.replace(
            /[^a-zA-Z0-9]/g,
            "_"
          )}.png`;
          await this.page.screenshot({ path: screenshotPath });
          console.log(`📸 Screenshot saved for FAILED link: ${screenshotPath}`);
        }
      } catch (err) {
        status = "ERROR";
        error = err.message;
        const screenshotPath = `test-reports/VisionMission/screenshots/ERROR_${i + 1}_${text.replace(
          /[^a-zA-Z0-9]/g,
          "_"
        )}.png`;
        await this.page.screenshot({ path: screenshotPath });
        console.log(`📸 Screenshot saved for ERROR link: ${screenshotPath}`);
      }

      // Add result
      reportUtils.results.push({
        index: i + 1,
        linkName: text,
        linkUrl: href,
        status,
        statusCode,
        error,
        timestamp: new Date().toISOString(),
      });

      // Scroll + highlight
      await this.page.evaluate((target) => {
        const el = Array.from(document.querySelectorAll("a[href]")).find((a) => a.href === target);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
          el.style.outline = "2px solid red";
        }
      }, href);

      // Smart wait based on scroll distance
      const scrollDistance = Math.abs(y - previousY);
      const smartWait = Math.min(2.5, Math.max(1, scrollDistance / 1000 + 1));
      previousY = y;
      await this.wait(smartWait);

      // Remove highlight
      await this.page.evaluate((target) => {
        const el = Array.from(document.querySelectorAll("a[href]")).find((a) => a.href === target);
        if (el) el.style.outline = "";
      }, href);
    }

    console.log("\n✅ Vision & Mission link verification completed successfully!");
    console.log("📊 Generating reports...");

    reportUtils.generateCSVReport();
    reportUtils.generateHTMLReport();

    console.log("✅ CSV and HTML reports generated successfully!");
    console.log("📸 Screenshots (if any) saved under: test-reports/VisionMission/screenshots/");
  }
}
