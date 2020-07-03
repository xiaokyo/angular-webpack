(function() {
  var app = angular.module("erp-resident");
  app.controller("PackageBuyCtrl", [
    "$scope",
    "erp",
    "$location",
    "$filter",
    function($scope, erp, $location, $filter) {
      console.log("packageBuyCtrl");

      //
      $scope.dataList = [];
      $scope.pageSize = "20";
      $scope.pageNum = 1;
      $scope.val = "1";
      $scope.packageInfo = {};

      //弹窗
      $scope.isShow = false;
      $scope.isCheck = false;

      $scope.close = function() {
        $scope.isShow = false;
      };

      //清空
      $scope.clearSearch = function() {
        $scope.accountType = undefined;
        $scope.companyName = undefined;
        $scope.status = undefined;
        $scope.pageNum = 1;
        getData();
      };

      //搜索
      $scope.searchInput = function(id) {
        $scope.pageNum = 1;
        getData();
      };

      //获取列表
      function getData() {
        console.log($scope.statusType);
        var data = {
          pageNum: $scope.pageNum + "",
          pageSize: $scope.pageSize,
          status:
            $scope.status === "" || $scope.status === undefined
              ? undefined
              : parseInt($scope.status),
          companyName: $scope.companyName,
          accountType:
            $scope.accountType === "" || $scope.accountType === undefined
              ? undefined
              : parseInt($scope.accountType),
          trialType: 1
        };
        erp.postFun(
          "supplierPlanInfo/selectSupplierPlanPage",
          data,
          function(res) {
            console.log(res);
            // if (res.data.statusCode == 200) {
            if (res.data.code == 200) {
              $scope.dataList = res.data.data.list;
              $scope.TotalNum = res.data.data.total;
              pageFun1();
            }
          },
          function(data) {
            console.log(data);
          },
          { layer: true }
        );
      }

      getData();

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
            console.log($scope.pageNum, typeof $scope.pageNum);
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

      //加入黑名单
      $scope.addBlackList = function(id) {
        $scope.isConfirmRemove = true;
        $scope.id = id;
      };

      $scope.editPackage = function(id, isCheck) {
        console.log(id, "idididdii");
        $scope.currentId = id;
        if (isCheck) {
          $scope.isCheck = true;
        } else {
          $scope.isCheck = false;
        }
        layer.load(2);
        erp.postFun(
          "supplierPlanInfo/selectPlanById",
          { id },
          function(res) {
            if (res.data.code == 200) {
              $scope.isConfirmRemove = false;
              $scope.packageInfo = res.data.data;
              $scope.isShow = true;
            } else {
              layer.msg("获取套餐详情失败");
            }
            layer.closeAll();
          },
          function(data) {},
          { layer: true }
        );
      };

      $scope.check = function() {
        console.log($scope.$$childTail.checkStatus, $scope);
        if (!$scope.$$childTail.checkStatus) {
          layer.msg("请选择审核状态");
          return;
        }
        layer.confirm("是否确定审核?", { icon: 3, title: "提示" }, function(
          index
        ) {
          layer.load(2);
          var data = {
            id: $scope.packageInfo.id,
            remark: $scope.$$childTail.remark,
            status: parseInt($scope.$$childTail.checkStatus)
          };
          erp.postFun(
            "supplierPlanInfo/updateStatus",
            data,
            function(res) {
              console.log(res);
              if (res.data.code == 200) {
                layer.msg("审核成功");
                $scope.isCheck = false;
                getData();
              } else {
                layer.msg("审核失败");
              }

              layer.close(index);
            },
            function(data) {},
            { layer: true }
          );
          layer.closeAll();
        });
      };

      $scope.checkPackage = function(id) {
        $location
          .path("/ResidentMerchant/packageControl")
          .search({ type: "detail", id });
      };
    }
  ]);
  app.filter("accoutType", function() {
    return function(value) {
      return value ? "个人" : "企业";
    };
  });
  app.filter("suppliersPlanStatus", function() {
    return function(value) {
      switch (value) {
        case 0:
          return "待审核";
        case 1:
          return "审核通过";
        case 2:
          return "审核不通过";
        default:
          return;
      }
    };
  });
  app.filter("payMethodTrans", function() {
    return function(value) {
      switch (value) {
        case 1:
          return "支付宝";
        case 2:
          return "微信";
        case 3:
          return "汇款";
        default:
          return;
      }
    };
  });
  app.filter("tradeTypeTrans", function() {
    return function(value) {
      switch (value) {
        case 1:
          return "运费";
        case 2:
          return "订单";
        case 3:
          return "套餐";
        case 4:
          return "套餐续费";
        case 5:
          return "套餐升级";
        case 6:
          return "试用";
        default:
          return;
      }
    };
  });
})();
