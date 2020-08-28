'use strict';
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const optionsDefault = {
    envFile: './.env',
    secret: '',
    secretFile: './ssl/cert.pem',
    algo: 'aes256',
    suffix: '_CIPHER',
    encoding: 'utf8'
}

const encrypt = (text, algo, key, iv) => {
    const cipher = crypto.createCipheriv(algo, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

const decrypt = (text, algo, key, iv) => {
    const decipher = crypto.createDecipheriv(algo, key, iv);
    let decrypted = decipher.update(text, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

const getPw = ({secret, secretFile}) => {
    if (secret.length === 0) {
        secret = fs.readFileSync(path.resolve(__dirname, secretFile)).toString().replace(/(-----(BEGIN|END) CERTIFICATE-----|[\n\r])/g, '');
    }
    return crypto.createHash("sha256")
        .update(secret)
        .digest("hex")
        .substr(0, 32);
}

// - reads .env file and encrypts variable values
// - stores encrypted values into .env-cipher and a YAML version into .env-cipher.yaml
module.exports.envCipher = ({
    envFile = optionsDefault.envFile, 
    secret = optionsDefault.envFile, 
    secretFile = optionsDefault.secretFile, 
    algo = optionsDefault.algo, 
    suffix = optionsDefault.suffix, 
    encoding = optionsDefault.encoding
} = {}) => {
    try {
        const pw = getPw({secret, secretFile});
        const iv = pw.substr(0, 16);
        const parsed = dotenv.parse(fs.readFileSync(envFile, { encoding }));
        let envEnc = {};
        Object.keys(parsed).forEach(key => {
            envEnc[key + suffix] = encrypt(parsed[key], algo, pw, iv);
        });

        let resultEnv = '';
        let resultYaml = 'environment:\n';
        for (const [key, value] of Object.entries(envEnc)) {
            if (key) {
                resultEnv += `${key}=${String(value)}\n`;
                resultYaml += `  - ${key}=${String(value)}\n`
            }
        }
        fs.writeFileSync(envFile + '-cipher', resultEnv, { encoding });
        fs.writeFileSync(envFile + '-cipher.yaml', resultYaml, { encoding });
    } catch (err) {
        console.error(err);
    }
}

// - reads all variables with suffix from process.env and decrypt values
// - stores new variable with decryped value and name without suffix into process.env
module.exports.envDecipher = ({
    secret = optionsDefault.envFile, 
    secretFile = optionsDefault.secretFile, 
    algo = optionsDefault.algo, 
    suffix = optionsDefault.suffix
} = {}) => {    try {
        const pw = getPw({secret, secretFile});
        const iv = pw.substr(0, 16);

        const env = process.env;
        let envDec = {};
        Object.keys(process.env).forEach(key => {
            if (key.endsWith(suffix)) {
                const newKey = key.substring(0, key.length - suffix.length);
                envDec[newKey] = decrypt(env[key], algo, pw, iv);
            }
        });
        return envDec;
    } catch (err) {
        console.error(err);
    }
}
