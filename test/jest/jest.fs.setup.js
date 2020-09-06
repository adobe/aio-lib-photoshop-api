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

/* global fakeFileSystem */

const fileSystem = require('jest-plugin-fs').default

// dont touch the real fs
jest.mock('fs', () => require('jest-plugin-fs/mock'))

// set the fake filesystem
global.fakeFileSystem = {
  addJson: (json) => {
    // add to existing
    fileSystem.mock(json)
  },
  removeKeys: (arr) => {
    // remove from existing
    const files = fileSystem.files()
    for (const prop in files) {
      if (arr.includes(prop)) {
        delete files[prop]
      }
    }
    fileSystem.restore()
    fileSystem.mock(files)
  },
  clear: () => {
    // reset to empty
    fileSystem.restore()
  },
  reset: () => {
    // reset file system
    // TODO: add any defaults
    fileSystem.restore()
  },
  files: () => {
    return fileSystem.files()
  }
}
// seed the fake filesystem
fakeFileSystem.reset()
