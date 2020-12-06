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

const { Job } = require('../src/job')

test('missing-response', async () => {
  await expect(() => {
    // eslint-disable-next-line no-new
    new Job()
  }).toThrow('[PhotoshopSDK:ERROR_STATUS_URL_MISSING] Status URL is missing in the response: %s')
})

test('missing-links', async () => {
  await expect(() => {
    // eslint-disable-next-line no-new
    new Job({})
  }).toThrow('[PhotoshopSDK:ERROR_STATUS_URL_MISSING] Status URL is missing in the response: {}')
})

test('missing-self', async () => {
  await expect(() => {
    // eslint-disable-next-line no-new
    new Job({ _links: {} })
  }).toThrow('[PhotoshopSDK:ERROR_STATUS_URL_MISSING] Status URL is missing in the response: {"_links":{}}')
})

test('missing-href', async () => {
  await expect(() => {
    // eslint-disable-next-line no-new
    new Job({ _links: { self: {} } })
  }).toThrow('[PhotoshopSDK:ERROR_STATUS_URL_MISSING] Status URL is missing in the response: {"_links":{"self":{}}}')
})

test('valid-status-url', async () => {
  const job = new Job({ _links: { self: { href: 'http://host/status' } } })
  expect(job).toEqual({
    getJobStatus: undefined,
    jobId: '',
    outputs: [],
    url: 'http://host/status'
  })
})

test('done-no-outputs', async () => {
  const job = new Job({ _links: { self: { href: 'http://host/status' } } })
  expect(job.isDone()).toEqual(false)
})

test('done-single-output-nostatus', async () => {
  const job = new Job({ _links: { self: { href: 'http://host/status' } } })
  job.outputs = [{}]
  expect(job.isDone()).toEqual(false)
})

test('done-single-output-succeeded', async () => {
  const job = new Job({ _links: { self: { href: 'http://host/status' } } })
  job.outputs = [{ status: 'succeeded' }]
  expect(job.isDone()).toEqual(true)
})

test('done-single-output-failed', async () => {
  const job = new Job({ _links: { self: { href: 'http://host/status' } } })
  job.outputs = [{ status: 'failed' }]
  expect(job.isDone()).toEqual(true)
})

test('done-multi-output-incomplete1', async () => {
  const job = new Job({ _links: { self: { href: 'http://host/status' } } })
  job.outputs = [{ status: 'failed' }, { status: 'running' }]
  expect(job.isDone()).toEqual(false)
})

test('done-multi-output-incomplete2', async () => {
  const job = new Job({ _links: { self: { href: 'http://host/status' } } })
  job.outputs = [{ status: 'running' }, { status: 'failed' }]
  expect(job.isDone()).toEqual(false)
})

test('done-multi-output-complete1', async () => {
  const job = new Job({ _links: { self: { href: 'http://host/status' } } })
  job.outputs = [{ status: 'failed' }, { status: 'succeeded' }]
  expect(job.isDone()).toEqual(true)
})

test('done-multi-output-complete2', async () => {
  const job = new Job({ _links: { self: { href: 'http://host/status' } } })
  job.outputs = [{ status: 'succeeded' }, { status: 'failed' }]
  expect(job.isDone()).toEqual(true)
})

test('poll-response-no-output', async () => {
  const getJobStatus = () => ({})
  const job = new Job({
    _links: { self: { href: 'http://host/status' } }
  }, getJobStatus)
  await job.poll()
  expect(job).toEqual({
    _links: undefined,
    getJobStatus,
    jobId: undefined,
    outputs: [],
    url: 'http://host/status'
  })
})

