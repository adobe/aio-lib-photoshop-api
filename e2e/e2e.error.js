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

test('createMask - test bad access token', async () => {
  const _sdkClient = await sdk.init(orgId, apiKey, 'bad_access_token')
  const promise = _sdkClient.createMask('input', 'output')
  return expect(promise).rejects.toThrow('[PhotoshopSDK:ERROR_UNAUTHORIZED] 401 - Unauthorized ({"error_code":"401013","message":"Oauth token is not valid"})')
})

test('autoTone - test bad access token', async () => {
  const _sdkClient = await sdk.init(orgId, apiKey, 'bad_access_token')
  const promise = _sdkClient.autoTone('input', 'output')

  // just match the error message
  return expect(promise).rejects.toThrow('[PhotoshopSDK:ERROR_UNAUTHORIZED] 401 - Unauthorized ({"error_code":"401013","message":"Oauth token is not valid"})')
})

test('createDocument - test bad access token', async () => {
  const _sdkClient = await sdk.init(orgId, apiKey, 'bad_access_token')
  const promise = _sdkClient.createDocument('output')

  // just match the error message
  return expect(promise).rejects.toThrow('[PhotoshopSDK:ERROR_UNAUTHORIZED] 401 - Unauthorized ({"error_code":"401013","message":"Oauth token is not valid"})')
})

test('createMask - test bad api key', async () => {
  const _sdkClient = await sdk.init(orgId, 'bad_api_key', accessToken)
  const promise = _sdkClient.createMask('input', 'output')
  return expect(promise).rejects.toThrow('[PhotoshopSDK:ERROR_AUTH_FORBIDDEN] 403 - Forbidden ({"error_code":"403003","message":"Api Key is invalid"})')
})

test('createMask - invalid value', async () => {
  const input = `${testRunId}/createMask-invalidValue-input.jpg`
  const output = `${testRunId}/createMask-invalidValue-output.jpg`
  await container.copy('./testfiles/Example.jpg', input, { localSrc: true })
  const promise = sdkClient.createMask(input, {
    href: output,
    mask: {
      format: 'invalidValue'
    }
  })
  return expect(promise).rejects.toThrow('[PhotoshopSDK:ERROR_INPUT_VALIDATION] 400 - Bad Request ({"code":400,"type":"InputValidationError","reason":[{"keyword":"enum","dataPath":".output.mask.format","schemaPath":"#/properties/output/properties/mask/properties/format/enum","params":{"allowedValues":["soft","binary"]},"message":"should be equal to one of the allowed values"}]})')
})

test('createMask - invalid type', async () => {
  const input = `${testRunId}/createMask-invalidValue-input.jpg`
  const output = `${testRunId}/createMask-invalidValue-output.jpg`
  await container.copy('./testfiles/Example.jpg', input, { localSrc: true })
  const promise = sdkClient.createMask(input, {
    href: output,
    mask: {
      format: 123
    }
  })
  return expect(promise).rejects.toThrow('[PhotoshopSDK:ERROR_INPUT_VALIDATION] 400 - Bad Request ({"code":400,"type":"InputValidationError","reason":[{"keyword":"type","dataPath":".output.mask.format","schemaPath":"#/properties/output/properties/mask/properties/format/type","params":{"type":"string"},"message":"should be string"},{"keyword":"enum","dataPath":".output.mask.format","schemaPath":"#/properties/output/properties/mask/properties/format/enum","params":{"allowedValues":["soft","binary"]},"message":"should be equal to one of the allowed values"}]})')
})

test('createMask - missing value', async () => {
  const input = `${testRunId}/createMask-invalidValue-input.jpg`
  const output = `${testRunId}/createMask-invalidValue-output.jpg`
  await container.copy('./testfiles/Example.jpg', input, { localSrc: true })
  const promise = sdkClient.createMask(input, {
    href: output,
    mask: { }
  })
  return expect(promise).rejects.toThrow('[PhotoshopSDK:ERROR_INPUT_VALIDATION] 400 - Bad Request ({"code":400,"type":"InputValidationError","reason":[{"keyword":"required","dataPath":".output.mask","schemaPath":"#/properties/output/properties/mask/required","params":{"missingProperty":"format"},"message":"should have required property \'format\'"}]})')
})

test('test bad input and output', async () => {
  const _sdkClient = await sdk.init('bad_org_id', apiKey, accessToken)
  const promise = _sdkClient.createMask('input', 'output')

  // just match the error message
  return expect(promise).rejects.toThrow('[PhotoshopSDK:ERROR_INPUT_VALIDATION] 400 - Bad Request ({"code":400,"type":"InputValidationError","reason":[{"keyword":"pattern","dataPath":".input.href","schemaPath":"#/properties/input/else/properties/href/pattern","params":{"pattern":"^/?(files|temp|cloud-content|assets)/.+"},"message":"should match pattern \\"^/?(files|temp|cloud-content|assets)/.+\\""},{"keyword":"if","dataPath":".input","schemaPath":"#/properties/input/if","params":{"failingKeyword":"else"},"message":"should match \\"else\\" schema"},{"keyword":"pattern","dataPath":".output.href","schemaPath":"#/properties/output/else/properties/href/pattern","params":{"pattern":"^/?(files|temp|cloud-content|assets)/.+"},"message":"should match pattern \\"^/?(files|temp|cloud-content|assets)/.+\\""},{"keyword":"if","dataPath":".output","schemaPath":"#/properties/output/if","params":{"failingKeyword":"else"},"message":"should match \\"else\\" schema"}]})')
})
