// 📁 File: tests/04_mob_highereducation/8_DigitalMarketing.spec.js
import { test } from "@playwright/test";
import { DigitalMarketingPage } from "../../pages/04_mob_highereducation/8_DigitalMarketingPage.js";

test("Open LearnQoch, expand menu, and verify Digital Marketing page", async ({ page }) => {
  const digitalMarketing = new DigitalMarketingPage(page);

  console.log("🚀 Starting Digital Marketing Page Automation...");

  // Step 1️⃣: Open LearnQoch homepage
  await digitalMarketing.openPage("/"); // 🌐 BasePage method

  // Step 2️⃣: Open mobile hamburger menu
  await digitalMarketing.openAndClickHamburger(); // 🍔 BasePage reusable method

  // Step 3️⃣: Navigate via Higher Education → Digital Marketing
  await digitalMarketing.navigateToDigitalMarketing(); // 🧭 Page-specific navigation

  // Step 4️⃣: Verify content, scroll, and check links
  await digitalMarketing.verifyDigitalMarketingPageContent(); // 🔍 Page verification

  console.log("🎯 Digital Marketing Page test completed successfully!");
});
