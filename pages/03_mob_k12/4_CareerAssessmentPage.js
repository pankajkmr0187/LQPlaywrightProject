import { BasePage } from "../BasePage.js";
import { LinkVerificationUtils } from "../../utils/linkVerificationUtils.js";

export class CareerAssessmentPage extends BasePage {
  constructor(page) {
    super(page, "Career_K12");

    this.k12Link = 'a.hfe-menu-item:has-text("K12")';
    this.careerLink = 'a.hfe-sub-menu-item[href*="career-assessment"]';
  }

  async navigateToCareerAssessment() {
    console.log("📂 Clicking K12...");
    await this.page.locator(this.k12Link).click();
    await this.page.waitForTimeout(4000);

    console.log("🧭 Clicking Career Assessment...");
    await this.page.locator(this.careerLink).first().click();
    await this.page.waitForTimeout(4000);

    console.log("✅ Career Assessment page opened!");
  }

  async verifyCareerAssessmentPageContent() {
    console.log("🔍 Verifying Career Assessment page...");
    const currentUrl = this.page.url();
    console.log(`🌐 Current URL: ${currentUrl}`);

    // Use LinkVerificationUtils for link verification
    const linkVerifier = new LinkVerificationUtils(this.page);
    await linkVerifier.verifyPageLinks('Career Assessment', 'Career_K12');
    
    console.log("✅ Career Assessment page verification completed successfully!");
  }
}
