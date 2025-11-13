import { test } from "@playwright/test";
import { SchoolERPSoftwarePage } from "../../pages/03_mob_k12/2_SchoolERPSoftwarePage.js";

test.setTimeout(0);

test("Navigate & Verify School ERP Software Page", async ({ page }) => {
  const schoolERPPage = new SchoolERPSoftwarePage(page);

  await schoolERPPage.openPage("/");
  await schoolERPPage.clickHamburgerUntilCrossVisible();
  await schoolERPPage.navigateToSchoolERP();
  await schoolERPPage.verifySchoolERPSoftwarePageContent();

  console.log("🎯 Test completed successfully!");
  // Browser will close automatically after test completion
});