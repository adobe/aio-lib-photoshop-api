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

const {
  BlobServiceClient,
  StorageSharedKeyCredential,
  generateBlobSASQueryParameters,
  SASProtocol,
  BlobSASPermissions
} = require('@azure/storage-blob')

/**
 * Abstraction around an Azure container that follows the aio-lib-files interface.
 * This is intended to be replaced when aio-lib-files can be used again in a local environment.
 */
class AzureContainer {
  constructor (containerClient, sharedKeyCredential) {
    this.containerClient = containerClient
    this.sharedKeyCredential = sharedKeyCredential
  }

  /**
   * Copy a blob to/from the container
   *
   * @param {string} srcPath Source path
   * @param {string} destPath Destination path
   * @param {object} [options] Copy options
   * @param {boolean} [options.localSrc=false] Source path is local on disk
   * @param {boolean} [options.localDest=false] Destination path is local on disk
   */
  async copy (srcPath, destPath, options) {
    const localSrc = options && options.localSrc
    const localDest = options && options.localDest
    if (localSrc && !localDest) {
      const destClient = this.containerClient.getBlockBlobClient(destPath)
      await destClient.uploadFile(srcPath)
    } else if (!localSrc && localDest) {
      const srcClient = this.containerClient.getBlockBlobClient(srcPath)
      await srcClient.downloadToFile(destPath)
    } else if (!localSrc && !localDest) {
      const srcClient = this.containerClient.getBlockBlobClient(srcPath)
      const destClient = this.containerClient.getBlockBlobClient(destPath)
      const copyPoller = destClient.beginCopyFromURL(srcClient.url)
      await copyPoller.pollUntilDone()
    } else {
      throw Error(`Local copy not supported: ${srcPath} ${destPath}`)
    }
  }

  /**
   * Generate a presigned url
   *
   * @param {string} blobName Name of the blob
   * @param {object} options Presign options
   * @param {string} [options.permissions='r'] Permission of the URL
   * @param {number} options.expiryInSeconds Expiration time in seconds
   * @returns {string} presigned url
   */
  async generatePresignURL (blobName, options) {
    const ttl = options.expiryInSeconds * 1000
    const perm = options.permissions || 'r'

    const permissions = new BlobSASPermissions()
    permissions.read = (perm.indexOf('r') >= 0)
    permissions.write = (perm.indexOf('w') >= 0)
    permissions.delete = (perm.indexOf('d') >= 0)

    const blobClient = this.containerClient.getBlockBlobClient(blobName)
    const query = generateBlobSASQueryParameters({
      protocol: SASProtocol.Https,
      expiresOn: new Date(Date.now() + ttl),
      containerName: this.containerClient.containerName,
      blobName,
      permissions
    }, this.sharedKeyCredential).toString()

    return `${blobClient.url}?${query}`
  }
}

/**
 * Initialize storage for e2e testing
 *
 * @returns {AzureContainer} Storage container
 */
async function init () {
  const accountKey = process.env.PHOTOSHOP_AZURE_ACCOUNT_KEY
  const accountName = process.env.PHOTOSHOP_AZURE_ACCOUNT_NAME
  const containerName = process.env.PHOTOSHOP_AZURE_CONTAINER_NAME

  const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey)
  const blobServiceClient = new BlobServiceClient(
    `https://${accountName}.blob.core.windows.net`,
    sharedKeyCredential
  )

  const containerClient = blobServiceClient.getContainerClient(containerName)
  return new AzureContainer(containerClient, sharedKeyCredential)
}

module.exports = {
  init
}
