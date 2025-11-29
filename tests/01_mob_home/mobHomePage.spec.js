import { test, expect } from "@playwright/test";
import { MobHomePage } from "../../pages/01_mob_home/mobHomePage.js";

test("Complete Home Page Flow", async ({ page }) => {
  const home = new MobHomePage(page);
  
  // Test 1: Schedule Demo Form
  console.log("\n🔷 Part 1: Schedule Demo Form");
  await home.scheduleDemoForm();
  console.log("✅ Schedule Demo test completed!");
  
  // Test 2: Try for Free Form
  console.log("\n🔷 Part 2: Try for Free Form");
  await home.tryForFreeForm();
  console.log("✅ Try for Free test completed!");
  
  // Test 3: Link Verification
  console.log("\n🔷 Part 3: Link Verification");
  await home.verifyLandingPageLinks();
  console.log("✅ Link Verification test completed!");
  
  // Generate combined report at the end with all data
  console.log("\n📄 Generating final combined report...");
  home.reportUtils.generateCSVReport();
  home.reportUtils.generateCombinedHTMLReport();
  
  console.log("🎯 Complete Home Page test completed successfully!");
});