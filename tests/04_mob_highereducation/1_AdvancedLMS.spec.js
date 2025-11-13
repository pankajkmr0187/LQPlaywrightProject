import { test } from "@playwright/test";
import { AdvancedLMSPage } from "../../pages/04_mob_highereducation/1_AdvancedLMSPage.js";

test("Open LearnQoch, expand menu, and verify Advanced LMS page", async ({ page }) => {
  const advancedLMS = new AdvancedLMSPage(page);

  await advancedLMS.openPage("/"); // BasePage method
  await advancedLMS.openAndClickHamburger(); // ✅ Uses BasePage logic
  await advancedLMS.navigateToAdvancedLMS(); // Page-specific
  await advancedLMS.verifyAdvancedLMSPageContent(); // Page-specific

  console.log("🎯 Test completed successfully!");
  // Browser will close automatically after test completion
});
