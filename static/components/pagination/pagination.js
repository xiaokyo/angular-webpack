/**
 * option {pageSizeRange, pageNum, pageSize, pageTotal, id}
 * pagechange 页面变化回调
 * sizechange size变化回调
 */
(function () {
  angular.module('manage')
    .component('pagination', {
      templateUrl: 'static/components/pagination/pagination.html',
      controller: pageCtrlFn,
      controllerAs: 'ng',
      bindings: {
        config: '<',
        pagechange: '&',
        sizechange: '&',
        init: '&'
      },
    });
  function pageCtrlFn($scope) {
    
    const ng = this;
    const { config = {} } = this;
    let { pageSizeRange = ['10', '30', '50'], pageNum = 1, pageSize = 10, pageTotal = 100, id = 'page' } = config;
    console.log('config --->> ', config)
    $scope.pageSizeRange = pageSizeRange;
    $scope.pageNum = pageNum;
    $scope.pageSize = pageSize + '';
    $scope.pageTotal = pageTotal;
    $scope.pageNumGo = '';
    $scope.pageId = 'page';

    setTimeout(() => { initPagination($scope) }, 100)//执行顺序 在 动态id 之后 所以 用异步初始化
    
    $scope.$on('initPagination', (_, config = {}) => { //父组件 调用 子组件方法。。
      let { pageNum, pageSize, pageTotal } = $scope;
      config = { pageNum, pageSize, pageTotal, ...config }
      destroyedPagination()
      initPagination(config)
    })
    // --->> 回调区域
    $scope.changePageSize = function () {
      console.log('changePageSize --->> --->', $scope.pageNum)
      pageSizeChange($scope.pageNum)
    }
    $scope.pageNav = function () {//跳转 第几页
      const pageNum = +$scope.pageNumGo || 0;
      console.log('pageNav --->> --->', pageNum)
      if (pageNum) {
        changePaginationCurrentPage(pageNum)
        pageChangeCb(pageNum)
      }
    }
    function pageChangeCb(n) {// 页码变化 
      const { pagechange } = ng;
      typeof pagechange === 'function' && pagechange()(n)
    }
    function pageSizeChange(n) {//  一页多少 条 变化
      const { sizechange } = ng;
      typeof sizechange === 'function' && sizechange()(n)
    }
    // <<---


    // --->> 页码功能区域
    function initPagination({ pageNum, pageSize, pageTotal }) {//加载分页器
      if (!pageTotal) return;
      console.log('initPagination --->> ', pageTotal, pageSize, pageNum, $scope.pageId, $(`#${$scope.pageId}`))
      $(`#${$scope.pageId}`).jqPaginator({
        currentPage: pageNum,
        pageSize: +pageSize,
        totalCounts: pageTotal,
        visiblePages: 5,
        activeClass: 'active',
        prev: '<a class="prev" href="javascript:void(0);">&lt;<\/a>',
        next: '<a class="next" href="javascript:void(0);">&gt;<\/a>',
        page: '<a href="javascript:void(0);">{{page}}<\/a>',
        first: '<a class="prev" href="javascript:void(0);">&lt&lt;<\/a>',
        last: '<a class="prev" href="javascript:void(0);">&gt&gt;<\/a>',
        onPageChange: function (n, type) {// n --> 页 type --> 切换方式  init change
          console.log('init', type)
          if (type === 'change') {
            pageChangeCb(n)
          } else {

          }
        }
      });
    }

    function changePaginationCurrentPage(n) {//变更 分页器 当前页
      n = +n;
      n && $(`#${$scope.pageId}`).jqPaginator('option', { currentPage: n });
    }

    function destroyedPagination() {
      $(`#${$scope.pageId}`).jqPaginator('destroy')
    }
    // <<--- 页码功能区域


  }
}());