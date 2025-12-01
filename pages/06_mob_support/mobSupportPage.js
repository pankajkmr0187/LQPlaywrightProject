// 📁 File: pages/06_mob_support/mobSupportPage.js
import { BasePage } from "../BasePage.js";
import { LinkVerificationUtils } from "../../utils/linkVerificationUtils.js";

export class MobSupportPage extends BasePage {
  constructor(page) {
    super(page, "Support");

    // Hamburger menu element (Support)
    this.supportLink = 'a.hfe-menu-item[href="https://learnqoch.com/support/"]';
  }

  // Step 1️⃣: Open hamburger menu
  async openAndClickHamburger() {
    console.log("📱 Setting mobile viewport...");
    await this.page.setViewportSize({ width: 390, height: 844 });
    await this.wait(2);

    console.log("🍔 Clicking hamburger icon using BasePage...");
    await this.clickHamburgerUntilCrossVisible();
    console.log("✅ Hamburger opened successfully!");
  }

  // Step 2️⃣: Navigate to Support page
  async navigateToSupport() {
    console.log("🧭 Navigating to Support page...");
    await this.page.locator(this.supportLink).click();
    await this.wait(2);

    console.log("✅ Support page opened successfully!");
  }

  // Step 3️⃣: Verify Support page content
  async verifySupportPageContent() {
    console.log("🔍 Starting Support page verification...");
    const currentUrl = this.page.url();
    console.log(`🌐 Current URL: ${currentUrl}`);

    // Fast scroll down
    console.log("🔽 Starting fast scroll down...");
    await this.page.evaluate(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    });
    await this.page.waitForTimeout(500);
    console.log("✅ Fast scroll down complete!");

    // Fast scroll up
    console.log("🔼 Starting fast scroll up...");
    await this.page.evaluate(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    await this.page.waitForTimeout(500);
    console.log("✅ Fast scroll up complete!");

    // Link verification
    const linkVerifier = new LinkVerificationUtils(this.page);
    await linkVerifier.verifyPageLinks("Support", "Support");

    console.log("✅ Support page verification complete!");
  }
}
