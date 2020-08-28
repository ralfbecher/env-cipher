const run = require('./index');

// load .env-cipher into process.env
require('dotenv').config({ path: '.env-cipher' })
// decrypt values from process.env with suffix
const decrypted = run.envDecipher();
console.log(decrypted);
