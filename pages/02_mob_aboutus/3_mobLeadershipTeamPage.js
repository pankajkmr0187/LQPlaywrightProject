// 📁 File: pages/02_mob_aboutus/3_mobLeadershipTeamPage.js
import { BasePage } from "../BasePage.js";
import { LinkVerificationUtils } from "../../utils/linkVerificationUtils.js";

export class MobLeadershipTeamPage extends BasePage {
  constructor(page) {
    super(page);

    // ✅ Page-specific locators only
    this.aboutUsLink = 'a.hfe-menu-item:has-text("About Us")';
    this.leadershipTeamLink = 'ul.sub-menu li a.hfe-sub-menu-item[href*="leadership-team"]';
  }

  // ✅ Step 1: Use BasePage method for hamburger
  async openAndClickHamburger() {
    console.log("📱 Setting mobile viewport...");
    await this.page.setViewportSize({ width: 390, height: 844 });
    await this.wait(2);

    console.log("🖱️ Clicking hamburger using BasePage method...");
    await this.clickHamburgerUntilCrossVisible(); // ✅ from BasePage
    console.log("✅ Hamburger opened successfully!");
  }

  // ✅ Step 2: Navigate to Leadership Team page
  async navigateToLeadershipTeam() {
    console.log("📂 Clicking About Us...");
    await this.page.locator(this.aboutUsLink).click();
    await this.wait(1);

    console.log("🧭 Clicking Leadership Team...");
    await this.page.locator(this.leadershipTeamLink).click();
    await this.wait(2);

    console.log("✅ Leadership Team page opened!");
  }

  // ✅ Step 3: Verify Leadership Team page with smooth scrolling and link verification
  async verifyLeadershipTeamPageContent() {
    console.log("🔍 Starting Leadership Team page verification...");
    const currentUrl = this.page.url();
    console.log(`🌐 URL: ${currentUrl}`);

    // Fast scroll to bottom
    console.log("🔽 Scrolling to bottom...");
    await this.page.evaluate(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    });
    await this.page.waitForTimeout(500);
    console.log("✅ Reached bottom!");

    // Fast scroll to top
    console.log("🔼 Scrolling to top...");
    await this.page.evaluate(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    await this.page.waitForTimeout(500);
    console.log("✅ Back to top!");

    // ✅ Step 4: Verify all links using LinkVerificationUtils
    const linkVerifier = new LinkVerificationUtils(this.page);
    await linkVerifier.verifyPageLinks("Leadership Team", "LeadershipTeam");

    console.log("✅ Leadership Team page verification complete!");
  }
}
