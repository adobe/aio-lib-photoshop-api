/*
Copyright 2020 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

'use strict'

const sdk = require('../src/index')
const path = require('path')
const storage = require('./storage')
const { v4: uuidv4 } = require('uuid')
const { readFile } = require('fs-extra')

// load .env values in the e2e folder, if any
require('dotenv').config({ path: path.join(__dirname, '.env') })

/**
 * @type {import('../src/index').PhotoshopAPI}
 */
let sdkClient = {}
let container = {}
let testRunId = ''
const orgId = process.env.PHOTOSHOP_ORG_ID
const apiKey = process.env.PHOTOSHOP_API_KEY
const accessToken = process.env.PHOTOSHOP_ACCESS_TOKEN

beforeAll(async () => {
  container = await storage.init()
  sdkClient = await sdk.init(orgId, apiKey, accessToken, container)
  testRunId = uuidv4()
  console.error(`Test run id: ${testRunId}`)
})

test('sdk init test', async () => {
  expect(sdkClient.orgId).toBe(orgId)
  expect(sdkClient.apiKey).toBe(apiKey)
  expect(sdkClient.accessToken).toBe(accessToken)
})

test('createCutout-soft', async () => {
  const input = `${testRunId}/autoCutout-soft-input.jpg`
  const output = `${testRunId}/autoCutout-soft-output.jpg`
  await container.copy('./testfiles/Example.jpg', input, { localSrc: true })
  const job = await sdkClient.createCutout(input, {
    href: output,
    mask: {
      format: 'soft'
    }
  })
  expect(job.isDone()).toEqual(true)
})

test('createMask-soft', async () => {
  const input = `${testRunId}/createMask-soft-input.jpg`
  const output = `${testRunId}/createMask-soft-output.jpg`
  await container.copy('./testfiles/Example.jpg', input, { localSrc: true })
  const job = await sdkClient.createMask(input, {
    href: output,
    mask: {
      format: 'soft'
    }
  })
  expect(job.isDone()).toEqual(true)
})

test('straighten', async () => {
  const input = `${testRunId}/straighten-input.jpg`
  const output = `${testRunId}/straighten-output.dng`
  await container.copy('./testfiles/Example.jpg', input, { localSrc: true })
  const job = await sdkClient.straighten(input, output)
  expect(job.isDone()).toEqual(true)
})

test('autoTone', async () => {
  const input = `${testRunId}/autoTone-input.jpg`
  const outputs = [
    `${testRunId}/autoTone-output.png`,
    `${testRunId}/autoTone-output.jpg`
  ]
  await container.copy('./testfiles/Example.jpg', input, { localSrc: true })
  const job = await sdkClient.autoTone(input, outputs)
  expect(job.isDone()).toEqual(true)
})

test('editPhoto', async () => {
  const input = `${testRunId}/editPhoto-input.jpg`
  const output = `${testRunId}/editPhoto-output.jpg`
  await container.copy('./testfiles/Example.jpg', input, { localSrc: true })
  const job = await sdkClient.editPhoto(input, output, {
    Contrast: 100
  })
  expect(job.isDone()).toEqual(true)
})

test('applyPreset-AutoBW', async () => {
  const input = `${testRunId}/applyPreset-input.jpg`
  const preset = `${testRunId}/Auto-BW.xmp`
  const output = `${testRunId}/applyPreset-output.jpg`
  await container.copy('./testfiles/Example.jpg', input, { localSrc: true })
  await container.copy('./testfiles/Auto-BW.xmp', preset, { localSrc: true })
  const job = await sdkClient.applyPreset(input, preset, output)
  expect(job.isDone()).toEqual(true)
})

test('applyPresetXmp-AutoBW', async () => {
  const input = `${testRunId}/applyPresetXmp-input.jpg`
  const output = `${testRunId}/applyPresetXmp-output.jpg`
  const xmp = await readFile('./testfiles/Auto-BW.xmp', 'utf8')
  await container.copy('./testfiles/Example.jpg', input, { localSrc: true })
  const job = await sdkClient.applyPresetXmp(input, output, xmp)
  expect(job.isDone()).toEqual(true)
})

test('createDocument', async () => {
  const input = `${testRunId}/createDocument-input.jpg`
  const output = `${testRunId}/createDocument-output.psd`
  await container.copy('./testfiles/Example.jpg', input, { localSrc: true })
  const job = await sdkClient.createDocument(output, {
    document: {
      width: 802,
      height: 528,
      resolution: 96,
      fill: sdk.BackgroundFill.TRANSPARENT,
      mode: sdk.Colorspace.RGB
    },
    layers: [{
      type: sdk.LayerType.ADJUSTMENT_LAYER,
      adjustments: {
        brightnessContrast: {
          brightness: 150
        }
      }
    }, {
      type: sdk.LayerType.LAYER,
      input,
      name: 'example'
    }]
  })
  expect(job.isDone()).toEqual(true)
})

test('getDocumentManifest', async () => {
  const input = `${testRunId}/getDocumentManifest-input.psd`
  await container.copy('./testfiles/Layer Comps.psd', input, { localSrc: true })
  const job = await sdkClient.getDocumentManifest(input)
  expect(job.outputs[0].layers.length).toEqual(3)
  expect(job.outputs[0].layers[0].type).toEqual(sdk.LayerType.LAYER_SECTION)
  expect(job.outputs[0].layers[0].name).toEqual('text')
  expect(job.outputs[0].layers[1].type).toEqual(sdk.LayerType.LAYER_SECTION)
  expect(job.outputs[0].layers[1].name).toEqual('votives')
  expect(job.outputs[0].layers[2].type).toEqual(sdk.LayerType.LAYER_SECTION)
  expect(job.outputs[0].layers[2].name).toEqual('different backgrounds')
  expect(job.outputs[0].document.width).toEqual(400)
  expect(job.outputs[0].document.height).toEqual(424)
  expect(job.isDone()).toEqual(true)
})

test('modifyDocument', async () => {
  const input = `${testRunId}/modifyDocument-input.psd`
  const output = `${testRunId}/modifyDocument-output.psd`
  await container.copy('./testfiles/Sunflower.psd', input, { localSrc: true })
  const job = await sdkClient.modifyDocument(input, output, {
    layers: [{
      add: {
        insertTop: true
      },
      type: sdk.LayerType.ADJUSTMENT_LAYER,
      adjustments: {
        brightnessContrast: {
          brightness: 150
        }
      }
    }]
  })
  expect(job.isDone()).toEqual(true)
})

test('createRendition-500px', async () => {
  const input = `${testRunId}/createRendition-input.jpg`
  const output = `${testRunId}/createRendition-output.jpg`
  await container.copy('./testfiles/Example.jpg', input, { localSrc: true })
  const job = await sdkClient.createRendition(input, {
    href: output,
    width: 500
  })
  expect(job.isDone()).toEqual(true)
})
