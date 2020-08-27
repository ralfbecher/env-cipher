const run = require('../lib/index');

// encrypt values to .env-cipher
run.envCipher();

// load .env-cipher into process.env
require('dotenv').config({ path: '.env-cipher' })
// decrypt values from process.env with suffix
const decrypted = run.envDecipher();
console.log(decrypted);
