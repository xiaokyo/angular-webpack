(function() {
  app.controller('financingDisputeRefundCtrl', [
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
      console.log("financingDisputeRefundCtrl");
      // var bs = new Base64();
      // $scope.loginName = localStorage.getItem('erploginName') ? bs.decode(localStorage.getItem('erploginName')) : '';
      // $scope.isAdminLogin = erp.isAdminLogin();
      // console.log('admin', $scope.isAdminLogin);
      // $scope.userId = localStorage.getItem('erpuserId') == null ? '' : bs.decode(localStorage.getItem('erpuserId'));
      // $scope.userName = localStorage.getItem('erpname') == null ? '' : bs.decode(localStorage.getItem('erpname'));
      // $scope.token = localStorage.getItem('erptoken') == null ? '' : bs.decode(localStorage.getItem('erptoken'));

      $scope.paymentName = ''; //客户名称
      $scope.cjOrderId = ''; //订单号
      $scope.paymentType = ''; //退款渠道
      $scope.startDate = ''; //起始时间
      $scope.endDate = ''; //截止时间

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
          getDisputeRefundList();
        })
      }
      initPageChange();
      /* page 区域 end */

      function getDisputeRefundList() {
        let data = {};
        data.paymentName = $scope.paymentName;
        data.cjOrderId = $scope.cjOrderId;
        data.paymentType = $scope.paymentType;
        data.startTime = $scope.startDate;
        data.endTime = $scope.endDate;
        erp.postFun('pojo/customer/watercourse/list', {
          "pageNum": $scope.pageNum,
          "pageSize": $scope.pageSize,
          "model": data
        }, res => {
          console.log(res);
          const {
            data,
            code,
            total
          } = res.data;
          if (code != 200) return layer.msg('获取列表数据失败');
          $scope.totalNum = total;
          $scope.disputeRefundList = data;
          console.log($scope.disputeRefundList);
          initPage();
        }, err => {
          console.log(err);
        }, {
          layer: true
        })
      }

      getDisputeRefundList();

      $scope.filterSearch = () => {
        $scope.pageNum = '1';
        getDisputeRefundList();
      }

      $scope.reset = () => {
        $scope.paymentName = '';
        $scope.cjOrderId = '';
        $scope.paymentType = '';
        $scope.startDate = '';
        $scope.endDate = '';
        $scope.pageNum = '1';
        getDisputeRefundList();
      }

    }
  ]);
})();
