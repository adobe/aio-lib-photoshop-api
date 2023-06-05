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
const path = require('path')
const validUrl = require('valid-url')
const { Storage, MimeType } = require('./types')
require('./types')

/* global File Input Output CreateDocumentOptions ModifyDocumentOptions ReplaceSmartObjectOptions ApplyPhotoshopActionsOptions */

const ExtensionMimeTypeMap = {
  '.dng': MimeType.DNG,
  '.jpg': MimeType.JPEG,
  '.jpeg': MimeType.JPEG,
  '.png': MimeType.PNG,
  '.psb': MimeType.PSD,
  '.psd': MimeType.PSD,
  '.tif': MimeType.TIFF,
  '.tiff': MimeType.TIFF
}

/**
 * Determine the desired format type based on the extension.
 * Defaults to `image/png` if the type can't be determined.
 *
 * @private
 * @param {Output} output Output file
 * @returns {Output} detected mime type
 */
function resolveMimeType (output) {
  if (!output.type) {
    let pathname = output.href
    if (validUrl.isWebUri(output.href)) {
      ({ pathname } = new URL(output.href))
      pathname = decodeURIComponent(pathname)
    }
    output.type = ExtensionMimeTypeMap[path.extname(pathname)] || MimeType.PNG
  }
  return output
}

/**
 * Determine the proper storage type based on the hostname of a URL
 *
 * @private
 * @param {string} href https url to check
 * @returns {Storage} Auto-detected storage
 */
function getStorageFromUrl (href) {
  const { hostname } = new URL(href)
  if (hostname.endsWith('.blob.core.windows.net') || hostname.endsWith('.azureedge.net')) {
    return Storage.AZURE
  } else if (hostname === 'content.dropboxapi.com') {
    return Storage.DROPBOX
  } else {
    return Storage.EXTERNAL
  }
}

/**
 * @typedef {object} FileResolverOptions
 * @description File resolver options
 * @property {number} [presignExpiryInSeconds=3600] Expiry time of any presigned urls, defaults to 1 hour
 * @property {boolean} [defaultAdobeCloudPaths] True if paths should be considered references to files in Creative Cloud
 */

/**
 * Resolves the storage and mime type of files referenced in the API.
 *
 * The storage type storage type is resolved for input and output files using the following heuristic:
 *
 * - If the storage type is provided, it is used as-is
 * - If a URL is provided, the hostname is inspected to determine Azure, Dropbox, or External (default)
 * - If a path is provided, the path resolved to Adobe I/O Files if an instance is provided to the constructor, otherwise it's Creative Cloud
 *
 * Path resolution can be overridden by the `defaultAdobeCloudPaths` option.
 *
 * The mime-type is resolved based on the extension of the pathname of the URL or the path. If no extension can
 * be found or the extension is unknown, the default `image/png` is selected.
 */
class FileResolver {
  /**
   * Construct a file resolver
   *
   * @param {*} [files] Adobe I/O Files instance
   * @param {FileResolverOptions} [options] Options
   */
  constructor (files, options) {
    /**
     * Adobe I/O Files instance
     *
     * @private
     */
    this.files = files

    /**
     * Expiry time of presigned urls in seconds
     *
     * @type {number}
     */
    this.presignExpiryInSeconds = (options && options.presignExpiryInSeconds) || 3600

    /**
     * Plain paths can reference either Adobe Creative Cloud or Adobe I/O Files.
     *
     * If an instance of files is provided, the default is considered to be
     * Adobe I/O Files, otherwise it's Creative Cloud. The default can be overridden
     * using the options
     *
     * @type {Storage}
     */
    this.defaultPathStorage = files ? Storage.AIO : Storage.ADOBE
    if (options && options.defaultAdobeCloudPaths) {
      this.defaultPathStorage = Storage.ADOBE
    }
  }

  /**
   * Auto-detect the storage associated with the href
   *
   * @private
   * @param {Input|Output} file Input or output reference
   * @param {'r'|'rwd'} permissions Permissions required for file
   * @returns {Input|Output} Resolved input or output reference with storage
   */
  async __resolveStorage (file, permissions) {
    if (validUrl.isWebUri(file.href)) {
      return Object.assign({}, file, {
        storage: getStorageFromUrl(file.href)
      })
    } else if (this.defaultPathStorage === Storage.AIO) {
      const href = await this.files.generatePresignURL(file.href, {
        permissions,
        expiryInSeconds: this.presignExpiryInSeconds
      })
      return Object.assign({}, file, {
        href,
        storage: getStorageFromUrl(href)
      })
    } else {
      return Object.assign({}, file, {
        storage: this.defaultPathStorage
      })
    }
  }

