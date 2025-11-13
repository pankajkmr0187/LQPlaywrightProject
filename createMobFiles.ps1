# =========================================
# 📁 Script: createMobK12Files.ps1
# 📌 Description: Create numbered Page & Test files (1–6) inside existing 03_mob_k12 folders
# =========================================

# Define existing folders
$pagesDir = "pages\03_mob_k12"
$testsDir = "tests\03_mob_k12"

# Confirm folders exist
if (!(Test-Path $pagesDir)) {
    Write-Host "❌ Folder not found: $pagesDir" -ForegroundColor Red
    exit
}
if (!(Test-Path $testsDir)) {
    Write-Host "❌ Folder not found: $testsDir" -ForegroundColor Red
    exit
}

# Menu sub-items with numbering
$menuItems = @(
    @{ Num = "1"; Name = "AdvancedLMS" },
    @{ Num = "2"; Name = "SchoolERPSoftware" },
    @{ Num = "3"; Name = "CodingForSchools" },
    @{ Num = "4"; Name = "CareerAssessment" },
    @{ Num = "5"; Name = "DigitalMarketing" },
    @{ Num = "6"; Name = "WebsiteManagement" }
)

Write-Host "🛠 Creating files inside existing folders..." -ForegroundColor Yellow

# Loop to create Page & Test files
foreach ($item in $menuItems) {
    $num = $item.Num
    $name = $item.Name
    $pageFile = "$pagesDir\$num`_${name}Page.js"
    $testFile = "$testsDir\$num`_${name}Page.spec.js"

    # Skip if file already exists
    if (Test-Path $pageFile) {
        Write-Host "⚠️ Skipped (exists): $pageFile"
        continue
    }

    # Create Page file content
    $pageContent = @"
import { BasePage } from "../BasePage.js";

export class ${name}Page extends BasePage {
  constructor(page) {
    super(page);
  }

  async verify${name}PageContent() {
    console.log("✅ ${name} page verification started...");
    // 👉 Add locators, waits & verifications here
    console.log("✅ ${name} page verification completed successfully!");
  }
}
"@

    # Create Test file content
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

    Write-Host "✅ Created: $num - $name" -ForegroundColor Green
}

Write-Host "🎯 All files generated successfully inside '03_mob_k12'!" -ForegroundColor Cyan
