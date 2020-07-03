(function () {
  var app = angular.module("merchandise");
  app.controller("merchandiseTransRecordCtrl", [
    "$scope",
    "erp",
    "$location",
    "$routeParams",
    function ($scope, erp, $location, $routeParams) {
      $scope.pageNum = "1";
      $scope.pageSize = "10";
      function getList() {
        var params = {};
        params.pageNum = $scope.pageNum.toString();
        params.pageSize = $scope.pageSize.toString();
        params.accountName = $scope.accountName;
        params.sku = $scope.sku;
        params.supplier = $scope.supplier;
        layer.load(2);
        erp.postFun(
          "pojo/inventory/getErpAuthorityTransforRecordList",
          params,
          function (res) {
            if (res.data.statusCode === "200") {
              $scope.list = JSON.parse(res.data.result).list;
              $scope.$broadcast("page-data", {
                pageSize: $scope.pageSize.toString(),
                pageNum: $scope.pageNum.toString(),
                totalCounts: JSON.parse(res.data.result).total,
                pageList: ["10", "20", "50"],
              });
            } else {
              layer.msg('查询失败')
            }

            console.log($scope.list, "供应搜品列表");
            layer.closeAll("loading");
          },
          function () {
            layer.msg("请求失败");
            layer.closeAll("loading");
          }
        );
      }
      getList();

      $scope.searchInput = function () {
        $scope.pageNum = "1";
        $scope.pageSize = "10";
        getList();
      };

      $scope.showVariant = function (item, index) {
        console.log(item, index)
        erp.postFun(
          "pojo/inventory/getErpAuthorityVariantsTransforRecords",
          JSON.stringify({ pid: item.pid }),
          function (data) {
            console.log(data);
            if (data.data.statusCode === "200") {
              var result = JSON.parse(data.data.result);
              $scope.list[index].vlist = result.list;
              $scope.list[index].down = true;
            } else {
              layer.msg('查询失败')
            }
          }
        );
      };
      $scope.hideVariant = function (item, index) {
        $scope.list[index].vlist = [];
        $scope.list[index].down = false;
      };

      // 分页触发
      $scope.$on("pagedata-fa", function (d, data) {
        $scope.pageNum = parseInt(data.pageNum);
        $scope.pageSize = parseInt(data.pageSize);
        getList();
      });
    },
  ]);
})();
