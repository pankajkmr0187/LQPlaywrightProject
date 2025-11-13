// 📁 File: tests/04_mob_highereducation/7_CareerAssessment.spec.js
import { test } from "@playwright/test";
import { CareerAssessmentPage } from "../../pages/04_mob_highereducation/7_CareerAssessmentPage.js";

test("Open LearnQoch, expand menu, and verify Career Assessment page", async ({ page }) => {
  const careerAssessment = new CareerAssessmentPage(page);

  console.log("🚀 Starting Career Assessment Page Automation...");

  // Step 1️⃣: Open LearnQoch homepage
  await careerAssessment.openPage("/"); // 🌐 BasePage method

  // Step 2️⃣: Open hamburger menu in mobile viewport
  await careerAssessment.openAndClickHamburger(); // 🍔 BasePage reusable method

  // Step 3️⃣: Navigate via Higher Education → Career Assessment
  await careerAssessment.navigateToCareerAssessment(); // 🧭 Page-specific navigation

  // Step 4️⃣: Scroll, verify links, and validate page
  await careerAssessment.verifyCareerAssessmentPageContent(); // 🔍 Page verification

  console.log("🎯 Career Assessment Page test completed successfully!");
});
