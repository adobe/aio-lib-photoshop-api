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

const { context, getToken } = require('@adobe/aio-lib-ims')
const { readFile } = require('fs-extra')

/**
 * Authenticate from a project file and private key
 *
 * @param {string} projectFile File containing the Firefly Project
 * @param {string} projectPrivateKeyFile File containing a valid private key for the Firefly Project
 */
async function getAccessTokenFromProject (projectFile, projectPrivateKeyFile) {
  const { project } = JSON.parse(await readFile(projectFile, 'utf-8'))
  const privateKey = await readFile(projectPrivateKeyFile, 'utf-8')

  for (const credentials of project.workspace.details.credentials) {
    if (credentials.jwt) {
      const { jwt } = credentials
      await context.set(project.name, Object.assign({}, jwt, {
        ims_org_id: project.org.ims_org_id,
        private_key: privateKey
      }))

      return {
        orgId: project.org.ims_org_id,
        apiKey: jwt.client_id,
        accessToken: await getToken(project.name)
      }
    }
  }

  throw Error(`Unable to find JWT credentials in ${projectFile}`)
}

module.exports = {
  getAccessTokenFromProject
}
