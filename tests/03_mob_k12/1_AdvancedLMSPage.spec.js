import { test } from "@playwright/test";
import { AdvancedLMSPage } from "../../pages/03_mob_k12/1_AdvancedLMSPage.js";

// Disable timeout for debugging
test.setTimeout(0);

test("Navigate & Verify Advanced LMS Page", async ({ page }) => {
  const advancedLMSPage = new AdvancedLMSPage(page);

  console.log("🌐 Opening LearnQoch homepage...");
  await advancedLMSPage.openPage("/");

  console.log("🌭 Attempting hamburger menu click...");
  await advancedLMSPage.clickHamburgerUntilCrossVisible();
  
  console.log("🛤️ Navigating to Advanced LMS...");
  await advancedLMSPage.navigateToAdvancedLMS();

  await advancedLMSPage.verifyAdvancedLMSPageContent();

  console.log("🎯 Test completed successfully!");
  // Browser will close automatically after test completion
});
