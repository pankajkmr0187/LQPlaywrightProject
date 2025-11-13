// 📁 File: pages/06_mob_support/mobSupportPage.js
import { BasePage } from "../BasePage.js";
import { LinkVerificationUtils } from "../../utils/linkVerificationUtils.js";

export class MobSupportPage extends BasePage {
  constructor(page) {
    super(page);

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

    // Smooth scroll down
    console.log("🔽 Starting smooth scroll down...");
    await this.page.evaluate(async () => {
      const totalHeight = document.body.scrollHeight - window.innerHeight;
      const sections = 30;
      const sectionHeight = totalHeight / sections;
      for (let i = 1; i <= sections; i++) {
        const targetY = sectionHeight * i;
        window.scrollTo({ top: targetY, behavior: "smooth" });
        await new Promise((resolve) => setTimeout(resolve, 300));
      }
    });
    console.log("✅ Smooth scroll down complete!");
    await this.wait(1);

    // Smooth scroll up
    console.log("🔼 Starting smooth scroll up...");
    await this.page.evaluate(async () => {
      const totalHeight = document.body.scrollHeight - window.innerHeight;
      const sections = 30;
      const sectionHeight = totalHeight / sections;
      for (let i = sections - 1; i >= 0; i--) {
        const targetY = sectionHeight * i;
        window.scrollTo({ top: targetY, behavior: "smooth" });
        await new Promise((resolve) => setTimeout(resolve, 300));
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    console.log("✅ Smooth scroll up complete!");

    // Link verification
    const linkVerifier = new LinkVerificationUtils(this.page);
    await linkVerifier.verifyPageLinks("Support", "Support");

    console.log("✅ Support page verification complete!");
  }
}
