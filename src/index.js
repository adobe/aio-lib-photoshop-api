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

const Swagger = require('swagger-client')
const loggerNamespace = 'aio-lib-photoshop-api'
const logger = require('@adobe/aio-lib-core-logging')(loggerNamespace, { level: process.env.LOG_LEVEL })
const { reduceError, requestInterceptor, responseInterceptor, createRequestOptions } = require('./helpers')
const { codes } = require('./SDKErrors')
const { Job } = require('./job')
const { FileResolver } = require('./fileresolver')
const types = require('./types')
require('./types')

/* global EditPhotoOptions Input Output CreateDocumentOptions MimeType ModifyDocumentOptions ReplaceSmartObjectOptions PhotoshopActionsOptions */

/**
 * Returns a Promise that resolves with a new PhotoshopAPI object.
 *
 * @param {string} orgId IMS organization id
 * @param {string} apiKey the API key for your integration
 * @param {string} accessToken the access token for your integration
 * @param {*} [files] Adobe I/O Files instance
 * @param {PhotoshopAPIOptions} [options] Options
 * @returns {Promise<PhotoshopAPI>} a Promise with a PhotoshopAPI object
 */
async function init (orgId, apiKey, accessToken, files, options) {
  try {
    const clientWrapper = new PhotoshopAPI()
    const initializedSDK = await clientWrapper.init(orgId, apiKey, accessToken, files, options)
    logger.debug('sdk initialized successfully')
    return initializedSDK
  } catch (err) {
    logger.debug(`sdk init error: ${err}`)
    throw err
  }
}

/**
 * Translate and throw error
 *
 * @private
 * @param {*} err Error response
 */
function throwError (err) {
  const errType = err.response && err.response.body && err.response.body.type
  switch (err.status) {
    case 400:
      switch (errType) {
        case 'InputValidationError':
          throw new codes.ERROR_INPUT_VALIDATION({ messageValues: reduceError(err) })
        case 'PayloadValidationError':
          throw new codes.ERROR_PAYLOAD_VALIDATION({ messageValues: reduceError(err) })
        case 'RequestBodyError':
          throw new codes.ERROR_REQUEST_BODY({ messageValues: reduceError(err) })
        default:
          throw new codes.ERROR_BAD_REQUEST({ messageValues: reduceError(err) })
      }
    case 401:
      throw new codes.ERROR_UNAUTHORIZED({ messageValues: reduceError(err) })
    case 403:
      throw new codes.ERROR_AUTH_FORBIDDEN({ messageValues: reduceError(err) })
    case 404:
      switch (errType) {
        case 'FileExistsErrors':
          throw new codes.ERROR_FILE_EXISTS({ messageValues: reduceError(err) })
        case 'InputFileExistsErrors':
          throw new codes.ERROR_INPUT_FILE_EXISTS({ messageValues: reduceError(err) })
        default:
          throw new codes.ERROR_RESOURCE_NOT_FOUND({ messageValues: reduceError(err) })
      }
    case 415:
      throw new codes.ERROR_INVALID_CONTENT_TYPE({ messageValues: reduceError(err) })
    case 500:
      throw new codes.ERROR_UNDEFINED({ messageValues: reduceError(err) })
    default:
      throw new codes.ERROR_UNKNOWN({ messageValues: reduceError(err) })
  }
}

/**
 * @typedef {object} PhotoshopAPIOptions
 * @description Photoshop API options
 * @property {number} [presignExpiryInSeconds=3600] Expiry time of any presigned urls, defaults to 1 hour
 * @property {boolean} [defaultAdobeCloudPaths] True if paths should be considered references to files in Creative Cloud
 */

/**
 * This class provides methods to call your PhotoshopAPI APIs.
 * Before calling any method initialize the instance by calling the `init` method on it
 * with valid values for orgId, apiKey and accessToken
 */
