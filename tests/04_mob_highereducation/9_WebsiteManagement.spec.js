// 📁 File: tests/04_mob_highereducation/9_WebsiteManagement.spec.js
import { test } from "@playwright/test";
import { WebsiteManagementPage } from "../../pages/04_mob_highereducation/9_WebsiteManagementPage.js";

test("Open LearnQoch, expand menu, and verify Website Management page", async ({ page }) => {
  const websiteManagement = new WebsiteManagementPage(page);

  console.log("🚀 Starting Website Management Page Automation...");

  // Step 1️⃣: Open LearnQoch homepage
  await websiteManagement.openPage("/"); // 🌐 BasePage method

  // Step 2️⃣: Open mobile hamburger menu
  await websiteManagement.openAndClickHamburger(); // 🍔 from BasePage

  // Step 3️⃣: Navigate through menu to Website Management page
  await websiteManagement.navigateToWebsiteManagement(); // 🧭 Page-specific navigation

  // Step 4️⃣: Scroll, verify links, and validate page
  await websiteManagement.verifyWebsiteManagementPageContent(); // 🔍 Page verification

  console.log("🎯 Website Management Page test completed successfully!");
});
