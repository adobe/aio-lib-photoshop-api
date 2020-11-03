
'use strict'

const path = require('path')

let arg = '../spec/api.json'
if (process.argv.length > 2) {
  arg = path.resolve(process.argv[2])
}

var OpenAPISchemaValidator = require('openapi-schema-validator').default
var validator = new OpenAPISchemaValidator({
  version: 3
})

const apiDoc = require(arg)
const result = validator.validate(apiDoc)

if (result.errors.length > 0) {
  console.log(JSON.stringify(result, null, 4))
  throw Error(`Failed to validate: ${arg}`)
}