class PhotoshopAPI {
  /**
   * Initializes the PhotoshopAPI object and returns it.
   *
   * @param {string} orgId the IMS organization id
   * @param {string} apiKey the API key for your integration
   * @param {string} accessToken the access token for your integration
   * @param {*} [files] Adobe I/O Files instance
   * @param {PhotoshopAPIOptions} [options] Options
   * @returns {Promise<PhotoshopAPI>} a PhotoshopAPI object
   */
  async init (orgId, apiKey, accessToken, files, options) {
    // init swagger client
    const spec = require('../spec/api.json')
    this.sdk = await new Swagger({
      spec: spec,
      requestInterceptor,
      responseInterceptor,
      authorizations: {
        BearerAuth: { value: accessToken },
        ApiKeyAuth: { value: apiKey }
      },
      usePromise: true
    })

    const initErrors = []
    if (!orgId) {
      initErrors.push('orgId')
    }
    if (!apiKey) {
      initErrors.push('apiKey')
    }
    if (!accessToken) {
      initErrors.push('accessToken')
    }

    if (initErrors.length) {
      const sdkDetails = { orgId, apiKey, accessToken }
      throw new codes.ERROR_SDK_INITIALIZATION({ sdkDetails, messageValues: `${initErrors.join(', ')}` })
    }

    /**
     * The IMS organization id
     *
     * @type {string}
     */
    this.orgId = orgId

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

    /**
     * @private
     */
    this.fileResolver = new FileResolver(files, options)

    return this
  }

  __createRequestOptions (body = {}) {
    return createRequestOptions({
      orgId: this.orgId,
      apiKey: this.apiKey,
      accessToken: this.accessToken,
      body
    })
  }

  /**
   * Acquire the current job status
   *
   * The APIs for status updates are defined in the OpenAPI spec, however the status is provided
   * as a url, and not just a jobId. Instead of parsing the url to extract the jobId, this code is
   * invoking the url directly but routed through the Swagger client to take advantage of the request
   * and response interceptor for consistency.
   *
   * @private
   * @param {string} url Job status url
   * @returns {*} Job status response
   */
  async __getJobStatus (url) {
    const response = await Swagger.http({
      url,
      headers: {
        authorization: `Bearer ${this.accessToken}`,
        'x-api-key': this.apiKey,
        'x-gw-ims-org-id': this.orgId
      },
      method: 'GET',
      requestInterceptor,
      responseInterceptor
    })
    return response.obj
  }

  /**
   * Create a cutout mask, and apply it to the input
   *
   * @param {string|Input} input Input file
   * @param {string|Output} output Output file
   * @returns {Job} Auto cutout job
   */
  async createCutout (input, output) {
    try {
      const response = await this.sdk.apis.sensei.autoCutout({
        'x-gw-ims-org-id': this.orgId
      }, this.__createRequestOptions({
        input: await this.fileResolver.resolveInput(input),
        output: await this.fileResolver.resolveOutput(output)
      }))

      const job = new Job(response.body, this.__getJobStatus.bind(this))
      return await job.pollUntilDone()
    } catch (err) {
      throwError(err)
    }
  }

  /**
   * Create a cutout mask
   *
   * @param {string|Input} input Input file
   * @param {string|Output} output Output file
   * @returns {Job} Auto masking job
   */
  async createMask (input, output) {
    try {
      const response = await this.sdk.apis.sensei.autoMask({
        'x-gw-ims-org-id': this.orgId
      }, this.__createRequestOptions({
        input: await this.fileResolver.resolveInput(input),
        output: await this.fileResolver.resolveOutput(output)
      }))

      const job = new Job(response.body, this.__getJobStatus.bind(this))
      return await job.pollUntilDone()
    } catch (err) {
      throwError(err)
    }
  }

  /**
   * Straighten photo
   *
   * @param {string|Input} input Input file
   * @param {string|Output|Output[]} outputs Output file
   * @returns {Job} Auto straighten job
   */
  async straighten (input, outputs) {
    try {
      const response = await this.sdk.apis.lightroom.autoStraighten({
        'x-gw-ims-org-id': this.orgId
      }, this.__createRequestOptions({
        inputs: await this.fileResolver.resolveInput(input),
        outputs: await this.fileResolver.resolveOutputs(outputs)
      }))

      const job = new Job(response.body, this.__getJobStatus.bind(this))
      return await job.pollUntilDone()
    } catch (err) {
      throwError(err)
    }
  }

