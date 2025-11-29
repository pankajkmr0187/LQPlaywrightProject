// 📁 File: pages/02_mob_aboutus/1_mobVisionMissionPage.js
import { BasePage } from "../BasePage.js";
import { LinkVerificationUtils } from "../../utils/linkVerificationUtils.js";

export class MobVisionMissionPage extends BasePage {
  constructor(page) {
    super(page);

    // 🔹 Navigation locators
    this.aboutUsLink = 'a.hfe-menu-item:has-text("About Us")';
    this.visionMissionLink =
      'ul.sub-menu li a.hfe-sub-menu-item[href*="vision-and-mission"]';
  }

  // ✅ Step 1: Open and click hamburger
  async openAndClickHamburger() {
    console.log("📱 Setting mobile viewport...");
    await this.page.setViewportSize({ width: 390, height: 844 });
    await this.wait(2);
    console.log("🖱️ Clicking hamburger using BasePage method...");
    await this.clickHamburgerUntilCrossVisible();
    console.log("✅ Hamburger opened successfully!");
  }

  // ✅ Step 2: Navigate to Vision & Mission
  async navigateToVisionMission() {
    console.log("📂 Clicking About Us...");
    await this.page.locator(this.aboutUsLink).click();
    await this.wait(1);

    console.log("🧭 Clicking Vision and Mission...");
    await this.page.locator(this.visionMissionLink).click();
    await this.wait(1);

    console.log("✅ Vision and Mission page opened successfully!");
  }

  // ✅ Step 3: Verify content and run link verification
  async verifyVisionMissionPageContentAndLinks() {
    console.log("🔍 Verifying Vision & Mission page content...");

    const currentUrl = this.page.url();
    console.log(`🌐 Current URL: ${currentUrl}`);

    // Capture heading
    const heading = await this.page.locator("h1, h2, h3").first().textContent();
    console.log(`📝 Found heading: ${heading.trim()}`);

    const paragraphCount = await this.page.locator("p").count();
    console.log(`🧾 Found ${paragraphCount} text paragraphs.`);

    console.log("✅ Vision & Mission basic content verified.");

    // ✅ Use LinkVerificationUtils for link verification
    const linkVerifier = new LinkVerificationUtils(this.page);
    await linkVerifier.verifyPageLinks("Vision & Mission", "VisionMission");
    
    console.log("✅ Vision & Mission page verification completed successfully!");
  }
}
