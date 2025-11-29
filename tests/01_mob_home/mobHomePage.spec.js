import { test, expect } from "@playwright/test";
import { MobHomePage } from "../../pages/01_mob_home/mobHomePage.js";

test("Home Page Forms Only", async ({ page }) => {
  const home = new MobHomePage(page);
  
  // Test 1: Schedule Demo Form
  console.log("\n🔷 Schedule Demo Form");
  await home.scheduleDemoForm();
  console.log("✅ Schedule Demo completed!");
  
  // Test 2: Try for Free Form
  console.log("\n🔷 Try for Free Form");
  await home.tryForFreeForm();
  console.log("✅ Try for Free completed!");
  
  // Generate combined report
  console.log("\n📄 Generating report...");
  home.reportUtils.generateCSVReport();
  home.reportUtils.generateCombinedHTMLReport();
  
  console.log("🎯 Home Page Forms test completed!");
});