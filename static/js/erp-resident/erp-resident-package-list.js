(function() {
  var app = angular.module("erp-resident");
  app.controller("packageListCtrl", [
    "$scope",
    "erp",
    "$routeParams",
    "utils",
    "$location",
    "$filter",
    function($scope, erp, $routeParams, utils, $location, $filter) {
      console.log("packageListCtrl");

      //
      $scope.dataList = [];
      $scope.pageSize = "20";
      $scope.pageNum = 1;
      $scope.val = "1";
      $scope.statusType = "-1";

      //弹窗（是否加入黑名单
      $scope.isConfirmRemove = false;
      $scope.id = "";

      //清空
      function clear() {
        $scope.statusType = "-1";
        $scope.packageName = "";
        $scope.pageNum = 1;
        getData();
      }
      //搜索
      $scope.searchInput = function() {
        $scope.pageNum = 1;
        getData();
      };

      //搜索选择框

      //获取列表
      function getData() {
        console.log($scope.pageNum);
        var data = {
          pageNum: $scope.pageNum + "",
          pageSize: $scope.pageSize,
          status:
            $scope.statusType === "-1"
              ? undefined
              : parseInt($scope.statusType),
          planName: $scope.packageName === "" ? undefined : $scope.packageName
        };
        erp.postFun(
          "erpSupplierPlan/page",
          data,
          function(res) {
            console.log(res);
            // if (res.data.statusCode == 200) {
            if (res.data.code == 200) {
              $scope.dataList = res.data.data.records;
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
      //确定
      $scope.sureBlackList = function() {
        var data = {
          id: $scope.id
        };
        erp.postFun(
          "supplier/supplierShopBlackList/add",
          data,
          function(res) {
            console.log(res);
            if (res.data.code == 200) {
              $scope.isConfirmRemove = false;
              getData();
            }
          },
          function(data) {},
          { layer: true }
        );
      };
      // 启用禁用
      $scope.controlStatus = function(status, id) {
        var data = {
          id: id,
          status: status === 1 ? "0" : "1"
        };
        layer.confirm(
          status === 1 ? "确认禁用该套餐?" : "确认启用该套餐?",
          { icon: 3, title: "提示" },
          function(index) {
            layer.load(2);
            erp.postFun("erpSupplierPlan/updateStatus", data, function(res) {
              console.log(res);
              if (res.data.code === 200) {
                layer.msg(status === 1 ? "禁用套餐成功" : "启用套餐成功");
                getData();
              } else {
                if (res.data.error) {
                  layer.msg(res.data.error);
                } else {
                  layer.msg("操作失败！");
                }
              }
              layer.closeAll("loading");
            });
            layer.close(index);
          }
        );
      };

      // 新建套餐
      $scope.addPackage = function() {
        $location
          .path("/ResidentMerchant/packageControl")
          .search({ type: "add" });
      };

      $scope.editPackage = function(id) {
        $location
          .path("/ResidentMerchant/packageControl")
          .search({ type: "edit", id });
      };
      $scope.checkPackage = function(id) {
        $location
          .path("/ResidentMerchant/packageControl")
          .search({ type: "detail", id });
      };
    }
  ]);
  app.filter("payMethod", function() {
    return function(value) {
      return value ? "按年收费" : "按月收费";
    };
  });
  app.filter("suppliersStatus", function() {
    return function(value, index) {
      if (index === 1) {
        return value ? "启用" : "禁用";
      } else {
        return value ? "禁用" : "启用";
      }
    };
  });
  app.filter("whetherTrans", function() {
    return function(value) {
      return value ? "是" : "否";
    };
  });
})();
