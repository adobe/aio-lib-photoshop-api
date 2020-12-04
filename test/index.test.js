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

jest.mock('swagger-client')

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
  status = 'succeeded'
}) {
  const [, apiFunction] = fullyQualifiedApiName.split('.')

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

/** @private */
async function errorTest({
  fullyQualifiedApiName, apiParameters, apiOptions,
  sdkFunctionName, sdkArgs,
  statusCode, errType, ErrorClass
}) {
  const [, apiFunction] = fullyQualifiedApiName.split('.')

  if (!ErrorClass) {
    throw new Error('ErrorClass not defined for errorTest')
  }

  // sdk function name is the same as the apiname (without the namespace) by default
  // so if it is not set, we set it
  // this means in the SDK the namespace is flattened, so functions have to have unique names
  if (!sdkFunctionName) {
    sdkFunctionName = apiFunction
  }
  const fn = sdkClient[sdkFunctionName]
  let mockFn

  // failure case
  const err = new Error('some API error')
  if (statusCode) err.status = statusCode
  if (errType) err.response = { body: { type: errType } }
  mockFn = sdkClient.sdk.mockRejected(fullyQualifiedApiName, err)
  await expect(fn.apply(sdkClient, sdkArgs)).rejects.toEqual(
    new ErrorClass({ sdkDetails: { ...sdkArgs }, messageValues: err })
  )
  expect(mockFn).toHaveBeenCalledWith(apiParameters, apiOptions)
}




let sdkClient;

beforeEach(async () => {
  sdkClient = await createSdkClient()
})

describe('__createRequestOptions', () => {
  test('Empty Body', async () => {
    try {
      let opt = await sdkClient.__createRequestOptions();
      expect(opt).toMatchObject({
        requestBody: {},
        securities: {
          authorized: {
            BearerAuth: { value: "test-token" },
            ApiKeyAuth: { value: "test-apikey" }
          }
        }
      })
    } catch (e) {
      throw e;
    }
  });

  test('Non-Empty Body', async () => {
    try {
      let opt = await sdkClient.__createRequestOptions({
        input: await sdkClient.fileResolver.resolveInput('input'),
        output: await sdkClient.fileResolver.resolveOutput('output')
      });
      expect(opt).toMatchObject({
        requestBody: {
          "input": {
            "href": "input",
            "storage": "adobe",
          },
          "output": {
            "href": "output",
            "storage": "adobe",
            "type": "image/png",
          },
        },
        securities: {
          authorized: {
            BearerAuth: { value: "test-token" },
            ApiKeyAuth: { value: "test-apikey" }
          }
        }
      })
    } catch (e) {
      throw e;
    }
  });
});


describe('Sensei', () => {
  describe('createCutout', () => {
    let spec
    let apiParameters
    let apiOptions
    let sdkArgs
    let returnValue
    let jobStatus
    beforeEach(async () => {

      apiParameters = { 'x-gw-ims-org-id': gOrgId }
      apiOptions = createSwaggerOptions({
        input: await sdkClient.fileResolver.resolveInput('input'),
        output: await sdkClient.fileResolver.resolveOutput('output')
      })

      sdkArgs = ['input', 'output']

      spec = {
        fullyQualifiedApiName: 'sensei.autoCutout',
        apiParameters: apiParameters,
        apiOptions: apiOptions,
        sdkFunctionName: 'createCutout',
        sdkArgs: sdkArgs,
      }

      returnValue = {
        "body": {
          "_links": {
            "self": { "href": "https://image.adobe.io/sensei/status/f54e0fcb-260b-47c3-b520-de0d17dc2b67" }
          }
        }
      }

      jobStatus = {
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
    });

    test('Success Case', async () => {
      try {
        await standardTest({
          ...spec,
          successReturnValue: jobStatus,
          returnValue: returnValue,
          httpResponseBody: jobStatus
        })
      } catch (e) {
        throw e
      }
    });

    test('Failure Case', async () => {
      try {

        jobStatus.status = "failed"

        await standardTest({
          ...spec,
          successReturnValue: jobStatus,
          returnValue: returnValue,
          httpResponseBody: jobStatus,
          status: 'failed'
        })
      } catch (e) {
        throw e
      }
    });

    test('Error Case - Unknown', async () => {
      try {
        await errorTest({
          ...spec,
          ErrorClass: codes.ERROR_UNKNOWN
        })
      } catch (e) {
        throw e
      }
    });

    test('Error Case (400) - Default', async () => {
      try {
        await errorTest({
          ...spec,
          statusCode: 400,
          ErrorClass: codes.ERROR_BAD_REQUEST
        })
      } catch (e) {
        throw e
      }
    })

    test('Error Case (400) - InputValidationError', async () => {
      try {
        await errorTest({
          ...spec,
          statusCode: 400,
          errType: 'InputValidationError',
          ErrorClass: codes.ERROR_INPUT_VALIDATION
        })
      } catch (e) {
        throw e
      }
    });

    test('Error Case (400) - PayloadValidationError', async () => {
      try {
        await errorTest({
          ...spec,
          statusCode: 400,
          errType: 'PayloadValidationError',
          ErrorClass: codes.ERROR_PAYLOAD_VALIDATION
        })
      } catch (e) {
        throw e
      }
    });

    test('Error Case (400) - RequestBodyError', async () => {
      try {
        await errorTest({
          ...spec,
          statusCode: 400,
          errType: 'RequestBodyError',
          ErrorClass: codes.ERROR_REQUEST_BODY
        })
      } catch (e) {
        throw e
      }
    });

    test('Error Case (401)', async () => {
      try {
        await errorTest({
          ...spec,
          statusCode: 401,
          ErrorClass: codes.ERROR_UNAUTHORIZED
        })
      } catch (e) {
        throw e
      }
    });

    test('Error Case (403)', async () => {
      try {
        await errorTest({
          ...spec,
          statusCode: 403,
          ErrorClass: codes.ERROR_AUTH_FORBIDDEN
        })
      } catch (e) {
        throw e
      }
    });

    test('Error Case (404) - Default', async () => {
      try {
        await errorTest({
          ...spec,
          statusCode: 404,
          ErrorClass: codes.ERROR_RESOURCE_NOT_FOUND
        })
      } catch (e) {
        throw e
      }
    });

    test('Error Case (404) - FileExistsErrors', async () => {
      try {
        await errorTest({
          ...spec,
          statusCode: 404,
          errType: 'FileExistsErrors',
          ErrorClass: codes.ERROR_FILE_EXISTS
        })
      } catch (e) {
        throw e
      }
    });

    test('Error Case (404) - InputFileExistsErrors', async () => {
      try {
        await errorTest({
          ...spec,
          statusCode: 404,
          errType: 'InputFileExistsErrors',
          ErrorClass: codes.ERROR_INPUT_FILE_EXISTS
        })
      } catch (e) {
        throw e
      }
    });

    test('Error Case (415)', async () => {
      try {
        await errorTest({
          ...spec,
          statusCode: 415,
          ErrorClass: codes.ERROR_INVALID_CONTENT_TYPE
        })
      } catch (e) {
        throw e
      }
    });

    test('Error Case (500)', async () => {
      try {
        await errorTest({
          ...spec,
          statusCode: 500,
          ErrorClass: codes.ERROR_UNDEFINED
        })
      } catch (e) {
        throw e
      }
    });

  })

  describe('createMask', () => {
    let spec
    let apiParameters
    let apiOptions
    let sdkArgs
    let returnValue
    let jobStatus
    beforeEach(async () => {

      apiParameters = { 'x-gw-ims-org-id': gOrgId }
      apiOptions = createSwaggerOptions({
        input: await sdkClient.fileResolver.resolveInput('input'),
        output: await sdkClient.fileResolver.resolveOutput('output')
      })

      sdkArgs = ['input', 'output']

      spec = {
        fullyQualifiedApiName: 'sensei.autoMask',
        apiParameters: apiParameters,
        apiOptions: apiOptions,
        sdkFunctionName: 'createMask',
        sdkArgs: sdkArgs,
      }

      returnValue = {
        "body": {
          "_links": {
            "self": { "href": "https://image.adobe.io/sensei/status/f54e0fcb-260b-47c3-b520-de0d17dc2b67" }
          }
        }
      }

      jobStatus = {
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
    });

    test('Success Case', async () => {
      try {
        await standardTest({
          ...spec,
          returnValue: returnValue,
          httpResponseBody: jobStatus
        })
      } catch (e) {
        throw e
      }
    });

    test('Failure Case', async () => {
      try {

        jobStatus.status = "failed"

        await standardTest({
          ...spec,
          returnValue: returnValue,
          httpResponseBody: jobStatus,
          status: 'failed'
        })
      } catch (e) {
        throw e
      }
    });

    test('Error Case - Unknown', async () => {
      try {
        await errorTest({
          ...spec,
          ErrorClass: codes.ERROR_UNKNOWN
        })
      } catch (e) {
        throw e
      }
    });

  });
});

describe('Lightroom', () => {
  describe('straighten', () => {
    let spec
    let apiParameters
    let apiOptions
    let sdkArgs
    let returnValue
    let jobStatus
    beforeEach(async () => {

      apiParameters = { 'x-gw-ims-org-id': gOrgId }
      apiOptions = createSwaggerOptions({
        inputs: await sdkClient.fileResolver.resolveInput('input'),
        outputs: await sdkClient.fileResolver.resolveOutputs('output')
      })

      sdkArgs = ['input', 'output']

      spec = {
        fullyQualifiedApiName: 'lightroom.autoStraighten',
        apiParameters: apiParameters,
        apiOptions: apiOptions,
        sdkFunctionName: 'straighten',
        sdkArgs: sdkArgs,
      }

      returnValue = {
        "body": {
          "_links": {
            "self": { "href": "https://image.adobe.io/sensei/status/f54e0fcb-260b-47c3-b520-de0d17dc2b67" }
          }
        }
      }

      jobStatus = {
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
    });

    test('Success Case', async () => {
      try {
        await standardTest({
          ...spec,
          returnValue: returnValue,
          httpResponseBody: jobStatus
        })
      } catch (e) {
        throw e
      }
    });

    test('Failure Case', async () => {
      try {

        jobStatus.status = "failed"

        await standardTest({
          ...spec,
          returnValue: returnValue,
          httpResponseBody: jobStatus,
          status: 'failed'
        })
      } catch (e) {
        throw e
      }
    });

    test('Error Case - Unknown', async () => {
      try {
        await errorTest({
          ...spec,
          ErrorClass: codes.ERROR_UNKNOWN
        })
      } catch (e) {
        throw e
      }
    });

  });

  describe('autoTone', () => {
    let spec
    let apiParameters
    let apiOptions
    let sdkArgs
    let returnValue
    let jobStatus
    beforeEach(async () => {

      apiParameters = { 'x-gw-ims-org-id': gOrgId }
      apiOptions = createSwaggerOptions({
        inputs: await sdkClient.fileResolver.resolveInput('input'),
        outputs: await sdkClient.fileResolver.resolveOutputs('output')
      })

      sdkArgs = ['input', 'output']

      spec = {
        fullyQualifiedApiName: 'lightroom.autoTone',
        apiParameters: apiParameters,
        apiOptions: apiOptions,
        sdkFunctionName: 'autoTone',
        sdkArgs: sdkArgs,
      }

      returnValue = {
        "body": {
          "_links": {
            "self": { "href": "https://image.adobe.io/sensei/status/f54e0fcb-260b-47c3-b520-de0d17dc2b67" }
          }
        }
      }

      jobStatus = {
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
    });

    test('Success Case', async () => {
      try {
        await standardTest({
          ...spec,
          returnValue: returnValue,
          httpResponseBody: jobStatus
        })
      } catch (e) {
        throw e
      }
    });

    test('Failure Case', async () => {
      try {

        jobStatus.status = "failed"

        await standardTest({
          ...spec,
          returnValue: returnValue,
          httpResponseBody: jobStatus,
          status: 'failed'
        })
      } catch (e) {
        throw e
      }
    });

    test('Error Case - Unknown', async () => {
      try {
        await errorTest({
          ...spec,
          ErrorClass: codes.ERROR_UNKNOWN
        })
      } catch (e) {
        throw e
      }
    })

  });

  describe('editPhoto', () => {
    let spec
    let apiParameters
    let apiOptions
    let sdkArgs
    let returnValue
    let jobStatus
    beforeEach(async () => {

      apiParameters = { 'x-gw-ims-org-id': gOrgId }
      apiOptions = createSwaggerOptions({
        inputs: {
          source: await sdkClient.fileResolver.resolveInput('input')
        },
        outputs: await sdkClient.fileResolver.resolveOutputs('output'),
        options: undefined
      })

      sdkArgs = ['input', 'output']

      spec = {
        fullyQualifiedApiName: 'lightroom.editPhoto',
        apiParameters: apiParameters,
        apiOptions: apiOptions,
        sdkFunctionName: 'editPhoto',
        sdkArgs: sdkArgs,
      }

      returnValue = {
        "body": {
          "_links": {
            "self": { "href": "https://image.adobe.io/sensei/status/f54e0fcb-260b-47c3-b520-de0d17dc2b67" }
          }
        }
      }

      jobStatus = {
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
    });

    test('Success Case', async () => {
      try {
        await standardTest({
          ...spec,
          returnValue: returnValue,
          httpResponseBody: jobStatus
        })
      } catch (e) {
        throw e
      }
    });

    test('Failure Case', async () => {
      try {

        jobStatus.status = "failed"

        await standardTest({
          ...spec,
          returnValue: returnValue,
          httpResponseBody: jobStatus,
          status: 'failed'
        })
      } catch (e) {
        throw e
      }
    });

    test('Error Case - Unknown', async () => {
      try {
        await errorTest({
          ...spec,
          ErrorClass: codes.ERROR_UNKNOWN
        })
      } catch (e) {
        throw e
      }
    })

  });

  describe('applyPreset', () => {
    let spec
    let apiParameters
    let apiOptions
    let sdkArgs
    let returnValue
    let jobStatus
    beforeEach(async () => {

      apiParameters = { 'x-gw-ims-org-id': gOrgId }
      apiOptions = createSwaggerOptions({
        inputs: {
          source: await sdkClient.fileResolver.resolveInput('input'),
          presets: await sdkClient.fileResolver.resolveInputs('preset')
        },
        outputs: await sdkClient.fileResolver.resolveOutputs('output'),
      })
      sdkArgs = ['input', 'preset', 'output']

      spec = {
        fullyQualifiedApiName: 'lightroom.applyPreset',
        apiParameters: apiParameters,
        apiOptions: apiOptions,
        sdkFunctionName: 'applyPreset',
        sdkArgs: sdkArgs,
      }

      returnValue = {
        "body": {
          "_links": {
            "self": { "href": "https://image.adobe.io/sensei/status/f54e0fcb-260b-47c3-b520-de0d17dc2b67" }
          }
        }
      }

      jobStatus = {
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
    });

    test('Success Case', async () => {
      try {
        await standardTest({
          ...spec,
          returnValue: returnValue,
          httpResponseBody: jobStatus
        })
      } catch (e) {
        throw e
      }
    });

    test('Failure Case', async () => {
      try {

        jobStatus.status = "failed"

        await standardTest({
          ...spec,
          returnValue: returnValue,
          httpResponseBody: jobStatus,
          status: 'failed'
        })
      } catch (e) {
        throw e
      }
    });

    test('Error Case - Unknown', async () => {
      try {
        await errorTest({
          ...spec,
          ErrorClass: codes.ERROR_UNKNOWN
        })
      } catch (e) {
        throw e
      }
    })

  });

  describe('applyPresetXmp', () => {
    let spec
    let apiParameters
    let apiOptions
    let sdkArgs
    let returnValue
    let jobStatus
    beforeEach(async () => {

      apiParameters = { 'x-gw-ims-org-id': gOrgId }
      apiOptions = createSwaggerOptions({
        inputs: {
          source: await sdkClient.fileResolver.resolveInput('input')
        },
        outputs: await sdkClient.fileResolver.resolveOutputs('output'),
        options: {
          xmp: 'xmp'
        }
      })
      sdkArgs = ['input', 'output', 'xmp']

      spec = {
        fullyQualifiedApiName: 'lightroom.applyPresetXmp',
        apiParameters: apiParameters,
        apiOptions: apiOptions,
        sdkFunctionName: 'applyPresetXmp',
        sdkArgs: sdkArgs,
      }

      returnValue = {
        "body": {
          "_links": {
            "self": { "href": "https://image.adobe.io/sensei/status/f54e0fcb-260b-47c3-b520-de0d17dc2b67" }
          }
        }
      }

      jobStatus = {
        "jobID": "applyPresetXmpSucceededJobId",
        "status": "succeeded",
        "input": "/files/images/input.jpg",
        "output": {
          "storage": "adobe",
          "href": "/files/applyPresetXmp/output/applyPresetXmp.png",
          "mask": {
            "format": "binary"
          },
          "color": {
            "space": "rgb"
          }
        },
        "_links": {
          "self": {
            "href": "https://image.adobe.io/sensei/status/applyPresetXmpSucceededStatusId"
          }
        }
      }
    });

    test('Success Case', async () => {
      try {
        await standardTest({
          ...spec,
          returnValue: returnValue,
          httpResponseBody: jobStatus
        })
      } catch (e) {
        throw e
      }
    });

    test('Failure Case', async () => {
      try {

        jobStatus.status = "failed"

        await standardTest({
          ...spec,
          returnValue: returnValue,
          httpResponseBody: jobStatus,
          status: 'failed'
        })
      } catch (e) {
        throw e
      }
    });

    test('Error Case - Unknown', async () => {
      try {
        await errorTest({
          ...spec,
          ErrorClass: codes.ERROR_UNKNOWN
        })
      } catch (e) {
        throw e
      }
    })

  });

});

describe('Photoshop', () => {
  describe('createDocument', () => {
    let spec
    let apiParameters
    let apiOptions
    let sdkArgs
    let returnValue
    let jobStatus
    beforeEach(async () => {

      apiParameters = { 'x-gw-ims-org-id': gOrgId }
      apiOptions = createSwaggerOptions({
        outputs: await sdkClient.fileResolver.resolveOutputs('outputs'),
        options: await sdkClient.fileResolver.resolveInputsDocumentOptions('options')
      })
      sdkArgs = ['outputs', 'options']

      spec = {
        fullyQualifiedApiName: 'photoshop.createDocument',
        apiParameters: apiParameters,
        apiOptions: apiOptions,
        sdkFunctionName: 'createDocument',
        sdkArgs: sdkArgs,
      }

      returnValue = {
        "body": {
          "_links": {
            "self": { "href": "https://image.adobe.io/sensei/status/f54e0fcb-260b-47c3-b520-de0d17dc2b67" }
          }
        }
      }

      jobStatus = {
        "jobID": "createDocumentSucceededJobId",
        "status": "succeeded",
        "input": "/files/images/input.jpg",
        "output": {
          "storage": "adobe",
          "href": "/files/createDocument/output/createDocument.png",
          "mask": {
            "format": "binary"
          },
          "color": {
            "space": "rgb"
          }
        },
        "_links": {
          "self": {
            "href": "https://image.adobe.io/sensei/status/createDocumentSucceededStatusId"
          }
        }
      }
    });

    test('Success Case', async () => {
      try {
        await standardTest({
          ...spec,
          returnValue: returnValue,
          httpResponseBody: jobStatus
        })
      } catch (e) {
        throw e
      }
    });

    test('Failure Case', async () => {
      try {

        jobStatus.status = "failed"

        await standardTest({
          ...spec,
          returnValue: returnValue,
          httpResponseBody: jobStatus,
          status: 'failed'
        })
      } catch (e) {
        throw e
      }
    });

    test('Error Case - Unknown', async () => {
      try {
        await errorTest({
          ...spec,
          ErrorClass: codes.ERROR_UNKNOWN
        })
      } catch (e) {
        throw e
      }
    })

  });

  describe('getDocumentManifest', () => {
    let spec
    let apiParameters
    let apiOptions
    let sdkArgs
    let returnValue
    let jobStatus
    beforeEach(async () => {

      apiParameters = { 'x-gw-ims-org-id': gOrgId }
      apiOptions = createSwaggerOptions({
        inputs: await sdkClient.fileResolver.resolveInputs('input'),
        options: 'options'
      })
      sdkArgs = ['input', 'options']

      spec = {
        fullyQualifiedApiName: 'photoshop.getDocumentManifest',
        apiParameters: apiParameters,
        apiOptions: apiOptions,
        sdkFunctionName: 'getDocumentManifest',
        sdkArgs: sdkArgs,
      }

      returnValue = {
        "body": {
          "_links": {
            "self": { "href": "https://image.adobe.io/sensei/status/f54e0fcb-260b-47c3-b520-de0d17dc2b67" }
          }
        }
      }

      jobStatus = {
        "jobID": "getDocumentManifestSucceededJobId",
        "status": "succeeded",
        "input": "/files/images/input.jpg",
        "output": {
          "storage": "adobe",
          "href": "/files/getDocumentManifest/output/getDocumentManifest.png",
          "mask": {
            "format": "binary"
          },
          "color": {
            "space": "rgb"
          }
        },
        "_links": {
          "self": {
            "href": "https://image.adobe.io/sensei/status/getDocumentManifestSucceededStatusId"
          }
        }
      }
    });

    test('Success Case', async () => {
      try {
        await standardTest({
          ...spec,
          returnValue: returnValue,
          httpResponseBody: jobStatus
        })
      } catch (e) {
        throw e
      }
    });

    test('Failure Case', async () => {
      try {

        jobStatus.status = "failed"

        await standardTest({
          ...spec,
          returnValue: returnValue,
          httpResponseBody: jobStatus,
          status: 'failed'
        })
      } catch (e) {
        throw e
      }
    });

    test('Error Case - Unknown', async () => {
      try {
        await errorTest({
          ...spec,
          ErrorClass: codes.ERROR_UNKNOWN
        })
      } catch (e) {
        throw e
      }
    })

  });

  describe('modifyDocument', () => {
    let spec
    let apiParameters
    let apiOptions
    let sdkArgs
    let returnValue
    let jobStatus
    beforeEach(async () => {

      apiParameters = { 'x-gw-ims-org-id': gOrgId }
      apiOptions = createSwaggerOptions({
        inputs: await sdkClient.fileResolver.resolveInputs('input'),
        outputs: await sdkClient.fileResolver.resolveOutputs('outputs'),
        options: await sdkClient.fileResolver.resolveInputsDocumentOptions('options')
      })
      sdkArgs = ['input', 'outputs', 'options']

      spec = {
        fullyQualifiedApiName: 'photoshop.modifyDocument',
        apiParameters: apiParameters,
        apiOptions: apiOptions,
        sdkFunctionName: 'modifyDocument',
        sdkArgs: sdkArgs,
      }

      returnValue = {
        "body": {
          "_links": {
            "self": { "href": "https://image.adobe.io/sensei/status/f54e0fcb-260b-47c3-b520-de0d17dc2b67" }
          }
        }
      }

      jobStatus = {
        "jobID": "modifyDocumentSucceededJobId",
        "status": "succeeded",
        "input": "/files/images/input.jpg",
        "output": {
          "storage": "adobe",
          "href": "/files/modifyDocument/output/modifyDocument.png",
          "mask": {
            "format": "binary"
          },
          "color": {
            "space": "rgb"
          }
        },
        "_links": {
          "self": {
            "href": "https://image.adobe.io/sensei/status/modifyDocumentSucceededStatusId"
          }
        }
      }
    });

    test('Success Case', async () => {
      try {
        await standardTest({
          ...spec,
          returnValue: returnValue,
          httpResponseBody: jobStatus
        })
      } catch (e) {
        throw e
      }
    });

    test('Failure Case', async () => {
      try {

        jobStatus.status = "failed"

        await standardTest({
          ...spec,
          returnValue: returnValue,
          httpResponseBody: jobStatus,
          status: 'failed'
        })
      } catch (e) {
        throw e
      }
    });

    test('Error Case - Unknown', async () => {
      try {
        await errorTest({
          ...spec,
          ErrorClass: codes.ERROR_UNKNOWN
        })
      } catch (e) {
        throw e
      }
    })

  });

  describe('createRendition', () => {
    let spec
    let apiParameters
    let apiOptions
    let sdkArgs
    let returnValue
    let jobStatus
    beforeEach(async () => {

      apiParameters = { 'x-gw-ims-org-id': gOrgId }
      apiOptions = createSwaggerOptions({
        inputs: await sdkClient.fileResolver.resolveInputs('input'),
        outputs: await sdkClient.fileResolver.resolveOutputs('outputs'),
      })
      sdkArgs = ['input', 'outputs']

      spec = {
        fullyQualifiedApiName: 'photoshop.createRendition',
        apiParameters: apiParameters,
        apiOptions: apiOptions,
        sdkFunctionName: 'createRendition',
        sdkArgs: sdkArgs,
      }

      returnValue = {
        "body": {
          "_links": {
            "self": { "href": "https://image.adobe.io/sensei/status/f54e0fcb-260b-47c3-b520-de0d17dc2b67" }
          }
        }
      }

      jobStatus = {
        "jobID": "createRenditionSucceededJobId",
        "status": "succeeded",
        "input": "/files/images/input.jpg",
        "output": {
          "storage": "adobe",
          "href": "/files/createRendition/output/createRendition.png",
          "mask": {
            "format": "binary"
          },
          "color": {
            "space": "rgb"
          }
        },
        "_links": {
          "self": {
            "href": "https://image.adobe.io/sensei/status/createRenditionSucceededStatusId"
          }
        }
      }
    });

    test('Success Case', async () => {
      try {
        await standardTest({
          ...spec,
          returnValue: returnValue,
          httpResponseBody: jobStatus
        })
      } catch (e) {
        throw e
      }
    });

    test('Failure Case', async () => {
      try {

        jobStatus.status = "failed"

        await standardTest({
          ...spec,
          returnValue: returnValue,
          httpResponseBody: jobStatus,
          status: 'failed'
        })
      } catch (e) {
        throw e
      }
    });

    test('Error Case - Unknown', async () => {
      try {
        await errorTest({
          ...spec,
          ErrorClass: codes.ERROR_UNKNOWN
        })
      } catch (e) {
        throw e
      }
    })

  });

  describe('replaceSmartObject', () => {
    let spec
    let apiParameters
    let apiOptions
    let sdkArgs
    let returnValue
    let jobStatus
    beforeEach(async () => {

      apiParameters = { 'x-gw-ims-org-id': gOrgId }
      apiOptions = createSwaggerOptions({
        inputs: await sdkClient.fileResolver.resolveInputs('input'),
        outputs: await sdkClient.fileResolver.resolveOutputs('outputs'),
        options: await sdkClient.fileResolver.resolveInputsDocumentOptions('options')
      })
      sdkArgs = ['input', 'outputs', 'options']

      spec = {
        fullyQualifiedApiName: 'photoshop.replaceSmartObject',
        apiParameters: apiParameters,
        apiOptions: apiOptions,
        sdkFunctionName: 'replaceSmartObject',
        sdkArgs: sdkArgs,
      }

      returnValue = {
        "body": {
          "_links": {
            "self": { "href": "https://image.adobe.io/sensei/status/f54e0fcb-260b-47c3-b520-de0d17dc2b67" }
          }
        }
      }

      jobStatus = {
        "jobID": "replaceSmartObjectSucceededJobId",
        "status": "succeeded",
        "input": "/files/images/input.jpg",
        "output": {
          "storage": "adobe",
          "href": "/files/replaceSmartObject/output/replaceSmartObject.png",
          "mask": {
            "format": "binary"
          },
          "color": {
            "space": "rgb"
          }
        },
        "_links": {
          "self": {
            "href": "https://image.adobe.io/sensei/status/replaceSmartObjectSucceededStatusId"
          }
        }
      }
    });

    test('Success Case', async () => {
      try {
        await standardTest({
          ...spec,
          returnValue: returnValue,
          httpResponseBody: jobStatus
        })
      } catch (e) {
        throw e
      }
    });

    test('Failure Case', async () => {
      try {

        jobStatus.status = "failed"

        await standardTest({
          ...spec,
          returnValue: returnValue,
          httpResponseBody: jobStatus,
          status: 'failed'
        })
      } catch (e) {
        throw e
      }
    });

    test('Error Case - Unknown', async () => {
      try {
        await errorTest({
          ...spec,
          ErrorClass: codes.ERROR_UNKNOWN
        })
      } catch (e) {
        throw e
      }
    })

  });

  describe('applyPhotoshopActions', () => {
    let spec
    let apiParameters
    let apiOptions
    let sdkArgs
    let returnValue
    let jobStatus
    beforeEach(async () => {

      apiParameters = { 'x-gw-ims-org-id': gOrgId }
      apiOptions = createSwaggerOptions({
        inputs: await sdkClient.fileResolver.resolveInputs('input'),
        outputs: await sdkClient.fileResolver.resolveOutputs('outputs'),
        options: await sdkClient.fileResolver.resolveInputsDocumentOptions('options')
      })
      sdkArgs = ['input', 'outputs', 'options']

      spec = {
        fullyQualifiedApiName: 'photoshop.applyPhotoshopActions',
        apiParameters: apiParameters,
        apiOptions: apiOptions,
        sdkFunctionName: 'applyPhotoshopActions',
        sdkArgs: sdkArgs,
      }

      returnValue = {
        "body": {
          "_links": {
            "self": { "href": "https://image.adobe.io/sensei/status/f54e0fcb-260b-47c3-b520-de0d17dc2b67" }
          }
        }
      }

      jobStatus = {
        "jobID": "applyPhotoshopActionsSucceededJobId",
        "status": "succeeded",
        "input": "/files/images/input.jpg",
        "output": {
          "storage": "adobe",
          "href": "/files/applyPhotoshopActions/output/applyPhotoshopActions.png",
          "mask": {
            "format": "binary"
          },
          "color": {
            "space": "rgb"
          }
        },
        "_links": {
          "self": {
            "href": "https://image.adobe.io/sensei/status/applyPhotoshopActionsSucceededStatusId"
          }
        }
      }
    });

    test('Success Case', async () => {
      try {
        await standardTest({
          ...spec,
          returnValue: returnValue,
          httpResponseBody: jobStatus
        })
      } catch (e) {
        throw e
      }
    });

    test('Failure Case', async () => {
      try {

        jobStatus.status = "failed"

        await standardTest({
          ...spec,
          returnValue: returnValue,
          httpResponseBody: jobStatus,
          status: 'failed'
        })
      } catch (e) {
        throw e
      }
    });

    test('Error Case - Unknown', async () => {
      try {
        await errorTest({
          ...spec,
          ErrorClass: codes.ERROR_UNKNOWN
        })
      } catch (e) {
        throw e
      }
    })

  });

});