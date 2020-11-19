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

## Classes

<dl>
<dt><a href="#FileResolver">FileResolver</a></dt>
<dd><p>Resolves the storage and mime type of files referenced in the API.</p>
<p>The storage type storage type is resolved for input and output files using the following heuristic:</p>
<ul>
<li>If the storage type is provided, it is used as-is</li>
<li>If a URL is provided, the hostname is inspected to determine Azure, Dropbox, or External (default)</li>
<li>If a path is provided, the path resolved to Adobe I/O Files if an instance is provided to the constructor, otherwise it&#39;s Creative Cloud</li>
</ul>
<p>Path resolution can be overridden by the <code>defaultAdobeCloudPaths</code> option.</p>
<p>The mime-type is resolved based on the extension of the pathname of the URL or the path. If no extension can
be found or the extension is unknown, the default <code>image/png</code> is selected.</p>
</dd>
<dt><a href="#PhotoshopAPI">PhotoshopAPI</a></dt>
<dd><p>This class provides methods to call your PhotoshopAPI APIs.
Before calling any method initialize the instance by calling the <code>init</code> method on it
with valid values for orgId, apiKey and accessToken</p>
</dd>
<dt><a href="#Job">Job</a></dt>
<dd><p>Abstraction around the Photoshop Services Jobs</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#init">init(orgId, apiKey, accessToken, [files], [options])</a> ⇒ <code><a href="#PhotoshopAPI">Promise.&lt;PhotoshopAPI&gt;</a></code></dt>
<dd><p>Returns a Promise that resolves with a new PhotoshopAPI object.</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#FileResolverOptions">FileResolverOptions</a> : <code>object</code></dt>
<dd><p>File resolver options</p>
</dd>
<dt><a href="#PhotoshopAPIOptions">PhotoshopAPIOptions</a> : <code>object</code></dt>
<dd><p>Photoshop API options</p>
</dd>
<dt><a href="#Input">Input</a> : <code>object</code></dt>
<dd><p>A reference to an input file</p>
</dd>
<dt><a href="#IccProfile">IccProfile</a> : <code>object</code></dt>
<dd><p>Either referencing a standard profile from <a href="#StandardIccProfileNames">StandardIccProfileNames</a> in <code>profileName</code>, or a custom profile through <code>input</code>.</p>
</dd>
<dt><a href="#Output">Output</a> : <code>object</code></dt>
<dd><p>A reference to an output file, including output options</p>
</dd>
<dt><a href="#EditPhotoOptions">EditPhotoOptions</a> : <code>object</code></dt>
<dd><p>Set of edit parameters to apply to an image</p>
</dd>
<dt><a href="#Bounds">Bounds</a> : <code>object</code></dt>
<dd><p>Layer bounds (in pixels)</p>
</dd>
<dt><a href="#LayerMask">LayerMask</a> : <code>object</code></dt>
<dd><p>Mask applied to an layer</p>
</dd>
<dt><a href="#BlendOptions">BlendOptions</a> : <code>object</code></dt>
<dd><p>Layer blend options</p>
</dd>
<dt><a href="#BrightnessContrast">BrightnessContrast</a> : <code>object</code></dt>
<dd><p>Adjustment layer brightness and contrast settings</p>
</dd>
<dt><a href="#Exposure">Exposure</a> : <code>object</code></dt>
<dd><p>Adjustment layer exposure settings</p>
</dd>
<dt><a href="#HueSaturationChannel">HueSaturationChannel</a> : <code>object</code></dt>
<dd><p>Master channel hue and saturation settings</p>
</dd>
<dt><a href="#HueSaturation">HueSaturation</a> : <code>object</code></dt>
<dd><p>Adjustment layer hue and saturation settings</p>
</dd>
<dt><a href="#ColorBalance">ColorBalance</a> : <code>object</code></dt>
<dd><p>Adjustment layer color balance settings</p>
</dd>
<dt><a href="#AdjustmentLayer">AdjustmentLayer</a> : <code>object</code></dt>
<dd><p>Adjustment layer settings</p>
</dd>
<dt><a href="#FontColorRgb">FontColorRgb</a> : <code>object</code></dt>
<dd><p>Font color settings for RGB mode (16-bit)</p>
</dd>
<dt><a href="#FontColorCmyk">FontColorCmyk</a> : <code>object</code></dt>
<dd><p>Font color settings for CMYK mode (16-bit)</p>
</dd>
<dt><a href="#FontColorGray">FontColorGray</a> : <code>object</code></dt>
<dd><p>Font color settings for Gray mode (16-bit)</p>
</dd>
<dt><a href="#FontColor">FontColor</a> : <code>object</code></dt>
<dd><p>Font color settings</p>
</dd>
<dt><a href="#CharacterStyle">CharacterStyle</a> : <code>object</code></dt>
<dd><p>Character style settings</p>
</dd>
<dt><a href="#ParagraphStyle">ParagraphStyle</a> : <code>object</code></dt>
<dd><p>Paragraph style</p>
</dd>
<dt><a href="#TextLayer">TextLayer</a> : <code>object</code></dt>
<dd><p>Text layer settings</p>
</dd>
<dt><a href="#SmartObject">SmartObject</a> : <code>object</code></dt>
<dd><p>Smart object settings</p>
</dd>
<dt><a href="#FillLayer">FillLayer</a> : <code>object</code></dt>
<dd><p>Fill layer settings</p>
</dd>
<dt><a href="#LayerReference">LayerReference</a> : <code>object</code></dt>
<dd><p>Layer reference</p>
</dd>
<dt><a href="#AddLayerPosition">AddLayerPosition</a> : <code>object</code></dt>
<dd><p>Position where to add the layer in the layer hierarchy</p>
</dd>
<dt><a href="#MoveLayerPosition">MoveLayerPosition</a> : <code>object</code></dt>
<dd><p>Position where to move the layer to in the layer hierarchy</p>
</dd>
<dt><a href="#Layer">Layer</a> : <code>object</code></dt>
<dd><p>Layer to add, replace, move or delete when manipulating a Photoshop document, or retrieved from the manifest</p>
</dd>
<dt><a href="#SmartObjectLayer">SmartObjectLayer</a> : <code>object</code></dt>
<dd><p>Smart object layer to add or replace</p>
</dd>
<dt><a href="#ModifyDocumentOptions">ModifyDocumentOptions</a> : <code>object</code></dt>
<dd><p>Global Photoshop document modification options</p>
</dd>
<dt><a href="#CreateDocumentOptions">CreateDocumentOptions</a> : <code>object</code></dt>
<dd><p>Photoshop document create options</p>
</dd>
<dt><a href="#DocumentManifest">DocumentManifest</a> : <code>object</code></dt>
<dd><p>Photoshop document manifest</p>
</dd>
<dt><a href="#ReplaceSmartObjectOptions">ReplaceSmartObjectOptions</a> : <code>object</code></dt>
<dd><p>Replace Smart Object options</p>
</dd>
<dt><a href="#JobError">JobError</a> : <code>object</code></dt>
<dd><p>Reported job errors</p>
</dd>
<dt><a href="#JobOutput">JobOutput</a> : <code>object</code></dt>
<dd><p>Job status and output</p>
</dd>
</dl>

<a name="FileResolver"></a>

## FileResolver
Resolves the storage and mime type of files referenced in the API.

The storage type storage type is resolved for input and output files using the following heuristic:

- If the storage type is provided, it is used as-is
- If a URL is provided, the hostname is inspected to determine Azure, Dropbox, or External (default)
- If a path is provided, the path resolved to Adobe I/O Files if an instance is provided to the constructor, otherwise it's Creative Cloud

Path resolution can be overridden by the `defaultAdobeCloudPaths` option.

The mime-type is resolved based on the extension of the pathname of the URL or the path. If no extension can
be found or the extension is unknown, the default `image/png` is selected.

**Kind**: global class  