test('poll-response-cutout-pending', async () => {
  const getJobStatus = () => ({
    jobID: 'c900e70c-03b2-43dc-b6f0-b0db16333b4b',
    status: 'pending',
    _links: {
      self: {
        href: 'https://image.adobe.io/sensei/status/c900e70c-03b2-43dc-b6f0-b0db16333b4b'
      }
    }
  })
  const job = new Job({
    _links: { self: { href: 'http://host/status' } }
  }, getJobStatus)
  await job.poll()
  expect(job).toEqual({
    _links: {
      self: {
        href: 'https://image.adobe.io/sensei/status/c900e70c-03b2-43dc-b6f0-b0db16333b4b'
      }
    },
    getJobStatus,
    jobId: 'c900e70c-03b2-43dc-b6f0-b0db16333b4b',
    outputs: [],
    url: 'http://host/status'
  })
})

test('poll-response-cutout-succeeded', async () => {
  const getJobStatus = () => ({
    jobID: 'c900e70c-03b2-43dc-b6f0-b0db16333b4b',
    status: 'succeeded',
    input: '/files/images/input.jpg',
    output: {
      storage: 'adobe',
      href: '/files/cutout/output/mask.png',
      mask: {
        format: 'binary'
      },
      color: {
        space: 'rgb'
      }
    },
    _links: {
      self: {
        href: 'https://image.adobe.io/sensei/status/c900e70c-03b2-43dc-b6f0-b0db16333b4b'
      }
    }
  })
  const job = new Job({
    _links: { self: { href: 'http://host/status' } }
  }, getJobStatus)
  await job.poll()
  expect(job).toEqual({
    _links: {
      self: {
        href: 'https://image.adobe.io/sensei/status/c900e70c-03b2-43dc-b6f0-b0db16333b4b'
      }
    },
    getJobStatus,
    jobId: 'c900e70c-03b2-43dc-b6f0-b0db16333b4b',
    outputs: [{
      status: 'succeeded',
      input: '/files/images/input.jpg',
      _links: {
        self: {
          storage: 'adobe',
          href: '/files/cutout/output/mask.png',
          mask: {
            format: 'binary'
          },
          color: {
            space: 'rgb'
          }
        }
      }
    }],
    url: 'http://host/status'
  })
})

test('poll-response-cutout-failed', async () => {
  const getJobStatus = () => ({
    jobID: 'c900e70c-03b2-43dc-b6f0-b0db16333b4b',
    status: 'failed',
    input: '/files/images/input.jpg',
    errors: {
      type: '<errorType>',
      code: '<errorCode>',
      title: '<errorDescription>',
      '<errorDetails>': [{
        name: '<paramName>',
        reason: '<error>'
      }]
    },
    _links: {
      self: {
        href: 'https://image.adobe.io/sensei/status/c900e70c-03b2-43dc-b6f0-b0db16333b4b'
      }
    }
  })
  const job = new Job({
    _links: { self: { href: 'http://host/status' } }
  }, getJobStatus)
  await job.poll()
  expect(job).toEqual({
    _links: {
      self: {
        href: 'https://image.adobe.io/sensei/status/c900e70c-03b2-43dc-b6f0-b0db16333b4b'
      }
    },
    getJobStatus,
    jobId: 'c900e70c-03b2-43dc-b6f0-b0db16333b4b',
    outputs: [{
      status: 'failed',
      input: '/files/images/input.jpg',
      errors: {
        type: '<errorType>',
        code: '<errorCode>',
        title: '<errorDescription>',
        '<errorDetails>': [{
          name: '<paramName>',
          reason: '<error>'
        }]
      }
    }],
    url: 'http://host/status'
  })
})

