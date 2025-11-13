// 📁 File: pages/04_mob_highereducation/9_WebsiteManagementPage.js
import { BasePage } from "../BasePage.js";
import { LinkVerificationUtils } from "../../utils/linkVerificationUtils.js";

export class WebsiteManagementPage extends BasePage {
  constructor(page) {
    super(page);

    this.higherEducationLink = 'a.hfe-menu-item:has-text("Higher Education")';
    this.websiteManagementLink = '/html/body/div[1]/header/div/div[3]/div/div[1]/div/div/nav/ul/li[3]/ul/li[9]/a';
  }

  // ✅ Step 1: Open hamburger (mobile mode)
  async openAndClickHamburger() {
    console.log("📱 Setting mobile viewport...");
    await this.page.setViewportSize({ width: 390, height: 844 });
    await this.wait(2);

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

    // Verify all page links
    const linkVerifier = new LinkVerificationUtils(this.page);
    await linkVerifier.verifyPageLinks("Website Management", "WebsiteManagement");

    console.log("✅ Website Management page verification complete!");
  }
}
