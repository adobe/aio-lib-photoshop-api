<!--
Copyright 2020 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
-->

[![Version](https://img.shields.io/npm/v/@adobe/aio-lib-photoshop-api.svg)](https://npmjs.org/package/@adobe/aio-lib-photoshop-api)
[![Downloads/week](https://img.shields.io/npm/dw/@adobe/aio-lib-photoshop-api.svg)](https://npmjs.org/package/@adobe/aio-lib-photoshop-api)
[![Build Status](https://travis-ci.com/adobe/aio-lib-photoshop-api.svg?branch=master)](https://travis-ci.com/adobe/aio-lib-photoshop-api)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Codecov Coverage](https://img.shields.io/codecov/c/github/adobe/aio-lib-photoshop-api/master.svg?style=flat-square)](https://codecov.io/gh/adobe/aio-lib-photoshop-api/)

# Adobe I/O Photoshop API Lib

### Rest API

The Rest API is documented at:

- [Public Documentation](https://adobedocs.github.io/photoshop-api-docs-pre-release/#api-Photoshop)

### Installing

```bash
$ npm install @adobe/aio-lib-photoshop-api
```

### Usage

1) Initialize the SDK

```javascript
const sdk = require('@adobe/aio-lib-photoshop-api')

async function sdkTest() {
  //initialize sdk
  const client = await sdk.init('<ims org id>', '<api key>', '<valid auth token>')
}
```

2) Remove the background of a photo

This is the example of using the storage type of `http://host/input.jpg` (External) and call the service to cutout the background, ask for JPEG output, and store the result in Adobe Creative Cloud file storage `path/output.jpg`.

```javascript
const sdk = require('@adobe/aio-lib-photoshop-api')

async function sdkTest() {
  // initialize sdk
  const client = await sdk.init('<ims org id>', '<api key>', '<valid auth token>')

  // call methods
  try {
    const result = await client.createCutout({
      href: 'http://host/input.jpg',
      storage: sdk.Storage.EXTERNAL
    }, {
      href: 'path/output.jpg',
      storage: sdk.Storage.ADOBE,
      type: sdk.MimeType.JPEG
    })

  } catch (e) {
    console.error(e)
  }
}
```

### Usage with Adobe I/O Files access

1) Initialize the SDK with Adobe I/O Files access

Configuring the SDK like this will make plain paths reference locations in Adobe I/O Files.

```javascript
const libFiles = require('@adobe/aio-lib-files')
const sdk = require('@adobe/aio-lib-photoshop-api')

async function sdkTest() {
  // initialize sdk
  const files = await libFiles.init();
  const client = await sdk.init('<ims org id>', '<api key>', '<valid auth token>', files)
}
```

2) Remove the background of a photo

This will automatically detect the storage type of `http://host/input.jpg` (e.g. Azure, External) and call the service to cutout the background, ask for JPEG output, and store the result in Adobe I/O Files under `path/output.jpg`.

```javascript
const libFiles = require('@adobe/aio-lib-files')
const sdk = require('@adobe/aio-lib-photoshop-api')

async function sdkTest() {
  // initialize sdk
  const files = await libFiles.init();
  const client = await sdk.init('<ims org id>', '<api key>', '<valid auth token>', files)

  // call methods
  try {
    // auto cutout...
    const result = await client.createCutout('http://host/input.jpg', 'path/output.jpg')
    console.log(result)

    // equivalent call without FileResolver...
    const result = await client.createCutout({
      href: 'http://host/input.jpg',
      storage: sdk.Storage.EXTERNAL
    }, {
      href: 'path/output.jpg',
      storage: sdk.Storage.AIO,
      type: sdk.MimeType.JPEG
    })

  } catch (e) {
    console.error(e)
  }
}
```

{{>main-index~}}
{{>all-docs~}}


### Debug Logs

```bash
LOG_LEVEL=debug <your_call_here>
```

Prepend the `LOG_LEVEL` environment variable and `debug` value to the call that invokes your function, on the command line. This should output a lot of debug data for your SDK calls.

### Contributing

Contributions are welcome! Read the [Contributing Guide](./.github/CONTRIBUTING.md) for more information.

### Licensing

This project is licensed under the Apache V2 License. See [LICENSE](LICENSE) for more information.
