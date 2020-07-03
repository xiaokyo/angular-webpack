(function() {
  var app = angular.module('erp-reconciliation', []);
  app.controller("BillCollectionCtrl", [
    "$scope",
    "erp",
    "$routeParams",
    "utils",
    "$location",
    "$filter",
    function($scope, erp, $routeParams, utils, $location, $filter) {

      //
      $scope.dataList = [];
      $scope.pageSize = '20';
      $scope.pageNum = 1;
      $scope.searVal = '';
      $scope.selectVal = 'logisticsCompanyName'
      $scope.isComplete = false
      $scope.isError = false
      $scope.status = '1'
      $scope.ReconciliationName = '' //对账单名称
      $scope.filters = "";
      $scope.pagenumarr = ['10', '20', '30', '50', '100'];
      $scope.NotMatchNum = 0
      $scope.ErrorLog = ""

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
      $scope.startTime = formatMDate;
      $scope.endTime = formatNowDate;
      $('#date1').val(formatMDate)
      $('#date2').val(formatNowDate)

      // 分页触发
      $scope.$on('pagedata-fa', function(d, data) {
        $scope.pageNum = parseInt(data.pageNum);
        $scope.pageSize = parseInt(data.pageSize);
        getData();
      });

      //清空
      function clear() {
        $('#date1').val(formatMDate)
        $('#date2').val(formatNowDate)
        $scope.searVal = ''
        $scope.pageNum = 1
      }
      //查询
      $scope.searchInput = function() {
        $scope.pageNum = 1
        getData();
      }
      //获取列表
      function getData() {
        const { cjorderId, logisticsWaybillNo, status } = $scope
        var info;
        let data = {}
        const filters = {
          [$scope.selectVal]: $scope.searVal,
          startDeliveryTime: $('#date1').val(),
          endDeliveryTimeme: $('#date2').val(),
          cjorderId, // 子订单号
          logisticsWaybillNo, // 物流商运单号
          status,
        }
        data = {
          pageNo: $scope.pageNum,
          pageSize: $scope.pageSize * 1,
        };
        Object.assign(data, info, filters);

        erp.postFun("erp/reconciliation/logisticChargePage", data, function(res) {
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

      // 上传账单
      $scope.upLoadExcelFun = function(item) {
        const filter = $scope.filters
        var file = $("#document2").val();
        var index = file.lastIndexOf(".");
        var ext = file.substring(index + 1, file.length);
        if (ext != "xlsx" && ext != "xls") {
          layer.msg('请上传excel文件')
          return;
        }
        erp.load();
        var formData = new FormData();
        formData.append("file", item[0]);
        for (let i in filter) {
          formData.append(i, filter[i]);
        }

        erp.upLoadImgPost('erp/reconciliation/codExcelFinancial', formData, function(data) {

          layer.closeAll("loading")
          if (data.data.statusCode == '200') {
            const res = data.data.result
            if (res.ErrorLog) {
              $scope.isError = true
              $scope.ErrorLog = res.ErrorLog
            } else {
              $scope.isComplete = true
            }
            $scope.batchNumber = res.batchNumber
            $scope.NotMatchNum = res.NotMatchNum
          } else {
            layer.msg(data.data.message)
          }
          $('#document2').val('')
        }, function(data) {
          layer.closeAll("loading")
        })
      }

      $scope.toCollectionDetails = function() {
        $scope.isComplete = false
        $scope.isError = false
        if ($scope.batchNumber) {
          location.href = "/manage.html#/Reconciliation/BillCollectionList?batchNumber=" + $scope.batchNumber
        } else {
          layer.msg("没有匹配项！")
        }
      }

      $scope.downloadErr = function() {
        window.open($scope.ErrorLog)
      }

      // 导入
      $scope.ImportantAmount = function() {
        document.getElementById('document2').click();
      }
      //导入提示信息(error)
      $scope.containOption = function() {
        $scope.isError = false
      }
      // errorCancel
      $scope.errorCancel = function() {
        $scope.isError = false;
        // 清空
      }
    }

  ])
})()