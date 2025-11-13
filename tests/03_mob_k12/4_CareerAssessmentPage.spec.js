import { test } from "@playwright/test";
import { CareerAssessmentPage } from "../../pages/03_mob_k12/4_CareerAssessmentPage.js";

test.setTimeout(0);

test("Navigate & Verify Career Assessment Page", async ({ page }) => {
  const careerPage = new CareerAssessmentPage(page);

  await careerPage.openPage("/");
  await careerPage.clickHamburgerUntilCrossVisible();
  await careerPage.navigateToCareerAssessment();
  await careerPage.verifyCareerAssessmentPageContent();

  console.log("🎯 Test completed successfully!");
  // Browser will close automatically after test completion
});