  /**
   * Resolve file from href to an object with href and storage
   *
   * @private
   * @param {string|Input|Output} file Input, output, or href to resolve
   * @param {'r'|'rwd'} permissions Permissions required for file
   * @returns {Input|Output} resolved input or output with storage
   */
  async __resolveFile (file, permissions) {
    if (!file) {
      throw Error('No file provided')
    } else if (typeof file === 'string') {
      return this.__resolveStorage({
        href: file
      }, permissions)
    } else if (!file.href) {
      throw Error(`Missing href: ${JSON.stringify(file)}`)
    } else if (!file.storage) {
      return this.__resolveStorage(file, permissions)
    } else {
      return file
    }
  }

  /**
   * Resolve files from href to an object with href and storage
   *
   * @private
   * @param {string|string[]|Input|Input[]|Output|Output[]} files One or more files
   * @param {'r'|'rwd'} permissions Permissions required for file
   * @returns {Input[]|Output[]} resolved files
   */
  async __resolveFiles (files, permissions) {
    if (Array.isArray(files)) {
      return Promise.all(files.map(file => this.__resolveFile(file, permissions)))
    } else {
      const resolvedFile = await this.__resolveFile(files, permissions)
      return [resolvedFile]
    }
  }

  /**
   * Resolve input file from href to an object with href and storage
   *
   * @param {string|Input} input Input or href to resolve
   * @returns {Input} resolved input
   */
  async resolveInput (input) {
    return this.__resolveFile(input, 'r')
  }

  /**
   * Resolve input files from hrefs to an array of objects with href and storage
   *
   * @param {string|string[]|Input|Input[]} inputs One or more files
   * @returns {Input[]} resolved files
   */
  async resolveInputs (inputs) {
    return this.__resolveFiles(inputs, 'r')
  }

  /**
   * Resolve the font and layer inputs in the document options
   *
   * @param {CreateDocumentOptions|ModifyDocumentOptions|ReplaceSmartObjectOptions} options Document options
   * @returns {CreateDocumentOptions|ModifyDocumentOptions|ReplaceSmartObjectOptions} Document options
   */
  async resolveInputsDocumentOptions (options) {
    if (options && options.fonts) {
      options.fonts = await this.resolveInputs(options.fonts)
    }
    if (options && options.layers) {
      options.layers = await Promise.all(options.layers.map(async layer => {
        if (layer.input) {
          layer.input = await this.resolveInput(layer.input)
        }
        return layer
      }))
    }
    return options
  }

  /**
   * Resolve the actions, fonts, and custom presets options
   *
   * @param {ApplyPhotoshopActionsOptions} options Photoshop Actions options
   * @returns {ApplyPhotoshopActionsOptions} Photoshop Actions options
   */
  async resolveInputsPhotoshopActionsOptions (options) {
    if (options && options.actions) {
      options.actions = await this.resolveInputs(options.actions)
    }
    if (options && options.fonts) {
      options.fonts = await this.resolveInputs(options.fonts)
    }
    if (options && options.patterns) {
      options.patterns = await this.resolveInputs(options.patterns)
    }
    if (options && options.brushes) {
      options.brushes = await this.resolveInputs(options.brushes)
    }
    if (options && options.additionalImages) {
      options.additionalImages = await this.resolveInputs(options.additionalImages)
    }
    return options
  }

  /**
   * Resolve output from href to an object with href, storage, and type
   *
   * @param {string|File|Output} output One or more output files
   * @returns {Output} resolved files
   */
  async resolveOutput (output) {
    return resolveMimeType(
      await this.__resolveFile(output, 'rwd')
    )
  }

  /**
   * Resolve outputs from href to an object with href, storage, and type
   *
   * @param {string|string[]|File|File[]|Output|Output[]} outputs One or more output files
   * @returns {Output[]} resolved files
   */
  async resolveOutputs (outputs) {
    const resolvedFiles = await this.__resolveFiles(outputs, 'rwd')
    return resolvedFiles.map(output => resolveMimeType(output))
  }
}

module.exports = {
  FileResolver
}
