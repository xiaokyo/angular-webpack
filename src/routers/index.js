import routers from './routers'

export default (app) => {
  app.config(($stateProvider, $locationProvider, $urlRouterProvider, $translateProvider) => {

    /**
     * 翻译配置
     */

    $translateProvider.preferredLanguage('cn');
    //默认的语言
    $translateProvider.useSanitizeValueStrategy('escape');
    $translateProvider.useStaticFilesLoader({
      files: [{
        prefix: 'static/angular-1.5.8/i18n/', //语言包路径
        suffix: '.json' //语言包后缀名
      }]
    });

    /**
     * 路由配置
     */
    routers.forEach(({ name, url, controller, params = {} }) => {
      $stateProvider
        .state(name, {
          url,
          params,
          controller,
          templateUrl: `/src/pages/${name}/index.template.html`,
          lazyLoad: transition => {
            const $lazy = transition.injector().get('$ocLazyLoad');
            return import(`@cache/modules/index.${name}.js`).then(m => $lazy.load(m.default));
          },
        })
    })

    $locationProvider.hashPrefix(''); // 去掉路径中的! (/#!/ -> /#/)
    // $urlRouterProvider.otherwise('/mycj/ywyHome');
  })
}