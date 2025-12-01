// 📁 File: pages/04_mob_highereducation/8_DigitalMarketingPage.js
import { BasePage } from "../BasePage.js";
import { LinkVerificationUtils } from "../../utils/linkVerificationUtils.js";

export class DigitalMarketingPage extends BasePage {
  constructor(page) {
    super(page, "Digital_Higher");

    this.higherEducationLink = 'a.hfe-menu-item:has-text("Higher Education")';
    this.digitalMarketingLink = '/html/body/div[1]/header/div/div[3]/div/div[1]/div/div/nav/ul/li[3]/ul/li[8]/a';
  }

  async openAndClickHamburger() {
    console.log("📱 Setting mobile viewport...");
    await this.page.setViewportSize({ width: 390, height: 844 });
    await this.wait(2);

    console.log("🖥️ Clicking hamburger using BasePage method...");
    await this.clickHamburgerUntilCrossVisible();
    console.log("✅ Hamburger opened successfully!");
  }

  async navigateToDigitalMarketing() {
    console.log("📂 Clicking Higher Education...");
    await this.page.locator(this.higherEducationLink).click();
    await this.wait(1);

    console.log("🧭 Clicking Digital Marketing using XPath...");
    await this.page.locator(`xpath=${this.digitalMarketingLink}`).click();
    await this.wait(2);

    console.log("✅ Digital Marketing page opened!");
  }

  async verifyDigitalMarketingPageContent() {
    console.log("🔍 Starting Digital Marketing page verification...");
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
    await linkVerifier.verifyPageLinks('Digital Marketing', 'DigitalMarketing');
    
    console.log("✅ Digital Marketing page verification complete!");
  }
}