  /**
   * Automatically tone photo
   *
   * @param {string|Input} input Input file
   * @param {string|Output} output Output file
   * @returns {Job} Auto tone job
   */
  async autoTone (input, output) {
    try {
      const response = await this.sdk.apis.lightroom.autoTone({
        'x-gw-ims-org-id': this.orgId
      }, this.__createRequestOptions({
        inputs: await this.fileResolver.resolveInput(input),
        outputs: await this.fileResolver.resolveOutputs(output)
      }))

      const job = new Job(response.body, this.__getJobStatus.bind(this))
      return await job.pollUntilDone()
    } catch (err) {
      throwError(err)
    }
  }

  /**
   * Apply a set of edit parameters on an image
   *
   * @param {string|Input} input Input file
   * @param {string|Output} output Output file
   * @param {EditPhotoOptions} options Edit options
   * @returns {Job} Edit photo job
   */
  async editPhoto (input, output, options) {
    try {
      const response = await this.sdk.apis.lightroom.editPhoto({
        'x-gw-ims-org-id': this.orgId
      }, this.__createRequestOptions({
        inputs: {
          source: await this.fileResolver.resolveInput(input)
        },
        outputs: await this.fileResolver.resolveOutputs(output),
        options
      }))

      const job = new Job(response.body, this.__getJobStatus.bind(this))
      return await job.pollUntilDone()
    } catch (err) {
      throwError(err)
    }
  }

  /**
   * Apply a preset on an image
   *
   * @param {string|Input} input Input file
   * @param {string|Input} preset Lightroom preset XMP file
   * @param {string|Output} output Output file
   * @returns {Job} Apply preset job
   */
  async applyPreset (input, preset, output) {
    try {
      const response = await this.sdk.apis.lightroom.applyPreset({
        'x-gw-ims-org-id': this.orgId
      }, this.__createRequestOptions({
        inputs: {
          source: await this.fileResolver.resolveInput(input),
          presets: await this.fileResolver.resolveInputs(preset)
        },
        outputs: await this.fileResolver.resolveOutputs(output)
      }))

      const job = new Job(response.body, this.__getJobStatus.bind(this))
      return await job.pollUntilDone()
    } catch (err) {
      throwError(err)
    }
  }

  /**
   * Apply a preset on an image
   *
   * @param {string|Input} input Input file
   * @param {string|Output} output Output file
   * @param {string} xmp Lightroom preset XMP file contents
   * @returns {Job} Apply preset job
   */
  async applyPresetXmp (input, output, xmp) {
    try {
      const response = await this.sdk.apis.lightroom.applyPresetXmp({
        'x-gw-ims-org-id': this.orgId
      }, this.__createRequestOptions({
        inputs: {
          source: await this.fileResolver.resolveInput(input)
        },
        outputs: await this.fileResolver.resolveOutputs(output),
        options: {
          xmp
        }
      }))

      const job = new Job(response.body, this.__getJobStatus.bind(this))
      return await job.pollUntilDone()
    } catch (err) {
      throwError(err)
    }
  }

  /**
   * Create a new psd, optionally with layers, and then generate renditions and/or save as a psd
   *
   * @param {string|string[]|Output|Output[]} outputs Desired output
   * @param {CreateDocumentOptions} options Document create options
   * @returns {Job} Create document job
   */
  async createDocument (outputs, options) {
    try {
      const response = await this.sdk.apis.photoshop.createDocument({
        'x-gw-ims-org-id': this.orgId
      }, this.__createRequestOptions({
        outputs: await this.fileResolver.resolveOutputs(outputs),
        options: await this.fileResolver.resolveInputsDocumentOptions(options)
      }))

      const job = new Job(response.body, this.__getJobStatus.bind(this))
      return await job.pollUntilDone()
    } catch (err) {
      throwError(err)
    }
  }

  /**
   * Extract and return a psd file's layer information
   *
   * @param {string|Input} input An object describing an input PSD file.Current support is for files less than 1000MB.
   * @param {object} [options] available options to apply to all input files
   * @param {object} [options.thumbnails] Include presigned GET URLs to small preview thumbnails for any renderable layer.
   * @param {MimeType} [options.thumbnails.type] desired image format. Allowed values: "image/jpeg", "image/png", "image/tiff"
   * @returns {Job} Get document manifest job
   */
  async getDocumentManifest (input, options) {
    try {
      const response = await this.sdk.apis.photoshop.getDocumentManifest({
        'x-gw-ims-org-id': this.orgId
      }, this.__createRequestOptions({
        inputs: await this.fileResolver.resolveInputs(input),
        options
      }))

      const job = new Job(response.body, this.__getJobStatus.bind(this))
      return await job.pollUntilDone()
    } catch (err) {
      throwError(err)
    }
  }

