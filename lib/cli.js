#! /usr/bin/env node

/* command line arguments:
 * --secret <secretKey>  | -s <secretKey>
 * --secretFile <file-path>  | -f <secretKey>
 * --algo <algoName> |  -a <algoName>
 * --suffix | -u
 * --encoding | -e
 */

const argv = require('minimist')(process.argv.slice(2));
const envFile = argv._[0];
const secret = argv.secret || argv.s;
const secretFile = argv.secretFile || argv.f;
const algorithm = argv.algo || argv.a;
const suffix = argv.suffix || argv.u;
const encoding = argv.encoding || argv.e;

const run = require('./index');
run.envCipher({envFile, secret, secretFile, algorithm, suffix, encoding});
