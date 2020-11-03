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

const sleep = require('util').promisify(setTimeout)
require('./types')

/**
 * Acquire the status url from a response
 *
 * @param {*} response Service response
 * @returns {string} status url
 */
function getStatusUrl (response) {
  if (typeof response === 'string') {
    // temporary fallback
    return response
  } else {
    return response._links && response._links.self && response._links.self.href
  }
}

/**
 * Abstraction around the Photoshop Services Jobs
 */
class Job {
  /**
   * Construct a job with the ability to acquire status updates
   *
   * @param {string|*} response Initiate job response
   * @param {Function} getJobStatus Async function to get job status
   */
  constructor (response, getJobStatus) {
    this.getJobStatus = getJobStatus

    /**
     * URL to request a status update of the job
     *
     * @type {string}
     */
    this.url = getStatusUrl(response)

    /**
     * Job identifier
     *
     * @type {string}
     */
    this.jobId = ''

    /**
     * Status of each output sub job
     *
     * @type {JobOutput[]}
     */
    this.outputs = []
  }

  /**
   * Check if the job is done
   *
   * A job is marked done when it has either the `succeeded` or `failed` status.
   *
   * @returns {boolean} True if the job is done, or false if it is still pending/running
   */
  isDone () {
    for (const output of this.outputs) {
      if ((output.status !== 'succeeded') && (output.status !== 'failed')) {
        return false
      }
    }
    // return true if there was at least 1 output, otherwise poll hasn't been called yet
    return this.outputs.length > 0
  }

  /**
   * Poll for job status
   *
   * @returns {Job} Job instance
   */
  async poll () {
    const response = await this.getJobStatus(this.url)

    // Image cutout and mask APIs only support a single output, map the input, status, errors fields to
    // the same structure as Lightroom and Photoshop for consistency.
    this.outputs = response.outputs || []
    if (response.output) {
      this.outputs.push({
        input: response.input,
        status: response.status,
        _links: {
          self: response.output
        },
        errors: response.errors
      })
    }

    // Lightroom APIs provide created and modified in the root, but do have outputs
    if (response.created) {
      this.outputs.forEach(output => {
        output.created = response.created
      })
    }
    if (response.modified) {
      this.outputs.forEach(output => {
        output.modified = response.modified
      })
    }

    this.jobId = response.jobId || response.jobID
    this._links = response._links
    this.url = getStatusUrl(response)

    return this
  }

  /**
   * Poll job until done
   *
   * @param {number} [pollTimeMs=2000] Polling time
   * @returns {Job} Job instance
   */
  async pollUntilDone (pollTimeMs = 2000) {
    while (!this.isDone()) {
      await sleep(pollTimeMs)
      await this.poll()
    }
    return this
  }
}

module.exports = {
  Job
}