  /**
   * Apply (optional) psd edits and then generate renditions and/or save a new psd
   *
   * @param {string|Input} input An object describing an input PSD file. Current support is for files less than 1000MB.
   * @param {string|string[]|Output|Output[]} outputs Desired output
   * @param {ModifyDocumentOptions} options Modify document options
   * @returns {Job} Modify document job
   */
  async modifyDocument (input, outputs, options) {
    try {
      const response = await this.sdk.apis.photoshop.modifyDocument({
        'x-gw-ims-org-id': this.orgId
      }, this.__createRequestOptions({
        inputs: await this.fileResolver.resolveInputs(input),
        outputs: await this.fileResolver.resolveOutputs(outputs),
        options: await this.fileResolver.resolveInputsDocumentOptions(options)
      }))

      const job = new Job(response.body, this.__getJobStatus.bind(this))
      return await job.pollUntilDone()
    } catch (err) {
      throwError(err)
    }
  }

  /**
   * Create renditions
   *
   * @param {string|Input} input An object describing an input file. Currently supported filetypes include: jpeg, png, psd, tiff. Current support is for files less than 1000MB.
   * @param {string|string[]|Output|Output[]} outputs Desired output
   * @returns {Job} Create rendition job
   */
  async createRendition (input, outputs) {
    try {
      const response = await this.sdk.apis.photoshop.createRendition({
        'x-gw-ims-org-id': this.orgId
      }, this.__createRequestOptions({
        inputs: await this.fileResolver.resolveInputs(input),
        outputs: await this.fileResolver.resolveOutputs(outputs)
      }))

      const job = new Job(response.body, this.__getJobStatus.bind(this))
      return await job.pollUntilDone()
    } catch (err) {
      throwError(err)
    }
  }

  /**
   * Apply psd edits for replacing embedded smart object and then generate renditions and/or save a new psd
   *
   * @param {Input} input An object describing an input PSD file. Current support is for files less than 1000MB.
   * @param {string|Output|Output[]} outputs Desired output
   * @param {ReplaceSmartObjectOptions} options Replace smart object options
   * @returns {Job} Replace smart object job
   */
  async replaceSmartObject (input, outputs, options) {
    try {
      const response = await this.sdk.apis.photoshop.replaceSmartObject({
        'x-gw-ims-org-id': this.orgId
      }, this.__createRequestOptions({
        inputs: await this.fileResolver.resolveInputs(input),
        outputs: await this.fileResolver.resolveOutputs(outputs),
        options: await this.fileResolver.resolveInputsDocumentOptions(options)
      }))

      const job = new Job(response.body, this.__getJobStatus.bind(this))
      return await job.pollUntilDone()
    } catch (err) {
      throwError(err)
    }
  }

  /**
   * Play Photoshop Actions and then generate renditions and/or save a new psd
   *
   * @param {Input} input An object describing an input image file. Current support is for files less than 1000MB.
   * @param {string|Output|Output[]} outputs Desired output
   * @param {PhotoshopActionsOptions} options Photoshop Actions options
   * @returns {Job} Photoshop Actions job
   */
  async photoshopActions (input, outputs, options) {
    try {
      const response = await this.sdk.apis.photoshop.photoshopActions({
        'x-gw-ims-org-id': this.orgId
      }, this.__createRequestOptions({
        inputs: await this.fileResolver.resolveInputs(input),
        outputs: await this.fileResolver.resolveOutputs(outputs),
        options: await this.fileResolver.resolveInputsphotoshopActionsOptions(options)
      }))

      const job = new Job(response.body, this.__getJobStatus.bind(this))
      return await job.pollUntilDone()
    } catch (err) {
      throwError(err)
    }
  }
}

module.exports = {
  init,
  ...types
}
