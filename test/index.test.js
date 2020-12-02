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

/* eslint no-unused-vars: "warn" */

'use strict'

const Swagger = require('swagger-client');
const sdk = require('../src')
const fetch = require('cross-fetch')
const { createRequestOptions } = require('../src/helpers')
const { codes } = require('../src/SDKErrors')

// /////////////////////////////////////////////

const gOrgId = 'test-orgid'
const gApiKey = 'test-apikey'
const gAccessToken = 'test-token'

// /////////////////////////////////////////////

const createSwaggerOptions = (body = {}) => {
  return createRequestOptions({
    orgId: gOrgId,
    apiKey: gApiKey,
    accessToken: gAccessToken,
    body
  })
}

const createSdkClient = async () => {
  return sdk.init(gOrgId, gApiKey, gAccessToken)
}

// /////////////////////////////////////////////

jest.mock('swagger-client')

beforeEach(() => {
  fetch.resetMocks()
})

test('sdk init test', async () => {
  const sdkClient = await createSdkClient()

  expect(sdkClient.orgId).toBe(gOrgId)
  expect(sdkClient.apiKey).toBe(gApiKey)
  expect(sdkClient.accessToken).toBe(gAccessToken)
})

test('sdk init test - no orgId', async () => {
  return expect(sdk.init(null, gApiKey, gAccessToken)).rejects.toEqual(
    new codes.ERROR_SDK_INITIALIZATION({ messageValues: 'orgId' })
  )
})

test('sdk init test - no apiKey', async () => {
  return expect(sdk.init(gOrgId, null, gAccessToken)).rejects.toEqual(
    new codes.ERROR_SDK_INITIALIZATION({ messageValues: 'apiKey' })
  )
})

test('sdk init test - no accessToken', async () => {
  return expect(sdk.init(gOrgId, gApiKey, null)).rejects.toEqual(
    new codes.ERROR_SDK_INITIALIZATION({ messageValues: 'accessToken' })
  )
})

/** @private */
async function standardTest({
  fullyQualifiedApiName, apiParameters, apiOptions,
  sdkFunctionName, sdkArgs,
  returnValue = {},
  httpResponseBody = {},
  status = 'succeeded',
  ErrorClass
}) {
  const [, apiFunction] = fullyQualifiedApiName.split('.')

  if (!ErrorClass) {
    throw new Error('ErrorClass not defined for standardTest')
  }

  // sdk function name is the same as the apiname (without the namespace) by default
  // so if it is not set, we set it
  // this means in the SDK the namespace is flattened, so functions have to have unique names
  if (!sdkFunctionName) {
    sdkFunctionName = apiFunction
  }
  const fn = sdkClient[sdkFunctionName]
  let mockFn

  // Mock out the http() function of Swagger SDK
  Swagger.http = jest.fn(() => { return { obj: httpResponseBody } });

  // success case
  mockFn = sdkClient.sdk.mockResolved(fullyQualifiedApiName, returnValue)
  await expect(fn.apply(sdkClient, sdkArgs)).resolves.toMatchObject({
    jobId: httpResponseBody["jobID"],
    outputs: expect.arrayContaining([
      expect.objectContaining({ "status": status })
    ])
  })
  expect(mockFn).toHaveBeenCalledWith(apiParameters, apiOptions)

  // failure case
  // const err = new Error('some API error')
  // mockFn = sdkClient.sdk.mockRejected(fullyQualifiedApiName, err)
  // await expect(fn.apply(sdkClient, sdkArgs)).rejects.toEqual(
  //   new ErrorClass({ sdkDetails: { ...sdkArgs }, messageValues: err })
  // )
  // expect(mockFn).toHaveBeenCalledWith(apiParameters, apiOptions)
}

// test('getSomething', async () => {
//   const sdkArgs = []
//   const apiParameters = {}
//   const apiOptions = createSwaggerOptions()

//   return expect(() => standardTest({
//     fullyQualifiedApiName: 'mytag.getSomething',
//     apiParameters,
//     apiOptions,
//     sdkArgs,
//     ErrorClass: codes.ERROR_GET_SOMETHING
//   })).not.toThrow()
// })

let sdkClient;

beforeEach(async () => {
  sdkClient = await createSdkClient()
})

