import { test } from "@playwright/test";
import { MobHomePage } from "../../pages/01_mob_home/mobHomePage.js";

test("Complete Home Page Flow (Schedule Demo → Try for Free → Link Verification)", async ({ page }) => {
  const home = new MobHomePage(page);

 await home.scheduleDemoForm();
 await home.tryForFreeForm();
  await home.verifyLandingPageLinks();

  console.log("\n🎯 ✅ Full Home Page test completed successfully!");
});