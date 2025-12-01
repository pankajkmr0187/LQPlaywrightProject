import { BasePage } from "../BasePage.js";
import { LinkVerificationUtils } from "../../utils/linkVerificationUtils.js";

export class CodingForSchoolsPage extends BasePage {
  constructor(page) {
    super(page, "Coding_K12");

    this.k12Link = 'a.hfe-menu-item:has-text("K12")';
    this.codingLink = 'a.hfe-sub-menu-item[href*="coding"]';
  }

  async navigateToCoding() {
    console.log("📂 Clicking K12...");
    await this.page.locator(this.k12Link).click();
    await this.page.waitForTimeout(4000);

    console.log("🧭 Clicking Coding for Schools...");
    await this.page.locator(this.codingLink).first().click();
    await this.page.waitForTimeout(4000);

    console.log("✅ Coding for Schools page opened!");
  }

  async verifyCodingForSchoolsPageContent() {
    console.log("🔍 Verifying Coding for Schools page...");
    const currentUrl = this.page.url();
    console.log(`🌐 Current URL: ${currentUrl}`);

    // Use LinkVerificationUtils for link verification
    const linkVerifier = new LinkVerificationUtils(this.page);
    await linkVerifier.verifyPageLinks('Coding for Schools', 'Coding_K12');
    
    console.log("✅ Coding For Schools page verification completed successfully!");
  }
}
