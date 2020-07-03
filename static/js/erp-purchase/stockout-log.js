(function() {
  var app = angular.module('purchase-stockout-app', []);

  app.controller('stockoutLogCtrl', [
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
      console.log("stockoutLogCtrl");
      // var bs = new Base64();
      // $scope.loginName = localStorage.getItem('erploginName') ? bs.decode(localStorage.getItem('erploginName')) : '';
      // $scope.isAdminLogin = erp.isAdminLogin();
      // console.log('admin', $scope.isAdminLogin);
      // $scope.userId = localStorage.getItem('erpuserId') == null ? '' : bs.decode(localStorage.getItem('erpuserId'));
      // $scope.userName = localStorage.getItem('erpname') == null ? '' : bs.decode(localStorage.getItem('erpname'));
      // $scope.token = localStorage.getItem('erptoken') == null ? '' : bs.decode(localStorage.getItem('erptoken'));
      console.log($routeParams);
      const {state} = $routeParams;
      $scope.state = state;
      $scope.variantShow = false;

      $scope.warehouseList = [
        { label: '义乌仓', id: 'bc228e33b02a4c03b46b186994eb6eb3' },
        { label: '金华仓', id: '522d3c01c75e4b819ebd31e854841e6c' },
        { label: '深圳仓', id: '08898c4735bf43068d5d677c1d217ab0' },
      ];
      $scope.warehouseID = 'bc228e33b02a4c03b46b186994eb6eb3'; //默认义乌

      /* page 区域 start */
      $scope.pageNum = '1';
      $scope.pageSize = '20';
      $scope.totalNum = '0';

      function initPage() {
        const pages = Math.ceil($scope.totalNum / $scope.pageSize);
        $scope.$broadcast('page-data', {
          pageSize: $scope.pageSize, //每页条数
          pageNum: $scope.pageNum, //页码
          totalNum: pages, //总页数
          totalCounts: $scope.totalNum, //数据总条数
          pageList: ['20', '50', '100'] //条数选择列表，例：['10','50','100']
        })
      }
      initPageChange();
      function initPageChange() {
        $scope.$on('pagedata-fa', function(_, {
          pageNum,
          pageSize
        }) { // 分页onchange
          $scope.pageNum = pageNum;
          $scope.pageSize = pageSize;
          switchState();
        })
      }
      /* page 区域 end */

      function switchState() {
        switch (state) {
          case '1':
            getInventoryRecordList();
            break;
          case '2':
            getRecordInfoList();
            break;
          default:
            break;
        }
      }
      switchState();

      function getInventoryRecordList() {
        erp.postFun('storehouse/WarehousInfo/getInventoryRecordList', {
          "pageNum": $scope.pageNum,
          "pageSize": '10000',
          "storageId": $scope.warehouseID
        }, res => {
          // console.log(res);
          const {data, code} = res.data;
          if (code != 200) return layer.msg('获取列表数据失败');
          $scope.totalNum = data.length;
          $scope.inventoryList = data;
          console.log($scope.inventoryList);
          initPage();
        }, err => {console.log(err);
        },{layer:true})
      }

      $scope.variantInfo = (item) => {
        $scope.variantShow = true;
        const id = item.pid;
        erp.postFun('storehouse/WarehousInfo/getRecordInfo', {id}, res => {
          // console.log(res);
          const {data, code} = res.data;
          if (code != 200) return layer.msg('获取列表数据失败');
          $scope.variantList = data;
          console.log($scope.variantList);
        }, err => {console.log(err);
        },{layer:true})
      }

      $scope.addProcurement = (item) => {
        const id = item.pid;
        erp.postFun('storehouse/WarehousInfo/addProcurement', {id}, res => {
          // console.log(res);
          const {data, code} = res.data;
          if (code != 200) return layer.msg('操作失败');
          layer.msg('操作成功');
          $scope.inventoryList = $scope.inventoryList.filter(item => item.pid !== id);
        }, err => {console.log(err);
        },{layer:true})
      }

      function getRecordInfoList() {
        erp.postFun('storehouse/WarehousInfo/getRecordInfoList', {
          "pageNum": $scope.pageNum,
          "pageSize": $scope.pageSize,
          "data": {
            "status": "2",
            "storageId": $scope.warehouseID
          }
        }, res => {
          // console.log(res);
          const {data, code} = res.data;
          if (code != 200) return layer.msg('获取列表数据失败');
          const {pages, size ,total, records} = data;
          $scope.totalNum = total;
          $scope.recordInfoList = records;
          console.log($scope.recordInfoList);
          initPage();
        }, err => {console.log(err);
        },{layer:true})
      }

      $scope.changeWarehouse = () => {
        switchState();
      }

    }
  ]);
})();
