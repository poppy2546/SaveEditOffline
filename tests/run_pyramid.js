const path = require('path');

let passCount = 0;
let failCount = 0;

async function it(name, fn) {
  try {
    const res = fn();
    if (res && typeof res.then === 'function') {
      await res;
    }
    console.log(`    ✅ PASS: ${name}`);
    passCount++;
  } catch (err) {
    console.error(`    ❌ FAIL: ${name}`);
    console.error(`       Error: ${err.message || err}`);
    failCount++;
  }
}

async function run() {
  const args = process.argv.slice(2);
  const runUnit = args.length === 0 || args.includes('--unit');
  const runIntegration = args.length === 0 || args.includes('--integration');
  const runE2E = args.length === 0 || args.includes('--e2e');

  console.log('====================================================');
  console.log('🔺 RUNNING TESTING PYRAMID SUITE');
  console.log('====================================================\n');

  if (runUnit) {
    console.log('--- 🔺 [LEVEL 1: UNIT TESTS] (Fast & Isolated) ---');
    const rubyMarshalTests = require(path.join(__dirname, 'unit/ruby_marshal.test.js'));
    const compressionTests = require(path.join(__dirname, 'unit/compression.test.js'));
    await rubyMarshalTests(it);
    await compressionTests(it);
    console.log('');
  }

  if (runIntegration) {
    console.log('--- 🔷 [LEVEL 2: INTEGRATION TESTS] (Modules & DOM) ---');
    const pipelineTests = require(path.join(__dirname, 'integration/save_pipeline.test.js'));
    const domMockTests = require(path.join(__dirname, 'integration/dom_mock.test.js'));
    await pipelineTests(it);
    await domMockTests(it);
    console.log('');
  }

  if (runE2E) {
    console.log('--- 🟢 [LEVEL 3: E2E TESTS] (System & Network Smoke) ---');
    const e2eTests = require(path.join(__dirname, 'e2e/e2e_http_smoke.test.js'));
    await e2eTests(it);
    console.log('');
  }

  console.log('====================================================');
  console.log(`📊 PYRAMID SUMMARY: ${passCount} PASSED, ${failCount} FAILED`);
  console.log('====================================================');

  if (failCount > 0) {
    process.exit(1);
  } else {
    console.log('✨ All targeted Pyramid tests completed successfully!\n');
    process.exit(0);
  }
}

run();
