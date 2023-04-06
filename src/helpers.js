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

const loggerNamespace = 'aio-lib-photoshop-api'
const logger = require('@adobe/aio-lib-core-logging')(loggerNamespace, { level: process.env.LOG_LEVEL })
const NodeFetchRetry = require('@adobe/node-fetch-retry')

// Wait 1 second for first retry, then 2, 4, etc
const RETRY_INITIAL_DELAY = 1000

// Retry for up to 14 seconds
const RETRY_MAX_DURATON = 14000

/**
 * Reduce an Error to a string
 *
 * @private
 * @param {Error} error the Error object to reduce
 * @returns {string} string reduced from an Error
 */
function reduceError (error = {}) {
  const response = error.response
  if (response) {
    if (response.status && response.statusText && response.body) {
      return `${response.status} - ${response.statusText} (${JSON.stringify(response.body)})`
    }
  }

  return error
}

/**
 * Determine if we should retry fetch due to Server errors (server busy or other application errors)
 *
 * @param {*} response Fetch response object, should at least have a status property which is the HTTP status code received
 * @returns {boolean} true if we should retry or false if not
 */
function shouldRetryFetch (response = {}) {
  return (response.status >= 500) || (response.status === 429)
}

/**
 * Fetch a URL, with retry options provided or default retry options otherwise
 * By default retries will happen for 14 seconds (3 retries at 1, 2 and then 4 seconds -- there cannot be enough time for anotehr retry after that)
 * Retry will occur if error code 429 or >= 500 occurs.
 *
 * @param {*} options Fetch options object, which can also include retryOptions described here https://github.com/adobe/node-fetch-retry
 * @returns {Function} Wrapped node fetch retry function which takes our preferred default options
 */
function nodeFetchRetry (options = {}) {
  const retryOptions = 'retryOptions' in options ? options.retryOptions : {}
  options.retryOptions = {
    retryInitialDelay: RETRY_INITIAL_DELAY,
    retryMaxDuration: RETRY_MAX_DURATON,
    retryOnHttpResponse: shouldRetryFetch,
    ...retryOptions
  }
  const fetchFunction = (url, opts) => NodeFetchRetry(url, { ...options, ...opts })
  // This is helpful for unit testing purposes
  fetchFunction.isNodeFetchRetry = true
  return fetchFunction
}

/**
 * Parse through options object and determine correct parameters to Swagger for desired fetch approach
 *
 * @param {*} options Photoshop API options object
 * @returns {*} Swagger options object with relevant settings for fetch module
 */
function getFetchOptions (options) {
  if (options !== undefined && options.useSwaggerFetch) { // << TEST
    logger.debug('Using swagger fetch')
    return {}
  } else if (options !== undefined && options.userFetch !== undefined) { // << TEST
    logger.debug('Using custom fetch')
    return { userFetch: options.userFetch }
  } else {
    logger.debug('Using node-fetch-retry')
    return { userFetch: nodeFetchRetry(options) }
  }
}

/**
 * Create request options for openapi client
 *
 * @private
 * @param {object} parameters object
 * @returns {object}  options request options
 */
function createRequestOptions ({ apiKey, accessToken, body = {} }) {
  return {
    requestBody: body,
    securities: {
      authorized: {
        BearerAuth: { value: accessToken },
        ApiKeyAuth: { value: apiKey }
      }
    }
  }
}

/**
 * Converts a fetch Response object's body contents to a string.
 *
 * @private
 * @param {Response} response the response object
 * @returns {Promise<string>} a Promise that resolves to the converted object's body contents
 */
async function responseBodyToString (response) {
  try {
    // work with differences in the Response object processed by swagger vs straight fetch
    if (typeof response.text === 'function') {
      const _res = response.clone() // work around 'body already consumed' issues
      return _res.text()
    } else {
      return response.text
    }
  } catch (error) {
    return Promise.reject(error.toString())
  }
}

/**
 * Filters a json object, removing any undefined or null entries.
 * Returns a new object (does not mutate original)
 *
 * @private
 * @param {object} json the json object to filter
 * @returns {object} the filtered object (a new object)
 */
function filterUndefinedOrNull (json) {
  return Object.entries(json).reduce((accum, [key, value]) => {
    if (value == null) { // undefined or null
      return accum
    } else {
      return { ...accum, [key]: value }
    }
  }, {})
}

/**
 * Converts a fetch Request object to a string.
 *
 * @private
 * @param {Request} request the request object
 * @returns {object} the converted object
 */
function requestToString (request) {
  try {
    const { method, headers, url, credentials, body } = request
    const json = { method, headers, url, credentials, body }

    // work with differences in the Request object processed by swagger vs straight fetch
    if (request.headers && request.headers.forEach && typeof request.headers.forEach === 'function') {
      json.headers = {}
      request.headers.forEach((value, key) => {
        json.headers[key] = value
      })
    }

    return JSON.stringify(filterUndefinedOrNull(json), null, 2)
  } catch (error) {
    return error.toString()
  }
}

/**
 * A request interceptor that logs the request
 *
 * @private
 * @param {Response} response the response object
 * @returns {Response} the response object
 */
async function responseInterceptor (response) {
  logger.debug(`RESPONSE:\n ${await responseBodyToString(response)}`)
  return response
}

module.exports = {
  responseBodyToString,
  requestToString,
  createRequestOptions,
  responseInterceptor,
  nodeFetchRetry,
  shouldRetryFetch,
  getFetchOptions,
  reduceError
}
