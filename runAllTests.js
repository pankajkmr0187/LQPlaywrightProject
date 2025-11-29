import { execSync } from 'child_process';
import path from 'path';

// Test folders to run
const testFolders = [
  'tests/01_mob_home',
  'tests/02_mob_aboutus', 
  'tests/03_mob_k12',
  'tests/04_mob_highereducation',
  'tests/05_mob_blogs',
  'tests/06_mob_support'
];

console.log('🚀 Starting all test folders execution...\n');

testFolders.forEach((folder, index) => {
  console.log(`\n📁 Running tests in: ${folder} (${index + 1}/${testFolders.length})`);
  console.log('='.repeat(50));
  
  try {
    execSync(`npx playwright test ${folder}`, { 
      stdio: 'inherit',
      cwd: process.cwd()
    });
    console.log(`✅ ${folder} - PASSED`);
  } catch (error) {
    console.log(`❌ ${folder} - FAILED`);
    console.log(`Error: ${error.message}`);
  }
});

console.log('\n🏁 All test folders execution completed!');