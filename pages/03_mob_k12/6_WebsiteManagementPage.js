import { BasePage } from "../BasePage.js";
import { LinkVerificationUtils } from "../../utils/linkVerificationUtils.js";

export class WebsiteManagementPage extends BasePage {
  constructor(page) {
    super(page, "Website_K12");

    this.k12Link = 'a.hfe-menu-item:has-text("K12")';
    this.websiteManagementLink = 'a.hfe-sub-menu-item[href*="website-management"]';
  }

  async navigateToWebsiteManagement() {
    console.log("📂 Clicking K12...");
    await this.page.locator(this.k12Link).click();
    await this.page.waitForTimeout(4000);

    console.log("🧭 Clicking Website Management...");
    await this.page.locator(this.websiteManagementLink).first().click();
    await this.page.waitForTimeout(4000);

    console.log("✅ Website Management page opened!");
  }

  async verifyWebsiteManagementPageContent() {
    console.log("🔍 Verifying Website Management page...");
    const currentUrl = this.page.url();
    console.log(`🌐 Current URL: ${currentUrl}`);

    // Use LinkVerificationUtils for link verification
    const linkVerifier = new LinkVerificationUtils(this.page);
    await linkVerifier.verifyPageLinks('Website Management', 'WebsiteManagement');
    
    console.log("✅ Website Management page verification completed successfully!");
  }
}
