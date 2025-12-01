import { BasePage } from "../BasePage.js";
import { LinkVerificationUtils } from "../../utils/linkVerificationUtils.js";

export class SchoolERPSoftwarePage extends BasePage {
  constructor(page) {
    super(page, "SchoolERP_K12");


    this.k12Link = 'a.hfe-menu-item:has-text("K12")';
    this.schoolERPLink = 'a.hfe-sub-menu-item[href*="school-erp-software"]';
  }



  // ✅ Step 2: Navigate to School ERP Software
  async navigateToSchoolERP() {
    console.log("📂 Clicking K12...");
    await this.page.locator(this.k12Link).click();
    await this.page.waitForTimeout(4000);

    console.log("🧭 Clicking School ERP Software...");
    await this.page.locator(this.schoolERPLink).first().click();
    await this.page.waitForTimeout(4000);

    console.log("✅ School ERP Software page opened!");
  }

  // ✅ Step 3: Verify School ERP page content
  async verifySchoolERPSoftwarePageContent() {
    console.log("🔍 Verifying School ERP Software page...");
    const currentUrl = this.page.url();
    console.log(`🌐 Current URL: ${currentUrl}`);

    // Use LinkVerificationUtils for link verification
    const linkVerifier = new LinkVerificationUtils(this.page);
    await linkVerifier.verifyPageLinks('School ERP Software', 'SchoolERP_K12');
    
    console.log("✅ School ERP Software page verification completed successfully!");
  }
}
