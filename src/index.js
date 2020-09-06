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

const Swagger = require('swagger-client')
const loggerNamespace = '@adobe'
const logger = require('@adobe/aio-lib-core-logging')(loggerNamespace, { level: process.env.LOG_LEVEL })
const { reduceError, requestInterceptor, responseInterceptor, createRequestOptions } = require('./helpers')
const { codes } = require('./SDKErrors')

require('./types.jsdoc') // for VS Code autocomplete
/* global MyParameters, Response */ // for linter

/**
 * Returns a Promise that resolves with a new Aio-lib-creativecloud-automation object.
 *
 * @param {string} tenantId the tenant id
 * @param {string} apiKey the API key for your integration
 * @param {string} accessToken the access token for your integration
 * @returns {Promise<Aio-lib-creativecloud-automation>} a Promise with a Aio-lib-creativecloud-automation object
 */
function init (tenantId, apiKey, accessToken) {
  return new Promise((resolve, reject) => {
    const clientWrapper = new Aio-lib-creativecloud-automation()

    clientWrapper.init(tenantId, apiKey, accessToken)
      .then(initializedSDK => {
        logger.debug('sdk initialized successfully')
        resolve(initializedSDK)
      })
      .catch(err => {
        logger.debug(`sdk init error: ${err}`)
        reject(err)
      })
  })
}

/**
 * This class provides methods to call your Aio-lib-creativecloud-automation APIs.
 * Before calling any method initialize the instance by calling the `init` method on it
 * with valid values for tenantId, apiKey and accessToken
 */
class Aio-lib-creativecloud-automation {
  /**
   * Initializes a Aio-lib-creativecloud-automation object and returns it.
   *
   * @param {string} tenantId the tenant id
   * @param {string} apiKey the API key for your integration
   * @param {string} accessToken the access token for your integration
   * @returns {Promise<Aio-lib-creativecloud-automation>} a Aio-lib-creativecloud-automation object
   */
  async init (tenantId, apiKey, accessToken) {
    // init swagger client
    const spec = require('../spec/api.json')
    const swagger = new Swagger({
      spec: spec,
      requestInterceptor,
      responseInterceptor,
      usePromise: true
    })
    this.sdk = (await swagger)

    const initErrors = []
    if (!tenantId) {
      initErrors.push('tenantId')
    }
    if (!apiKey) {
      initErrors.push('apiKey')
    }
    if (!accessToken) {
      initErrors.push('accessToken')
    }

    if (initErrors.length) {
      const sdkDetails = { tenantId, apiKey, accessToken }
      throw new codes.ERROR_SDK_INITIALIZATION({ sdkDetails, messageValues: `${initErrors.join(', ')}` })
    }

    /**
     * The tenant id
     *
     * @type {string}
     */
    this.tenantId = tenantId

    /**
     * The api key from your integration
     *
     * @type {string}
     */
    this.apiKey = apiKey

    /**
     * The access token from your integration
     *
     * @type {string}
     */
    this.accessToken = accessToken

    return this
  }

  __createRequestOptions ({ body } = {}) {
    return createRequestOptions({
      tenantId: this.tenantId,
      apiKey: this.apiKey,
      accessToken: this.accessToken,
      body
    })
  }

  /**
   * Get something.
   *
   * @param {MyParameters} [parameters={}] parameters to pass
   * @returns {Promise<Response>} the response
   */
  getSomething (parameters = {}) {
    const sdkDetails = { parameters }

    return new Promise((resolve, reject) => {
      this.sdk.apis.mytag.getSomething(parameters, this.__createRequestOptions())
        .then(response => {
          resolve(response)
        })
        .catch(err => {
          reject(new codes.ERROR_GET_SOMETHING({ sdkDetails, messageValues: reduceError(err) }))
        })
    })
  }
}
module.exports = {
  init: init
}