* [FileResolver](#FileResolver)
    * [new FileResolver([files], [options])](#new_FileResolver_new)
    * [.presignExpiryInSeconds](#FileResolver+presignExpiryInSeconds) : <code>number</code>
    * [.defaultPathStorage](#FileResolver+defaultPathStorage) : [<code>Storage</code>](#Storage)
    * [.resolveInput(input)](#FileResolver+resolveInput) ⇒ [<code>Input</code>](#Input)
    * [.resolveInputs(inputs)](#FileResolver+resolveInputs) ⇒ [<code>Array.&lt;Input&gt;</code>](#Input)
    * [.resolveInputsDocumentOptions(options)](#FileResolver+resolveInputsDocumentOptions) ⇒ [<code>CreateDocumentOptions</code>](#CreateDocumentOptions) \| [<code>ModifyDocumentOptions</code>](#ModifyDocumentOptions) \| [<code>ReplaceSmartObjectOptions</code>](#ReplaceSmartObjectOptions)
    * [.resolveInputsPhotoshopActionsOptions(options)](#FileResolver+resolveInputsPhotoshopActionsOptions) ⇒ <code>ApplyPhotoshopActionsOptions</code>
    * [.resolveOutput(output)](#FileResolver+resolveOutput) ⇒ [<code>Output</code>](#Output)
    * [.resolveOutputs(outputs)](#FileResolver+resolveOutputs) ⇒ [<code>Array.&lt;Output&gt;</code>](#Output)

<a name="new_FileResolver_new"></a>

### new FileResolver([files], [options])
Construct a file resolver


| Param | Type | Description |
| --- | --- | --- |
| [files] | <code>\*</code> | Adobe I/O Files instance |
| [options] | [<code>FileResolverOptions</code>](#FileResolverOptions) | Options |

<a name="FileResolver+presignExpiryInSeconds"></a>

### fileResolver.presignExpiryInSeconds : <code>number</code>
Expiry time of presigned urls in seconds

**Kind**: instance property of [<code>FileResolver</code>](#FileResolver)  
<a name="FileResolver+defaultPathStorage"></a>

### fileResolver.defaultPathStorage : [<code>Storage</code>](#Storage)
Plain paths can reference either Adobe Creative Cloud or Adobe I/O Files.

If an instance of files is provided, the default is considered to be
Adobe I/O Files, otherwise it's Creative Cloud. The default can be overridden
using the options

**Kind**: instance property of [<code>FileResolver</code>](#FileResolver)  
<a name="FileResolver+resolveInput"></a>

### fileResolver.resolveInput(input) ⇒ [<code>Input</code>](#Input)
Resolve input file from href to an object with href and storage

**Kind**: instance method of [<code>FileResolver</code>](#FileResolver)  
**Returns**: [<code>Input</code>](#Input) - resolved input  

| Param | Type | Description |
| --- | --- | --- |
| input | <code>string</code> \| [<code>Input</code>](#Input) | Input or href to resolve |

<a name="FileResolver+resolveInputs"></a>

### fileResolver.resolveInputs(inputs) ⇒ [<code>Array.&lt;Input&gt;</code>](#Input)
Resolve input files from hrefs to an array of objects with href and storage

**Kind**: instance method of [<code>FileResolver</code>](#FileResolver)  
**Returns**: [<code>Array.&lt;Input&gt;</code>](#Input) - resolved files  

| Param | Type | Description |
| --- | --- | --- |
| inputs | <code>string</code> \| <code>Array.&lt;string&gt;</code> \| [<code>Input</code>](#Input) \| [<code>Array.&lt;Input&gt;</code>](#Input) | One or more files |

<a name="FileResolver+resolveInputsDocumentOptions"></a>

### fileResolver.resolveInputsDocumentOptions(options) ⇒ [<code>CreateDocumentOptions</code>](#CreateDocumentOptions) \| [<code>ModifyDocumentOptions</code>](#ModifyDocumentOptions) \| [<code>ReplaceSmartObjectOptions</code>](#ReplaceSmartObjectOptions)
Resolve the font and layer inputs in the document options

**Kind**: instance method of [<code>FileResolver</code>](#FileResolver)  
**Returns**: [<code>CreateDocumentOptions</code>](#CreateDocumentOptions) \| [<code>ModifyDocumentOptions</code>](#ModifyDocumentOptions) \| [<code>ReplaceSmartObjectOptions</code>](#ReplaceSmartObjectOptions) - Document options  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>CreateDocumentOptions</code>](#CreateDocumentOptions) \| [<code>ModifyDocumentOptions</code>](#ModifyDocumentOptions) \| [<code>ReplaceSmartObjectOptions</code>](#ReplaceSmartObjectOptions) | Document options |

<a name="FileResolver+resolveInputsPhotoshopActionsOptions"></a>

### fileResolver.resolveInputsPhotoshopActionsOptions(options) ⇒ <code>ApplyPhotoshopActionsOptions</code>
Resolve the actions, fonts, and custom presets options

**Kind**: instance method of [<code>FileResolver</code>](#FileResolver)  
**Returns**: <code>ApplyPhotoshopActionsOptions</code> - Photoshop Actions options  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>ApplyPhotoshopActionsOptions</code> | Photoshop Actions options |

<a name="FileResolver+resolveOutput"></a>

### fileResolver.resolveOutput(output) ⇒ [<code>Output</code>](#Output)
Resolve output from href to an object with href, storage, and type

**Kind**: instance method of [<code>FileResolver</code>](#FileResolver)  
**Returns**: [<code>Output</code>](#Output) - resolved files  

| Param | Type | Description |
| --- | --- | --- |
| output | <code>string</code> \| <code>File</code> \| [<code>Output</code>](#Output) | One or more output files |

<a name="FileResolver+resolveOutputs"></a>

### fileResolver.resolveOutputs(outputs) ⇒ [<code>Array.&lt;Output&gt;</code>](#Output)
Resolve outputs from href to an object with href, storage, and type

**Kind**: instance method of [<code>FileResolver</code>](#FileResolver)  
**Returns**: [<code>Array.&lt;Output&gt;</code>](#Output) - resolved files  

| Param | Type | Description |
| --- | --- | --- |
| outputs | <code>string</code> \| <code>Array.&lt;string&gt;</code> \| <code>File</code> \| <code>Array.&lt;File&gt;</code> \| [<code>Output</code>](#Output) \| [<code>Array.&lt;Output&gt;</code>](#Output) | One or more output files |

<a name="PhotoshopAPI"></a>

## PhotoshopAPI
This class provides methods to call your PhotoshopAPI APIs.
Before calling any method initialize the instance by calling the `init` method on it
with valid values for orgId, apiKey and accessToken

**Kind**: global class  

* [PhotoshopAPI](#PhotoshopAPI)
    * [.orgId](#PhotoshopAPI+orgId) : <code>string</code>
    * [.apiKey](#PhotoshopAPI+apiKey) : <code>string</code>
    * [.accessToken](#PhotoshopAPI+accessToken) : <code>string</code>
    * [.init(orgId, apiKey, accessToken, [files], [options])](#PhotoshopAPI+init) ⇒ [<code>Promise.&lt;PhotoshopAPI&gt;</code>](#PhotoshopAPI)
    * [.createCutout(input, output)](#PhotoshopAPI+createCutout) ⇒ [<code>Job</code>](#Job)
    * [.createMask(input, output)](#PhotoshopAPI+createMask) ⇒ [<code>Job</code>](#Job)
    * [.straighten(input, outputs)](#PhotoshopAPI+straighten) ⇒ [<code>Job</code>](#Job)
    * [.autoTone(input, output)](#PhotoshopAPI+autoTone) ⇒ [<code>Job</code>](#Job)
    * [.editPhoto(input, output, options)](#PhotoshopAPI+editPhoto) ⇒ [<code>Job</code>](#Job)
    * [.applyPreset(input, preset, output)](#PhotoshopAPI+applyPreset) ⇒ [<code>Job</code>](#Job)
    * [.applyPresetXmp(input, output, xmp)](#PhotoshopAPI+applyPresetXmp) ⇒ [<code>Job</code>](#Job)
    * [.createDocument(outputs, options)](#PhotoshopAPI+createDocument) ⇒ [<code>Job</code>](#Job)
    * [.getDocumentManifest(input, [options])](#PhotoshopAPI+getDocumentManifest) ⇒ [<code>Job</code>](#Job)
    * [.modifyDocument(input, outputs, options)](#PhotoshopAPI+modifyDocument) ⇒ [<code>Job</code>](#Job)
    * [.createRendition(input, outputs)](#PhotoshopAPI+createRendition) ⇒ [<code>Job</code>](#Job)
    * [.replaceSmartObject(input, outputs, options)](#PhotoshopAPI+replaceSmartObject) ⇒ [<code>Job</code>](#Job)
    * [.applyPhotoshopActions(input, outputs, options)](#PhotoshopAPI+applyPhotoshopActions) ⇒ [<code>Job</code>](#Job)

<a name="PhotoshopAPI+orgId"></a>

### photoshopAPI.orgId : <code>string</code>
The IMS organization id

**Kind**: instance property of [<code>PhotoshopAPI</code>](#PhotoshopAPI)  
<a name="PhotoshopAPI+apiKey"></a>

### photoshopAPI.apiKey : <code>string</code>
The api key from your integration

**Kind**: instance property of [<code>PhotoshopAPI</code>](#PhotoshopAPI)  
<a name="PhotoshopAPI+accessToken"></a>

### photoshopAPI.accessToken : <code>string</code>
The access token from your integration

**Kind**: instance property of [<code>PhotoshopAPI</code>](#PhotoshopAPI)  
<a name="PhotoshopAPI+init"></a>

### photoshopAPI.init(orgId, apiKey, accessToken, [files], [options]) ⇒ [<code>Promise.&lt;PhotoshopAPI&gt;</code>](#PhotoshopAPI)
Initializes the PhotoshopAPI object and returns it.

**Kind**: instance method of [<code>PhotoshopAPI</code>](#PhotoshopAPI)  
**Returns**: [<code>Promise.&lt;PhotoshopAPI&gt;</code>](#PhotoshopAPI) - a PhotoshopAPI object  

| Param | Type | Description |
| --- | --- | --- |
| orgId | <code>string</code> | the IMS organization id |
| apiKey | <code>string</code> | the API key for your integration |
| accessToken | <code>string</code> | the access token for your integration |
| [files] | <code>\*</code> | Adobe I/O Files instance |
| [options] | [<code>PhotoshopAPIOptions</code>](#PhotoshopAPIOptions) | Options |

<a name="PhotoshopAPI+createCutout"></a>

### photoshopAPI.createCutout(input, output) ⇒ [<code>Job</code>](#Job)
Create a cutout mask, and apply it to the input

**Kind**: instance method of [<code>PhotoshopAPI</code>](#PhotoshopAPI)  
**Returns**: [<code>Job</code>](#Job) - Auto cutout job  

| Param | Type | Description |
| --- | --- | --- |
| input | <code>string</code> \| [<code>Input</code>](#Input) | Input file |
| output | <code>string</code> \| [<code>Output</code>](#Output) | Output file |

<a name="PhotoshopAPI+createMask"></a>

### photoshopAPI.createMask(input, output) ⇒ [<code>Job</code>](#Job)
Create a cutout mask

**Kind**: instance method of [<code>PhotoshopAPI</code>](#PhotoshopAPI)  
**Returns**: [<code>Job</code>](#Job) - Auto masking job  

| Param | Type | Description |
| --- | --- | --- |
| input | <code>string</code> \| [<code>Input</code>](#Input) | Input file |
| output | <code>string</code> \| [<code>Output</code>](#Output) | Output file |

<a name="PhotoshopAPI+straighten"></a>

### photoshopAPI.straighten(input, outputs) ⇒ [<code>Job</code>](#Job)
Straighten photo

**Kind**: instance method of [<code>PhotoshopAPI</code>](#PhotoshopAPI)  
**Returns**: [<code>Job</code>](#Job) - Auto straighten job  

| Param | Type | Description |
| --- | --- | --- |
| input | <code>string</code> \| [<code>Input</code>](#Input) | Input file |
| outputs | <code>string</code> \| [<code>Output</code>](#Output) \| [<code>Array.&lt;Output&gt;</code>](#Output) | Output file |

<a name="PhotoshopAPI+autoTone"></a>

### photoshopAPI.autoTone(input, output) ⇒ [<code>Job</code>](#Job)
Automatically tone photo

**Kind**: instance method of [<code>PhotoshopAPI</code>](#PhotoshopAPI)  
**Returns**: [<code>Job</code>](#Job) - Auto tone job  

| Param | Type | Description |
| --- | --- | --- |
| input | <code>string</code> \| [<code>Input</code>](#Input) | Input file |
| output | <code>string</code> \| [<code>Output</code>](#Output) | Output file |

<a name="PhotoshopAPI+editPhoto"></a>

### photoshopAPI.editPhoto(input, output, options) ⇒ [<code>Job</code>](#Job)
Apply a set of edit parameters on an image

**Kind**: instance method of [<code>PhotoshopAPI</code>](#PhotoshopAPI)  
**Returns**: [<code>Job</code>](#Job) - Edit photo job  

| Param | Type | Description |
| --- | --- | --- |
| input | <code>string</code> \| [<code>Input</code>](#Input) | Input file |
| output | <code>string</code> \| [<code>Output</code>](#Output) | Output file |
| options | [<code>EditPhotoOptions</code>](#EditPhotoOptions) | Edit options |

<a name="PhotoshopAPI+applyPreset"></a>

### photoshopAPI.applyPreset(input, preset, output) ⇒ [<code>Job</code>](#Job)
Apply a preset on an image

**Kind**: instance method of [<code>PhotoshopAPI</code>](#PhotoshopAPI)  
**Returns**: [<code>Job</code>](#Job) - Apply preset job  

| Param | Type | Description |
| --- | --- | --- |
| input | <code>string</code> \| [<code>Input</code>](#Input) | Input file |
| preset | <code>string</code> \| [<code>Input</code>](#Input) | Lightroom preset XMP file |
| output | <code>string</code> \| [<code>Output</code>](#Output) | Output file |

<a name="PhotoshopAPI+applyPresetXmp"></a>

### photoshopAPI.applyPresetXmp(input, output, xmp) ⇒ [<code>Job</code>](#Job)
Apply a preset on an image

**Kind**: instance method of [<code>PhotoshopAPI</code>](#PhotoshopAPI)  
**Returns**: [<code>Job</code>](#Job) - Apply preset job  

| Param | Type | Description |
| --- | --- | --- |
| input | <code>string</code> \| [<code>Input</code>](#Input) | Input file |
| output | <code>string</code> \| [<code>Output</code>](#Output) | Output file |
| xmp | <code>string</code> | Lightroom preset XMP file contents |

<a name="PhotoshopAPI+createDocument"></a>

### photoshopAPI.createDocument(outputs, options) ⇒ [<code>Job</code>](#Job)
Create a new psd, optionally with layers, and then generate renditions and/or save as a psd

**Kind**: instance method of [<code>PhotoshopAPI</code>](#PhotoshopAPI)  
**Returns**: [<code>Job</code>](#Job) - Create document job  

| Param | Type | Description |
| --- | --- | --- |
| outputs | <code>string</code> \| <code>Array.&lt;string&gt;</code> \| [<code>Output</code>](#Output) \| [<code>Array.&lt;Output&gt;</code>](#Output) | Desired output |
| options | [<code>CreateDocumentOptions</code>](#CreateDocumentOptions) | Document create options |

<a name="PhotoshopAPI+getDocumentManifest"></a>

### photoshopAPI.getDocumentManifest(input, [options]) ⇒ [<code>Job</code>](#Job)
Extract and return a psd file's layer information

**Kind**: instance method of [<code>PhotoshopAPI</code>](#PhotoshopAPI)  
**Returns**: [<code>Job</code>](#Job) - Get document manifest job  

| Param | Type | Description |
| --- | --- | --- |
| input | <code>string</code> \| [<code>Input</code>](#Input) | An object describing an input PSD file.Current support is for files less than 1000MB. |
| [options] | <code>object</code> | available options to apply to all input files |
| [options.thumbnails] | <code>object</code> | Include presigned GET URLs to small preview thumbnails for any renderable layer. |
| [options.thumbnails.type] | [<code>MimeType</code>](#MimeType) | desired image format. Allowed values: "image/jpeg", "image/png", "image/tiff" |

<a name="PhotoshopAPI+modifyDocument"></a>

### photoshopAPI.modifyDocument(input, outputs, options) ⇒ [<code>Job</code>](#Job)
Apply (optional) psd edits and then generate renditions and/or save a new psd

**Kind**: instance method of [<code>PhotoshopAPI</code>](#PhotoshopAPI)  
**Returns**: [<code>Job</code>](#Job) - Modify document job  

| Param | Type | Description |
| --- | --- | --- |
| input | <code>string</code> \| [<code>Input</code>](#Input) | An object describing an input PSD file. Current support is for files less than 1000MB. |
| outputs | <code>string</code> \| <code>Array.&lt;string&gt;</code> \| [<code>Output</code>](#Output) \| [<code>Array.&lt;Output&gt;</code>](#Output) | Desired output |
| options | [<code>ModifyDocumentOptions</code>](#ModifyDocumentOptions) | Modify document options |

<a name="PhotoshopAPI+createRendition"></a>

### photoshopAPI.createRendition(input, outputs) ⇒ [<code>Job</code>](#Job)
Create renditions

**Kind**: instance method of [<code>PhotoshopAPI</code>](#PhotoshopAPI)  
**Returns**: [<code>Job</code>](#Job) - Create rendition job  

| Param | Type | Description |
| --- | --- | --- |
| input | <code>string</code> \| [<code>Input</code>](#Input) | An object describing an input file. Currently supported filetypes include: jpeg, png, psd, tiff. Current support is for files less than 1000MB. |
| outputs | <code>string</code> \| <code>Array.&lt;string&gt;</code> \| [<code>Output</code>](#Output) \| [<code>Array.&lt;Output&gt;</code>](#Output) | Desired output |

<a name="PhotoshopAPI+replaceSmartObject"></a>

### photoshopAPI.replaceSmartObject(input, outputs, options) ⇒ [<code>Job</code>](#Job)
Apply psd edits for replacing embedded smart object and then generate renditions and/or save a new psd

**Kind**: instance method of [<code>PhotoshopAPI</code>](#PhotoshopAPI)  
**Returns**: [<code>Job</code>](#Job) - Replace smart object job  

| Param | Type | Description |
| --- | --- | --- |
| input | [<code>Input</code>](#Input) | An object describing an input PSD file. Current support is for files less than 1000MB. |
| outputs | <code>string</code> \| [<code>Output</code>](#Output) \| [<code>Array.&lt;Output&gt;</code>](#Output) | Desired output |
| options | [<code>ReplaceSmartObjectOptions</code>](#ReplaceSmartObjectOptions) | Replace smart object options |

<a name="PhotoshopAPI+applyPhotoshopActions"></a>

### photoshopAPI.applyPhotoshopActions(input, outputs, options) ⇒ [<code>Job</code>](#Job)
Apply Photoshop Actions and then generate renditions and/or save a new psd

**Kind**: instance method of [<code>PhotoshopAPI</code>](#PhotoshopAPI)  
**Returns**: [<code>Job</code>](#Job) - Photoshop Actions job  

| Param | Type | Description |
| --- | --- | --- |
| input | [<code>Input</code>](#Input) | An object describing an input image file. Current support is for files less than 1000MB. |
| outputs | <code>string</code> \| [<code>Output</code>](#Output) \| [<code>Array.&lt;Output&gt;</code>](#Output) | Desired output |
| options | <code>ApplyPhotoshopActionsOptions</code> | Apply Photoshop Actions options |

<a name="Job"></a>

## Job
Abstraction around the Photoshop Services Jobs

**Kind**: global class  

* [Job](#Job)
    * [new Job(response, getJobStatus)](#new_Job_new)
    * [.url](#Job+url) : <code>string</code>
    * [.jobId](#Job+jobId) : <code>string</code>
    * [.outputs](#Job+outputs) : [<code>Array.&lt;JobOutput&gt;</code>](#JobOutput)
    * [.isDone()](#Job+isDone) ⇒ <code>boolean</code>
    * [.poll()](#Job+poll) ⇒ [<code>Job</code>](#Job)
    * [.pollUntilDone([pollTimeMs])](#Job+pollUntilDone) ⇒ [<code>Job</code>](#Job)

<a name="new_Job_new"></a>

### new Job(response, getJobStatus)
Construct a job with the ability to acquire status updates


| Param | Type | Description |
| --- | --- | --- |
| response | <code>\*</code> | Service response |
| getJobStatus | <code>function</code> | Async function to get job status |

<a name="Job+url"></a>

### job.url : <code>string</code>
URL to request a status update of the job

**Kind**: instance property of [<code>Job</code>](#Job)  
<a name="Job+jobId"></a>

### job.jobId : <code>string</code>
Job identifier

**Kind**: instance property of [<code>Job</code>](#Job)  
<a name="Job+outputs"></a>

### job.outputs : [<code>Array.&lt;JobOutput&gt;</code>](#JobOutput)
Status of each output sub job

**Kind**: instance property of [<code>Job</code>](#Job)  
<a name="Job+isDone"></a>

### job.isDone() ⇒ <code>boolean</code>
Check if the job is done

A job is marked done when it has either the `succeeded` or `failed` status.

**Kind**: instance method of [<code>Job</code>](#Job)  
**Returns**: <code>boolean</code> - True if the job is done, or false if it is still pending/running  
<a name="Job+poll"></a>

### job.poll() ⇒ [<code>Job</code>](#Job)
Poll for job status

**Kind**: instance method of [<code>Job</code>](#Job)  
**Returns**: [<code>Job</code>](#Job) - Job instance  
<a name="Job+pollUntilDone"></a>

### job.pollUntilDone([pollTimeMs]) ⇒ [<code>Job</code>](#Job)
Poll job until done

**Kind**: instance method of [<code>Job</code>](#Job)  
**Returns**: [<code>Job</code>](#Job) - Job instance  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [pollTimeMs] | <code>number</code> | <code>2000</code> | Polling time |

<a name="Storage"></a>

## Storage
Storage types

**Kind**: global enum  
**Read only**: true  
**Properties**

| Name | Default | Description |
| --- | --- | --- |
| AIO | <code>aio</code> | href is a path in Adobe I/O Files: https://github.com/adobe/aio-lib-files |
| ADOBE | <code>adobe</code> | href is a path in Creative Cloud |
| EXTERNAL | <code>external</code> | href is a presigned get/put url, e.g. AWS S3 |
| AZURE | <code>azure</code> | href is an Azure SAS (Shared Access Signature) URL for upload/download |
| DROPBOX | <code>dropbox</code> | href is a temporary upload/download Dropbox link: https://dropbox.github.io/dropbox-api-v2-explorer/ |

<a name="MimeType"></a>

## MimeType
Mime types

**Kind**: global enum  
**Read only**: true  
**Properties**

| Name | Default | Description |
| --- | --- | --- |
| DNG | <code>image/x-adobe-dng</code> | Digital Negative, available from `autoTone`, `straighten`, `applyPreset` |
| JPEG | <code>image/jpeg</code> | JPEG, available from all operations |
| PNG | <code>image/png</code> | PNG, available from all operations |
| PSD | <code>image/vnd.adobe.photoshop</code> | Photoshop Document, available from `createDocument`, `modifyDocument`, `createRendition`, `replaceSmartObject` |
| TIFF | <code>image/tiff</code> | TIFF format, available from `createDocument`, `modifyDocument`, `createRendition`, `replaceSmartObject` |

<a name="PngCompression"></a>

## PngCompression
Compression level for PNG: small, medium or large.

**Kind**: global enum  
**Read only**: true  
**Properties**

| Name | Default |
| --- | --- |
| SMALL | <code>small</code> | 
| MEDIUM | <code>medium</code> | 
| LARGE | <code>large</code> | 

<a name="Colorspace"></a>

## Colorspace
Color space

**Kind**: global enum  
**Read only**: true  
**Properties**

| Name | Default |
| --- | --- |
| BITMAP | <code>bitmap</code> | 
| GREYSCALE | <code>greyscale</code> | 
| INDEXED | <code>indexed</code> | 
| RGB | <code>rgb</code> | 
| CMYK | <code>cmyk</code> | 
| MULTICHANNEL | <code>multichannel</code> | 
| DUOTONE | <code>duotone</code> | 
| LAB | <code>lab</code> | 

<a name="StandardIccProfileNames"></a>

## StandardIccProfileNames
Standard ICC profile names

**Kind**: global enum  
**Read only**: true  
**Properties**

| Name | Default |
| --- | --- |
| ADOBE_RGB_1998 | <code>Adobe RGB (1998)</code> | 
| APPLE_RGB | <code>Apple RGB</code> | 
| COLORMATCH_RGB | <code>ColorMatch RGB</code> | 
| SRGB | <code>sRGB IEC61966-2.1</code> | 
| DOTGAIN_10 | <code>Dot Gain 10%</code> | 
| DOTGAIN_15 | <code>Dot Gain 15%</code> | 
| DOTGAIN_20 | <code>Dot Gain 20%</code> | 
| DOTGAIN_25 | <code>Dot Gain 25%</code> | 
| DOTGAIN_30 | <code>Dot Gain 30%</code> | 
| GRAY_GAMMA_18 | <code>Gray Gamma 1.8</code> | 
| GRAY_GAMMA_22 | <code>Gray Gamma 2.2</code> | 

<a name="CreateMaskType"></a>

## CreateMaskType
Type of mask to create

**Kind**: global enum  
**Read only**: true  
**Properties**

| Name | Default | Description |
| --- | --- | --- |
| BINARY | <code>binary</code> | Binary mask |
| SOFT | <code>soft</code> | Soft mask |

<a name="WhiteBalance"></a>

## WhiteBalance
White balance enum

**Kind**: global enum  
**Read only**: true  
**Properties**

| Name | Default |
| --- | --- |
| AS_SHOT | <code>As Shot</code> | 
| AUTO | <code>Auto</code> | 
| CLOUDY | <code>Cloudy</code> | 
| CUSTOM | <code>Custom</code> | 
| DAYLIGHT | <code>Daylight</code> | 
| FLASH | <code>Flash</code> | 
| FLUORESCENT | <code>Fluorescent</code> | 
| SHADE | <code>Shade</code> | 
| TUNGSTEN | <code>Tungsten</code> | 

<a name="ManageMissingFonts"></a>

## ManageMissingFonts
Action to take if there are one or more missing fonts in the document

**Kind**: global enum  
**Read only**: true  
**Properties**

| Name | Default | Description |
| --- | --- | --- |
| USE_DEFAULT | <code>useDefault</code> | The job will succeed, however, by default all the missing fonts will be replaced with this font: ArialMT |
| FAIL | <code>fail</code> | The job will not succeed and the status will be set to "failed", with the details of the error provided in the "details" section in the status |

<a name="BackgroundFill"></a>

## BackgroundFill
Background fill

**Kind**: global enum  
**Read only**: true  
**Properties**

| Name | Default |
| --- | --- |
| WHITE | <code>white</code> | 
| BACKGROUND_COLOR | <code>backgroundColor</code> | 
| TRANSPARENT | <code>transparent</code> | 

<a name="LayerType"></a>

## LayerType
Layer type

**Kind**: global enum  
**Read only**: true  
**Properties**

| Name | Default | Description |
| --- | --- | --- |
| LAYER | <code>layer</code> | A pixel layer |
| TEXT_LAYER | <code>textLayer</code> | A text layer |
| ADJUSTMENT_LAYER | <code>adjustmentLayer</code> | An adjustment layer |
| LAYER_SECTION | <code>layerSection</code> | Group of layers |
| SMART_OBJECT | <code>smartObject</code> | A smart object |
| BACKGROUND_LAYER | <code>backgroundLayer</code> | The background layer |
| FILL_LAYER | <code>fillLayer</code> | A fill layer |

<a name="BlendMode"></a>

## BlendMode
Blend modes

**Kind**: global enum  
**Read only**: true  
**Properties**

| Name | Default |
| --- | --- |
| NORMAL | <code>normal</code> | 
| DISSOLVE | <code>dissolve</code> | 
| DARKEN | <code>darken</code> | 
| MULTIPLY | <code>multiply</code> | 
| COLOR_BURN | <code>colorBurn</code> | 
| LINEAR_BURN | <code>linearBurn</code> | 
| DARKER_COLOR | <code>darkerColor</code> | 
| LIGHTEN | <code>lighten</code> | 
| SCREEN | <code>screen</code> | 
| COLOR_DODGE | <code>colorDodge</code> | 
| LINEAR_DODGE | <code>linearDodge</code> | 
| LIGHTER_COLOR | <code>lighterColor</code> | 
| OVERLAY | <code>overlay</code> | 
| SOFT_LIGHT | <code>softLight</code> | 
| HARD_LIGHT | <code>hardLight</code> | 
| VIVID_LIGHT | <code>vividLight</code> | 
| LINEAR_LIGHT | <code>linearLight</code> | 
| PIN_LIGHT | <code>pinLight</code> | 
| HARD_MIX | <code>hardMix</code> | 
| DIFFERENCE | <code>difference</code> | 
| EXCLUSION | <code>exclusion</code> | 
| SUBTRACT | <code>subtract</code> | 
| DIVIDE | <code>divide</code> | 
| HUE | <code>hue</code> | 
| SATURATION | <code>saturation</code> | 
| COLOR | <code>color</code> | 
| LUMINOSITY | <code>luminosity</code> | 

<a name="TextOrientation"></a>

## TextOrientation
Text orientation

**Kind**: global enum  
**Read only**: true  
**Properties**

| Name | Default |
| --- | --- |
| HORIZONTAL | <code>horizontal</code> | 
| VERTICAL | <code>vertical</code> | 

<a name="ParagraphAlignment"></a>

## ParagraphAlignment
Paragraph alignment

**Kind**: global enum  
**Read only**: true  
**Properties**

| Name | Default |
| --- | --- |
| LEFT | <code>left</code> | 
| CENTER | <code>center</code> | 
| RIGHT | <code>right</code> | 
| JUSTIFY | <code>justify</code> | 
| JUSTIFY_LEFT | <code>justifyLeft</code> | 
| JUSTIFY_CENTER | <code>justifyCenter</code> | 
| JUSTIFY_RIGHT | <code>justifyRight</code> | 

<a name="HorizontalAlignment"></a>

## HorizontalAlignment
Horizontal alignment

**Kind**: global enum  
**Read only**: true  
**Properties**

| Name | Default |
| --- | --- |
| LEFT | <code>left</code> | 
| CENTER | <code>center</code> | 
| RIGHT | <code>right</code> | 

<a name="VerticalAlignment"></a>

## VerticalAlignment
Vertical alignment

**Kind**: global enum  
**Read only**: true  
**Properties**

| Name | Default |
| --- | --- |
| TOP | <code>top</code> | 
| CENTER | <code>center</code> | 
| BOTTOM | <code>bottom</code> | 

<a name="JobOutputStatus"></a>

## JobOutputStatus
Output status

**Kind**: global enum  
**Read only**: true  
**Properties**

| Name | Default | Description |
| --- | --- | --- |
| PENDING | <code>pending</code> | request has been accepted and is waiting to start |
| RUNNING | <code>running</code> | the child job is running |
| UPLOADING | <code>uploading</code> | files have been generated and are uploading to destination |
| SUCCEEDED | <code>succeeded</code> | the child job has succeeded |
| FAILED | <code>failed</code> | the child job has failed |

<a name="init"></a>

## init(orgId, apiKey, accessToken, [files], [options]) ⇒ [<code>Promise.&lt;PhotoshopAPI&gt;</code>](#PhotoshopAPI)
Returns a Promise that resolves with a new PhotoshopAPI object.

**Kind**: global function  
**Returns**: [<code>Promise.&lt;PhotoshopAPI&gt;</code>](#PhotoshopAPI) - a Promise with a PhotoshopAPI object  

| Param | Type | Description |
| --- | --- | --- |
| orgId | <code>string</code> | IMS organization id |
| apiKey | <code>string</code> | the API key for your integration |
| accessToken | <code>string</code> | the access token for your integration |
| [files] | <code>\*</code> | Adobe I/O Files instance |
| [options] | [<code>PhotoshopAPIOptions</code>](#PhotoshopAPIOptions) | Options |

<a name="FileResolverOptions"></a>

## FileResolverOptions : <code>object</code>
File resolver options

**Kind**: global typedef  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| [presignExpiryInSeconds] | <code>number</code> | <code>3600</code> | Expiry time of any presigned urls, defaults to 1 hour |
| [defaultAdobeCloudPaths] | <code>boolean</code> |  | True if paths should be considered references to files in Creative Cloud |

<a name="PhotoshopAPIOptions"></a>

## PhotoshopAPIOptions : <code>object</code>
Photoshop API options

**Kind**: global typedef  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| [presignExpiryInSeconds] | <code>number</code> | <code>3600</code> | Expiry time of any presigned urls, defaults to 1 hour |
| [defaultAdobeCloudPaths] | <code>boolean</code> |  | True if paths should be considered references to files in Creative Cloud |

<a name="Input"></a>

## Input : <code>object</code>
A reference to an input file

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| href | <code>string</code> | Either an href to a single Creative Cloud asset for storage='adobe' OR a presigned GET URL for other external services. |
| [storage] | [<code>Storage</code>](#Storage) | Storage type, by default detected based on `href` |

<a name="IccProfile"></a>

## IccProfile : <code>object</code>
Either referencing a standard profile from [StandardIccProfileNames](#StandardIccProfileNames) in `profileName`, or a custom profile through `input`.

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| imageMode | [<code>Colorspace</code>](#Colorspace) | Image mode |
| input | [<code>Input</code>](#Input) | Custom ICC profile href to a Creative Cloud asset or presigned URL |
| profileName | <code>string</code> | Standard ICC profile name (e.g. `Adobe RGB (1998)`) |

<a name="Output"></a>

## Output : <code>object</code>
A reference to an output file, including output options

**Kind**: global typedef  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| href | <code>string</code> |  | (all) Either an href to a single Creative Cloud asset for storage='adobe' OR a presigned GET URL for other external services. |
| [storage] | [<code>Storage</code>](#Storage) |  | (all) Storage type, by default detected based on `href` |
| [type] | [<code>MimeType</code>](#MimeType) |  | (all) Desired output image format, by default detected based on `href` extension |
| [overwrite] | <code>boolean</code> | <code>true</code> | (all) If the file already exists, indicates if the output file should be overwritten. Will eventually support eTags. Only applies to CC Storage |
| [mask] | <code>object</code> |  | (createMask, createCutout) Type of mask to create |
| mask.format | [<code>CreateMaskType</code>](#CreateMaskType) |  | (createMask, createCutout) Binary or soft mask to create |
| [width] | <code>number</code> | <code>0</code> | (document) width, in pixels, of the renditions. Width of 0 generates a full size rendition. Height is not necessary as the rendition generate will automatically figure out the correct width-to-height aspect ratio. Only supported for image renditions |
| [quality] | <code>number</code> | <code>7</code> | (document) quality of the renditions for JPEG. Range from 1 to 7, with 7 as the highest quality. |
| [compression] | [<code>PngCompression</code>](#PngCompression) | <code>large</code> | (document) compression level for PNG: small, medium or large |
| [trimToCanvas] | <code>boolean</code> | <code>false</code> | (document) 'false' generates renditions that are the actual size of the layer (as seen by View > Show > Layer Edges within the Photoshop desktop app) but will remove any extra transparent pixel padding. 'true' generates renditions that are the size of the canvas, either trimming the layer to the visible portion of the canvas or padding extra space. If the requested file format supports transparency than transparent pixels will be used for padding, otherwise white pixels will be used. |
| [layers] | [<code>Array.&lt;LayerReference&gt;</code>](#LayerReference) |  | (document) An array of layer objects. By including this array you are signaling that you'd like a rendition created from these layer id's or layer names. Excluding it will generate a document-level rendition. |
| [iccProfile] | [<code>IccProfile</code>](#IccProfile) |  | (document) Describes the ICC profile to convert to |

<a name="EditPhotoOptions"></a>

## EditPhotoOptions : <code>object</code>
Set of edit parameters to apply to an image

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| Contrast | <code>number</code> | integer [ -100 .. 100 ] |
| Saturation | <code>number</code> | integer [ -100 .. 100 ] |
| VignetteAmount | <code>number</code> | integer [ -100 .. 100 ] |
| Vibrance | <code>number</code> | integer [ -100 .. 100 ] |
| Highlights | <code>number</code> | integer [ -100 .. 100 ] |
| Shadows | <code>number</code> | integer [ -100 .. 100 ] |
| Whites | <code>number</code> | integer [ -100 .. 100 ] |
| Blacks | <code>number</code> | integer [ -100 .. 100 ] |
| Clarity | <code>number</code> | integer [ -100 .. 100 ] |
| Dehaze | <code>number</code> | integer [ -100 .. 100 ] |
| Texture | <code>number</code> | integer [ -100 .. 100 ] |
| Sharpness | <code>number</code> | integer [ 0 .. 150 ] |
| ColorNoiseReduction | <code>number</code> | integer [ 0 .. 100 ] |
| NoiseReduction | <code>number</code> | integer [ 0 .. 100 ] |
| SharpenDetail | <code>number</code> | integer [ 0 .. 100 ] |
| SharpenEdgeMasking | <code>number</code> | integer [ 0 .. 10 ] |
| Exposure | <code>number</code> | float [ -5 .. 5 ] |
| SharpenRadius | <code>number</code> | float [ 0.5 .. 3 ] |
| WhiteBalance | [<code>WhiteBalance</code>](#WhiteBalance) | white balance |

<a name="Bounds"></a>

## Bounds : <code>object</code>
Layer bounds (in pixels)

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| top | <code>number</code> | Top position of the layer |
| left | <code>number</code> | Left position of the layer |
| width | <code>number</code> | Layer width |
| height | <code>number</code> | Layer height |

<a name="LayerMask"></a>

## LayerMask : <code>object</code>
Mask applied to an layer

**Kind**: global typedef  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| [clip] | <code>boolean</code> |  | Indicates if this is a clipped layer |
| [enabled] | <code>boolean</code> | <code>true</code> | Indicates a mask is enabled on that layer or not. |
| [linked] | <code>boolean</code> | <code>true</code> | Indicates a mask is linked to the layer or not. |
| [offset] | <code>object</code> |  | An object to specify mask offset on the layer. |
| [offset.x] | <code>number</code> | <code>0</code> | Offset to indicate horizontal move of the mask |
| [offset.y] | <code>number</code> | <code>0</code> | Offset to indicate vertical move of the mask |

<a name="BlendOptions"></a>

## BlendOptions : <code>object</code>
Layer blend options

**Kind**: global typedef  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| [opacity] | <code>number</code> | <code>100</code> | Opacity value of the layer |
| [blendMode] | [<code>BlendMode</code>](#BlendMode) | <code>&quot;normal&quot;</code> | Blend mode of the layer |

<a name="BrightnessContrast"></a>

## BrightnessContrast : <code>object</code>
Adjustment layer brightness and contrast settings

**Kind**: global typedef  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| [brightness] | <code>number</code> | <code>0</code> | Adjustment layer brightness (-150...150) |
| [contrast] | <code>number</code> | <code>0</code> | Adjustment layer contrast (-150...150) |

<a name="Exposure"></a>

## Exposure : <code>object</code>
Adjustment layer exposure settings

**Kind**: global typedef  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| [exposure] | <code>number</code> | <code>0</code> | Adjustment layer exposure (-20...20) |
| [offset] | <code>number</code> | <code>0</code> | Adjustment layer exposure offset (-0.5...0.5) |
| [gammaCorrection] | <code>number</code> | <code>1</code> | Adjustment layer gamma correction (0.01...9.99) |

<a name="HueSaturationChannel"></a>

## HueSaturationChannel : <code>object</code>
Master channel hue and saturation settings

**Kind**: global typedef  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| [channel] | <code>string</code> | <code>&quot;\&quot;master\&quot;&quot;</code> | Allowed values: "master" |
| [hue] | <code>number</code> | <code>0</code> | Hue adjustment (-180...180) |
| [saturation] | <code>number</code> | <code>0</code> | Saturation adjustment (-100...100) |
| [lightness] | <code>number</code> | <code>0</code> | Lightness adjustment (-100...100) |

<a name="HueSaturation"></a>

## HueSaturation : <code>object</code>
Adjustment layer hue and saturation settings

**Kind**: global typedef  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| [colorize] | <code>boolean</code> | <code>false</code> | Colorize |
| [channels] | [<code>Array.&lt;HueSaturationChannel&gt;</code>](#HueSaturationChannel) | <code>[]</code> | An array of hashes representing the 'master' channel (the remaining five channels of 'magentas', 'yellows', 'greens', etc are not yet supported) |

<a name="ColorBalance"></a>

## ColorBalance : <code>object</code>
Adjustment layer color balance settings

**Kind**: global typedef  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| [preserveLuminosity] | <code>boolean</code> | <code>true</code> | Preserve luminosity |
| [shadowLevels] | <code>Array.&lt;number&gt;</code> | <code>[0,0,0]</code> | Shadow levels (-100...100) |
| [midtoneLevels] | <code>Array.&lt;number&gt;</code> | <code>[0,0,0]</code> | Midtone levels (-100...100) |
| [highlightLevels] | <code>Array.&lt;number&gt;</code> | <code>[0,0,0]</code> | Highlight levels (-100...100) |

<a name="AdjustmentLayer"></a>

## AdjustmentLayer : <code>object</code>
Adjustment layer settings

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| [brightnessContrast] | [<code>BrightnessContrast</code>](#BrightnessContrast) | Brightness and contrast settings |
| [exposure] | [<code>Exposure</code>](#Exposure) | Exposure settings |
| [hueSaturation] | [<code>HueSaturation</code>](#HueSaturation) | Hue and saturation settings |
| [colorBalance] | [<code>ColorBalance</code>](#ColorBalance) | Color balance settings |

<a name="FontColorRgb"></a>

## FontColorRgb : <code>object</code>
Font color settings for RGB mode (16-bit)

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| red | <code>number</code> | Red color (0...32768) |
| green | <code>number</code> | Green color (0...32768) |
| blue | <code>number</code> | Blue color (0...32768) |

<a name="FontColorCmyk"></a>

## FontColorCmyk : <code>object</code>
Font color settings for CMYK mode (16-bit)

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| cyan | <code>number</code> | Cyan color (0...32768) |
| magenta | <code>number</code> | Magenta color (0...32768) |
| yellowColor | <code>number</code> | Yellow color (0...32768) |
| black | <code>number</code> | Black color (0...32768) |

<a name="FontColorGray"></a>

## FontColorGray : <code>object</code>
Font color settings for Gray mode (16-bit)

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| gray | <code>number</code> | Gray color (0...32768) |

<a name="FontColor"></a>

## FontColor : <code>object</code>
Font color settings

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| rgb | [<code>FontColorRgb</code>](#FontColorRgb) | Font color settings for RGB mode (16-bit) |
| cmyk | [<code>FontColorCmyk</code>](#FontColorCmyk) | Font color settings for CMYK mode (16-bit) |
| gray | [<code>FontColorGray</code>](#FontColorGray) | Font color settings for Gray mode (16-bit) |

<a name="CharacterStyle"></a>

## CharacterStyle : <code>object</code>
Character style settings

**Kind**: global typedef  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| [from] | <code>number</code> |  | The beginning of the range of characters that this characterStyle applies to. Based on initial index of 0. For example a style applied to only the first two characters would be from=0 and to=1 |
| [to] | <code>number</code> |  | The ending of the range of characters that this characterStyle applies to. Based on initial index of 0. For example a style applied to only the first two characters would be from=0 and to=1 |
| [fontSize] | <code>number</code> |  | Font size (in points) |
| [fontName] | <code>string</code> |  | Font postscript name (see https://github.com/AdobeDocs/photoshop-api-docs/blob/master/SupportedFonts.md) |
| [orientation] | [<code>TextOrientation</code>](#TextOrientation) | <code>&quot;horizontal&quot;</code> | Text orientation |
| [fontColor] | [<code>FontColor</code>](#FontColor) |  | The font color settings (one of rgb, cmyk, gray, lab) |

<a name="ParagraphStyle"></a>

## ParagraphStyle : <code>object</code>
Paragraph style

**Kind**: global typedef  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| [alignment] | [<code>ParagraphAlignment</code>](#ParagraphAlignment) | <code>&quot;left&quot;</code> | Paragraph alignment |
| [from] | <code>number</code> |  | The beginning of the range of characters that this paragraphStyle applies to. Based on initial index of 0. For example a style applied to only the first two characters would be from=0 and to=1 |
| [to] | <code>number</code> |  | The ending of the range of characters that this characterStyle applies to. Based on initial index of 0. For example a style applied to only the first two characters would be from=0 and to=1 |

<a name="TextLayer"></a>

## TextLayer : <code>object</code>
Text layer settings

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| content | <code>string</code> | The text string |
| [characterStyles] | [<code>Array.&lt;CharacterStyle&gt;</code>](#CharacterStyle) | If the same supported attributes apply to all characters in the layer than this will be an array of one item, otherwise each characterStyle object will have a 'from' and 'to' value indicating the range of characters that the style applies to. |
| [paragraphStyles] | [<code>Array.&lt;ParagraphStyle&gt;</code>](#ParagraphStyle) | If the same supported attributes apply to all characters in the layer than this will be an array of one item, otherwise each paragraphStyle object will have a 'from' and 'to' value indicating the range of characters that the style applies to. |

<a name="SmartObject"></a>

## SmartObject : <code>object</code>
Smart object settings

**Kind**: global typedef  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| type | <code>string</code> |  | Desired image format for the smart object |
| [linked] | <code>boolean</code> | <code>false</code> | Indicates if this smart object is linked. |
| [path] | <code>string</code> |  | Relative path for the linked smart object |

<a name="FillLayer"></a>

## FillLayer : <code>object</code>
Fill layer settings

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| solidColor | <code>object</code> | An object describing the solid color type for this fill layer. Currently supported mode is RGB only. |
| solidColor.red | <code>number</code> | Red color (0...255) |
| solidColor.green | <code>number</code> | Green color (0...255) |
| solidColor.blue | <code>number</code> | Blue color (0...255) |

<a name="LayerReference"></a>

## LayerReference : <code>object</code>
Layer reference

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| [id] | <code>number</code> | The id of the layer you want to move above. Use either id OR name. |
| [name] | <code>string</code> | The name of the layer you want to move above. Use either id OR name. |

<a name="AddLayerPosition"></a>

## AddLayerPosition : <code>object</code>
Position where to add the layer in the layer hierarchy

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| [insertAbove] | [<code>LayerReference</code>](#LayerReference) | Used to add the layer above another. If the layer ID indicated is a group layer than the layer will be inserted above the group layer. |
| [insertBelow] | [<code>LayerReference</code>](#LayerReference) | Used to add the layer below another. If the layer ID indicated is a group layer than the layer will be inserted below (and outside of) the group layer |
| [insertInto] | [<code>LayerReference</code>](#LayerReference) | Used to add the layer inside of a group. Useful when you need to move a layer to an empty group. |
| [insertTop] | <code>boolean</code> | Indicates the layer should be added at the top of the layer stack. |
| [insertBottom] | <code>boolean</code> | Indicates the layer should be added at the bottom of the layer stack. If the image has a background image than the new layer will be inserted above it instead. |

<a name="MoveLayerPosition"></a>

## MoveLayerPosition : <code>object</code>
Position where to move the layer to in the layer hierarchy

**Kind**: global typedef  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| [moveChildren] | <code>boolean</code> | <code>true</code> | If layer is a group layer than true = move the set as a unit. Otherwise an empty group is moved and any children are left where they were, un-grouped. |
| [insertAbove] | [<code>LayerReference</code>](#LayerReference) |  | Used to move the layer above another. If the layer ID indicated is a group layer than the layer will be inserted above the group layer. |
| [insertBelow] | [<code>LayerReference</code>](#LayerReference) |  | Used to move the layer below another. If the layer ID indicated is a group layer than the layer will be inserted below (and outside of) the group layer |
| [insertInto] | [<code>LayerReference</code>](#LayerReference) |  | Used to move the layer inside of a group. Useful when you need to move a layer to an empty group. |
| [insertTop] | <code>boolean</code> |  | Indicates the layer should be moved at the top of the layer stack. |
| [insertBottom] | <code>boolean</code> |  | Indicates the layer should be moved at the bottom of the layer stack. If the image has a background image than the new layer will be inserted above it instead. |

<a name="Layer"></a>

## Layer : <code>object</code>
Layer to add, replace, move or delete when manipulating a Photoshop document, or retrieved from the manifest

**Kind**: global typedef  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| type | [<code>LayerType</code>](#LayerType) |  | The layer type |
| [id] | <code>number</code> |  | (modify, manifest) The layer id |
| [index] | <code>number</code> |  | (modify, manifest) The layer index. Required when deleting a layer, otherwise not used |
| [children] | [<code>Array.&lt;Layer&gt;</code>](#Layer) |  | (manifest) An array of nested layer objects. Only layerSections (group layers) can include children |
| [thumbnail] | <code>string</code> |  | (manifest) If thumbnails were requested, a presigned GET URL to the thumbnail |
| [name] | <code>string</code> |  | Layer name |
| [locked] | <code>boolean</code> | <code>false</code> | Is the layer locked |
| [visible] | <code>boolean</code> | <code>true</code> | Is the layer visible |
| input | [<code>Input</code>](#Input) |  | (create, modify) An object describing the input file to add or replace for a Pixel or Embedded Smart object layer. Supported image types are PNG or JPEG. Images support bounds. If the bounds do not reflect the width and height of the image the image will be resized to fit the bounds. Smart object replacement supports PNG, JPEG, PSD, SVG, AI, PDF. Added images are always placed at (top,left = 0,0) and bounds are ignored. Edited images are replaced for exact pixel size |
| [adjustments] | [<code>AdjustmentLayer</code>](#AdjustmentLayer) |  | Adjustment layer attributes |
| [bounds] | [<code>Bounds</code>](#Bounds) |  | The bounds of the layer, applicable to: LAYER, TEXT_LAYER, ADJUSTMENT_LAYER, LAYER_SECTION, SMART_OBJECT, FILL_LAYER |
| [mask] | [<code>LayerMask</code>](#LayerMask) |  | An object describing the input mask to be added or replaced to the layer. Supported mask type is Layer Mask. The input file must be a greyscale image. Supported file types are jpeg, png and psd. |
| [smartObject] | [<code>SmartObject</code>](#SmartObject) |  | An object describing the attributes specific to creating or editing a smartObject. SmartObject properties need the input smart object file to operate on, which can be obtained from Input block. Currently we support Embedded Smart Object only. So this block is optional. If you are creating a Linked Smart Object, this is a required block. |
| [fill] | [<code>FillLayer</code>](#FillLayer) |  | Fill layer attributes |
| [text] | [<code>TextLayer</code>](#TextLayer) |  | Text layer attributes |
| [blendOptions] | [<code>BlendOptions</code>](#BlendOptions) |  | Blend options of a layer, including opacity and blend mode |
| [fillToCanvas] | <code>boolean</code> | <code>false</code> | Indicates if this layer needs to be proportionally filled in to the entire canvas of the document. Applicable only to layer type="smartObject" or layer type="layer". |
| [horizontalAlign] | [<code>HorizontalAlignment</code>](#HorizontalAlignment) |  | Indicates the horizontal position where this layer needs to be placed at. Applicable only to layer type="smartObject" or layer type="layer". |
| [verticalAlign] | [<code>VerticalAlignment</code>](#VerticalAlignment) |  | Indicates the vertical position where this layer needs to be placed at. Applicable only to layer type="smartObject" or layer type="layer". |
| [edit] | <code>object</code> |  | (modify) Indicates you want to edit the layer identified by it's id or name. Note the object is currently empty but leaves room for futher enhancements. The layer block should than contain changes from the original manifest. If you apply it to a group layer you will be effecting the attributes of the group layer itself, not the child layers |
| [move] | [<code>MoveLayerPosition</code>](#MoveLayerPosition) |  | (modify) Indicates you want to move the layer identified by it's id or name. You must also indicate where you want to move the layer by supplying one of the attributes insertAbove, insertBelow, insertInto, insertTop or insertBottom |
| [add] | [<code>AddLayerPosition</code>](#AddLayerPosition) |  | (modify) Indicates you want to add a new layer. You must also indicate where you want to insert the new layer by supplying one of the attributes insertAbove, insertBelow, insertInto, insertTop or insertBottom After successful completion of this async request please call layers.read again in order to get a refreshed manifest with the latest layer indexes and any new layer id's. Currently supported layer types available for add are: layer, adjustmentLayer, textLayer, fillLayer |
| [delete] | <code>boolean</code> |  | (modify) Indicates you want to delete the layer, including any children, identified by the id or name. Note the object is currently empty but leaves room for futher enhancements. |

<a name="SmartObjectLayer"></a>

## SmartObjectLayer : <code>object</code>
Smart object layer to add or replace

**Kind**: global typedef  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| [id] | <code>number</code> |  | (modify, smart object, manifest) they layer id |
| [name] | <code>string</code> |  | (all) Layer name |
| [locked] | <code>boolean</code> | <code>false</code> | (all) Is the layer locked |
| [visible] | <code>boolean</code> | <code>true</code> | (all) Is the layer visible |
| input | [<code>Input</code>](#Input) |  | (create, modify, smart object) An object describing the input file to add or replace for a Pixel or Embedded Smart object layer. Supported image types are PNG or JPEG. Images support bounds. If the bounds do not reflect the width and height of the image the image will be resized to fit the bounds. Smart object replacement supports PNG, JPEG, PSD, SVG, AI, PDF. Added images are always placed at (top,left = 0,0) and bounds are ignored. Edited images are replaced for exact pixel size |
| [bounds] | [<code>Bounds</code>](#Bounds) |  | (all) The bounds of the layer, applicable to: LAYER, TEXT_LAYER, ADJUSTMENT_LAYER, LAYER_SECTION, SMART_OBJECT, FILL_LAYER |
| [add] | [<code>AddLayerPosition</code>](#AddLayerPosition) |  | (modify, smart object) Indicates you want to add a new layer. You must also indicate where you want to insert the new layer by supplying one of the attributes insertAbove, insertBelow, insertInto, insertTop or insertBottom After successful completion of this async request please call layers.read again in order to get a refreshed manifest with the latest layer indexes and any new layer id's. Currently supported layer types available for add are: layer, adjustmentLayer, textLayer, fillLayer |

<a name="ModifyDocumentOptions"></a>

## ModifyDocumentOptions : <code>object</code>
Global Photoshop document modification options

**Kind**: global typedef  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| [manageMissingFonts] | [<code>ManageMissingFonts</code>](#ManageMissingFonts) | <code>&#x27;useDefault&#x27;</code> | Action to take if there are one or more missing fonts in the document |
| [globalFont] | <code>string</code> |  | The full postscript name of the font to be used as the global default for the document. This font will be used for any text layer which has a missing font and no other font has been specifically provided for that layer. If this font itself is missing, the option specified for manageMissingFonts from above will take effect. |
| [fonts] | [<code>Array.&lt;Input&gt;</code>](#Input) |  | Array of custom fonts needed in this document. Filename should be <font_postscript_name>.otf |
| [document] | <code>object</code> |  | Document attributes |
| [document.canvasSize] | <code>object</code> |  | Crop parameters |
| [document.canvasSize.bounds] | [<code>Bounds</code>](#Bounds) |  | The bounds to crop the document |
| [document.imageSize] | <code>object</code> |  | Resize parameters. resizing a PSD always maintains the original aspect ratio by default. If the new width & height values specified in the parameters does not match the original aspect ratio, then the specified height will not be used and the height will be determined automatically |
| [document.imageSize.width] | <code>number</code> |  | Resize width |
| [document.imageSize.height] | <code>number</code> |  | Resize height |
| [document.trim] | <code>object</code> |  | Image trim parameters |
| [document.trim.basedOn] | <code>&#x27;transparentPixels&#x27;</code> | <code>&#x27;transparentPixels&#x27;</code> | Type of pixel to trim |
| [layers] | [<code>Array.&lt;Layer&gt;</code>](#Layer) |  | An array of layer objects you wish to act upon (edit, add, delete). Any layer missing an "operations" block will be ignored. |

<a name="CreateDocumentOptions"></a>

## CreateDocumentOptions : <code>object</code>
Photoshop document create options

**Kind**: global typedef  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| [manageMissingFonts] | [<code>ManageMissingFonts</code>](#ManageMissingFonts) | <code>&#x27;useDefault&#x27;</code> | Action to take if there are one or more missing fonts in the document |
| [globalFont] | <code>string</code> |  | The full postscript name of the font to be used as the global default for the document. This font will be used for any text layer which has a missing font and no other font has been specifically provided for that layer. If this font itself is missing, the option specified for manageMissingFonts from above will take effect. |
| [fonts] | [<code>Array.&lt;Input&gt;</code>](#Input) |  | Array of custom fonts needed in this document. Filename should be <font_postscript_name>.otf |
| document | <code>object</code> |  | Document attributes |
| document.width | <code>number</code> |  | Document width in pixels |
| document.height | <code>number</code> |  | Document height in pixels |
| document.resolution | <code>number</code> |  | Document resolution in pixels per inch. Allowed values: [72 ... 300]. |
| document.fill | [<code>BackgroundFill</code>](#BackgroundFill) |  | Background fill |
| document.mode | [<code>Colorspace</code>](#Colorspace) |  | Color space |
| document.depth | <code>number</code> |  | Bit depth. Allowed values: 8, 16, 32 |
| [layers] | [<code>Array.&lt;Layer&gt;</code>](#Layer) |  | An array of layer objects representing the layers to be created, in the same order as provided (from top to bottom). |

<a name="DocumentManifest"></a>

## DocumentManifest : <code>object</code>
Photoshop document manifest

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | Name of the input file |
| width | <code>number</code> | Document width in pixels |
| height | <code>number</code> | Document height in pixels |
| photoshopBuild | <code>string</code> | Name of the application that created the PSD |
| imageMode | [<code>Colorspace</code>](#Colorspace) | Document image mode |
| bitDepth | <code>number</code> | Bit depth. Allowed values: 8, 16, 32 |

<a name="ReplaceSmartObjectOptions"></a>

## ReplaceSmartObjectOptions : <code>object</code>
Replace Smart Object options

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| layers | [<code>Array.&lt;SmartObjectLayer&gt;</code>](#SmartObjectLayer) | An array of layer objects you wish to act upon (edit, add, delete). Any layer missing an "operations" block will be ignored. |

<a name="JobError"></a>

## JobError : <code>object</code>
Reported job errors

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| type | <code>string</code> | A machine readable error type |
| code | <code>string</code> | A machine readable error code |
| title | <code>string</code> | A short human readable error summary |
| errorDetails | <code>Array.&lt;object&gt;</code> | Further descriptions of the exact errors where errorDetail is substituted for a specific issue. |

<a name="JobOutput"></a>

## JobOutput : <code>object</code>
Job status and output

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| input | <code>string</code> | The original input file path |
| status | [<code>JobOutputStatus</code>](#JobOutputStatus) | Output status |
| created | <code>string</code> | Created timestamp of the job |
| modified | <code>string</code> | Modified timestamp of the job |
| [document] | [<code>DocumentManifest</code>](#DocumentManifest) | (manifest) Information about the PSD file |
| [layer] | [<code>Array.&lt;Layer&gt;</code>](#Layer) | (manifest) A tree of layer objects representing the PSD layer structure extracted from the psd document |
| [_links] | <code>object</code> | Output references |
| [_links.renditions] | [<code>Array.&lt;Output&gt;</code>](#Output) | (document) Created renditions |
| [_links.self] | [<code>Output</code>](#Output) | (lightroom, sensei) Created output |
| [errors] | [<code>JobError</code>](#JobError) | Any errors reported |

### Debug Logs

```bash
LOG_LEVEL=debug <your_call_here>
```

Prepend the `LOG_LEVEL` environment variable and `debug` value to the call that invokes your function, on the command line. This should output a lot of debug data for your SDK calls.

### Contributing

Contributions are welcome! Read the [Contributing Guide](./.github/CONTRIBUTING.md) for more information.

### Licensing

This project is licensed under the Apache V2 License. See [LICENSE](LICENSE) for more information.
