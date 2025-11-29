// 📁 File: pages/04_mob_highereducation/5_NAAC_NBA_NIRFPage.js
import { BasePage } from "../BasePage.js";
import { LinkVerificationUtils } from "../../utils/linkVerificationUtils.js";

export class NAAC_NBA_NIRFPage extends BasePage {
  constructor(page) {
    super(page);

    this.higherEducationLink = 'a.hfe-menu-item:has-text("Higher Education")';
    this.naacNbaNirfLink = '/html/body/div[1]/header/div/div[3]/div/div[1]/div/div/nav/ul/li[3]/ul/li[5]/a';
  }

  async openAndClickHamburger() {
    console.log("📱 Setting mobile viewport...");
    await this.page.setViewportSize({ width: 390, height: 844 });
    await this.wait(2);

    console.log("🖥️ Clicking hamburger using BasePage method...");
    await this.clickHamburgerUntilCrossVisible();
    console.log("✅ Hamburger opened successfully!");
  }

  async navigateToNAACNBANIRF() {
    console.log("📂 Clicking Higher Education...");
    await this.page.locator(this.higherEducationLink).click();
    await this.wait(1);

    console.log("🧭 Clicking NAAC NBA NIRF using XPath...");
    await this.page.locator(`xpath=${this.naacNbaNirfLink}`).click();
    await this.wait(2);

    console.log("✅ NAAC NBA NIRF page opened!");
  }

  async verifyNAACNBANIRFPageContent() {
    console.log("🔍 Starting NAAC NBA NIRF page verification...");
    const currentUrl = this.page.url();
    console.log(`🌐 URL: ${currentUrl}`);

    console.log("🔽 Scrolling to bottom...");
    await this.page.evaluate(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    });
    await this.page.waitForTimeout(500);
    console.log("✅ Reached bottom!");

    console.log("🔼 Scrolling to top...");
    await this.page.evaluate(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    await this.page.waitForTimeout(500);
    console.log("✅ Back to top!");

    const linkVerifier = new LinkVerificationUtils(this.page);
    await linkVerifier.verifyPageLinks('NAAC NBA NIRF', 'NAACNBANIRF');
    
    console.log("✅ NAAC NBA NIRF page verification complete!");
  }
}
