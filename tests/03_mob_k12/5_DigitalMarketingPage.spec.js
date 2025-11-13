import { test } from "@playwright/test";
import { DigitalMarketingPage } from "../../pages/03_mob_k12/5_DigitalMarketingPage.js";

test.setTimeout(0);

test.describe("Digital Marketing Navigation Test", () => {
  test("Navigate & Verify Digital Marketing Page", async ({ page }) => {
    const digitalMarketingPage = new DigitalMarketingPage(page);

    // Step 1: Open homepage
    await digitalMarketingPage.openPage("/");
    await digitalMarketingPage.wait(3);

    // Step 2: Navigate through hamburger → K12 → Digital Marketing
    await digitalMarketingPage.clickHamburgerUntilCrossVisible();
    await digitalMarketingPage.navigateToDigitalMarketing();

    // Step 3: Verify Digital Marketing page content
    await digitalMarketingPage.verifyDigitalMarketingPageContent();

    console.log("✅ Digital Marketing test completed successfully!");
  });
});