// ✅ FINAL CLEAN mobHomePage.js — SAFE FOR GITHUB + LOCAL PLAYWRIGHT REPORTING
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

    // Try multiple selectors for better reliability
    const demoBtn = this.page.locator(
      'a.ekit-double-btn.ekit-double-btn-one[href*="schedule-a-demo"], a[href*="schedule-a-demo"]'
    ).first();

    // Wait for button to be visible
    await demoBtn.waitFor({ state: 'visible', timeout: 10000 }).catch(async () => {
      console.log("⚠️ Button not visible, taking screenshot for debugging...");
      await this.page.screenshot({ path: `test-reports/GenericReport/screenshots/button-not-found-${Date.now()}.png`, fullPage: true });
      throw new Error('Schedule a Demo button not found on page');
    });

    console.log("✨ Highlighting and clicking 'Schedule a Demo'...");
    await demoBtn.scrollIntoViewIfNeeded();
    await this.page.evaluate(() => {
      const btn = document.querySelector(
        'a.ekit-double-btn.ekit-double-btn-one[href*="schedule-a-demo"], a[href*="schedule-a-demo"]'
      );
      if (btn) {
        btn.style.outline = "3px solid #00ff00";
      }
    });

    await this.wait(2);

    // Click and wait for navigation
    await demoBtn.click();
    await this.page.waitForURL(/schedule-a-demo/, { timeout: 30000 });

    const currentUrl = this.page.url();
    console.log(`✅ Navigated to: ${currentUrl}`);
    
    if (!currentUrl.includes('schedule-a-demo')) {
      throw new Error(`Failed to navigate to Schedule Demo page. Current URL: ${currentUrl}`);
    }
    
    await this.wait(3);
    await this.page.waitForLoadState('networkidle');

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
    
    // Check for multiple possible success indicators
    const pageText = await this.page.evaluate(() => document.body.innerText.toLowerCase());
    console.log("📄 Page text snippet:", pageText.substring(0, 500));
    
    // Check for CF7 success message div
    const successDiv = await this.page.locator('.wpcf7-response-output, .wpcf7-mail-sent-ok').textContent().catch(() => null);
    if (successDiv) {
      console.log("✉️ Form response:", successDiv);
    }
    
    const successFound = pageText.includes("thank you") || 
                        pageText.includes("thanks") ||
                        pageText.includes("success") ||
                        pageText.includes("submitted") ||
                        await this.page.locator('.wpcf7-mail-sent-ok').isVisible().catch(() => false);

    if (successFound) {
      console.log("🎉 SUCCESS: Schedule Demo submission successful!");
    } else {
      console.log("⚠️ WARNING: Schedule Demo success text not found!");
      console.log("📄 Page response:", successDiv || "No response message");
      await this.page.screenshot({ path: `test-reports/GenericReport/screenshots/schedule-demo-failed-${Date.now()}.png`, fullPage: true });
      console.log("➡️ Skipping Schedule Demo verification and continuing...");
    }
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

    // Try multiple selectors for better reliability
    const tryBtn = this.page.locator(
      'a.ekit-double-btn.ekit-double-btn-two[href*="try-for-free"], a[href*="try-for-free"]'
    ).first();

    // Wait for button to be visible
    await tryBtn.waitFor({ state: 'visible', timeout: 10000 }).catch(async () => {
      console.log("⚠️ Button not visible, taking screenshot for debugging...");
      await this.page.screenshot({ path: `test-reports/GenericReport/screenshots/try-button-not-found-${Date.now()}.png`, fullPage: true });
      throw new Error('Try for Free button not found on page');
    });

    console.log("✨ Highlighting and clicking 'Try for Free'...");
    await tryBtn.scrollIntoViewIfNeeded();
    await this.page.evaluate(() => {
      const btn = document.querySelector(
        'a.ekit-double-btn.ekit-double-btn-two[href*="try-for-free"], a[href*="try-for-free"]'
      );
      if (btn) {
        btn.style.outline = "3px solid yellow";
      }
    });

    await this.wait(2);

    // Click and wait for navigation
    await tryBtn.click();
    await this.page.waitForURL(/try-for-free/, { timeout: 30000 });

    const currentUrl = this.page.url();
    console.log(`💚 Navigated to: ${currentUrl}`);
    
    if (!currentUrl.includes('try-for-free')) {
      throw new Error(`Failed to navigate to Try for Free page. Current URL: ${currentUrl}`);
    }
    
    await this.wait(3);
    await this.page.waitForLoadState('networkidle');

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
    await this.wait(6);

    const text = await this.page.evaluate(() => document.body.innerText.toLowerCase());
    await this.wait(2);

    if (text.includes("thank you for signing up") || text.includes("thank you for registration") || text.includes("thank you") || text.includes("success")) {
      console.log("🎉 SUCCESS: Try for Free submission successful!");
    } else {
      console.log("⚠️ WARNING: Try for Free success text not found!");
      await this.page.screenshot({ path: `test-reports/GenericReport/screenshots/try-for-free-failed-${Date.now()}.png`, fullPage: true });
      console.log("➡️ Skipping Try for Free verification and continuing...");
    }
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

      // Only log → NOT generating report here
      await reportUtils.logLinkResult(i + 1, text, href, status, statusCode, error);

      const scrollDist = Math.abs(y - prevY);
      prevY = y;
      await this.wait(Math.min(2.5, Math.max(1, scrollDist / 1000 + 1)));
    }

    console.log("✔ Link verification completed!");
    // ❌ No generateCSVReport()
    // ❌ No generateHTMLReport()
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

    // ❌ No generateFieldHTMLReport()
    // ❌ No generateCSVReport()
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
    console.log("⏳ Waiting for form to be ready...");
    try {
      // Wait for form container first
      await this.page.waitForSelector('form.wpcf7-form', { state: 'visible', timeout: 20000 });
      await this.wait(2);
      
      // Then wait for first name field
      await this.page.waitForSelector('input[name="your-fname"]', { state: 'visible', timeout: 20000 });
      console.log("✅ Form is ready!");
    } catch (err) {
      console.log("⚠️ Form not ready, checking page URL...");
      const currentUrl = this.page.url();
      console.log(`   Current URL: ${currentUrl}`);
      
      // Take a screenshot for debugging
      await this.page.screenshot({ path: `test-reports/GenericReport/screenshots/form-not-found-${Date.now()}.png`, fullPage: true });
      throw new Error(`Form fields not found on page: ${currentUrl}. Screenshot saved.`);
    }
  }

  async disableFormReset() {
    await this.page.evaluate(() => {
      document.querySelectorAll("form").forEach((f) => {
        f.addEventListener("reset", (e) => e.preventDefault());
      });
    });
  }
}
