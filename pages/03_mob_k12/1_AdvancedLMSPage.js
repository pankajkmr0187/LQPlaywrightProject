import { BasePage } from "../BasePage.js";
import { LinkVerificationUtils } from "../../utils/linkVerificationUtils.js";

export class AdvancedLMSPage extends BasePage {
  constructor(page) {
    super(page, "AdvancedLMS_K12");


    this.k12Link = 'a.hfe-menu-item:has-text("K12")';
    this.advancedLMSLink = 'a.hfe-sub-menu-item[href*="lms"]';
  }



  // ✅ Step 2: Navigate to Advanced LMS
  async navigateToAdvancedLMS() {
    console.log("📂 Clicking K12...");
    await this.page.locator(this.k12Link).click();
    await this.page.waitForTimeout(4000); // Long wait to see submenu

    console.log("🧭 Clicking Advanced LMS...");
    await this.page.locator(this.advancedLMSLink).first().click();
    await this.page.waitForTimeout(4000); // Long wait to see navigation

    console.log("✅ Advanced LMS page opened!");
  }

  // ✅ Step 3: Verify Advanced LMS page content
  async verifyAdvancedLMSPageContent() {
    console.log("🔍 Verifying Advanced LMS page...");
    const currentUrl = this.page.url();
    console.log(`🌐 Current URL: ${currentUrl}`);

    // Use LinkVerificationUtils for link verification
    const linkVerifier = new LinkVerificationUtils(this.page);
    await linkVerifier.verifyPageLinks('Advanced LMS', 'AdvancedLMS');
    
    console.log("✅ Advanced LMS page verification completed successfully!");
  }
}
