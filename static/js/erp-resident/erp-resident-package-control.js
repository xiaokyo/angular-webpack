(function() {
  var app = angular.module("erp-resident");
  app.controller("packageControlCtrl", [
    "$scope",
    "erp",
    "$routeParams",
    "utils",
    "$timeout",
    "$location",
    "$filter",

    function($scope, erp, $routeParams, utils, $timeout, $location, $filter) {
      $scope.isDetail = false;
      $scope.type = $location.search().type;
      $scope.id = $location.search().id;
      $scope.controlDesc = $filter("controlTrans")($scope.type);


      $scope.test = function() {
        console.log($scope)
      }

      function myMsg(str) {
        //提示框
        return layer.msg(str);
      }
      $scope.getDetailInfo = function() {
        var data = {
          id: $scope.id
        };
        layer.load(2);
        erp.postFun("erpSupplierPlan/planDetail", data, function(res) {
          console.log(res);
          if (res.data.code === 200) {
            var resData = res.data.data;
            $scope.packageName = resData.planName;
            $scope.sort = resData.sortNumber;
            $scope.baseType = resData.defaultPlan;
            $scope.picurl = resData.accountLogoUrl;
            $scope.uploadProduct = resData.productUploadNumber;
            $scope.isSelfDelivery = resData.selfdeliverySupportWhether;
            $scope.rentTime = resData.warehouseRental;
            $scope.txFee = resData.transactionFeeScale;
            $scope.selfDeliveryFee = resData.selfdeliveryTransactionFeeScale;
            $scope.isWithoutOrdDealFee = resData.noProcessingFeeWhether;
            $scope.isHelpSale = resData.boostSalesWhether;
            $scope.secProdQuotn = resData.searchProductQuote;
            $scope.isChatFunc = resData.informationCommunicateWhether;
            $scope.iscustomizeDN = resData.customDomainNameWhether;
            $scope.isNewProjectCoop = resData.newProjectCooperationWhether;
            $scope.isDelicateShop = resData.exquisiteShopWhether;
            $scope.packageStatus = resData.status;
            ($scope.planFeeYear = resData.planFeeYear),
              ($scope.planFeeMonth = resData.planFeeMonth),
              ($scope.remark = resData.remark);
          } else {
            layer.msg("获取套餐详情失败！");
          }
          layer.closeAll("loading");
        });
      };
      if ($scope.type === "edit") {
        $scope.getDetailInfo();
      } else if ($scope.type === "detail") {
        $scope.isDetail = true;
        $scope.getDetailInfo();
      }
      $scope.back = function() {
        $location.path("ResidentMerchant/packageManagement").search({});
      };

      $scope.clearImg = () => {
        $scope.picurl = ''
      }

      $scope.add = function() {
        console.log($scope);
        var data = {
          planName: $scope.packageName,
          accountLogoUrl: $scope.picurl,
          defaultPlan: parseInt($scope.baseType),
          sortNumber: parseInt($scope.sort),
          productUploadNumber: parseInt($scope.uploadProduct),
          selfdeliverySupportWhether: parseInt($scope.isSelfDelivery),
          warehouseRental: parseInt($scope.rentTime),
          transactionFeeScale: parseFloat($scope.txFee),
          selfdeliveryTransactionFeeScale: parseFloat($scope.selfDeliveryFee),
          noProcessingFeeWhether: parseInt($scope.isWithoutOrdDealFee),
          boostSalesWhether: parseInt($scope.isHelpSale),
          searchProductQuote: parseInt($scope.secProdQuotn),
          informationCommunicateWhether: parseInt($scope.isChatFunc),
          customDomainNameWhether: parseInt($scope.iscustomizeDN),
          newProjectCooperationWhether: parseInt($scope.isNewProjectCoop),
          exquisiteShopWhether: parseInt($scope.isDelicateShop),
          status: parseInt($scope.packageStatus),
          planFeeMonth: parseFloat($scope.planFeeMonth),
          planFeeYear: parseFloat($scope.planFeeYear),
          remark: $scope.remark
        };
        if ($scope.type === "edit") {
          data.id = $scope.id;
        }
        console.log(data);
        layer.load(2);
        erp.postFun("erpSupplierPlan/saveOrUpdatePlan", data, function(res) {
          console.log(res);
          if (res.data.code === 200) {
            layer.msg(
              $scope.type === "add" ? "新建套餐成功！" : "修改套餐成功！"
            );
            $location.path("ResidentMerchant/packageManagement");
          } else {
            if (res.data.error) {
              layer.msg(res.data.error);
            } else {
              layer.msg(
                $scope.type === "add" ? "新建套餐失败！" : "修改套餐失败！"
              );
            }
          }
          layer.closeAll("loading");
        });
      };
      $scope.confirmOpera = function() {
        layer.confirm(
          $scope.type === "add" ? "确认新增套餐?" : "确认修改套餐?",
          { icon: 3, title: "提示" },
          function(index) {
            $scope.add();
            layer.close(index);
          }
        );
      };
      $scope.uploadImg = function() {
        cjUtils.readLocalFile({}).then(res => {
          res.FileArr.forEach(({ file }) => {
            // output url for preview by base64=> json.base64
            // console.log('uploadImg --------->  ', file);
            const { type, size } = file;
            if (/(png|jpe?g)$/.test(type) === false)
              return myMsg("上传文件仅支持jpg或png格式");
            if (Math.ceil(size / (1024 * 1024) > 10))
              return myMsg("上传文件不能超过10m");
            erp.load();
            const isOnline = window.environment.includes("production");
            const ossUrl = isOnline
              ? "https://app.cjdropshipping.com/app/oss/policy"
              : "http://erp.test.com/app/oss/policy";
            cjUtils
              .uploadFileToOSS({ file, signatureURL: ossUrl })
              .then(url => {
                //async url for saving =>
                $timeout(function() {
                  $scope.picurl = url;
                }, 0);
                myMsg("图片上传成功");
                erp.closeLoad();
              })
              .catch(err => {
                console.log("uploadImg err => ", err);
                $timeout(function() {
                  $scope.picurl = "";
                }, 0);
                myMsg("图片上传失败");
                erp.closeLoad();
              });
          });
        });
      };
    }
  ]);
  app.filter("titleTrans", function() {
    return function(value) {
      switch (value) {
        case "add":
          return "新建套餐";
        case "edit":
          return "修改套餐";
        case "detail":
          return "套餐详情";
        default:
          return;
      }
    };
  });
  app.filter("controlTrans", function() {
    return function(value) {
      switch (value) {
        case "add":
          return "新建";
        case "edit":
          return "保存";
        case "detail":
          return "返回";
        default:
          return;
      }
    };
  });
})();