test('createCutout', async () => {
  try {
    const apiParameters = { 'x-gw-ims-org-id': gOrgId }
    const apiOptions = createSwaggerOptions({
      input: await sdkClient.fileResolver.resolveInput('input'),
      output: await sdkClient.fileResolver.resolveOutput('output')
    })
    const sdkArgs = ['input', 'output']
    const returnValue = {
      "body": {
        "_links": {
          "self": { "href": "https://image.adobe.io/sensei/status/f54e0fcb-260b-47c3-b520-de0d17dc2b67" }
        }
      }
    }
    const jobStatus = {
      "jobID": "cutoutSucceededJobId",
      "status": "succeeded",
      "input": "/files/images/input.jpg",
      "output": {
        "storage": "adobe",
        "href": "/files/cutout/output/cutout.png",
        "mask": {
          "format": "binary"
        },
        "color": {
          "space": "rgb"
        }
      },
      "_links": {
        "self": {
          "href": "https://image.adobe.io/sensei/status/cutoutSucceededStatusId"
        }
      }
    }

    await standardTest({
      fullyQualifiedApiName: 'sensei.autoCutout',
      apiParameters: apiParameters,
      apiOptions: apiOptions,
      sdkFunctionName: 'createCutout',
      sdkArgs: sdkArgs,
      successReturnValue: jobStatus,
      returnValue: returnValue,
      httpResponseBody: jobStatus,
      ErrorClass: {}
    })
  } catch (e) {
    throw e
  }
})

test('createMask', async () => {
  try {
    const apiParameters = { 'x-gw-ims-org-id': gOrgId }
    const apiOptions = createSwaggerOptions({
      input: await sdkClient.fileResolver.resolveInput('input'),
      output: await sdkClient.fileResolver.resolveOutput('output')
    })
    const sdkArgs = ['input', 'output']
    const returnValue = {
      "body": {
        "_links": {
          "self": { "href": "https://image.adobe.io/sensei/status/f54e0fcb-260b-47c3-b520-de0d17dc2b67" }
        }
      }
    }
    const jobStatus = {
      "jobID": "maskSucceededJobId",
      "status": "succeeded",
      "input": "/files/images/input.jpg",
      "output": {
        "storage": "adobe",
        "href": "/files/mask/output/mask.png",
        "mask": {
          "format": "binary"
        },
        "color": {
          "space": "rgb"
        }
      },
      "_links": {
        "self": {
          "href": "https://image.adobe.io/sensei/status/maskSucceededStatusId"
        }
      }
    }

    await standardTest({
      fullyQualifiedApiName: 'sensei.autoMask',
      apiParameters: apiParameters,
      apiOptions: apiOptions,
      sdkFunctionName: 'createMask',
      sdkArgs: sdkArgs,
      returnValue: returnValue,
      httpResponseBody: jobStatus,
      ErrorClass: {}
    })
  } catch (e) {
    throw e
  }
})

test('straighten', async () => {
  try {
    const apiParameters = { 'x-gw-ims-org-id': gOrgId }
    const apiOptions = createSwaggerOptions({
      inputs: await sdkClient.fileResolver.resolveInput('input'),
      outputs: await sdkClient.fileResolver.resolveOutputs('output')
    })
    const sdkArgs = ['input', 'output']
    const returnValue = {
      "body": {
        "_links": {
          "self": { "href": "https://image.adobe.io/sensei/status/f54e0fcb-260b-47c3-b520-de0d17dc2b67" }
        }
      }
    }
    const jobStatus = {
      "jobID": "straightenSucceededJobId",
      "status": "succeeded",
      "input": "/files/images/input.jpg",
      "output": {
        "storage": "adobe",
        "href": "/files/straighten/output/straighten.png",
        "mask": {
          "format": "binary"
        },
        "color": {
          "space": "rgb"
        }
      },
      "_links": {
        "self": {
          "href": "https://image.adobe.io/sensei/status/straightenSucceededStatusId"
        }
      }
    }

    await standardTest({
      fullyQualifiedApiName: 'lightroom.autoStraighten',
      apiParameters: apiParameters,
      apiOptions: apiOptions,
      sdkFunctionName: 'straighten',
      sdkArgs: sdkArgs,
      returnValue: returnValue,
      httpResponseBody: jobStatus,
      ErrorClass: {}
    })
  } catch (e) {
    throw e
  }
})

