[![NPM version](https://img.shields.io/npm/v/env-cipher.svg?style=flat-square)](https://www.npmjs.com/package/env-cipher)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/ralfbecher/env-cipher/graphs/commit-activity)
[![LICENSE](https://img.shields.io/github/license/ralfbecher/env-cipher.svg)](LICENSE)

# env-cipher

Env-cipher is a module that reads encrypted environment variables with a certain suffix (default: `_CIPHER`) from `process.env` and decrypts it. The result can then be stored back into `process.env` and used in a node.js app as usual.

It also has a CLI to create a `.env-cipher` file with encrypted variable values, additionally a `.env-cipher.yaml` file is created for environment usage in docker or kubernetes context.

The idea behind is to only use encrypted settings in deployment files or secrets or cloud vaults. A secret file (eg. a certificate) can be used to encrypt the values during development or CI/CD. For decryption the secret file can be placed inside the node.js docker container (in best case use a distroless image!) to process the decryption.

## Usage

Create a certificate by running `npm run certgen`. It will be stored into `./ssl/cert.pem` and used as default.

Create a `.env` file in the root directory of your project. Add environment-specific variables on new lines in the form of `NAME=VALUE`. For example:

```dosini
ACCOUNT=hazfd783.cloudname.com
USER=fridolinhamster
PASSWORD=y0uw1lln0tbr4ek
DATABASE=hr.salaries
SCHEMA=management
ROLE=SYSADMIN
URL=localhorst:8123
```
### Encrypt .env values

```bash
$ npm install -g env-cipher
$ npx env-cipher
# or
$ env-cipher .env -s mySecretPassword

```

After running the CLI command the encrypted values resulting into:
```dosini
ACCOUNT_CIPHER=6478b68193c03a3c0bdadec46f89a09eef5beb55077d5c4cf7e72f733d3d75b4
USER_CIPHER=17e766942fe4fa19068202c4138c517a
PASSWORD_CIPHER=1ccd001d85277b9be50da994590e5f7f
DATABASE_CIPHER=374eab00f4a46cd2276ef8b9f6ce9f27
SCHEMA_CIPHER=a4a62c29f0a2f50d06c414ff91ebd676
ROLE_CIPHER=506824248ee4729c22381fd838139c49
URL_CIPHER=31fe6850775707846d5c8aa56a5d9c84
```
The YAML output file `.env-cipher.yaml` looks like this:
```yaml
environment:
  - ACCOUNT_CIPHER=6478b68193c03a3c0bdadec46f89a09eef5beb55077d5c4cf7e72f733d3d75b4
  - USER_CIPHER=17e766942fe4fa19068202c4138c517a
  - ASSWORD_CIPHER=1ccd001d85277b9be50da994590e5f7f
  - DATABASE_CIPHER=374eab00f4a46cd2276ef8b9f6ce9f27
  - SCHEMA_CIPHER=a4a62c29f0a2f50d06c414ff91ebd676
  - ROLE_CIPHER=506824248ee4729c22381fd838139c49
  - URL_CIPHER=31fe6850775707846d5c8aa56a5d9c84
```

### Usage in your Node.js App

```bash
$ npm install env-cipher
```

Place secret file (or certificate) into `./ssl`.

```javascript
const { envDecipher } = require('env-cipher');
const decrypted = envDecipher();

process.env = {
    ...process.env,
    ...decrypted
}
```

## Dependencies

Env-cipher uses these open source projects to work properly:

* [Minimist][minimist] - for parsing CLI arguments
* [Dotenv][dotenv] - for parsing .env file

[minimist]: <https://www.npmjs.com/package/minimist>
[dotenv]: <https://github.com/motdotla/dotenv/>

## License

[MIT](LICENSE)
