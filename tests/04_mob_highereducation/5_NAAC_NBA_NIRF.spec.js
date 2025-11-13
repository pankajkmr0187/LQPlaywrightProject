// 📁 File: tests/04_mob_highereducation/5_NAAC_NBA_NIRF.spec.js
import { test } from "@playwright/test";
import { NAAC_NBA_NIRFPage } from "../../pages/04_mob_highereducation/5_NAAC_NBA_NIRFPage.js";

test("Open LearnQoch, expand menu, and verify NAAC NBA NIRF page", async ({ page }) => {
  const naacNbaNirf = new NAAC_NBA_NIRFPage(page);

  console.log("🚀 Starting NAAC NBA NIRF Page Automation...");

  // Step 1️⃣: Open LearnQoch homepage
  await naacNbaNirf.openPage("/"); // 🌐 BasePage method

  // Step 2️⃣: Click hamburger menu (mobile view)
  await naacNbaNirf.openAndClickHamburger(); // 🍔 From BasePage

  // Step 3️⃣: Navigate to NAAC NBA NIRF page
  await naacNbaNirf.navigateToNAACNBANIRF(); // 🧭 Page-specific navigation

  // Step 4️⃣: Scroll and verify page content
  await naacNbaNirf.verifyNAACNBANIRFPageContent(); // 🔍 Smooth scroll + link verification

  console.log("🎯 NAAC NBA NIRF Page test completed successfully!");
});
