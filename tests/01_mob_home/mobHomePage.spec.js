import { test, expect } from "@playwright/test";
import { MobHomePage } from "../../pages/01_mob_home/mobHomePage.js";

test("Complete Home Page Flow", async ({ page }) => {
  const home = new MobHomePage(page);
  
  // Test: Schedule Demo Form
  console.log("\n🔷 Schedule Demo Form");
  await home.scheduleDemoForm();
  console.log("✅ Schedule Demo completed!");
  
  // Test: Try for Free Form
  console.log("\n🔷 Try for Free Form");
  await home.tryForFreeForm();
  console.log("✅ Try for Free completed!");
  
  // Test: Link Verification
  console.log("\n🔷 Link Verification");
  await home.verifyLandingPageLinks();
  console.log("✅ Link Verification completed!");
  
  // Generate report
  console.log("\n📄 Generating report...");
  home.reportUtils.generateCSVReport();
  home.reportUtils.generateCombinedHTMLReport();
  
  console.log("🎯 All tests completed!");
});