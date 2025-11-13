// 📁 File: tests/06_mob_support/mobSupport.spec.js
import { test } from "@playwright/test";
import { MobSupportPage } from "../../pages/06_mob_support/mobSupportPage.js";

test("Open LearnQoch, expand menu, and verify Support page", async ({ page }) => {
  const support = new MobSupportPage(page);

  console.log("🚀 Starting Support Page Automation...");

  await support.openPage("/");             // 🌐 Open homepage
  await support.openAndClickHamburger();   // 🍔 Open hamburger
  await support.navigateToSupport();       // 🧭 Click Support link
  await support.verifySupportPageContent(); // 🔍 Verify and scroll

  console.log("🎯 Support Page test completed successfully!");
});
