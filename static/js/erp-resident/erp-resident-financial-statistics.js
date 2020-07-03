(function() {
  var app = angular.module("erp-resident");
  app.controller("FinancialStatisticsCtrl", [
    "$scope",
    "erp",
    "$routeParams",
    "utils",
    "$location",
    "$filter",
    function($scope, erp, $routeParams, utils, $location, $filter) {
      console.log("FinancialStatisticsCtrl");

      //
      $scope.dataList = [];
      $scope.pageSize = "20";
      $scope.pageNum = 1;
      $scope.val = "1";
      $scope.tabArr = [
        { name: "收入统计", val: "1", isActive: "true" },
        { name: "收入明细", val: "2", isActive: "" }
      ];
      $scope.searVal = ""; //搜索
      // $scope.startTime = '';
      // $scope.endTime = '';
      $scope.moneyType = "1"; //币种展示
      $scope.seaType = "1"; //下拉选择框
      $scope.selectVal = "";
      $scope.totalMoney = ""; //获取总金额
      $scope.totleFreight = "";
      $scope.totalCommissionAmount = "";

      //切换tab
      $scope.checkTab = function(item) {
        console.log(item);
        for (i = 0; i < $scope.tabArr.length; i++) {
          $scope.tabArr[i].isActive = "";
        }
        item.isActive = true;
        $scope.val = item.val;
        clear();
        getData();
      };

      //默认时间
      //  $scope.startTime =

      //获取系统当前时间
      var nowTime = new Date();
      var y = nowTime.getFullYear();
      var m = nowTime.getMonth() + 1;
      var d = nowTime.getDate();
      // var formatNowDate = y+'-'+m+'-'+d;
      var formatNowDate;
      if (d < 10) {
        d = "0" + d;
      }
      if (m < 10) {
        m = "0" + m;
      }
      console.log(d, m);
      formatNowDate = y + "-" + m + "-" + d;

      //获取系统前一周的时间
      var oneWeekDate = new Date(nowTime - 7 * 24 * 3600 * 1000);
      var y1 = oneWeekDate.getFullYear();
      var m1 = oneWeekDate.getMonth() + 1;
      var d1 = oneWeekDate.getDate();
      // var formatWDate = y+'-'+m+'-'+d;
      var formatWDate;
      if (d1 < 10) {
        d1 = "0" + d1;
      }
      if (m1 < 10) {
        m1 = "0" + m1;
      }
      console.log(d, m);
      formatWDate = y1 + "-" + m1 + "-" + d1;

      // //获取系统前一个月的时间
      // nowTime.setMonth(nowTime.getMonth()-1);
      // var y = nowTime.getFullYear();
      // var m = nowTime.getMonth()+1;
      // var d = nowTime.getDate();
      // var formatMDate = y+'-'+m+'-'+d;
      $scope.startTime = formatWDate;
      $scope.endTime = formatNowDate;

      console.log($scope.startTime, typeof $scope.startTime);
      console.log($scope.endTime);

      //清空
      function clear() {
        $("#date1").val(formatWDate);
        $("#date2").val(formatNowDate);
        $scope.searVal = "";
        $scope.pageNum = 1;
      }
      //切换下拉选择框
      $scope.selectArr = [
        { name: "运费", val: "productFee", activeVal: "1" },
        { name: "供应商佣金", val: "payFee", activeVal: "2" }
      ];

      $scope.checkSelect = function() {
        clear();
        getData();
      };

      //搜索
      $scope.searchInput = function() {
        $scope.pageNum = 1;
        getData();
      };

      $scope.tradeTypeTrans = function(i) {
        switch (i) {
          case 3:
            return "购买";
          case 4:
            return "续费";
          case 5:
            return "升级为";
        }
      };

      //获取列表
      function getData() {
        if ($scope.seaType !== "3") {
          var url = "";
          if ($scope.val == 2) {
            url = "supplier/supplierOrder/financialIncomeList";
          } else if ($scope.val == 1) {
            url = "supplier/supplierOrder/financialIncomeStatistical";
          }

          var data = {
            pageNum: $scope.pageNum,
            // "page": $scope.pageNum,
            pageSize: $scope.pageSize * 1,
            search: $scope.searVal,
            orderType: $scope.seaType * 1,
            beginTime: $("#date1").val(),
            endTime: $("#date2").val(),
            currency: $scope.moneyType * 1
          };

          erp.postFun(
            url,
            data,
            function(res) {
              console.log(res);
              // if (res.data.statusCode == 200) {
              if (res.data.code == 200) {
                // $scope.dataList = res.data.result.rows;
                $scope.dataList = res.data.data.list;
                if ($scope.dataList) {
                  for (let i = 0, len = $scope.dataList.length; i < len; i++) {
                    $scope.dataList[i]["index"] =
                      $scope.pageSize * ($scope.pageNum - 1) + i + 1;
                    if ($scope.dataList[i]["orderType"] == 1) {
                      $scope.dataList[i]["orderType"] = "供应商佣金";
                    }
                    if ($scope.dataList[i]["orderType"] == 2) {
                      $scope.dataList[i]["orderType"] = "包裹运费";
                    }
                    // $scope.totalMoney = $scope.dataList[i]['']
                  }
                }
                console.log($scope.dataList);
                // $scope.TotalNum1 = res.data.result.total;
                $scope.TotalNum = res.data.data.total;
                console.log($scope.TotalNum);
                pageFun1();
                gettotalMoney();
              }
            },
            function(data) {
              console.log(data);
            },
            { layer: true }
          );
        } else {
          var url;
          if ($scope.val == 2) {
            var data = {
              pageNum: $scope.pageNum,
              pageSize: $scope.pageSize * 1,
              beginTime: $("#date1").val(),
              endTime: $("#date2").val()
            };
            url = "erpSupplierPlan/planIncomeDetail";
          } else if ($scope.val == 1) {
            var data = {
              pageNum: $scope.pageNum,
              pageSize: $scope.pageSize * 1
            };
            url = "supplierPlanInfo/financialIncomePlanStatistical";
            erp.postFun("supplierPlanInfo/feeSum", {}, function(res) {
              if (res.data.code === 200) {
                $scope.amount = res.data.data;
              }
            });
          }

          erp.postFun(
            url,
            data,
            function(res) {
              if (res.data.code == 200) {
                if ($scope.val === "1") {
                  $scope.dataList = res.data.data.list;
                  $scope.TotalNum = res.data.data.total;
                } else {
                  $scope.dataList = res.data.data.list.list;
                  $scope.TotalNum = res.data.data.list.total;
                  $scope.amount = res.data.data.totalAmount;
                }
              }
            },
            function(data) {},
            { layer: true }
          );
        }
      }
      getData();

      //获取总金额
      function gettotalMoney() {
        var data = {
          // "pageNum": $scope.pageNum,
          // "pageSize": $scope.pageSize *1,
          // "search": $scope.searVal,
          orderType: $scope.seaType * 1,
          // "beginTime": $('#date1').val(),
          // "endTime": $('#date2').val(),
          currency: $scope.moneyType * 1
        };
        erp.postFun(
          "supplier/supplierOrder/financialIncomeTotalAmount",
          data,
          function(res) {
            console.log(res);
            // if (res.data.statusCode == 200) {
            if (res.data.code == 200) {
              $scope.totalMoney = res.data.data.totalAmount;
              $scope.totleFreight = res.data.data.totleFreight;
              $scope.totalCommissionAmount =
                res.data.data.totalCommissionAmount;
              // console.log($scope.totalMoney)
            }
          },
          function(data) {
            console.log(data);
          },
          { layer: true }
        );
      }
      //分页
      function pageFun1() {
        $(".pagegroup1").jqPaginator({
          totalCounts: $scope.TotalNum || 1,
          pageSize: $scope.pageSize * 1,
          visiblePages: 5,
          currentPage: $scope.pageNum * 1,
          activeClass: "current",
          first: '<a class="prev" href="javascript:void(0);">&lt;&lt;</a>',
          prev: '<a class="prev" href="javascript:void(0);">&lt;</a>',
          next: '<a class="next" href="javascript:void(0);">&gt;</a>',
          last: '<a class="next" href="javascript:void(0);">&gt;&gt;</a>',
          page: '<a href="javascript:void(0);">{{page}}</a>',
          onPageChange: function(n, type) {
            if (type == "init") {
              return;
            }
            erp.load();
            $scope.pageNum = n;
            getData();
          }
        });
      }
      $scope.toPage1 = function() {
        var pageNum = Number($scope.pageNum);
        var pageNumtotal = Number($scope.TotalNum);
        var pageSize1 = Number($scope.pageSize);
        // var totalPage = Math.ceil($scope.TotalNum1 / Number($scope.pageSize1));
        var totalPage = Math.ceil(pageNumtotal / pageSize1);

        console.log(typeof pageNum);
        console.log(typeof Number($scope.pageSize));
        console.log(totalPage);
        if (!pageNum) {
          layer.msg("请输入页码");
          return;
        }
        if (pageNum > totalPage) {
          layer.msg("总计" + totalPage + "页，所输入数字应小于" + totalPage);
          $scope.pageNum1 = 1;
          return;
        }
        getData();
      };
      $scope.pagechange = function(pageSize) {
        console.log($scope.pageSize);
        console.log(pageSize);
        $scope.pageNum = 1;
        getData();
      };

      //导出报表
      $scope.exportExcel = function() {
        if ($scope.seaType === "3") {
          erp.getFun(
            "erpSupplierPlan/exportPlanIncomeDetail?beginTime=" +
              $("#date1").val() +
              "&endTime=" +
              $("#date2").val(),
            function(res) {
              // 返回200
              console.log(res);
              var blob = res.data;
              var reader = new FileReader();
              reader.readAsDataURL(blob); // 转换为base64，可以直接放入a表情href
              reader.onload = function(e) {
                // 转换完成，创建一个a标签用于下载
                var a = document.createElement("a");
                var body = document.getElementsByTagName("body")[0];
                a.download = "收入明细";
                a.href = e.target.result;
                body.append(a); // 修复firefox中无法触发click
                a.click();
              };
            },
            function() {},
            { responseType: "blob" }
          );
        } else {
          window.open(
            "http://supplier1.test.com/supplier/supplierOrder/exportInfo?search=" +
              $scope.searVal +
              "&orderType=" +
              $scope.seaType * 1 +
              "&beginTime=" +
              $("#date1").val() +
              "&endTime=" +
              $("#date2").val()
          );
        }
      };
    }
  ]);
})();
