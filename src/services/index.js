import erpService from './erp'

export default app => {
  app.factory('MathService', function () {
    const factory = {}
    factory.multiply = function (a, b) {
      return a * b
    }

    return factory
  })

  app.service('CalcService', function (MathService) {
    this.square = function (a) {
      return MathService.multiply(a, a)
    }
  })

  erpService(app)
}