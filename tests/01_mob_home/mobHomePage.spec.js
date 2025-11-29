import { test, expect } from "@playwright/test";
import { MobHomePage } from "../../pages/01_mob_home/mobHomePage.js";

test("Schedule Demo Form Only", async ({ page }) => {
  const home = new MobHomePage(page);
  
  // Test: Schedule Demo Form
  console.log("\n🔷 Schedule Demo Form");
  await home.scheduleDemoForm();
  console.log("✅ Schedule Demo completed!");
  
  // Try for Free Form - COMMENTED OUT
  // console.log("\n🔷 Try for Free Form");
  // await home.tryForFreeForm();
  // console.log("✅ Try for Free completed!");
  
  // Generate report
  console.log("\n📄 Generating report...");
  home.reportUtils.generateCSVReport();
  home.reportUtils.generateCombinedHTMLReport();
  
  console.log("🎯 Schedule Demo test completed!");
});