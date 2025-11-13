// 📁 File: tests/04_mob_highereducation/3_ExamManagement.spec.js
import { test } from "@playwright/test";
import { ExamManagementPage } from "../../pages/04_mob_highereducation/3_ExamManagementPage.js";

test("Open LearnQoch, expand menu, and verify Exam Management page", async ({ page }) => {
  const examManagement = new ExamManagementPage(page);

  console.log("🚀 Starting Exam Management Page Automation...");

  // Step 1️⃣: Open website
  await examManagement.openPage("/"); // 🌐 BasePage method

  // Step 2️⃣: Open mobile menu
  await examManagement.openAndClickHamburger(); // 🍔 from BasePage

  // Step 3️⃣: Navigate through menu
  await examManagement.navigateToExamManagement(); // 🧭 Page-specific navigation

  // Step 4️⃣: Verify content and links
  await examManagement.verifyExamManagementPageContent(); // 🔍 Page-specific verification

  console.log("🎯 Exam Management Page test completed successfully!");
});
