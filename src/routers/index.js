const PAGE_PATH = '../pages'
export const setRouters = app => {
  app.config(($stateProvider) => {
    const routers = [
      {
        name: 'home',
        url: '/home',
        template: require(PAGE_PATH + '/home/index.html')
      },
      {
        name: 'test',
        url: '/test',
        template: require(PAGE_PATH + '/test/index.html')
      }
    ]

    routers.forEach(route => {
      $stateProvider.state(route)
    })

  })
}