import { test } from "@playwright/test";
import { CodingForSchoolsPage } from "../../pages/03_mob_k12/3_CodingForSchoolsPage.js";

test.setTimeout(0);

test("Navigate & Verify Coding for Schools Page", async ({ page }) => {
  const codingPage = new CodingForSchoolsPage(page);

  await codingPage.openPage("/");
  await codingPage.clickHamburgerUntilCrossVisible();
  await codingPage.navigateToCoding();
  await codingPage.verifyCodingForSchoolsPageContent();

  console.log("🎯 Test completed successfully!");
  // Browser will close automatically after test completion
});