import { test } from "@playwright/test";
import { MobWhyLearnQochPage } from "../../pages/02_mob_aboutus/2_mobWhyLearnQochPage.js";

test("Navigate & Verify Why LearnQoch Page", async ({ page }) => {
  const mobWhyLearnQochPage = new MobWhyLearnQochPage(page);

  await mobWhyLearnQochPage.openPage("/");
  await mobWhyLearnQochPage.clickHamburgerUntilCrossVisible();
  await mobWhyLearnQochPage.navigateToWhyLearnQoch();
  await mobWhyLearnQochPage.verifyWhyLearnQochPageContent();

  console.log("🎯 Test completed successfully!");
  // Browser will close automatically after test completion
});
