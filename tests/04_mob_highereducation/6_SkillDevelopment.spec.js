// 📁 File: tests/04_mob_highereducation/6_SkillDevelopment.spec.js
import { test } from "@playwright/test";
import { SkillDevelopmentPage } from "../../pages/04_mob_highereducation/6_SkillDevelopmentPage.js";

test("Open LearnQoch, expand menu, and verify Skill Development page", async ({ page }) => {
  const skillDevelopment = new SkillDevelopmentPage(page);

  console.log("🚀 Starting Skill Development Page Automation...");

  // Step 1️⃣: Open LearnQoch homepage
  await skillDevelopment.openPage("/"); // 🌐 BasePage method

  // Step 2️⃣: Open mobile hamburger menu
  await skillDevelopment.openAndClickHamburger(); // 🍔 from BasePage

  // Step 3️⃣: Navigate through Higher Education → Skill Development
  await skillDevelopment.navigateToSkillDevelopment(); // 🧭 Page-specific navigation

  // Step 4️⃣: Scroll down, scroll up, and verify all links
  await skillDevelopment.verifySkillDevelopmentPageContent(); // 🔍 Page verification

  console.log("🎯 Skill Development Page test completed successfully!");
});