test('poll-autostraighten-success', async () => {
  const response = {
    jobId: 'f54e0fcb-260b-47c3-b520-de0d17dc2b67',
    created: '2018-01-04T12:57:15.12345:Z',
    modified: '2018-01-04T12:58:36.12345:Z',
    outputs: [{
      input: '/some_project/photo.jpg',
      status: 'pending'
    }],
    _links: {
      self: {
        href: 'https://image.adobe.io/lrService/status/f54e0fcb-260b-47c3-b520-de0d17dc2b67'
      }
    }
  }
  const getJobStatus = () => response
  const job = new Job({
    _links: { self: { href: 'http://host/status' } }
  }, getJobStatus)
  await job.poll()
  expect(job).toEqual({
    getJobStatus,
    url: 'http://host/status',
    _links: {
      self: {
        href: 'https://image.adobe.io/lrService/status/f54e0fcb-260b-47c3-b520-de0d17dc2b67'
      }
    },
    jobId: 'f54e0fcb-260b-47c3-b520-de0d17dc2b67',
    outputs: [{
      created: '2018-01-04T12:57:15.12345:Z',
      modified: '2018-01-04T12:58:36.12345:Z',
      input: '/some_project/photo.jpg',
      status: 'pending'
    }]
  })
})

test('poll-response-document-operations', async () => {
  const response = {
    jobId: 'f54e0fcb-260b-47c3-b520-de0d17dc2b67',
    outputs: [{
      input: '/files/some_project/design1.psd',
      status: 'pending',
      created: '2018-01-04T12:57:15.12345:Z',
      modified: '2018-01-04T12:58:36.12345:Z'
    }, {
      input: 'https://some-bucket-us-east-1.amazonaws.com/s3_presigned_getObject...',
      status: 'running',
      created: '2018-01-04T12:57:15.12345:Z',
      modified: '2018-01-04T12:58:36.12345:Z'
    }, {
      input: '/files/some_project/design2.psd',
      status: 'succeeded',
      created: '2018-01-04T12:57:15.12345:Z',
      modified: '2018-01-04T12:58:36.12345:Z',
      _links: {
        renditions: [{
          href: '/files/some_project/OUTPUT/design2_new.psd',
          storage: 'adobe',
          width: '500',
          type: 'image/jpeg',
          trimToCanvas: false,
          layers: [{
            id: 77
          }]
        }]
      }
    }, {
      input: 'https://some-bucket-us-east-1.amazonaws.com/s3_presigned_getObject...',
      status: 'failed',
      created: '2018-01-04T12:57:15.12345:Z',
      modified: '2018-01-04T12:58:36.12345:Z',
      error: {
        type: 'InputValidationError',
        title: "request parameters didn't validate",
        code: '400',
        invalidParams: [{
          name: 'contrast',
          reason: 'value must be an int between -150 and 150'
        }, {
          name: 'exposure',
          reason: 'must be bool'
        }]
      }
    }],
    _links: {
      self: {
        href: 'https://image.adobe.io/pie/psdService/status/f54e0fcb-260b-47c3-b520-de0d17dc2b67'
      }
    }
  }
  const getJobStatus = () => response
  const job = new Job({
    _links: { self: { href: 'http://host/status' } }
  }, getJobStatus)
  await job.poll()
  expect(job).toEqual({
    ...response,
    getJobStatus,
    url: 'http://host/status'
  })
})

test('poll-until-done-succeeded', async () => {
  let iteration = 0
  const getJobStatus = () => {
    if (iteration === 0) {
      ++iteration
      return {
        jobID: 'c900e70c-03b2-43dc-b6f0-b0db16333b4b',
        status: 'pending'
      }
    } else if (iteration === 1) {
      ++iteration
      return {
        jobID: 'c900e70c-03b2-43dc-b6f0-b0db16333b4b',
        status: 'succeeded',
        output: {
          storage: 'adobe',
          href: '/files/output.png'
        }
      }
    } else {
      throw Error('invalid call')
    }
  }

  const job = new Job({
    _links: { self: { href: 'http://host/status' } }
  }, getJobStatus)
  await job.pollUntilDone()
  expect(job).toEqual({
    getJobStatus,
    url: 'http://host/status',
    jobId: 'c900e70c-03b2-43dc-b6f0-b0db16333b4b',
    outputs: [{
      status: 'succeeded',
      _links: {
        self: {
          storage: 'adobe',
          href: '/files/output.png'
        }
      }
    }]
  })
})
