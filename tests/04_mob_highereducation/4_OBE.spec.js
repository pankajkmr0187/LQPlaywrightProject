// 📁 File: tests/04_mob_highereducation/4_OBE.spec.js
import { test } from "@playwright/test";
import { OBEPage } from "../../pages/04_mob_highereducation/4_OBEPage.js";

test("Open LearnQoch, expand menu, and verify OBE page", async ({ page }) => {
  const obePage = new OBEPage(page);

  console.log("🚀 Starting OBE (Outcome Based Education) Page Automation...");

  // Step 1️⃣: Open website
  await obePage.openPage("/"); // 🌐 BasePage method

  // Step 2️⃣: Open hamburger menu
  await obePage.openAndClickHamburger(); // 🍔 BasePage reusable method

  // Step 3️⃣: Navigate through menu
  await obePage.navigateToOBE(); // 🧭 Page-specific navigation

  // Step 4️⃣: Verify page content + links
  await obePage.verifyOBEPageContent(); // 🔍 Scroll + link verification

  console.log("🎯 OBE Page test completed successfully!");
});
