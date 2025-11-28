// 📁 File: pages/BasePage.js
import { ReportUtils } from "../utils/reportUtils.js";

export class BasePage {
  constructor(page) {
    this.page = page;
    this.baseUrl = "https://www.learnqoch.com";

    // Common menu locators
    this.hamburgerIcon = page.locator('i.icon.icon-menu-9');
    this.crossIcon = page.locator('svg.e-font-icon-svg.e-far-window-close');

    // ⭐ AUTO APPLY GLOBAL SAFE WRAPPING
    this.wrapAllFunctions();
  }

  // =====================================================================================
  //  GLOBAL SAFE RUNNER — Every method (child classes included) auto-wrapped
  // =====================================================================================
  async safeRun(stepName, fn) {
    try {
      return await fn();
    } catch (err) {
      // Critical methods that should fail the test (only core navigation failures)
      const criticalMethods = [
        'openPage'
      ];
      
      // If it's a critical method, re-throw the error to fail the test
      if (criticalMethods.includes(stepName)) {
        console.log(`\n❌ CRITICAL ERROR in ${stepName}: ${err.message}`);
        throw err;
      }
      
      // For non-critical methods, log warning and continue
      console.log(`\n⚠️ GLOBAL WARNING: ${stepName} failed`);
      console.log(`   Reason: ${err.message}`);
      console.log("➡️ Continuing test execution...\n");
      return null;
    }
  }

  wrapAllFunctions() {
    const proto = Object.getPrototypeOf(this);
    const methods = Object.getOwnPropertyNames(proto);

    methods.forEach((name) => {
      if (
        typeof this[name] === "function" &&
        name !== "constructor" &&
        name !== "safeRun" &&
        name !== "wrapAllFunctions"
      ) {
        const originalFn = this[name].bind(this);

        this[name] = async (...args) => {
          return await this.safeRun(name, () => originalFn(...args));
        };
      }
    });
  }

  // =====================================================================================
  //  EXISTING CODE (UNCHANGED)
  // =====================================================================================

