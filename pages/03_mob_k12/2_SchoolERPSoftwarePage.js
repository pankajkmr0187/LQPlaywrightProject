import { BasePage } from "../BasePage.js";
import { LinkVerificationUtils } from "../../utils/linkVerificationUtils.js";

export class SchoolERPSoftwarePage extends BasePage {
  constructor(page) {
    super(page, "SchoolERP_K12");


    this.k12Link = 'a.hfe-menu-item:has-text("K12")';
    this.schoolERPLink = 'a.hfe-sub-menu-item[href*="school-erp-software"]';
  }



  // ✅ Step 2: Navigate to School ERP Software
  async navigateToSchoolERP() {
    console.log("📂 Clicking K12...");
    await this.page.locator(this.k12Link).click();
    await this.page.waitForTimeout(4000);

    console.log("🧭 Clicking School ERP Software...");
    await this.page.locator(this.schoolERPLink).first().click();
    await this.page.waitForTimeout(4000);

    console.log("✅ School ERP Software page opened!");
  }

  // ✅ Step 3: Verify School ERP page content
  async verifySchoolERPSoftwarePageContent() {
    console.log("🔍 Verifying School ERP Software page...");
    const currentUrl = this.page.url();
    console.log(`🌐 Current URL: ${currentUrl}`);

    // Use LinkVerificationUtils for link verification
    const linkVerifier = new LinkVerificationUtils(this.page);
    await linkVerifier.verifyPageLinks('School ERP Software', 'SchoolERP');
    
    console.log("✅ School ERP Software page verification completed successfully!");
  }
}

    const csvDir = path.join(baseReportDir, "csv_files", "03_mob_k12");
    const screenshotDir = path.join(baseReportDir, "screenshots", "03_mob_k12");
    
    if (!fs.existsSync(csvDir)) {
      fs.mkdirSync(csvDir, { recursive: true });
    }
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }

    // Delete old School ERP files
    console.log("🧹 Cleaning old School ERP files...");
    if (fs.existsSync(csvDir)) {
      const files = fs.readdirSync(csvDir);
      files.forEach(file => {
        if (file.includes('2_SchoolERPSoftwarePage')) {
          fs.unlinkSync(path.join(csvDir, file));
          console.log(`🗑️ Deleted old CSV: ${file}`);
        }
      });
    }
    
    if (fs.existsSync(screenshotDir)) {
      const screenshots = fs.readdirSync(screenshotDir);
      screenshots.forEach(file => {
        if (file.includes('2_SchoolERPSoftwarePage')) {
          fs.unlinkSync(path.join(screenshotDir, file));
          console.log(`🗑️ Deleted old screenshot: ${file}`);
        }
      });
    }

    const timestamp = new Date().toLocaleString("en-GB", {
      year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", second: "2-digit"
    }).replace(/[/:]/g, "-").replace(",", "");

    const csvPath = path.join(csvDir, `2_SchoolERPSoftwarePage_${timestamp}.csv`);
    fs.writeFileSync(csvPath, "Index,Link Text,URL,Status,Result\n");

    const visibleLinks = await this.page.$$eval('a[href]', (links) => {
      return links
        .map((link, index) => {
          const rect = link.getBoundingClientRect();
          const isVisible = rect.width > 0 && rect.height > 0;
          const hasText = link.innerText.trim().length > 0;
          
          return {
            index,
            text: link.innerText.trim(),
            href: link.href,
            isVisible,
            hasText
          };
        })
        .filter(link => link.isVisible && link.hasText && 
                       !link.href.startsWith('javascript:') && 
                       !link.href.startsWith('#'));
    });

    console.log(`📋 Found ${visibleLinks.length} visible links with text to verify`);

    let passed = 0, failed = 0;
    const allLinkElements = await this.page.$$('a[href]');

    for (let i = 0; i < visibleLinks.length; i++) {
      const link = visibleLinks[i];
      const linkElement = allLinkElements[link.index];

      if (linkElement) {
        await linkElement.scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(500);
        
        await this.page.evaluate((el) => {
          el.style.backgroundColor = 'yellow';
          el.style.border = '3px solid orange';
          el.style.outline = '2px solid black';
        }, linkElement);

        console.log(`🔍 [${i + 1}/${visibleLinks.length}] ${link.text}`);
        
        try {
          const response = await this.page.request.get(link.href, { timeout: 6000 });
          const status = response.status();

          if (status >= 200 && status < 400) {
            passed++;
            console.log(`✅ PASS | ${status}`);
            
            await this.page.evaluate((el) => {
              el.style.backgroundColor = 'lightgreen';
              el.style.border = '3px solid green';
            }, linkElement);
            
            fs.appendFileSync(csvPath, `${i + 1},"${link.text}","${link.href}",${status},"PASS"\n`);
          } else {
            failed++;
            console.log(`❌ FAIL | ${status}`);
            
            await this.page.evaluate((el) => {
              el.style.backgroundColor = 'lightcoral';
              el.style.border = '3px solid red';
            }, linkElement);
            
            await this.page.screenshot({ 
              path: path.join(screenshotDir, `2_SchoolERPSoftwarePage_failed_${i + 1}_${timestamp}.png`),
              fullPage: true 
            });
            
            fs.appendFileSync(csvPath, `${i + 1},"${link.text}","${link.href}",${status},"FAIL"\n`);
          }
        } catch (error) {
          failed++;
          console.log(`❌ FAIL | ERROR`);
          
          await this.page.evaluate((el) => {
            el.style.backgroundColor = 'lightcoral';
            el.style.border = '3px solid red';
          }, linkElement);
          
          await this.page.screenshot({ 
            path: path.join(screenshotDir, `2_SchoolERPSoftwarePage_error_${i + 1}_${timestamp}.png`),
            fullPage: true 
          });
          
          fs.appendFileSync(csvPath, `${i + 1},"${link.text}","${link.href}",0,"ERROR"\n`);
        }

        await this.page.waitForTimeout(800);
      }
    }

    console.log(`\n📊 School ERP Links Report:`);
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📋 Total: ${passed + failed}`);
    console.log(`📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);
    console.log(`📄 CSV Report: ${csvPath}`);
  }
}
