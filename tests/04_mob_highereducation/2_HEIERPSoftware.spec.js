// 2_HEIERPSoftware Test// 📁 File: tests/04_mob_highereducation/2_HEIERPSoftware.spec.js
import { test } from "@playwright/test";
import { HEIERPSoftwarePage } from "../../pages/04_mob_highereducation/2_HEIERPSoftwarePage.js";

test("Open LearnQoch, expand menu, and verify HEI ERP Software page", async ({ page }) => {
  const heiERP = new HEIERPSoftwarePage(page);

  console.log("🚀 Starting HEI ERP Software Page Automation...");

  await heiERP.openPage("/");              // 🌐 BasePage method — opens homepage
  await heiERP.openAndClickHamburger();    // 🍔 Opens mobile menu
  await heiERP.navigateToHEIERP();         // 🧭 Navigates via dropdown
  await heiERP.verifyHEIERPPageContent();  // 🔍 Scroll + verify all links

  console.log("🎯 HEI ERP Software Page test completed successfully!");
});
