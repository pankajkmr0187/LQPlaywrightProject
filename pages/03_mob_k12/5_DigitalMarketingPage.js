import { BasePage } from "../BasePage.js";
import { LinkVerificationUtils } from "../../utils/linkVerificationUtils.js";

export class DigitalMarketingPage extends BasePage {
  constructor(page) {
    super(page, "Digital_K12");


    this.k12Link = 'a.hfe-menu-item:has-text("K12")';
    this.digitalMarketingLink = 'a.hfe-sub-menu-item[href*="digital-marketing"]';
  }



  async navigateToDigitalMarketing() {
    console.log("📂 Clicking K12...");
    await this.page.locator(this.k12Link).click();
    await this.page.waitForTimeout(4000);

    console.log("🧭 Clicking Digital Marketing...");
    await this.page.locator(this.digitalMarketingLink).first().click();
    await this.page.waitForTimeout(4000);

    console.log("✅ Digital Marketing page opened!");
  }

  async verifyDigitalMarketingPageContent() {
    console.log("🔍 Verifying Digital Marketing page...");
    const currentUrl = this.page.url();
    console.log(`🌐 Current URL: ${currentUrl}`);

    // Use LinkVerificationUtils for link verification
    const linkVerifier = new LinkVerificationUtils(this.page);
    await linkVerifier.verifyPageLinks('Digital Marketing', 'DigitalMarketing');
    
    console.log("✅ Digital Marketing page verification completed successfully!");
  }
}
    }
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }

    // Delete old Digital Marketing files
    console.log("🧹 Cleaning old Digital Marketing files...");
    if (fs.existsSync(csvDir)) {
      const files = fs.readdirSync(csvDir);
      files.forEach(file => {
        if (file.includes('5_DigitalMarketingPage')) {
          fs.unlinkSync(path.join(csvDir, file));
          console.log(`🗑️ Deleted old CSV: ${file}`);
        }
      });
    }
    
    if (fs.existsSync(screenshotDir)) {
      const screenshots = fs.readdirSync(screenshotDir);
      screenshots.forEach(file => {
        if (file.includes('5_DigitalMarketingPage')) {
          fs.unlinkSync(path.join(screenshotDir, file));
          console.log(`🗑️ Deleted old screenshot: ${file}`);
        }
      });
    }

    const timestamp = new Date().toLocaleString("en-GB", {
      year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", second: "2-digit"
    }).replace(/[/:]/g, "-").replace(",", "");

    const csvPath = path.join(csvDir, `5_DigitalMarketingPage_${timestamp}.csv`);
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
              path: path.join(screenshotDir, `5_DigitalMarketingPage_failed_${i + 1}_${timestamp}.png`),
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
            path: path.join(screenshotDir, `5_DigitalMarketingPage_error_${i + 1}_${timestamp}.png`),
            fullPage: true 
          });
          
          fs.appendFileSync(csvPath, `${i + 1},"${link.text}","${link.href}",0,"ERROR"\n`);
        }

        await this.page.waitForTimeout(800);
      }
    }

    console.log(`\n📊 Digital Marketing Links Report:`);
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📋 Total: ${passed + failed}`);
    console.log(`📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);
    console.log(`📄 CSV Report: ${csvPath}`);
  }
}
