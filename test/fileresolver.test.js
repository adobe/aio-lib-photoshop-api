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

const { FileResolver } = require('../src/fileresolver')

test('resolveInput', async () => {
  const resolver = new FileResolver()
  const result = await resolver.resolveInput({
    href: 'https://host/path/to/image.png',
    storage: 'external'
  })
  expect(result).toEqual({
    href: 'https://host/path/to/image.png',
    storage: 'external'
  })
})

test('resolveOutput', async () => {
  const resolver = new FileResolver()
  const result = await resolver.resolveOutput({
    href: 'https://host/path/to/image.png',
    storage: 'external',
    type: 'image/png'
  })
  expect(result).toEqual({
    href: 'https://host/path/to/image.png',
    storage: 'external',
    type: 'image/png'
  })
})

test('resolveInputAdobeAbsPath', async () => {
  const resolver = new FileResolver()
  const result = await resolver.resolveInput('/path/to/file')
  expect(result).toEqual({
    href: '/path/to/file',
    storage: 'adobe'
  })
})

test('resolveInputAdobeRelPath', async () => {
  const resolver = new FileResolver()
  const result = await resolver.resolveInput('path/to/file')
  expect(result).toEqual({
    href: 'path/to/file',
    storage: 'adobe'
  })
})

test('defaultAdobeCloudPaths', async () => {
  const resolver = new FileResolver({
    generatePresignURL: (href, { permissions, expiryInSeconds }) => {
      return `https://host/${permissions}/${expiryInSeconds}/${href}`
    }
  }, {
    defaultAdobeCloudPaths: true
  })
  const result = await resolver.resolveInput('path/to/file')
  expect(result).toEqual({
    href: 'path/to/file',
    storage: 'adobe'
  })
})

test('resolveInputAIOAbsPath', async () => {
  const resolver = new FileResolver({
    generatePresignURL: (href, { permissions, expiryInSeconds }) => {
      return `https://host/${permissions}/${expiryInSeconds}/${href}`
    }
  })
  const result = await resolver.resolveInput('/path/to/file')
  expect(result).toEqual({
    href: 'https://host/r/3600//path/to/file',
    storage: 'external'
  })
})

test('resolveInputAIORelPath', async () => {
  const resolver = new FileResolver({
    generatePresignURL: (href, { permissions, expiryInSeconds }) => {
      return `https://host/${permissions}/${expiryInSeconds}/${href}`
    }
  })
  const result = await resolver.resolveInput('path/to/file')
  expect(result).toEqual({
    href: 'https://host/r/3600/path/to/file',
    storage: 'external'
  })
})

test('resolveInputAzureUrl', async () => {
  const resolver = new FileResolver()
  const result = await resolver.resolveInput('https://accountName.blob.core.windows.net/containerName')
  expect(result).toEqual({
    href: 'https://accountName.blob.core.windows.net/containerName',
    storage: 'azure'
  })
})

test('resolveInputDropboxUrl', async () => {
  const resolver = new FileResolver()
  const result = await resolver.resolveInput('https://content.dropboxapi.com/xyz')
  expect(result).toEqual({
    href: 'https://content.dropboxapi.com/xyz',
    storage: 'dropbox'
  })
})

test('resolveInputExternalUrl', async () => {
  const resolver = new FileResolver()
  const result = await resolver.resolveInput('https://www.adobe.com')
  expect(result).toEqual({
    href: 'https://www.adobe.com',
    storage: 'external'
  })
})

test('resolveInputHrefAdobeAbsPath', async () => {
  const resolver = new FileResolver()
  const result = await resolver.resolveInput({ href: '/path/to/file' })
  expect(result).toEqual({
    href: '/path/to/file',
    storage: 'adobe'
  })
})

test('resolveInputHrefAdobeRelPath', async () => {
  const resolver = new FileResolver()
  const result = await resolver.resolveInput({ href: 'path/to/file' })
  expect(result).toEqual({
    href: 'path/to/file',
    storage: 'adobe'
  })
})

test('resolveInputHrefAIOPath', async () => {
  const resolver = new FileResolver({
    generatePresignURL: (href, { permissions, expiryInSeconds }) => {
      return `https://host/${permissions}/${expiryInSeconds}/${href}`
    }
  })
  const result = await resolver.resolveInput({ href: 'path/to/file' })
  expect(result).toEqual({
    href: 'https://host/r/3600/path/to/file',
    storage: 'external'
  })
})

test('resolveInputHrefAzureUrl', async () => {
  const resolver = new FileResolver()
  const result = await resolver.resolveInput({ href: 'https://accountName.blob.core.windows.net/containerName' })
  expect(result).toEqual({
    href: 'https://accountName.blob.core.windows.net/containerName',
    storage: 'azure'
  })
})

