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

console.log('🚀 Starting all test folders execution in a single run...\n');
console.log(`📁 Running tests in: ${testFolders.join(' ')}\n`);
console.log('='.repeat(70));

try {
  // Run all folders in a single Playwright command
  execSync(`npx playwright test ${testFolders.join(' ')}`, { 
    stdio: 'inherit',
    cwd: process.cwd()
  });
  console.log('\n✅ All tests completed successfully!');
} catch (error) {
  console.log('\n❌ Some tests failed');
  console.log(`Error: ${error.message}`);
  process.exit(1); // Exit with error code for CI/CD
}

console.log('\n🏁 All test folders execution completed!');