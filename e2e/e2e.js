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

const sdk = require('../src/index')
const path = require('path')

// load .env values in the e2e folder, if any
require('dotenv').config({ path: path.join(__dirname, '.env') })

let sdkClient = {}
const tenantId = process.env['Aio-lib-creativecloud-automation_TENANT_ID']
const apiKey = process.env['Aio-lib-creativecloud-automation_API_KEY']
const accessToken = process.env['Aio-lib-creativecloud-automation_ACCESS_TOKEN']

beforeAll(async () => {
  sdkClient = await sdk.init(tenantId, apiKey, accessToken)
})

test('sdk init test', async () => {
  expect(sdkClient.tenantId).toBe(tenantId)
  expect(sdkClient.apiKey).toBe(apiKey)
  expect(sdkClient.accessToken).toBe(accessToken)
})

test('test bad access token', async () => {
  const _sdkClient = await sdk.init(tenantId, apiKey, 'bad_access_token')
  const promise = _sdkClient.getSomething()

  // just match the error message
  return expect(promise).rejects.toThrow('401')
})

test('test bad api key', async () => {
  const _sdkClient = await sdk.init(tenantId, 'bad_api_key', accessToken)
  const promise = _sdkClient.getSomething()

  // just match the error message
  return expect(promise).rejects.toThrow('403')
})

test('test bad tenant id', async () => {
  const _sdkClient = await sdk.init('bad_tenant_id', apiKey, accessToken)
  const promise = _sdkClient.getSomething()

  // just match the error message
  return expect(promise).rejects.toThrow('500')
})

test('test getSomething API', async () => {
  // check success response
  const res = await sdkClient.getSomething({ limit: 5, page: 0 })
  expect(res.ok).toBeTruthy()
})
