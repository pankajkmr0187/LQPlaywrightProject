import { test } from "@playwright/test";
import { WebsiteManagementPage } from "../../pages/03_mob_k12/6_WebsiteManagementPage.js";

test.setTimeout(0);

test.describe("Website Management Navigation Test", () => {
  test("Navigate & Verify Website Management Page", async ({ page }) => {
    const websiteManagementPage = new WebsiteManagementPage(page);

    // Step 1: Open homepage
    await websiteManagementPage.openPage("/");
    await websiteManagementPage.wait(3);

    // Step 2: Navigate through hamburger → K12 → Website Management
    await websiteManagementPage.clickHamburgerUntilCrossVisible();
    await websiteManagementPage.navigateToWebsiteManagement();

    // Step 3: Verify Website Management page content
    await websiteManagementPage.verifyWebsiteManagementPageContent();

    console.log("✅ Website Management test completed successfully!");
  });
});