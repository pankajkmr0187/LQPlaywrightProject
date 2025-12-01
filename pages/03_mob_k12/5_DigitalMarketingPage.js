import { BasePage } from "../BasePage.js";
import { LinkVerificationUtils } from "../../utils/linkVerificationUtils.js";

export class DigitalMarketingPage extends BasePage {
  constructor(page) {
    super(page, "Digital_K12");

    this.k12Link = 'a.hfe-menu-item:has-text("K12")';
    this.digitalMarketingLink = 'a.hfe-sub-menu-item[href*="digital-marketing"]';
  }

  async navigateToDigitalMarketing() {
    console.log("📂 Clicking K12...");
    await this.page.locator(this.k12Link).click();
    await this.page.waitForTimeout(4000);

    console.log("🧭 Clicking Digital Marketing...");
    await this.page.locator(this.digitalMarketingLink).first().click();
    await this.page.waitForTimeout(4000);

    console.log("✅ Digital Marketing page opened!");
  }

  async verifyDigitalMarketingPageContent() {
    console.log("🔍 Verifying Digital Marketing page...");
    const currentUrl = this.page.url();
    console.log(`🌐 Current URL: ${currentUrl}`);

    // Use LinkVerificationUtils for link verification
    const linkVerifier = new LinkVerificationUtils(this.page);
    await linkVerifier.verifyPageLinks('Digital Marketing', 'DigitalMarketing');
    
    console.log("✅ Digital Marketing page verification completed successfully!");
  }
}
