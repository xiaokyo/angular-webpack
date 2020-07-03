(function (angular) {
  angular.module("manage").filter("storageTrans", function () {
    return function (value, obj) {
      console.log(value, obj, "123123213");
      return obj[value];
    };
  });
  angular.module("manage").component("customerRecord", {
    templateUrl:
      "/static/components/customer-private-record/customer-connected.html",
    controller: customerConnectedCtrl,
    bindings: {
      customer: "=",
    },
  });

  function customerConnectedCtrl($scope, erp, $timeout) {
    $scope.$on("customer-list", async function (ev, data) {
      if (data.flag == "show-private-record") {
        $scope.currentData = data.customer;
        $scope.visible = true;
        await getStroageList();
        await getList();
      }
    });
    $scope.currentMenu = 0;
    $scope.pageNum = "1";
    $scope.pageSize = "10";

    function getList() {
      var params = {};
      var url = "pojo/inventory/getErpAccountPrivateLocProductList";
      params.pageNum = $scope.pageNum.toString();
      params.pageSize = $scope.pageSize.toString();
      params.accountId = $scope.currentData.id;
      layer.load(2);
      erp.postFun(
        $scope.url || url,
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
            layer.msg("查询失败");
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

    // 分页触发
    $scope.$on("pagedata-fa", function (d, data) {
      $scope.pageNum = data.pageNum;
      $scope.pageSize = data.pageSize;
      getList();
    });

    function getStroageList() {
      $scope.storageObj = {};
      layer.load(2);
      erp.postFun(
        "app/storagedo/getStorageDoList",
        {},
        function (res) {
          if (res.data.code === "200") {
            res.data.list.forEach((item, index) => {
              $scope.storageObj[item.id] = item.storageName;
              console.log($scope.storageObj);
            });
          } else {
            layer.msg("查询仓库列表失败");
          }
          layer.closeAll("loading");
        },
        function () {
          layer.msg("请求仓库列表失败");
          layer.closeAll("loading");
        }
      );
    }

    $scope.changeMenu = function (i) {
      if (i === 0) {
        $scope.url = false;
      } else {
        $scope.url = "pojo/inventory/getErpAccountPrivateLocProductListRecord";
      }
      $scope.currentMenu = i;
      $scope.pageNum = "1";
      $scope.pageSize = "10";
      getList();
    };

    $scope.closeTan = function () {
      $scope.visible = false;
    };

    $scope.showVariant = function (item, index) {
      console.log("123");
      $scope.list[index].down = true;
    };
    $scope.hideVariant = function (item, index) {
      $scope.list[index].down = false;
    };
  }
})(angular);
