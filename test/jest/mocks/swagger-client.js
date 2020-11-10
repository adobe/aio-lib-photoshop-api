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

/* global fixtureFile */

const mockSwaggerClient = {
  ...require.requireActual('swagger-client'), // we want the original implementation in there. Then we override the ones we want to mock below
  apis: {},
  mockFn: function (methodName) {
    const cmd = methodName.split('.')
    let method = this.apis
    while (cmd.length > 1) {
      const word = cmd.shift()
      method = method[word] = method[word] || {}
    }
    method = method[cmd.shift()] = jest.fn()
    return method
  },
  mockResolvedFixture: function (methodName, returnValue) {
    return this.mockResolved(methodName, returnValue, true)
  },
  mockRejectedFixture: function (methodName, returnValue) {
    return this.mockRejected(methodName, returnValue, true)
  },
  mockResolved: function (methodName, returnValue, isFile) {
    let val = (isFile) ? fixtureFile(returnValue) : returnValue
    try {
      val = JSON.parse(val)
    } catch (e) { }
    return this.mockFn(methodName).mockResolvedValue(val, isFile)
  },
  mockRejected: function (methodName, err) {
    return this.mockFn(methodName).mockRejectedValue(err)
  }
}

module.exports = jest.fn(() => mockSwaggerClient)
