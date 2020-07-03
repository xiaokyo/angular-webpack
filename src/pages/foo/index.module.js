import controller from './index.controller'
const mod = angular.module('foo', [])
mod.controller('foo.ctrl', controller)
export default mod