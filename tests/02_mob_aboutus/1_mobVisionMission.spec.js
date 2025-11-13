import { test } from "@playwright/test";
import { MobVisionMissionPage } from "../../pages/02_mob_aboutus/1_mobVisionMissionPage.js";

test("Vision & Mission Page Test — Verify Page Content and All Links", async ({ page }) => {
  const visionMission = new MobVisionMissionPage(page);

  console.log("🌐 Opening LearnQoch homepage...");
  await visionMission.openPage("/");
  await visionMission.wait(2);

  await visionMission.openAndClickHamburger();
  await visionMission.navigateToVisionMission();
  await visionMission.verifyVisionMissionPageContentAndLinks();

  console.log("🎯 Vision & Mission page link verification test completed successfully!");
});