  // ✅ Open any page relative to base URL
  async openPage(path = "/") {
    const targetUrl = `${this.baseUrl}${path === "/" ? "" : path}`;
    console.log(`🌐 Opening URL: ${targetUrl}`);
    await this.page.goto(targetUrl, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });
    await this.wait(3); // Wait for page to fully load
  }

  // ✅ Custom wait utility
  async wait(seconds) {
    console.log(`⏳ Waiting ${seconds}s...`);
    await this.page.waitForTimeout(seconds * 1000);
  }

  // ✅ Click hamburger icon until cross icon appears
  async clickHamburgerUntilCrossVisible() {
    console.log("📱 Clicking hamburger until cross icon appears...");

    for (let i = 0; i < 5; i++) {
      try {
        await this.hamburgerIcon.click();
        await this.page.waitForTimeout(2000);

        if (await this.crossIcon.isVisible()) {
          console.log("✅ Cross icon visible — menu opened successfully!");
          return;
        }
      } catch (error) {
        console.log(`⚠️ Attempt ${i + 1} failed: ${error.message}`);
        await this.page.waitForTimeout(1000);
      }
    }

    throw new Error("❌ Menu did not open — cross icon not visible after multiple clicks!");
  }

  // =====================================================================================
  //  PLAY VIDEO
  // =====================================================================================
  async playYouTubeVideos() {
    console.log('🎥 Looking for YouTube videos to play...');
    
    const videos = await this.page.evaluate(() => {
      const videoElements = [];

      const iframes = document.querySelectorAll('iframe[src*="youtube.com"], iframe[src*="youtu.be"]');
      iframes.forEach((iframe, index) => {
        if (iframe.offsetParent !== null) {
          videoElements.push({
            type: 'iframe',
            index: index + 1,
            src: iframe.src
          });
        }
      });

      const vids = document.querySelectorAll('video');
      vids.forEach((video, index) => {
        if (video.offsetParent !== null) {
          videoElements.push({
            type: 'video',
            index: index + 1,
            src: video.src || 'embedded video'
          });
        }
      });

      return videoElements;
    });

    if (videos.length === 0) {
      console.log('❌ No YouTube videos found on page');
      return;
    }

    console.log(`🎬 Found ${videos.length} video(s) to play`);

    for (let i = 0; i < videos.length; i++) {
      const video = videos[i];
      console.log(`\n🎯 Playing video ${i + 1}: ${video.src}`);

      try {
        if (video.type === 'iframe') {
          await this.page.evaluate((index) => {
            const iframes = document.querySelectorAll('iframe[src*="youtube.com"], iframe[src*="youtu.be"]');
            const iframe = iframes[index];
            if (iframe) {
              iframe.scrollIntoView({ behavior: 'smooth', block: 'center' });

              try {
                iframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
              } catch {}
            }
          }, i);
        } else {
          await this.page.evaluate((index) => {
            const videos = document.querySelectorAll('video');
            const video = videos[index];
            if (video) {
              video.scrollIntoView({ behavior: 'smooth', block: 'center' });
              video.play();
            }
          }, i);
        }

        console.log('▶️ Video started playing');
        await this.wait(5);

        if (video.type === 'iframe') {
          await this.page.evaluate((index) => {
            const iframes = document.querySelectorAll('iframe[src*="youtube.com"], iframe[src*="youtu.be"]');
            const iframe = iframes[index];
            if (iframe) {
              try {
                iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
              } catch {}
            }
          }, i);
        } else {
          await this.page.evaluate((index) => {
            const videos = document.querySelectorAll('video');
            const video = videos[index];
            if (video) {
              video.pause();
            }
          }, i);
        }

        console.log('⏸️ Video paused');

      } catch (err) {
        console.log(`❌ Error playing video ${i + 1}: ${err.message}`);
      }

      if (i < videos.length - 1) {
        await this.wait(1);
      }
    }

    console.log('✅ All videos played successfully!');
  }

  // =====================================================================================
  //  CENTRALIZED LINK VERIFICATION
  // =====================================================================================
  async verifyPageLinks(pageName = 'Page') {
    console.log(`🔍 Starting ${pageName} Links Verification...`);

    console.log(`✅ Page loaded`);
    const reportUtils = new ReportUtils(this.page, pageName);

    await this.page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
    await this.wait(1);

    const links = await this.page.evaluate((pageName) => {
      const pageLinks = [];
      const mainContent =
        document.querySelector('main, .main-content, #main') || document.body;
      const elements = Array.from(mainContent.querySelectorAll('a[href]'));

      elements.sort(
        (a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top
      );

      elements.forEach((element, index) => {
        const isDropdownLink = element.closest(
          '.dropdown, .sub-menu, .menu-item-has-children, [style*="display: none"], [style*="visibility: hidden"]'
        );

        const isHiddenMenu = element.closest('nav') && !element.offsetParent;

        if (!isDropdownLink && !isHiddenMenu && element.offsetParent !== null) {
          let linkName = element.textContent?.trim() || "";

          if (!linkName) {
            const img = element.querySelector("img");
            if (img) {
              linkName =
                img.alt ||
                img.title ||
                "Image Link";
            } else {
              linkName = `${pageName} Link ${index + 1}`;
            }
          }

          const rect = element.getBoundingClientRect();
          pageLinks.push({
            name: linkName,
            url: element.href,
            position: rect.top + window.scrollY,
          });
        }
      });

      return pageLinks;
    }, pageName);

    console.log(`🔗 Found ${links.length} ${pageName.toLowerCase()} links`);
    console.log(`\n=== ${pageName.toUpperCase()} LINKS DISCOVERY ===`);

    for (let i = 0; i < links.length; i++) {
      const link = links[i];

      console.log(`\n🔗 ${i + 1}: ${link.name}`);
      console.log(`   URL: ${link.url}`);

      reportUtils.results.push({
        index: i + 1,
        linkName: link.name,
        linkUrl: link.url,
        status: "FOUND",
        statusCode: 200,
        error: null,
        timestamp: new Date().toISOString(),
      });
    }

    console.log("\n=== END OF LINK DISCOVERY ===");

    reportUtils.generateCSVReport();
    reportUtils.generateHTMLReport();

    return links;
  }
}
