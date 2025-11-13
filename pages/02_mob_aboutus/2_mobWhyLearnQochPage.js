// 📁 File: pages/02_mob_aboutus/2_mobWhyLearnQochPage.js
import { BasePage } from "../BasePage.js";
import { LinkVerificationUtils } from "../../utils/linkVerificationUtils.js";

export class MobWhyLearnQochPage extends BasePage {
  constructor(page) {
    super(page);

    // ✅ Confirmed selectors

    this.aboutUsLink = 'a.hfe-menu-item:has-text("About Us")';
    this.whyLearnQochLink =
      'a.hfe-sub-menu-item[href*="why-learnqoch"]';
  }



  // ✅ Step 2: Navigate to Why LearnQoch using exact DOM selector
  async navigateToWhyLearnQoch() {
    console.log("📂 Clicking About Us...");
    await this.page.locator(this.aboutUsLink).click({ force: true });

    // 🕒 Wait 2 seconds to let the submenu load fully
    console.log("⏳ Waiting 2s for submenu items to load...");
    await this.page.waitForTimeout(2000);

    console.log("🧭 Clicking Why LearnQoch...");
    await this.page.locator(this.whyLearnQochLink).click({ force: true });

    await this.page.waitForLoadState("load", { timeout: 15000 });
    await this.page.waitForTimeout(3000);
    console.log("✅ Why LearnQoch page opened successfully!");
  }

  // ✅ Step 3: Verify Why LearnQoch page content with smooth scrolling and link verification
  async verifyWhyLearnQochPageContent() {
    console.log("🔍 Starting Why LearnQoch page verification...");

    // Verify main heading
    const heading = this.page
      .locator("h2.elementor-heading-title:has-text('Why LearnQoch')")
      .first();
    await heading.waitFor({ state: "visible", timeout: 8000 });
    console.log("✅ Page heading visible!");
    
    // Smooth scroll down
    console.log("🔽 Starting smooth scroll down...");
    await this.page.evaluate(async () => {
      const totalHeight = document.body.scrollHeight - window.innerHeight;
      const sections = 30;
      const sectionHeight = totalHeight / sections;
      
      for (let i = 1; i <= sections; i++) {
        const targetY = sectionHeight * i;
        window.scrollTo({ top: targetY, behavior: 'smooth' });
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    });
    console.log("✅ Smooth scroll down complete!");
    console.log("⏸️ Taking 1 second break...");
    await this.page.waitForTimeout(1000);
    
    // Smooth scroll up
    console.log("🔼 Starting smooth scroll up...");
    await this.page.evaluate(async () => {
      const totalHeight = document.body.scrollHeight - window.innerHeight;
      const sections = 30;
      const sectionHeight = totalHeight / sections;
      
      for (let i = sections - 1; i >= 0; i--) {
        const targetY = sectionHeight * i;
        window.scrollTo({ top: targetY, behavior: 'smooth' });
        await new Promise(resolve => setTimeout(resolve, 300));
      }
      
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    console.log("✅ Smooth scroll up complete!");
    
    // Use LinkVerificationUtils for link verification
    const linkVerifier = new LinkVerificationUtils(this.page);
    await linkVerifier.verifyPageLinks('Why LearnQoch', 'WhyLearnQoch');
    
    console.log("✅ Why LearnQoch page verification completed successfully!");
  }
  

}
