// ✅ FINAL mobHomePage.js — FULL Schedule + Try + Links + Field Reports
import { BasePage } from "../BasePage.js";
import { ReportUtils } from "../../utils/reportUtils.js";

export class MobHomePage extends BasePage {
  constructor(page) {
    super(page);
  }

  // =====================================================================
  // 1️⃣ Schedule a Demo Form
  // =====================================================================
  async scheduleDemoForm() {
    console.log("🚀 Starting Schedule a Demo form automation...");

    await this.openPage("/");
    await this.page.waitForLoadState("networkidle");
    await this.wait(3);

    console.log("🧭 Scrolling to bring 'Schedule a Demo' button into view...");
    await this.page.evaluate(() => window.scrollBy(0, document.body.scrollHeight / 2));
    await this.wait(2);

    const demoBtn = this.page.locator(
      'xpath=/html/body/div[1]/div/div[2]/div/div/div[2]/div/div/div/div/a[1]'
    );

    if (await demoBtn.isVisible()) {
      console.log("✨ Highlighting and clicking 'Schedule a Demo'...");
      await this.page.evaluate(() => {
        const btn = document.querySelector(
          'a.ekit-double-btn.ekit-double-btn-one[href*="schedule-a-demo"]'
        );
        if (btn) {
          btn.style.outline = "3px solid #00ff00";
          btn.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      });

      await this.wait(2);

      await Promise.all([
        this.page.waitForNavigation({ url: /schedule-a-demo/, timeout: 20000 }),
        demoBtn.click(),
      ]);
    }

    console.log("✅ Navigated to Schedule a Demo page!");
    await this.wait(2);

    await this.disableFormReset();
    await this.waitForFormReady();

    console.log("✏️ Starting Schedule Demo form fill...");

    await this.fillCommonFormFields();

    const checkbox = this.page.locator('input[name="iagree[]"]');
    await checkbox.scrollIntoViewIfNeeded();
    await this.highlightField('input[name="iagree[]"]', "#00ff00");
    await checkbox.click();
    console.log("💚 Checkbox selected.");

    await this.wait(1);

    console.log("📤 Submitting Schedule Demo form...");
    const submitBtn = this.page.locator('input.wpcf7-form-control.wpcf7-submit.has-spinner');
    await submitBtn.click();
    await this.wait(6);

    console.log("🔍 Checking thank-you message...");
    const successFound = await this.page.evaluate(() =>
      document.body.innerText.toLowerCase().includes("thank you for scheduling a demo")
    );

    if (successFound)
      console.log("🎉 SUCCESS: Schedule Demo submission successful!");
    else
      console.log("❌ ERROR: Schedule Demo success text not found!");
  }

  // =====================================================================
  // 2️⃣ Try for Free Form
  // =====================================================================
  async tryForFreeForm() {
    console.log("🚀 Starting Try for Free form automation...");

    await this.openPage("/");
    await this.page.waitForLoadState("networkidle");
    await this.wait(3);

    console.log("🧭 Scrolling to bring 'Try for Free' button into view...");
    await this.page.evaluate(() => window.scrollBy(0, document.body.scrollHeight / 2));
    await this.wait(2);

    const tryBtn = this.page.locator(
      'xpath=/html/body/div[1]/div/div[2]/div/div/div[2]/div/div/div/div/a[2]'
    );

    if (await tryBtn.isVisible()) {
      console.log("✨ Highlighting and clicking 'Try for Free'...");
      await this.page.evaluate(() => {
        const btn = document.querySelector(
          'a.ekit-double-btn.ekit-double-btn-two[href*="try-for-free"]'
        );
        if (btn) {
          btn.style.outline = "3px solid yellow";
          btn.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      });

      await this.wait(2);

      await Promise.all([
        this.page.waitForNavigation({ url: /try-for-free/, timeout: 20000 }),
        tryBtn.click(),
      ]);
    }

    console.log("💚 Navigated to Try for Free page!");

    await this.disableFormReset();
    await this.waitForFormReady();

    console.log("✏️ Filling Try for Free form...");
    await this.fillCommonFormFields();

    const checkbox = this.page.locator('input[name="iagree[]"]');
    await checkbox.click();
    console.log("💚 Checkbox selected.");

    await this.wait(1);

    console.log("📤 Submitting Try for Free form...");
    const submitBtn = this.page.locator('input.wpcf7-form-control.wpcf7-submit.has-spinner');
    await submitBtn.click();

    await this.page.waitForNavigation({ waitUntil: "load", timeout: 15000 });

    const text = await this.page.evaluate(() => document.body.innerText.toLowerCase());
    await this.wait(2);
    if (text.includes("thank you for signing up") || text.includes("thank you for registration"))
      console.log("🎉 SUCCESS: Try for Free submission successful!");
    else
      console.log("❌ ERROR: Try for Free success text not found!");
  }

  // =====================================================================
  // 3️⃣ Link Verification
  // =====================================================================
  async verifyLandingPageLinks() {
    console.log("\n🔗 Starting link verification...");
    await this.openPage("/");
    await this.wait(2);

    const reportUtils = new ReportUtils(this.page, "HomePage");

    const links = await this.page.evaluate(() => {
      const all = Array.from(document.querySelectorAll("a[href]"));
      const list = [];

      all.forEach((a, i) => {
        const s = window.getComputedStyle(a);
        const r = a.getBoundingClientRect();
        const isVisible =
          r.width > 2 && r.height > 2 && s.display !== "none" && s.visibility !== "hidden";
        const isMenu = a.closest("nav") || a.closest(".hfe-nav-menu");

        if (isVisible && !isMenu && a.href && !a.href.includes("javascript:void")) {
          list.push({
            index: i + 1,
            href: a.href,
            text: a.innerText.trim() || "Unnamed Link",
            y: r.top + window.scrollY,
          });
        }
      });

      return list.sort((a, b) => a.y - b.y);
    });

    console.log(`📋 Total links found: ${links.length}`);

    let prevY = 0;

    for (let i = 0; i < links.length; i++) {
      const { href, text, y } = links[i];

      console.log(`\n🔹 Link #${i + 1}: ${text}`);
      console.log(`   URL: ${href}`);

      let status = "VERIFIED";
      let statusCode = 200;
      let error = "";

      try {
        const response = await this.page.request.get(href);
        statusCode = response.status();
        if (statusCode >= 400) status = "FAILED";
      } catch (err) {
        status = "ERROR";
        error = err.message;
      }

      await reportUtils.logLinkResult(i + 1, text, href, status, statusCode, error);

      const scrollDist = Math.abs(y - prevY);
      prevY = y;
      await this.wait(Math.min(2.5, Math.max(1, scrollDist / 1000 + 1)));
    }

    console.log("✔ Link verification completed!");
    reportUtils.generateCSVReport();
    reportUtils.generateHTMLReport();
  }

  // =====================================================================
  // 4️⃣ Form Field Filling (Field Reports + Screenshot)
  // =====================================================================
  async fillCommonFormFields() {
    const reportUtils = new ReportUtils(this.page, "FieldReport");

    const fields = [
      { name: "First Name", selector: 'input[name="your-fname"]', value: "LQMob" },
      { name: "Last Name", selector: 'input[name="your-lname"]', value: "Test" },
      { name: "Email", selector: 'input[name="your-email"]', value: "learnqoch@lq.com" },
      { name: "Designation", selector: 'select[name="designation"]', value: "Principal", isSelect: true },
      { name: "Solution", selector: 'select[name="select-solution"]', value: "ERP", isSelect: true },
      { name: "Institute", selector: 'input[name="institute"]', value: "LearnQoch Academy" },
      { name: "Phone Number", selector: 'input[name="phone-number"]', value: "1234567890" },
      { name: "City", selector: 'input[name="city"]', value: "Mumbai" },
    ];

    for (const field of fields) {
      try {
        const el = this.page.locator(field.selector);
        await el.waitFor({ state: "visible", timeout: 4000 });
        await el.scrollIntoViewIfNeeded();
        await this.highlightField(field.selector, "#00ff00");

        if (field.isSelect) {
          await el.selectOption({ label: field.value });
        } else {
          await el.fill(field.value);
        }

        console.log(`✅ Filled: ${field.name}`);
        await reportUtils.addStep(field.name, "Fill", "Success", false);

      } catch (err) {
        console.log(`❌ Error filling: ${field.name}`);
        console.log(`   🔍 Reason: ${err.message}`);

        await reportUtils.addStep(field.name, "Fill", "Failed", true);
      }

      await this.page.waitForTimeout(200);
    }

    reportUtils.generateFieldHTMLReport();
    reportUtils.generateCSVReport();
  }

  // =====================================================================
  // 5️⃣ Highlight Field
  // =====================================================================
  async highlightField(selector, color) {
    await this.page.evaluate(({ sel, clr }) => {
      const el = document.querySelector(sel);
      if (el) {
        el.style.outline = `3px solid ${clr}`;
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, { sel: selector, clr: color });
  }

  // =====================================================================
  // Utilities
  // =====================================================================
  async waitForFormReady() {
    await this.page.waitForSelector('input[name="your-fname"]', { timeout: 15000 });
  }

  async disableFormReset() {
    await this.page.evaluate(() => {
      document.querySelectorAll("form").forEach((f) => {
        f.addEventListener("reset", (e) => e.preventDefault());
      });
    });
  }
}
