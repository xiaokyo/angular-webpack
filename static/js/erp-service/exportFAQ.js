(function() {
  app.controller('exportFAQCtrl', [
    '$scope',
    '$window',
    '$location',
    '$compile',
    '$routeParams',
    '$timeout',
    '$http',
    'erp',
    'merchan',
    '$sce',
    function(
      $scope,
      $window,
      $location,
      $compile,
      $routeParams,
      $timeout,
      $http,
      erp,
      merchan,
      $sce
    ) {
      console.log("exportFAQCtrl");
      // var bs = new Base64();
      // $scope.loginName = localStorage.getItem('erploginName') ? bs.decode(localStorage.getItem('erploginName')) : '';
      // $scope.isAdminLogin = erp.isAdminLogin();
      // console.log('admin', $scope.isAdminLogin);
      // $scope.userId = localStorage.getItem('erpuserId') == null ? '' : bs.decode(localStorage.getItem('erpuserId'));
      // $scope.userName = localStorage.getItem('erpname') == null ? '' : bs.decode(localStorage.getItem('erpname'));
      // $scope.token = localStorage.getItem('erptoken') == null ? '' : bs.decode(localStorage.getItem('erptoken'));

      $scope.checkAllFlag = false;
      $scope.status = '';
      $scope.startDate = '';
      $scope.endDate = '';

      $scope.industryFromType = {
        1: '猜你想问' ,
        2: '服务' ,
        3: '合作' ,
      }

      /* page 区域 start */
      $scope.pageNum = '1';
      $scope.pageSize = '20';
      $scope.totalNum = '0';

      function initPage() {
        const pages = Math.ceil($scope.totalNum / $scope.pageSize);
        $scope.$broadcast('page-data', {
          pageNum: $scope.pageNum, //页码
          pageSize: $scope.pageSize, //每页条数
          totalNum: pages, //总页数
          totalCounts: $scope.totalNum, //数据总条数
          pageList: ['20', '50', '100'] //条数选择列表，例：['10','50','100']
        })
      }

      function initPageChange() {
        $scope.$on('pagedata-fa', function(_, {
          pageNum,
          pageSize
        }) { // 分页onchange
          $scope.pageNum = pageNum;
          $scope.pageSize = pageSize;
          getIndMsgList();
        })
      }
      initPageChange();
      /* page 区域 end */

      function getIndMsgList() {
        let params = {};
        params.pageNum = $scope.pageNum;
        params.pageSize = $scope.pageSize;
        params.industryStatus = $scope.status;
        params.startTime = $scope.startDate;
        params.endTime = $scope.endDate;
        erp.postFun('message/getIndMsgListByStatics', params, ({data}) => {
          console.log(data);
          if (data.resultCode != 200) return layer.msg('数据获取失败');
          // $scope.indMsgList = data.data.page;
          $scope.totalNum = data.data.count;
          $scope.indMsgList = data.data.page.map(item => {
            item.industryFrom = item.industryFrom ? item.industryFrom.toString().split(',') : []
            return item
          })
          console.log($scope.indMsgList);
          initPage();
        }, err => {
          console.log(err);
        }, {
          layer: true
        })
      }

      getIndMsgList();

      $scope.filterSearch = () => {
        $scope.pageNum = '1';
        getIndMsgList();
      }

      $scope.reset = () => {
        $scope.status = '';
        $scope.startDate = '';
        $scope.endDate = '';
        $scope.pageNum = '1';
        getIndMsgList();
      }

      // 导出Excel
      $scope.exportFQA = () => {
        erp.getFun(`message/erp/exportIndustryMsgList?startTime=${$scope.startDate}&endTime=${$scope.endDate}&industryStatus=${$scope.status}`,
        res => {
          console.log(res.data);
          cjUtils.exportFile(res.data, `orders.xls`)
        },err =>console.log(err),{
          responseType: 'blob'
        })
      }

    }
  ]);
})();
