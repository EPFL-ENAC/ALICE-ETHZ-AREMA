// For more information about this file see https://dove.feathersjs.com/guides/cli/service.test.html
import assert from 'assert'
import { app } from '../../../src/app'

describe('technical-construction-building-material service', () => {
  it('registered the service', () => {
    const service = app.service('technical-construction-building-material')

    assert.ok(service, 'Registered the service')
  })
})
