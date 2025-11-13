# =========================================
# 📁 Script: createMobK12Files.ps1
# 📌 Description: Auto-create numbered Page & Test files (1, 2, 3...) inside 03_mob_k12 folder
# =========================================

# Define main folders
$pagesDir = "pages\03_mob_k12"
$testsDir = "tests\03_mob_k12"

# Create folders if they don't exist
New-Item -ItemType Directory -Force -Path $pagesDir | Out-Null
New-Item -ItemType Directory -Force -Path $testsDir | Out-Null

# Menu sub-items with numbering
$menuItems = @(
    @{ Num = "1"; Name = "AdvancedLMS" },
    @{ Num = "2"; Name = "SchoolERPSoftware" },
    @{ Num = "3"; Name = "CodingForSchools" },
    @{ Num = "4"; Name = "CareerAssessment" },
    @{ Num = "5"; Name = "DigitalMarketing" },
    @{ Num = "6"; Name = "WebsiteManagement" }
)

# Loop through and create Page & Test files
foreach ($item in $menuItems) {
    $num = $item.Num
    $name = $item.Name
    $pageFile = "$pagesDir\$num`_${name}Page.js"
    $testFile = "$testsDir\$num`_${name}Page.spec.js"

    # Template for Page file
    $pageContent = @"
import { BasePage } from "../BasePage.js";

export class ${name}Page extends BasePage {
  constructor(page) {
    super(page);
  }

  async verify${name}PageContent() {
    console.log("✅ ${name} page verification started...");
    // 👉 Add locators, waits, and verifications here
    console.log("✅ ${name} page verification completed successfully!");
  }
}
"@

    # Template for Test file
    $testContent = @"
import { test } from "@playwright/test";
import { ${name}Page } from "../../pages/03_mob_k12/${num}_${name}Page.js";

test.describe("${name} Page Test", () => {
  test("Verify ${name} Page Content", async ({ page }) => {
    const obj = new ${name}Page(page);
    await obj.openPage("/");
    await obj.verify${name}PageContent();
  });
});
"@

    # Write files
    Set-Content -Path $pageFile -Value $pageContent -Encoding UTF8
    Set-Content -Path $testFile -Value $testContent -Encoding UTF8
}

Write-Host "✅ All numbered K12 Page and Test files created successfully inside '03_mob_k12'!"
