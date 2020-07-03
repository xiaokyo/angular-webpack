(function() {
  var app = angular.module('erp-reconciliation');
  app.controller("BillCollectionAccountCtrl", [
    "$scope",
    "erp",
    "$routeParams",
    "utils",
    "$location",
    "$filter",
    function($scope, erp, $routeParams, utils, $location, $filter) {
      console.log('BillCollectionAccountCtrl')

      //
      $scope.dataList = [];
      $scope.pageSize = '20';
      $scope.pageNum = 1;
      $scope.searVal = '';
      $scope.status = '1' 
      $scope.checkStatus = '1' //判断，1是草稿，2是已对账
      $scope.filters = {}
      $scope.selectVal = 'logisticsCompanyName'
      $scope.showNameModal = false
      $scope.ReconciliationName = ""; //对账单名称
      $scope.pagenumarr=['10', '20', '30', '50', '100']

      //获取系统当前时间
      var nowTime = new Date();
      var y = nowTime.getFullYear();
      var m = nowTime.getMonth() + 1;
      var d = nowTime.getDate();
      var formatNowDate = y + '-' + m + '-' + d;
      //获取系统前一周的时间
      var oneWeekDate = new Date(nowTime - 7 * 24 * 3600 * 1000);
      var y = oneWeekDate.getFullYear();
      var m = oneWeekDate.getMonth() + 1;
      var d = oneWeekDate.getDate();
      var formatWDate = y + '-' + m + '-' + d;
      //获取系统前一个月的时间
      nowTime.setMonth(nowTime.getMonth() - 1);
      var y = nowTime.getFullYear();
      var m = nowTime.getMonth() + 1;
      var d = nowTime.getDate();
      var formatMDate = y + '-' + m + '-' + d;
      $scope.startTime = formatWDate;
      $scope.endTime = formatNowDate;
      $('#date1').val(formatWDate)
      $('#date2').val(formatNowDate)

      // 分页触发
      $scope.$on('pagedata-fa', function(d, data) {
        $scope.pageNum = parseInt(data.pageNum);
        $scope.pageSize = parseInt(data.pageSize);
        getData();
      });

      //清空
      function clear() {
        $('#date1').val(formatWDate)
        $('#date2').val(formatNowDate)
        $scope.searVal = ''
        $scope.pageNum = 1
      }
      //查询
      $scope.searchInput = function() {
        const filters = {
          [$scope.selectVal]: $scope.searVal,
          // startDeliveryTime: $('#date1').val(),
          // endDeliveryTimeme: $('#date2').val(),
          status: $scope.status,
        }
        $scope.filters = filters
        $scope.pageNum = 1
        getData(filters);
      }
      //获取列表
      function getData(filters) {
        console.log($scope.pageNum)
        let data = {}
        var info = {
            pageNo: $scope.pageNum,
            pageSize: $scope.pageSize * 1,
          };
        
        Object.assign(data, info, filters);
        
        erp.postFun("erp/reconciliationRecord/logisticChargePage", data, function(res) {
          console.log(res)
          const data = res.data
          if (data.statusCode == '200') {
            $scope.dataList = data.result.list;
            $scope.TotalNum = data.result.total;
            $scope.$broadcast('page-data', {
              pageSize: $scope.pageSize.toString(),
              pageNum: $scope.pageNum,
              totalCounts: $scope.TotalNum,
              pageList: $scope.pagenumarr
            });
          }
        }, function(data) {
          console.log(data)
        }, {
          layer: true
        })
      }
      getData()

      // 保存
      $scope.saveList = function() {
        erp.postFun('erp/reconciliation/queryMismatchCount', {
          batchNumber: $scope.batchNumber,
        }, function(res) {
          console.log(res.data)
          if (res.data.statusCode == '200') {
            if (res.data.result > 0) {
              $scope.misCount = res.data.result
              $scope.isPaymentList = true
            } else {
              sureConfirm()
            }
          }
        })
      }

      function sureConfirm() {
        erp.postFun('erp/reconciliation/saveRemitRecordDraft', {
          batchNumber: $scope.batchNumber,
        }, function(res) {
          const data = res.data
          if (data.statusCode == '200') {
            layer.msg("保存成功！")
          }
        })
      }
      // 导出
      $scope.exportExcel = function() {
        const filters = $scope.filters
        let data={}
        Object.assign(data, filters)
        console.log(data)
        erp.postFun('erp/reconciliation/codExcelOutFinancial',data, function(res) {
          const data = res.data
          if (data.statusCode == '200') {
            window.open(data.result);
          }

        }, function(data) {
          console.log(data)
        }, {
          layer: true
        })
      }
      //查看详情
      $scope.showDetail = function(batchNumber) {
        $scope.batchNumber = batchNumber
        location.href = "/manage.html#/Reconciliation/BillCollectionList?batchNumber=" + $scope.batchNumber

      }

      function clear() {
        $scope.ReconciliationName = ""
        $scope.filters = {}
      }
    }

  ])
})()