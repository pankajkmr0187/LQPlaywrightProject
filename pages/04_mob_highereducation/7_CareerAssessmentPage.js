// 📁 File: pages/04_mob_highereducation/7_CareerAssessmentPage.js
import { BasePage } from "../BasePage.js";
import { LinkVerificationUtils } from "../../utils/linkVerificationUtils.js";

export class CareerAssessmentPage extends BasePage {
  constructor(page) {
    super(page);

    this.higherEducationLink = 'a.hfe-menu-item:has-text("Higher Education")';
    this.careerAssessmentLink = '/html/body/div[1]/header/div/div[3]/div/div[1]/div/div/nav/ul/li[3]/ul/li[7]/a';
  }

  async openAndClickHamburger() {
    console.log("📱 Setting mobile viewport...");
    await this.page.setViewportSize({ width: 390, height: 844 });
    await this.wait(2);

    console.log("🖥️ Clicking hamburger using BasePage method...");
    await this.clickHamburgerUntilCrossVisible();
    console.log("✅ Hamburger opened successfully!");
  }

  async navigateToCareerAssessment() {
    console.log("📂 Clicking Higher Education...");
    await this.page.locator(this.higherEducationLink).click();
    await this.wait(1);

    console.log("🧭 Clicking Career Assessment using XPath...");
    await this.page.locator(`xpath=${this.careerAssessmentLink}`).click();
    await this.wait(2);

    console.log("✅ Career Assessment page opened!");
  }

  async verifyCareerAssessmentPageContent() {
    console.log("🔍 Starting Career Assessment page verification...");
    const currentUrl = this.page.url();
    console.log(`🌐 URL: ${currentUrl}`);

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

    const linkVerifier = new LinkVerificationUtils(this.page);
    await linkVerifier.verifyPageLinks('Career Assessment', 'CareerAssessment');
    
    console.log("✅ Career Assessment page verification complete!");
  }
}