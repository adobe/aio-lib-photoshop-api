#!/usr/bin/env node

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
  console.log(result)
  process.exit(1)
}