test('autoTone', async () => {
  try {
    const apiParameters = { 'x-gw-ims-org-id': gOrgId }
    const apiOptions = createSwaggerOptions({
      inputs: await sdkClient.fileResolver.resolveInput('input'),
      outputs: await sdkClient.fileResolver.resolveOutputs('output')
    })
    const sdkArgs = ['input', 'output']
    const returnValue = {
      "body": {
        "_links": {
          "self": { "href": "https://image.adobe.io/sensei/status/f54e0fcb-260b-47c3-b520-de0d17dc2b67" }
        }
      }
    }
    const jobStatus = {
      "jobID": "autoToneSucceededJobId",
      "status": "succeeded",
      "input": "/files/images/input.jpg",
      "output": {
        "storage": "adobe",
        "href": "/files/autoTone/output/autoTone.png",
        "mask": {
          "format": "binary"
        },
        "color": {
          "space": "rgb"
        }
      },
      "_links": {
        "self": {
          "href": "https://image.adobe.io/sensei/status/autoToneSucceededStatusId"
        }
      }
    }

    await standardTest({
      fullyQualifiedApiName: 'lightroom.autoTone',
      apiParameters: apiParameters,
      apiOptions: apiOptions,
      sdkFunctionName: 'autoTone',
      sdkArgs: sdkArgs,
      returnValue: returnValue,
      httpResponseBody: jobStatus,
      ErrorClass: {}
    })
  } catch (e) {
    throw e
  }
})

test('editPhoto', async () => {
  try {
    const apiParameters = { 'x-gw-ims-org-id': gOrgId }
    const apiOptions = createSwaggerOptions({
      inputs: {
        source: await sdkClient.fileResolver.resolveInput('input')
      },
      outputs: await sdkClient.fileResolver.resolveOutputs('output'),
      options: undefined
    })
    const sdkArgs = ['input', 'output']
    const returnValue = {
      "body": {
        "_links": {
          "self": { "href": "https://image.adobe.io/sensei/status/f54e0fcb-260b-47c3-b520-de0d17dc2b67" }
        }
      }
    }
    const jobStatus = {
      "jobID": "editPhotoSucceededJobId",
      "status": "succeeded",
      "input": "/files/images/input.jpg",
      "output": {
        "storage": "adobe",
        "href": "/files/editPhoto/output/editPhoto.png",
        "mask": {
          "format": "binary"
        },
        "color": {
          "space": "rgb"
        }
      },
      "_links": {
        "self": {
          "href": "https://image.adobe.io/sensei/status/editPhotoSucceededStatusId"
        }
      }
    }

    await standardTest({
      fullyQualifiedApiName: 'lightroom.editPhoto',
      apiParameters: apiParameters,
      apiOptions: apiOptions,
      sdkFunctionName: 'editPhoto',
      sdkArgs: sdkArgs,
      returnValue: returnValue,
      httpResponseBody: jobStatus,
      ErrorClass: {}
    })
  } catch (e) {
    throw e
  }
})

test('applyPreset', async () => {
  try {
    const apiParameters = { 'x-gw-ims-org-id': gOrgId }
    const apiOptions = createSwaggerOptions({
      inputs: {
        source: await sdkClient.fileResolver.resolveInput('input'),
        presets: await sdkClient.fileResolver.resolveInputs('preset')
      },
      outputs: await sdkClient.fileResolver.resolveOutputs('output'),
    })
    const sdkArgs = ['input', 'preset', 'output']
    const returnValue = {
      "body": {
        "_links": {
          "self": { "href": "https://image.adobe.io/sensei/status/f54e0fcb-260b-47c3-b520-de0d17dc2b67" }
        }
      }
    }
    const jobStatus = {
      "jobID": "applyPresetSucceededJobId",
      "status": "succeeded",
      "input": "/files/images/input.jpg",
      "output": {
        "storage": "adobe",
        "href": "/files/applyPreset/output/applyPreset.png",
        "mask": {
          "format": "binary"
        },
        "color": {
          "space": "rgb"
        }
      },
      "_links": {
        "self": {
          "href": "https://image.adobe.io/sensei/status/applyPresetSucceededStatusId"
        }
      }
    }

    await standardTest({
      fullyQualifiedApiName: 'lightroom.applyPreset',
      apiParameters: apiParameters,
      apiOptions: apiOptions,
      sdkFunctionName: 'applyPreset',
      sdkArgs: sdkArgs,
      returnValue: returnValue,
      httpResponseBody: jobStatus,
      ErrorClass: {}
    })
  } catch (e) {
    throw e
  }
})