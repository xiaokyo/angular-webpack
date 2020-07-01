export default (app, Angular) => {
  app.config(($stateProvider) => {
    $stateProvider.state('page4', {
      url: '/page4',
      templateProvider: ['$q', function ($q) {
        let deferred = $q.defer();
        require.ensure(['../pages/page4/index.template.html'], function () {
          let template = require('../pages/page4/index.template.html');
          deferred.resolve(template);
        });
        return deferred.promise;
      }],
      controller: 'Page4Controller',
      controllerAs: 'test',
      resolve: {
        foo: ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
          let deferred = $q.defer();
          require.ensure([], function () {
            let module = require('../pages/page4/index.controller.js')(Angular);
            $ocLazyLoad.load({
              name: 'page4App'
            });
            deferred.resolve(module);
          });

          return deferred.promise;
        }]
      }
    });
  })
}