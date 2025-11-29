import { BasePage } from "../BasePage.js";
import { LinkVerificationUtils } from "../../utils/linkVerificationUtils.js";
import fs from "fs";
import path from "path";

export class MobBlogsPage extends BasePage {
  constructor(page) {
    super(page);

    this.blogsLink = 'a.hfe-menu-item[href="https://learnqoch.com/blogs/"]';
    this.eachBlogLink = "a.blogLink";
    this.moreTopicLinks = "a.more-topics";

    this.reportDir = "Reports/BlogFailures";
    if (!fs.existsSync(this.reportDir)) {
      fs.mkdirSync(this.reportDir, { recursive: true });
    }
  }

  async openAndClickHamburger() {
    console.log("📱 Setting mobile viewport...");
    await this.page.setViewportSize({ width: 390, height: 844 });
    await this.wait(2);

    console.log("🍔 Opening hamburger via BasePage...");
    await this.clickHamburgerUntilCrossVisible();
    console.log("✅ Hamburger opened!");
  }

  async navigateToBlogs() {
    console.log("🧭 Navigating to Blogs page...");
    await this.page.locator(this.blogsLink).click();
    await this.wait(2);
    console.log("✅ Blogs main page opened!");
  }

  // Fast scroll helper
  async scrollFullPage() {
    console.log("🔽 Starting fast scroll...");
    await this.page.evaluate(async () => {
      const totalHeight = document.body.scrollHeight - window.innerHeight;
      const step = 200;
      for (let y = 0; y <= totalHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 30));
      }
    });

    console.log("🕒 Reached bottom, waiting 0.5s...");
    await this.page.waitForTimeout(500);

    console.log("🔼 Scrolling back to top...");
    await this.page.evaluate(() => window.scrollTo(0, 0));
    console.log("✅ Scroll completed!");
  }

  async verifyAndClickAllBlogLinks() {
    console.log("🔍 Starting Blogs link verification...");
    let total = await this.page.locator(this.eachBlogLink).count();
    console.log(`📋 Found ${total} blog links.`);

    for (let i = 0; i < total; i++) {
      console.log(`\n👉 Processing Blog #${i + 1}`);

      const blog = this.page.locator(this.eachBlogLink).nth(i);
      const href = await blog.getAttribute("href");
      const title = (await blog.textContent())?.trim() || "(no title)";
      console.log(`📝 Title: ${title}`);
      console.log(`🌐 URL: ${href}`);

      const response = await this.page.request.get(href);
      const status = response.status();
      console.log(`🔍 HTTP Status: ${status}`);

      if (status !== 200) {
        const safeName = title.replace(/[^a-zA-Z0-9]/g, "_").slice(0, 50);
        const screenshotPath = path.join(this.reportDir, `Fail_${safeName}.png`);
        await this.page.screenshot({ path: screenshotPath, fullPage: true });
        continue;
      }

      // Scroll + Highlight
      await this.page.evaluate((index) => {
        const el = document.querySelectorAll("a.blogLink")[index];
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
          el.style.outline = "3px solid red";
          el.style.backgroundColor = "#ffe6e6";
        }
      }, i);
      await this.page.waitForTimeout(2000);

      await Promise.all([
        this.page.waitForLoadState("networkidle"),
        blog.click(),
      ]);
      console.log(`✅ Opened: ${await this.page.title()}`);

      await this.page.waitForTimeout(2000);
      await this.scrollFullPage();

      console.log("↩️ Returning to Blogs...");
      await this.clickHamburgerUntilCrossVisible();
      await this.page.locator(this.blogsLink).click();
      await this.wait(1.5);
    }

    // Explore More Topics section
    console.log("\n🔍 Exploring 'More Topics' section...");
    let topicCount = await this.page.locator(this.moreTopicLinks).count();
    console.log(`📚 Found ${topicCount} Explore More Topics links.`);

    for (let j = 0; j < topicCount; j++) {
      console.log(`\n👉 Explore Topic #${j + 1}`);
      const topic = this.page.locator(this.moreTopicLinks).nth(j);
      const href = await topic.getAttribute("href");
      const name = (await topic.textContent())?.trim() || "(no name)";
      console.log(`📝 Topic: ${name}`);
      console.log(`🌐 URL: ${href}`);

      const response = await this.page.request.get(href);
      const status = response.status();
      console.log(`🔍 HTTP Status: ${status}`);

      if (status !== 200) {
        const safeName = name.replace(/[^a-zA-Z0-9]/g, "_").slice(0, 50);
        const screenshotPath = path.join(this.reportDir, `Fail_Topic_${safeName}.png`);
        await this.page.screenshot({ path: screenshotPath, fullPage: true });
        continue;
      }

      await this.page.evaluate((index) => {
        const el = document.querySelectorAll("a.more-topics")[index];
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
          el.style.outline = "3px solid blue";
          el.style.backgroundColor = "#e6f3ff";
        }
      }, j);
      await this.page.waitForTimeout(2000);

      await Promise.all([
        this.page.waitForLoadState("networkidle"),
        topic.click(),
      ]);
      console.log(`✅ Opened Topic: ${await this.page.title()}`);

      await this.page.waitForTimeout(2000);
      await this.scrollFullPage();

      console.log("↩️ Returning to Blogs...");
      await this.clickHamburgerUntilCrossVisible();
      await this.page.locator(this.blogsLink).click();
      await this.wait(1.5);
    }

    // ✅ Generate CSV + HTML Report
    console.log("\n🧾 Generating Blogs page report...");
    const linkVerifier = new LinkVerificationUtils(this.page);
    await linkVerifier.verifyPageLinks("Blogs", "Blogs");
    console.log("✅ Blogs report (CSV + HTML) generated successfully!");

    console.log("\n🎯 All Blog & Topic links verified, scrolled & reported successfully!");
  }
}
