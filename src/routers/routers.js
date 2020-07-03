// 可选参数
const squash = { squash: true, value: null }

export default [
  {
    name: 'home',
    controller: 'home.ctrl',
    url: '/mycj/ywyHome',
  },
  {
    name: 'commonHome',
    controller: 'commonHome.ctrl',
    url: '/mycj/commonHome/:id?haha',
    params: {
      id: squash
    }
  }
]