// 📁 File: pages/04_mob_highereducation/1_AdvancedLMSPage.js
import { BasePage } from "../BasePage.js";
import { LinkVerificationUtils } from "../../utils/linkVerificationUtils.js";

export class AdvancedLMSPage extends BasePage {
  constructor(page) {
    super(page);

    // ✅ Only keep page-specific locators now
    this.higherEducationLink = 'a.hfe-menu-item:has-text("Higher Education")';
    this.advancedLMSLink = '/html/body/div[1]/header/div/div[3]/div/div[1]/div/div/nav/ul/li[3]/ul/li[1]/a';
  }

  // ✅ Step 1: Use BasePage method for hamburger
  async openAndClickHamburger() {
    console.log("📱 Setting mobile viewport...");
    await this.page.setViewportSize({ width: 390, height: 844 });
    await this.wait(2);

    console.log("🖥️ Clicking hamburger using BasePage method...");
    await this.clickHamburgerUntilCrossVisible(); // ✅ from BasePage
    console.log("✅ Hamburger opened successfully!");
  }

  // ✅ Step 2: Navigate to Advanced LMS
  async navigateToAdvancedLMS() {
    console.log("📂 Clicking Higher Education...");
    await this.page.locator(this.higherEducationLink).click();
    await this.wait(1);

    console.log("🧭 Clicking Advanced LMS using XPath...");
    await this.page.locator(`xpath=${this.advancedLMSLink}`).click();
    await this.wait(2);

    console.log("✅ Advanced LMS page opened!");
  }

  // ✅ Step 3: Verify Advanced LMS page with smooth scrolling and link verification
  async verifyAdvancedLMSPageContent() {
    console.log("🔍 Starting Advanced LMS page verification...");
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

    // Use LinkVerificationUtils for link verification
    const linkVerifier = new LinkVerificationUtils(this.page);
    await linkVerifier.verifyPageLinks('Advanced LMS', 'AdvancedLMS');
    
    console.log("✅ Advanced LMS page verification complete!");
  }


}