test('resolveInputHrefDropboxUrl', async () => {
  const resolver = new FileResolver()
  const result = await resolver.resolveInput({ href: 'https://content.dropboxapi.com/xyz' })
  expect(result).toEqual({
    href: 'https://content.dropboxapi.com/xyz',
    storage: 'dropbox'
  })
})

test('resolveInputHrefExternalUrl', async () => {
  const resolver = new FileResolver()
  const result = await resolver.resolveInput({ href: 'https://www.adobe.com' })
  expect(result).toEqual({
    href: 'https://www.adobe.com',
    storage: 'external'
  })
})

test('resolveInputNoHref', async () => {
  await expect(new FileResolver()
    .resolveInput({ })
  ).rejects.toThrow(Error('Missing href: {}'))
})

test('resolveInputNull', async () => {
  await expect(new FileResolver()
    .resolveInput(null)
  ).rejects.toThrow(Error('No file provided'))
})

test('resolveInputUndefined', async () => {
  await expect(new FileResolver()
    .resolveInput()
  ).rejects.toThrow(Error('No file provided'))
})

test('resolveOutputTypeDng', async () => {
  const resolver = new FileResolver()
  const result = await resolver.resolveOutput('/path/to/file.dng')
  expect(result).toEqual({
    href: '/path/to/file.dng',
    storage: 'adobe',
    type: 'image/x-adobe-dng'
  })
})

test('resolveOutputTypeJpg', async () => {
  const resolver = new FileResolver()
  const result = await resolver.resolveOutput('/path/to/file.jpg')
  expect(result).toEqual({
    href: '/path/to/file.jpg',
    storage: 'adobe',
    type: 'image/jpeg'
  })
})

test('resolveOutputTypeJpeg', async () => {
  const resolver = new FileResolver()
  const result = await resolver.resolveOutput('/path/to/file.jpeg')
  expect(result).toEqual({
    href: '/path/to/file.jpeg',
    storage: 'adobe',
    type: 'image/jpeg'
  })
})

test('resolveOutputTypePng', async () => {
  const resolver = new FileResolver()
  const result = await resolver.resolveOutput('/path/to/file.png')
  expect(result).toEqual({
    href: '/path/to/file.png',
    storage: 'adobe',
    type: 'image/png'
  })
})

test('resolveOutputTypePsb', async () => {
  const resolver = new FileResolver()
  const result = await resolver.resolveOutput('/path/to/file.psb')
  expect(result).toEqual({
    href: '/path/to/file.psb',
    storage: 'adobe',
    type: 'image/vnd.adobe.photoshop'
  })
})

test('resolveOutputTypePsd', async () => {
  const resolver = new FileResolver()
  const result = await resolver.resolveOutput('/path/to/file.psd')
  expect(result).toEqual({
    href: '/path/to/file.psd',
    storage: 'adobe',
    type: 'image/vnd.adobe.photoshop'
  })
})

test('resolveOutputTypeTif', async () => {
  const resolver = new FileResolver()
  const result = await resolver.resolveOutput('/path/to/file.tif')
  expect(result).toEqual({
    href: '/path/to/file.tif',
    storage: 'adobe',
    type: 'image/tiff'
  })
})

test('resolveOutputTypeTiff', async () => {
  const resolver = new FileResolver()
  const result = await resolver.resolveOutput('/path/to/file.tiff')
  expect(result).toEqual({
    href: '/path/to/file.tiff',
    storage: 'adobe',
    type: 'image/tiff'
  })
})

test('resolveOutputTypeUnknown', async () => {
  const resolver = new FileResolver()
  const result = await resolver.resolveOutput('/path/to/file.xxx')
  expect(result).toEqual({
    href: '/path/to/file.xxx',
    storage: 'adobe',
    type: 'image/png'
  })
})

test('resolveOutputTypeAIOPath', async () => {
  const resolver = new FileResolver({
    generatePresignURL: (href, { permissions, expiryInSeconds }) => {
      return `https://host/${permissions}/${expiryInSeconds}/${href}`
    }
  })
  const result = await resolver.resolveOutput({ href: 'path/to/file.png' })
  expect(result).toEqual({
    href: 'https://host/rwd/3600/path/to/file.png',
    storage: 'external',
    type: 'image/png'
  })
})

test('resolveOutputTypeAzureUrl', async () => {
  const resolver = new FileResolver()
  const result = await resolver.resolveOutput({ href: 'https://accountName.blob.core.windows.net/containerName/file.png' })
  expect(result).toEqual({
    href: 'https://accountName.blob.core.windows.net/containerName/file.png',
    storage: 'azure',
    type: 'image/png'
  })
})

test('resolveOutputExternalUrl', async () => {
  const resolver = new FileResolver()
  const result = await resolver.resolveOutput({ href: 'https://host/path/to/file.png' })
  expect(result).toEqual({
    href: 'https://host/path/to/file.png',
    storage: 'external',
    type: 'image/png'
  })
})

