import { test } from "@playwright/test";
import { MobBlogsPage } from "../../pages/05_mob_blogs/mobBlogsPage.js";

test("Verify, scroll, and report all Blogs & Topics", async ({ page }) => {
  const blogs = new MobBlogsPage(page);

  console.log("🚀 Starting Blogs Page Test (with Reporting)...");

  await blogs.openPage("/");
  await blogs.openAndClickHamburger();
  await blogs.navigateToBlogs();
  await blogs.verifyAndClickAllBlogLinks();

  console.log("✅ Blogs Page Test completed successfully!");
});
