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

const { responseBodyToString, requestToString, reduceError, requestInterceptor, responseInterceptor, createRequestOptions } = require('../src/helpers')

test('reduceError', () => {
  // no args produces empty object
  expect(reduceError()).toEqual({})

  // unexpected properties returns the same error with no reduction
  const unexpectedError = { foo: 'bar' }
  expect(reduceError(unexpectedError)).toEqual(unexpectedError)

  // inadequate properties returns the same error with no reduction
  const unexpectedError2 = { foo: 'bar', response: {} }
  expect(reduceError(unexpectedError2)).toEqual(unexpectedError2)

  // expected properties returns the object reduced to a string
  const expectedError = {
    response: {
      status: 500,
      statusText: 'Something went gang aft agley.',
      body: {
        error_code: 500101,
        message: 'I\'m giving it all I got, cap\'n'
      }
    }
  }
  expect(reduceError(expectedError)).toEqual("500 - Something went gang aft agley. ({\"error_code\":500101,\"message\":\"I'm giving it all I got, cap'n\"})")
})

test('createRequestOptions', () => {
  const tenantId = 'my-tenant'
  const apiKey = 'my-api-key'
  const accessToken = 'my-token'

  const options = createRequestOptions({
    tenantId,
    apiKey,
    accessToken
  })

  expect(options).toEqual({
    requestBody: {},
    securities: {
      authorized: {
        BearerAuth: { value: accessToken },
        ApiKeyAuth: { value: apiKey }
      }
    }
  })
})

test('requestInterceptor', () => {
  const req = {}
  expect(requestInterceptor(req)).toEqual(req)
})

test('responseInterceptor', async () => {
  const res = {}
  expect(await responseInterceptor(res)).toEqual(res)
})

test('responseBodyToString', async () => {
  const body = 'body contents'
  let res

  res = new fetch.Response(body)
  await expect(responseBodyToString(res)).resolves.toEqual(body)

  // error coverage
  res = { text: () => {} }
  await expect(responseBodyToString(res)).rejects.toEqual('TypeError: response.clone is not a function')
})

test('requestToString', async () => {
  const url = 'http://foo.bar'
  let req, headers

  // no headers
  headers = {}
  req = {
    method: 'GET',
    headers,
    url
  }
  await expect(requestToString(req)).toEqual(JSON.stringify(req, null, 2))

  // has headers
  headers = new Map()
  headers.set('Content-Type', 'application/json')
  req = {
    method: 'GET',
    headers,
    url
  }
  const result = Object.assign({}, req, { headers: { 'Content-Type': 'application/json' } })
  await expect(requestToString(req)).toEqual(JSON.stringify(result, null, 2))

  // error coverage
  const error = new Error('foo')
  req = { headers: { forEach: () => { throw error } } }
  await expect(requestToString(req)).toEqual(error.toString())
})