test('resolveInputsDocumentOptionsUndefined', async () => {
  const resolver = new FileResolver()
  const result = await resolver.resolveInputsDocumentOptions()
  expect(result).toEqual(undefined)
})

test('resolveInputsDocumentOptionsFonts', async () => {
  const resolver = new FileResolver()
  const result = await resolver.resolveInputsDocumentOptions({
    fonts: ['https://host/path/to/font.ttf']
  })
  expect(result).toEqual({
    fonts: [{
      href: 'https://host/path/to/font.ttf',
      storage: 'external'
    }]
  })
})

test('resolveInputsDocumentOptionsLayersNoInput', async () => {
  const resolver = new FileResolver()
  const result = await resolver.resolveInputsDocumentOptions({
    layers: [{}]
  })
  expect(result).toEqual({
    layers: [{}]
  })
})

test('resolveInputsDocumentOptionsLayersInput', async () => {
  const resolver = new FileResolver()
  const result = await resolver.resolveInputsDocumentOptions({
    layers: [{
      input: 'https://host/path/to/image.png'
    }]
  })
  expect(result).toEqual({
    layers: [{
      input: {
        href: 'https://host/path/to/image.png',
        storage: 'external'
      }
    }]
  })
})

test('resolveInputsPhotoshopActionsOptionsUndefined', async () => {
  const resolver = new FileResolver()
  const result = await resolver.resolveInputsPhotoshopActionsOptions()
  expect(result).toEqual(undefined)
})

test('resolveInputsPhotoshopActionsOptionsActions', async () => {
  const resolver = new FileResolver()
  const result = await resolver.resolveInputsPhotoshopActionsOptions({
    actions: ['https://host/path/to/action.atn']
  })
  expect(result).toEqual({
    actions: [{
      href: 'https://host/path/to/action.atn',
      storage: 'external'
    }]
  })
})

test('resolveInputsPhotoshopActionsOptionsFonts', async () => {
  const resolver = new FileResolver()
  const result = await resolver.resolveInputsPhotoshopActionsOptions({
    fonts: ['https://host/path/to/font.ttf']
  })
  expect(result).toEqual({
    fonts: [{
      href: 'https://host/path/to/font.ttf',
      storage: 'external'
    }]
  })
})

test('resolveInputsPhotoshopActionsOptionsPatterns', async () => {
  const resolver = new FileResolver()
  const result = await resolver.resolveInputsPhotoshopActionsOptions({
    patterns: ['https://host/path/to/pattern.pat']
  })
  expect(result).toEqual({
    patterns: [{
      href: 'https://host/path/to/pattern.pat',
      storage: 'external'
    }]
  })
})

test('resolveInputsPhotoshopActionsOptionsBrushes', async () => {
  const resolver = new FileResolver()
  const result = await resolver.resolveInputsPhotoshopActionsOptions({
    brushes: ['https://host/path/to/brush.abr']
  })
  expect(result).toEqual({
    brushes: [{
      href: 'https://host/path/to/brush.abr',
      storage: 'external'
    }]
  })
})

test('resolveInputsPhotoshopActionsJsonOptionsAdditionalImages', async () => {
  const resolver = new FileResolver()
  const result = await resolver.resolveInputsPhotoshopActionsOptions({
    additionalImages: ['https://host/path/to/additional_image.png']
  })
  expect(result).toEqual({
    additionalImages: [{
      href: 'https://host/path/to/additional_image.png',
      storage: 'external'
    }]
  })
})

test('resolveInputsValue', async () => {
  const resolver = new FileResolver()
  const result = await resolver.resolveInputs('https://host/path/to/file.png')
  expect(result).toEqual([{
    href: 'https://host/path/to/file.png',
    storage: 'external'
  }])
})

test('resolveInputsArray', async () => {
  const resolver = new FileResolver()
  const result = await resolver.resolveInputs([
    'https://host/path/to/file.png',
    'https://accountName.blob.core.windows.net/containerName/file.png'
  ])
  expect(result).toEqual([{
    href: 'https://host/path/to/file.png',
    storage: 'external'
  }, {
    href: 'https://accountName.blob.core.windows.net/containerName/file.png',
    storage: 'azure'
  }])
})

test('resolveOutputsValue', async () => {
  const resolver = new FileResolver()
  const result = await resolver.resolveOutputs('https://host/path/to/file.png')
  expect(result).toEqual([{
    href: 'https://host/path/to/file.png',
    storage: 'external',
    type: 'image/png'
  }])
})

test('resolveOutputsArray', async () => {
  const resolver = new FileResolver()
  const result = await resolver.resolveOutputs([
    'https://host/path/to/file.png',
    'https://accountName.blob.core.windows.net/containerName/file.png'
  ])
  expect(result).toEqual([{
    href: 'https://host/path/to/file.png',
    storage: 'external',
    type: 'image/png'
  }, {
    href: 'https://accountName.blob.core.windows.net/containerName/file.png',
    storage: 'azure',
    type: 'image/png'
  }])
})
