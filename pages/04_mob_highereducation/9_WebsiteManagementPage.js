// 📁 File: pages/04_mob_highereducation/9_WebsiteManagementPage.js
import { BasePage } from "../BasePage.js";
import { LinkVerificationUtils } from "../../utils/linkVerificationUtils.js";

export class WebsiteManagementPage extends BasePage {
  constructor(page) {
    super(page, "Website_Higher");

    this.higherEducationLink = 'a.hfe-menu-item:has-text("Higher Education")';
    this.websiteManagementLink = '/html/body/div[1]/header/div/div[3]/div/div[1]/div/div/nav/ul/li[3]/ul/li[9]/a';
  }

  // ✅ Step 1: Open hamburger (mobile mode)
  async openAndClickHamburger() {
    console.log("📱 Setting mobile viewport...");
    await this.page.setViewportSize({ width: 390, height: 844 });
    await this.wait(1);

    console.log("🍔 Clicking hamburger using BasePage method...");
    await this.clickHamburgerUntilCrossVisible();
    console.log("✅ Hamburger opened successfully!");
  }

  // ✅ Step 2: Navigate to Website Management page
  async navigateToWebsiteManagement() {
    console.log("📂 Clicking Higher Education...");
    await this.page.locator(this.higherEducationLink).click();
    await this.wait(1);

    console.log("🧭 Clicking Website Management using XPath...");
    await this.page.locator(`xpath=${this.websiteManagementLink}`).click();
    await this.wait(2);

    console.log("✅ Website Management page opened!");
  }

  // ✅ Step 3: Verify Website Management page content
  async verifyWebsiteManagementPageContent() {
    console.log("🔍 Starting Website Management page verification...");
    const currentUrl = this.page.url();
    console.log(`🌐 URL: ${currentUrl}`);

    // Fast scroll to bottom
    console.log("🔽 Scrolling to bottom...");
    await this.page.evaluate(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    });
    await this.page.waitForTimeout(500);
    console.log("✅ Reached bottom!");

    // Fast scroll to top
    console.log("🔼 Scrolling to top...");
    await this.page.evaluate(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    await this.page.waitForTimeout(500);
    console.log("✅ Back to top!");

    // Verify all page links
    const linkVerifier = new LinkVerificationUtils(this.page);
    await linkVerifier.verifyPageLinks("Website Management", "Website_Higher");

    console.log("✅ Website Management page verification complete!");
  }
}
