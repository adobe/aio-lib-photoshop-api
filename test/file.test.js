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

const { FileResolver } = require('../src/fileresolver')
const { Storage } = require('../src/types')

test('resolveAdobeAbsPath', async () => {
  const resolver = new FileResolver()
  const result = await resolver.resolveInput('/path/to/file')
  expect(result).toEqual({
    href: '/path/to/file',
    storage: 'adobe'
  })
})

test('resolveAdobeRelPath', async () => {
  const resolver = new FileResolver()
  const result = await resolver.resolveInput('path/to/file')
  expect(result).toEqual({
    href: 'path/to/file',
    storage: 'adobe'
  })
})

test('resolveAIOAbsPath', async () => {
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

test('resolveAIORelPath', async () => {
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

test('resolveAzureUrl', async () => {
  const resolver = new FileResolver()
  const result = await resolver.resolveInput('https://accountName.blob.core.windows.net/containerName')
  expect(result).toEqual({
    href: 'https://accountName.blob.core.windows.net/containerName',
    storage: 'azure'
  })
})

test('resolveDropboxUrl', async () => {
  const resolver = new FileResolver()
  const result = await resolver.resolveInput('https://content.dropboxapi.com/xyz')
  expect(result).toEqual({
    href: 'https://content.dropboxapi.com/xyz',
    storage: 'dropbox'
  })
})

test('resolveExternalUrl', async () => {
  const resolver = new FileResolver()
  const result = await resolver.resolveInput('https://www.adobe.com')
  expect(result).toEqual({
    href: 'https://www.adobe.com',
    storage: 'external'
  })
})

test('resolveHrefAdobeAbsPath', async () => {
  const resolver = new FileResolver()
  const result = await resolver.resolveInput({ href: '/path/to/file' })
  expect(result).toEqual({
    href: '/path/to/file',
    storage: 'adobe'
  })
})

test('resolveHrefAdobeRelPath', async () => {
  const resolver = new FileResolver()
  const result = await resolver.resolveInput({ href: 'path/to/file' })
  expect(result).toEqual({
    href: 'path/to/file',
    storage: 'adobe'
  })
})

test('resolveHrefAIOPath', async () => {
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

test('resolveHrefAzureUrl', async () => {
  const resolver = new FileResolver()
  const result = await resolver.resolveInput({ href: 'https://accountName.blob.core.windows.net/containerName' })
  expect(result).toEqual({
    href: 'https://accountName.blob.core.windows.net/containerName',
    storage: 'azure'
  })
})

test('resolveHrefDropboxUrl', async () => {
  const resolver = new FileResolver()
  const result = await resolver.resolveInput({ href: 'https://content.dropboxapi.com/xyz' })
  expect(result).toEqual({
    href: 'https://content.dropboxapi.com/xyz',
    storage: 'dropbox'
  })
})

test('resolveHrefExternalUrl', async () => {
  const resolver = new FileResolver()
  const result = await resolver.resolveInput({ href: 'https://www.adobe.com' })
  expect(result).toEqual({
    href: 'https://www.adobe.com',
    storage: 'external'
  })
})

test('resolveFileNoHref', async () => {
  await expect(new FileResolver()
    .resolveInput({ })
  ).rejects.toThrow(Error('Missing href: {}'))
})

test('resolveFileNull', async () => {
  await expect(new FileResolver()
    .resolveInput(null)
  ).rejects.toThrow(Error('No file provided'))
})

test('resolveFileUndefined', async () => {
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
