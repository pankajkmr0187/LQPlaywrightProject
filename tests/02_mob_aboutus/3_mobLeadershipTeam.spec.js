import { test } from "@playwright/test";
import { MobLeadershipTeamPage } from "../../pages/02_mob_aboutus/3_mobLeadershipTeamPage.js";

test("Leadership Team Page — Verify Links", async ({ page }) => {
  const leadershipPage = new MobLeadershipTeamPage(page);

  console.log("🚀 Starting Leadership Team Page Link Verification...");

  await leadershipPage.openPage("/");
  await leadershipPage.openAndClickHamburger();  // ✅ Uses BasePage hamburger
  await leadershipPage.navigateToLeadershipTeam();
  await leadershipPage.verifyLeadershipTeamPageContent();

  console.log("🎯 Leadership Team page link verification test completed!");
});
