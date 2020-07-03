(function (angular) {

  angular.module('manage')
    .component('customerSkulist', {
      templateUrl: '/static/components/customer-skulist/customer-skulist.html',
      controller: customerSkulistCtrl,
      bindings: {
        customer:'='
      }
    })

  function customerSkulistCtrl($scope, erp, $timeout) {

    const lang = localStorage.getItem('lang') || 'cn';
    $scope.sendData = {
      discount: "",
      freightdiscount: ''
    };
    var gjh01;
    var gjh02;
    var gjh03;
    var gjh04;
    var gjh05;
    var gjh06;
    var gjh07;
    var gjh08;
    var gjh09;
    var gjh10;
    var gjh11;
    var gjh12;
    var gjh13;
    var gjh14;
    var gjh15;
    var gjh16;
    var gjh28;
    if (lang == 'cn' || lang == null) {
      gjh01 = '请选择物流';
      gjh02 = '该物流已经存在，不能重复添加！';
      gjh03 = '请先将所有物流方式保存';
      gjh04 = '请给';
      gjh05 = '设置优先级';
      gjh06 = '保存失败';
      gjh07 = '保存成功';
      gjh08 = '您还没有保存修改的信息，确定退出吗？';
      gjh09 = '确定';
      gjh10 = '取消';
      gjh11 = '请选择国家';
      gjh12 = '该国家已经存在，不能重复添加！';
      gjh13 = '请输入大于0的数字';
      gjh14 = '折扣不能设置为小数';
      gjh15 = '公式错误';
      gjh16 = '请输入大于0小于100的整数';
      gjh28 = '网络错误';
    } else if (lang == 'en') {
      gjh01 = 'Please choose logistics';
      gjh02 = 'The logistics already exists and cannot be added again!';
      gjh03 = 'Please save all logistics methods first';
      gjh04 = 'Please give';
      gjh05 = 'Set the priority';
      gjh06 = 'Failed to save';
      gjh07 = 'Saved successfully';
      gjh08 = 'You haven’t saved the edited information. Are you sure you want to exit?';
      gjh09 = 'Confirm ';
      gjh10 = 'Cancel';
      gjh11 = 'Please select a country';
      gjh12 = 'The country already exists and cannot be added twice!';
      gjh13 = 'Please enter a number greater than 0';
      gjh14 = 'Discount cannot be set to decimal';
      gjh15 = 'Formula error';
      gjh16 = 'Please enter an integer greater than 0 and less than 100';
      gjh28 = 'Network Error';
    }
    
    $scope.$on('customer-list', function (ev, data) {
      if (data.flag == 'show-customer-skulist') {
        $scope.setWuliuItem = data.customer
        // $scope.guanlianshangpin($scope.setWuliuItem);
        $scope.skulistshangpin($scope.setWuliuItem);
      }
    })


    $scope.wuliuArr = [];

    function renderWuliuRateArr() {
      var wuliuRateArr = [];
      var di;
      var wuliu;
      if (lang == 'cn' || lang == null) {
        di = "第";
        wuliu = "物流";
      } else if (lang == 'en') {
        di = "No.";
        wuliu = "Logistic";
      }
      for (var i = 0; i < $scope.wuliuArr.length; i++) {
        wuliuRateArr.push({
          id: i + 1,
          name: di + (i + 1) + wuliu
        });
      }
      $scope.wuliuRateArr = wuliuRateArr;
    }

    $scope.addOneWuliu = function () {
      // $scope.wuliuArr.push(3);
      $scope.addWuliuFlag = true;
    }
    $scope.canceladdWuliu = function () {
      $scope.addWuliuFlag = false;
    }

    function iniCountryArr() {
      var deCountryArr = {};
      deCountryArr.countryName = '';
      deCountryArr.countryCode = '--';
      deCountryArr.shipPrice = 0;
      deCountryArr.shipPriceTem = 0;
      deCountryArr.shipPriceDis = 0;
      deCountryArr.shipPriceDisTem = 0;
      deCountryArr.default = true;
      deCountryArr.amountPrice = $scope.setWuliuItem.SELLPRICE;
      deCountryArr.amountPriceTem = $scope.setWuliuItem.SELLPRICE;
      deCountryArr.amountPriceDis = $scope.setWuliuItem.discountPrice;
      deCountryArr.amountPriceDisTem = $scope.setWuliuItem.discountPrice;
      deCountryArr.noCountryGs = true;
      return [deCountryArr];
    }

    $scope.goActaddWuliu = function () {
      if (!$scope.addWuliuName) {
        layer.msg(gjh01);
        return;
      }
      if (erp.findIndexByKey($scope.wuliuArr, 'wuliuName', $scope.addWuliuName) != -1) {
        layer.msg(gjh02);
        return;
      }
      var addCoun = {};
      addCoun.wuliuName = $scope.addWuliuName;
      addCoun.wuliuCountTem = 0;
      console.log(iniCountryArr());
      addCoun.countryArr = iniCountryArr();
      // addCoun.noCountryGs = true;
      addCoun.showCountryArr = addCoun.countryArr;
      addCoun.wuliuGradeTem = $scope.wuliuArr.length + 1 + '';
      addCoun.newAddFlag = true;
      addCoun.editFlag = true;
      $scope.wuliuArr.push(addCoun);
      renderWuliuRateArr();
      $scope.addWuliuFlag = false;
    }
    $scope.setWuliuFlag = false;
    var sendReqFlag;
    var oriWuliuArr = [];
    $scope.setWuliu = function (item, index1, $event) {
      //获取物流方式
      var getWayData = {};
      getWayData.weight = item.packweight;
      getWayData.lcharacter = item.PROPERTYKEY;
      erp.postFun2('getWayBy.json', JSON.stringify(getWayData), function (n) {
        console.log('物流', n)
        $scope.filterWuliuList = n.data;
        // $scope.addWuliuName = $scope.filterWuliuList[0].enName;
      }, err);

      sendReqFlag = false;
      $scope.setWuliuFlag = true;
      $scope.setWuliuItem = item;
      $scope.setWuliuItem.index = index1;
      if (!item.logisticsInfoId) {
        oriWuliuArr = [];
        $scope.wuliuArr = [];
        renderWuliuRateArr();
        return;
      }
      erp.postFun('app/rebate/getModifyAccProduct', {
        "id": $scope.setWuliuItem.logisticsInfoId,
        "weight": item.packweight,
        "shopType": item.shopType
      }, function (data) {
        console.log(data);
        if (data.data.length == 0) {
          oriWuliuArr = [];
          $scope.wuliuArr = [];
          return;
        }
        // console.log(JSON.parse(data.data[0].logisticsInfo));
        var res = data.data;
        var temArr = [];
        for (var i = 0; i < res.length; i++) {
          var temObj = {};
          temObj.wuliuName = res[i].logiName;
          temObj.wuliuCount = res[i].logiDiscount;
          temObj.wuliuGrade = res[i].sort;
          temObj.countryArr = [];
          console.log(res[i].logiCoun.length);
          if (res[i].logiCoun.length > 0) {
            for (var j = 0; j < res[i].logiCoun.length; j++) {
              var shipPrice = res[i].logiCoun[j].logisticsPrice;
              var shipPriceDis = cacuDiscount(res[i].logiCoun[j].logisticsPrice, res[i].logiDiscount);
              temObj.countryArr.push({
                countryName: res[i].logiCoun[j].counName,
                countryCode: res[i].logiCoun[j].counCode,
                countryGs: res[i].logiCoun[j].counGs,
                countryGsInp: res[i].logiCoun[j].counGs,
                noCountryGs: res[i].logiCoun[j].noCountryGs,
                deCountryGs: res[i].logiCoun[j].deCountryGs,
                shipPrice: shipPrice,
                shipPriceDis: shipPriceDis,
                amountPrice: erp.cacuAmount(shipPrice, item.SELLPRICE),
                amountPriceDis: erp.cacuAmount(shipPriceDis, item.discountPrice)
              });
            }
          } else {
            temObj.countryArr = iniCountryArr();
          }
          temObj.showCountryArr = temObj.countryArr;
          temArr.push(temObj);
          temObj = null;
        }

        oriWuliuArr = JSON.parse(JSON.stringify(temArr));
        $scope.wuliuArr = JSON.parse(JSON.stringify(temArr));
        renderWuliuRateArr();
        console.log($scope.wuliuArr);
        temArr = null;
      }, err);


    }
    $scope.submitWuliu = function () {
      for (var i = 0; i < $scope.wuliuArr.length; i++) {
        if ($scope.wuliuArr[i].editFlag) {
          layer.msg(gjh03);
          return;
        }
        if (!$scope.wuliuArr[i].wuliuGrade) {
          layer.msg(gjh04 + $scope.wuliuArr[i].wuliuName + gjh05);
          return;
        }
      }
      console.log($scope.wuliuArr);
      var sendJson = {};
      var sendUrl;
      var defaultWuliu = {};
      if ($scope.isskulist) {
        sendJson.productId = $scope.setWuliuItem.productId;
        sendJson.userId = $scope.nowOpeUserId;
        sendUrl = 'app/rebate/newModifyPriceRateAll';
      }

      if ($scope.setWuliuItem.logisticsInfoId) {
        sendJson.logisticsInfoId = $scope.setWuliuItem.logisticsInfoId;
      }
      var logisticsInfo = [];
      for (var i = 0; i < $scope.wuliuArr.length; i++) {
        if ($scope.wuliuArr[i].wuliuGrade == 1) {
          defaultWuliu.wuliuName = $scope.wuliuArr[i].wuliuName;
          defaultWuliu.wuliuCount = $scope.wuliuArr[i].wuliuCount;
          if (!$scope.wuliuArr[i].countryArr[0].default) {
            defaultWuliu.countryName = $scope.wuliuArr[i].countryArr[0].countryName;
            defaultWuliu.countryCode = $scope.wuliuArr[i].countryArr[0].countryCode;
            defaultWuliu.shipPrice = $scope.wuliuArr[i].countryArr[0].shipPrice;
            defaultWuliu.shipPriceDis = $scope.wuliuArr[i].countryArr[0].shipPriceDis;
            defaultWuliu.amountPrice = $scope.wuliuArr[i].countryArr[0].amountPrice;
            defaultWuliu.amountPriceDis = $scope.wuliuArr[i].countryArr[0].amountPriceDis;
          } else {
            defaultWuliu.amountPrice = $scope.setWuliuItem.SELLPRICE;
            defaultWuliu.amountPriceDis = $scope.setWuliuItem.discountPrice;
          }
        }
        var temObj = {};
        temObj.logiName = $scope.wuliuArr[i].wuliuName;
        temObj.logiDiscount = $scope.wuliuArr[i].wuliuCount;
        temObj.sort = $scope.wuliuArr[i].wuliuGrade;
        temObj.logiCoun = [];
        if (!$scope.wuliuArr[i].countryArr[0].default) {
          for (var j = 0; j < $scope.wuliuArr[i].countryArr.length; j++) {
            temObj.logiCoun.push({
              counName: $scope.wuliuArr[i].countryArr[j].countryName,
              counCode: $scope.wuliuArr[i].countryArr[j].countryCode,
              counGs: $scope.wuliuArr[i].countryArr[j].countryGsInp,
              noCountryGs: $scope.wuliuArr[i].countryArr[j].noCountryGs,
              deCountryGs: $scope.wuliuArr[i].countryArr[j].deCountryGs
              // counGs: $scope.wuliuArr[i].countryArr[j].countryGs
            });
          }
        }
        logisticsInfo.push(temObj);
        temObj = null;
      }
      sendJson.logisticsInfo = JSON.stringify(logisticsInfo);
      sendJson = JSON.stringify(sendJson);
      console.log(sendJson);

      // app/rebate/newModifyAccProduct
      // accpid, shopId, logisticsInfo
      erp.postFun(sendUrl, sendJson, function (data) {
        console.log(data);
        if (data.data.result != 1) {
          layer.msg(gjh06);
          return;
        }
        sendReqFlag = true;
        layer.msg(gjh07);
        console.log(defaultWuliu);
        $scope.excellist[$scope.setWuliuItem.index].LOGISTICS = defaultWuliu.wuliuName;
        $scope.excellist[$scope.setWuliuItem.index].FREIGHTDISCOUNT = defaultWuliu.wuliuCount;
        $scope.excellist[$scope.setWuliuItem.index].erpdecountry = defaultWuliu.countryName;
        $scope.excellist[$scope.setWuliuItem.index].erpdeltPrice = defaultWuliu.shipPrice;
        $scope.excellist[$scope.setWuliuItem.index].shipCostDiscount = defaultWuliu.shipPriceDis;
        $scope.excellist[$scope.setWuliuItem.index].amount = defaultWuliu.amountPrice;
        $scope.excellist[$scope.setWuliuItem.index].amountDiscount = defaultWuliu.amountPriceDis;
        var profitRatePrice = erp.cacuProfitRate($scope.setWuliuItem.discountPrice, $scope.setWuliuItem.COSTPRICE);
        var profitRateShip = erp.cacuProfitRate(100 - defaultWuliu.wuliuCount, $scope.shipDefaultProfitRate);
        $scope.excellist[$scope.setWuliuItem.index].profitRate = erp.cacuAverage(profitRatePrice, profitRateShip);
        // $scope.excellist[$scope.setWuliuItem.index].logisticsInfoId = data.data.id;
        $scope.closeSetWuliu();
      }, err);

    }
    $scope.closeSetWuliu = function () {
      if (!sendReqFlag && JSON.stringify($scope.wuliuArr) != JSON.stringify(oriWuliuArr)) {
        layer.confirm(gjh08, {
          btn: [gjh09, gjh10] //按钮
        }, function (index) {
          // sendReqFlag = true;
          $timeout(function () {
            $scope.setWuliuItem = null;
            oriWuliuArr = [];
            $scope.wuliuArr = [];
            renderWuliuRateArr();
            $scope.setWuliuFlag = false;
            layer.close(index);
          }, 0);
        }, function (index) {
          layer.close(index);
        });
        return;
      }
      sendReqFlag = true;
      $scope.setWuliuItem = null;
      oriWuliuArr = [];
      $scope.wuliuArr = [];
      renderWuliuRateArr();
      $scope.setWuliuFlag = false;
    }
    $scope.editOneWuliu = function (item1, index1) {
      $scope.showAllCoun(null, null, index1);
      $scope.wuliuArr[index1].wuliuCountTem = $scope.wuliuArr[index1].wuliuCount;
      $scope.wuliuArr[index1].wuliuGradeTem = $scope.wuliuArr[index1].wuliuGrade;
      for (var i = 0; i < $scope.wuliuArr[index1].countryArr.length; i++) {
        // $scope.wuliuArr[index1].countryArr[i].countryGsInp = $scope.wuliuArr[index1].countryArr[i].countryGs;
        $scope.wuliuArr[index1].countryArr[i].shipPriceTem = $scope.wuliuArr[index1].countryArr[i].shipPrice;
        $scope.wuliuArr[index1].countryArr[i].shipPriceDisTem = $scope.wuliuArr[index1].countryArr[i].shipPriceDis;
        $scope.wuliuArr[index1].countryArr[i].amountPriceTem = $scope.wuliuArr[index1].countryArr[i].amountPrice;
        $scope.wuliuArr[index1].countryArr[i].amountPriceDisTem = $scope.wuliuArr[index1].countryArr[i].amountPriceDis;
      }
      $scope.wuliuArr[index1].editFlag = true;
    }
    $scope.deleteOneWuliu = function (item1, index1) {
      $scope.wuliuArr.splice(index1, 1);
      renderWuliuRateArr();
      for (var i = 0; i < $scope.wuliuArr.length; i++) {
        if ($scope.wuliuArr[i].wuliuGrade > $scope.wuliuRateArr.length) {
          $scope.wuliuArr[i].wuliuGrade = '';
        }
      }
    }
    $scope.saveOneWuliu = function (item1, index1) {
      if (Number(item1.wuliuCountTem) > 100 || Number(item1.wuliuCountTem) < 0) {
        layer.msg(gjh16);
        return;
      }
      if (item1.newAddFlag) {
        $scope.wuliuArr[index1].newAddFlag = null;
      }
      $scope.wuliuArr[index1].wuliuCount = $scope.wuliuArr[index1].wuliuCountTem;
      $scope.wuliuArr[index1].wuliuGrade = $scope.wuliuArr[index1].wuliuGradeTem;
      for (var i = 0; i < $scope.wuliuArr[index1].countryArr.length; i++) {
        if ($scope.wuliuArr[index1].countryArr[i].newAddFlag) {
          $scope.wuliuArr[index1].countryArr[i].newAddFlag = null;
        }
        if ($scope.wuliuArr[index1].countryArr[i].countryGsInp) {
          $scope.wuliuArr[index1].countryArr[i].countryGs = $scope.wuliuArr[index1].countryArr[i].countryGsInp;
        }
        $scope.wuliuArr[index1].countryArr[i].shipPrice = $scope.wuliuArr[index1].countryArr[i].shipPriceTem;
        $scope.wuliuArr[index1].countryArr[i].shipPriceDis = $scope.wuliuArr[index1].countryArr[i].shipPriceDisTem;
        $scope.wuliuArr[index1].countryArr[i].amountPrice = $scope.wuliuArr[index1].countryArr[i].amountPriceTem;
        $scope.wuliuArr[index1].countryArr[i].amountPriceDis = $scope.wuliuArr[index1].countryArr[i].amountPriceDisTem;
      }
      $scope.wuliuArr[index1].showCountryArr = $scope.wuliuArr[index1].countryArr;
      var nowWuliuRate = item1.wuliuGrade;
      for (var i = 0; i < $scope.wuliuArr.length; i++) {
        if (i == index1) continue;
        if ($scope.wuliuArr[i].wuliuGrade == nowWuliuRate) {
          $scope.wuliuArr[i].wuliuGrade = '';
        }
      }
      $scope.wuliuArr[index1].editFlag = false;
    }
    $scope.cacelOneWuliu = function (item1, index1) {
      if (item1.newAddFlag) {
        $scope.deleteOneWuliu(item1, index1);
        return;
      }
      $scope.wuliuArr[index1].wuliuCountTem = 0;
      $scope.wuliuArr[index1].wuliuGradeTem = '';
      if (!$scope.wuliuArr[index1].countryArr[0].default) {
        var filterArr = [];
        for (var i = 0; i < $scope.wuliuArr[index1].countryArr.length; i++) {
          if (!$scope.wuliuArr[index1].countryArr[i].newAddFlag) {
            filterArr.push($scope.wuliuArr[index1].countryArr[i]);
          }
        }
        for (var j = 0; j < filterArr.length; j++) {
          // filterArr[j].countryGsInp = '';
          filterArr[j].shipPriceTem = 0;
          filterArr[j].shipPriceDisTem = 0;
          filterArr[j].amountPriceTem = 0;
          filterArr[j].amountPriceDisTem = 0;
        }
        if (filterArr.length == 0) {
          filterArr = iniCountryArr();
        }
        $scope.wuliuArr[index1].showCountryArr = $scope.wuliuArr[index1].countryArr = filterArr;
      }
      $scope.wuliuArr[index1].editFlag = false;
    }
    $scope.oneCounFlag = true;
    $scope.banchAddCounArr = [];
    $scope.changeAddCounType = function (flag) {
      $scope.oneCounFlag = !flag;
    }
    $scope.checkOneCoun = function (flag, item) {
      if (flag) {
        $scope.banchAddCounArr.push(item);
      } else {
        $scope.banchAddCounArr.splice($scope.banchAddCounArr.indexOf(item), 1);
      }
      console.log($scope.banchAddCounArr);
    }
    $scope.addOneCoun = function (item2, index2, index1) {
      // $scope.wuliuArr[index1].countryArr.splice(index2, 0, 1);
      $scope.addCounFlag = true;
      $scope.addCounIndex = index1;
      $scope.addCounIndex2 = $scope.wuliuArr[index1].countryArr.length;
      erp.postFun2('lc/erplogistics/getLogisticCountry', JSON.stringify({ loginsticName: $scope.wuliuArr[index1].wuliuName }), function (n) {
        console.log('国家', n)
        var result = n.data;
        $scope.filterCounList = [];
        var filterArr = [];
        var opeArr = $scope.wuliuArr[$scope.addCounIndex];
        if (!opeArr.countryArr[0].default) {
          for (var i = 0; i < opeArr.countryArr.length; i++) {
            filterArr.push(opeArr.countryArr[i].countryCode);
          }
        }
        if (filterArr.length > 0) {
          for (var j = 0; j < result.length; j++) {
            if (filterArr.indexOf(result[j].country) == -1) {
              $scope.filterCounList.push(result[j]);
            }
          }
        } else {
          $scope.filterCounList = result;
        }
        $scope.addCounList = $scope.filterCounList;
        // $scope.addCounName = $scope.filterCounList[0].country + '-' + $scope.filterCounList[0].countryfull;
      }, err);
      $scope.addWuliuName = '';
    }
    $scope.canceladdCoun = function () {
      $scope.addCounFlag = false;
      $scope.oneCounFlag = true;
      $scope.addCounType = false;
    }
    $scope.goActaddCoun = function () {
      if ($scope.oneCounFlag && !$scope.addCounName) {
        layer.msg(gjh11);
        // alert(1);
        return;
      }
      if (!$scope.oneCounFlag && $scope.banchAddCounArr.length == 0) {
        layer.msg(gjh11);
        // alert(2)
        return;
      }
      var operateArr = $scope.wuliuArr[$scope.addCounIndex];
      if (!$scope.oneCounFlag) {
        if ($scope.addCounIndex2 == 1 && operateArr.countryArr[0].default) {
          operateArr.countryArr = [];
        }
        for (var i = 0; i < $scope.banchAddCounArr.length; i++) {
          operateArr.countryArr.push({
            countryName: $scope.banchAddCounArr[i].countryfull,
            countryCode: $scope.banchAddCounArr[i].country,
            noCountryGs: false,
            countryGs: '',
            shipPriceTem: 0,
            shipPriceDisTem: 0,
            amountPriceTem: 0,
            amountPriceDisTem: 0,
            newAddFlag: true
          });
        }
        $scope.banchAddCounArr = [];
        // alert(3)
        $scope.addCounFlag = false;
        operateArr.showCountryArr = operateArr.countryArr;
        $scope.oneCounFlag = true;
        $scope.addCounType = false;
        return;
      }
      var countryCode = $scope.addCounName.split('-')[0];
      var countryName = $scope.addCounName.split('-')[1];
      if (erp.findIndexByKey(operateArr.countryArr, 'countryCode', countryCode) != -1) {
        layer.msg(gjh12);
        return;
      }
      erp.load();
      erp.postFun2('lc/erpBusiness/getFormula', JSON.stringify({
        weight: $scope.setWuliuItem.packweight,
        country: countryCode,
        character: $scope.setWuliuItem.PROPERTYKEY,
        enName: operateArr.wuliuName,
        formula: ''
      }), function (n) {
        erp.closeLoad();
        console.log('运费计算', n);
        // if (n.data.code != 200) {
        //   layer.msg(n.data.code);
        //   return;
        // }
        var shipPriceTem = n.data.price;
        var shipPriceDisTem = cacuDiscount(shipPriceTem, operateArr.wuliuCountTem);
        var amountPriceTem = erp.cacuAmount($scope.setWuliuItem.SELLPRICE, shipPriceTem);
        var amountPriceDisTem = erp.cacuAmount($scope.setWuliuItem.discountPrice, shipPriceDisTem);

        if ($scope.addCounIndex2 == 1 && operateArr.countryArr[0].default) {
          operateArr.countryArr[0].countryName = countryName;
          operateArr.countryArr[0].countryCode = countryCode;
          if (n.data.formula == '') {
            operateArr.countryArr[0].noCountryGs = true;
            // operateArr.countryArr[0].countryGsInp = n.data.result[0].formula;
          } else {
            operateArr.countryArr[0].noCountryGs = false;
            operateArr.countryArr[0].countryGs = n.data.formula.enName;
            operateArr.countryArr[0].deCountryGs = n.data.formula.enName;
            // operateArr.countryArr[0].countryGsInp = n.data.formula;
          }
          operateArr.countryArr[0].shipPriceTem = shipPriceTem;
          operateArr.countryArr[0].shipPriceDisTem = shipPriceDisTem;
          operateArr.countryArr[0].amountPriceTem = amountPriceTem;
          operateArr.countryArr[0].amountPriceDisTem = amountPriceDisTem;
          operateArr.countryArr[0].default = null;
          operateArr.countryArr[0].newAddFlag = true;
          // operateArr.countryArr[0].editGsFlag = false;
        } else {
          var addArr = {};
          addArr.countryName = countryName;
          addArr.countryCode = countryCode;
          if (n.data.formula == '') {
            addArr.noCountryGs = true;
          } else {
            addArr.noCountryGs = false;
            addArr.countryGs = n.data.formula.enName;
            addArr.deCountryGs = n.data.formula.enName;
            // addArr.countryGsInp = n.data.formula;
          }
          addArr.shipPriceTem = shipPriceTem;
          addArr.shipPriceDisTem = shipPriceDisTem;
          addArr.amountPriceTem = amountPriceTem;
          addArr.amountPriceDisTem = amountPriceDisTem;
          addArr.newAddFlag = true;
          // addArr.editGsFlag = false;
          operateArr.countryArr.push(addArr);
        }
        // operateArr.wuliuCountTem = operateArr.wuliuCount = 0;
        operateArr.showCountryArr = operateArr.countryArr;
        $scope.addCounFlag = false;
        $scope.addCounName = '';
      }, err)
    }
    $scope.removeOneCoun = function (item2, index2, index1) {
      if ($scope.wuliuArr[index1].countryArr.length == 1) {
        $scope.wuliuArr[index1].showCountryArr = $scope.wuliuArr[index1].countryArr = iniCountryArr();
      } else {
        $scope.wuliuArr[index1].countryArr.splice(index2, 1);
      }
    }
    $scope.showOneCoun = function (item2, index2, index1) {
      $scope.wuliuArr[index1].showCountryArr = $scope.wuliuArr[index1].countryArr.slice(0, 1);
      console.log($scope.wuliuArr[index1].showCountryArr);
      $scope.wuliuArr[index1].hideCountry = true;
    }
    $scope.showAllCoun = function (item2, index2, index1) {
      $scope.wuliuArr[index1].showCountryArr = $scope.wuliuArr[index1].countryArr;
      $scope.wuliuArr[index1].hideCountry = false;
    }
    $scope.freshShipCost = function (item1, index1) {
      if (isNaN($scope.wuliuArr[index1].wuliuCountTem * 1) || $scope.wuliuArr[index1].wuliuCountTem * 1 < 0) {
        layer.msg(gjh13);
        $scope.wuliuArr[index1].wuliuCountTem = '0';
      } else if (String($scope.wuliuArr[index1].wuliuCountTem).indexOf(".") > -1) {
        layer.msg(gjh14);
        $scope.wuliuArr[index1].wuliuCountTem = '0';
      }
      var nowPrice;
      for (var i = 0; i < $scope.wuliuArr[index1].countryArr.length; i++) {
        nowPrice = cacuDiscount($scope.wuliuArr[index1].countryArr[i].shipPriceTem, $scope.wuliuArr[index1].wuliuCountTem);
        $scope.wuliuArr[index1].countryArr[i].shipPriceDisTem = nowPrice;
        $scope.wuliuArr[index1].countryArr[i].amountPriceDisTem = erp.cacuAmount($scope.setWuliuItem.discountPrice, nowPrice);
      }
      nowPrice = null;
    }
    $scope.getShipCostGs = function (item2, index2, index1) {
      var temObj = {};
      temObj[$scope.wuliuArr[index1].wuliuName] = $scope.wuliuArr[index1].countryArr[index2].countryGsInp;
      console.log($scope.wuliuArr[index1].wuliuName, $scope.wuliuArr[index1].countryArr[index2].countryGsInp, temObj)
      erp.postFun2('lc/erpBusiness/getFormula', JSON.stringify({
        weight: $scope.setWuliuItem.packweight,
        country: $scope.wuliuArr[index1].countryArr[index2].countryCode,
        character: $scope.setWuliuItem.PROPERTYKEY,
        enName: $scope.wuliuArr[index1].wuliuName,
        formula: JSON.stringify(temObj)
      }), function (n) {
        console.log('运费计算', n);
        if (n.data.price == 'null' || n.data.price == 'null -- null') {
          layer.msg(gjh15);
          $scope.wuliuArr[index1].countryArr[index2].countryGsInp = '';
          return;
        }
        var nowPrice = n.data.price;
        var disPrice = cacuDiscount(nowPrice, $scope.wuliuArr[index1].wuliuCountTem);
        $scope.wuliuArr[index1].countryArr[index2].shipPriceTem = nowPrice;
        $scope.wuliuArr[index1].countryArr[index2].shipPriceDisTem = disPrice;
        $scope.wuliuArr[index1].countryArr[index2].amountPriceTem = erp.cacuAmount($scope.setWuliuItem.discountPrice, nowPrice);
        $scope.wuliuArr[index1].countryArr[index2].amountPriceDisTem = erp.cacuAmount($scope.setWuliuItem.discountPrice, disPrice);

      }, err)
    }
    $scope.showFulltext = function (e) {
      console.log(e);
      var that = e.currentTarget;
      // layer.tips(e.currentTarget.innerText, that);
      layer.tips(e.currentTarget.innerText, that, {
        tips: [1, '#3595CC'],
        time: 4000
      });
      //在元素的事件回调体中，follow直接赋予this即可
    }

    // 计算折扣价
    function cacuDiscount(price, discount) {
      if (!price) {
        return 0;
      }
      var priceRes;
      var price = (price + '').replace(' -- ', '--');
      var discount = (discount + '').replace(' -- ', '--');
      var discountArr;
      var priceArr;
      if (price.indexOf('--') == -1) {
        if (discount.indexOf('--') == -1) {
          priceRes = (price * (100 - discount * 1) / 100).toFixed(2);
        } else {
          discountArr = discount.split('--');
          priceRes = (price * (100 - discountArr[0] * 1) / 100).toFixed(2) + '--' + (price * (100 - discountArr[1] * 1) / 100).toFixed(2);
        }
      } else {
        priceArr = price.split('--');
        if (discount.indexOf('--') == -1) {
          priceRes = (priceArr[0] * (100 - discount * 1) / 100).toFixed(2) + '--' + (priceArr[1] * (100 - discount * 1) / 100).toFixed(2);
        } else {
          discountArr = discount.split('--');
          priceRes = (priceArr[0] * (100 - discountArr[0] * 1) / 100).toFixed(2) + '--' + (priceArr[1] * (100 - discountArr[1]) / 100).toFixed(2);
        }
      }
      return priceRes;
    }


    // var discountPrice;
    var discountPriceTem;
    // var SELLDISCOUNT;
    var SELLDISCOUNTtem;
    // var amountDiscount;
    var amountDiscountTem;
    // var profitRate;
    var profitRateTem;

    $scope.changeSellRate = function () {
      $scope.editProItem.discountPrice = cacuDiscount($scope.editProItem.SELLPRICE, $scope.sendData.discount || 0);
      $scope.editProItem.SELLDISCOUNT = $scope.sendData.discount;
      $scope.editProItem.amountDiscount = erp.cacuAmount($scope.editProItem.discountPrice, $scope.editProItem.shipCostDiscount);
      var profitRatePrice = erp.cacuProfitRate($scope.editProItem.discountPrice, $scope.editProItem.COSTPRICE);
      var profitRateShip = erp.cacuProfitRate(100 - $scope.editProItem.FREIGHTDISCOUNT, $scope.shipDefaultProfitRate);
      $scope.editProItem.profitRate = erp.cacuAverage(profitRatePrice, profitRateShip);
    }

    //关联商品
    $scope.guanlianpagenum = 1;
    $scope.tanchuangpagesize = 10;
    $scope.shipDefaultProfitRate = 100;
    $scope.tanchuangpagenum = 1;
    //店铺查询
    $scope.serchByStore = function (val) {
      $scope.shopId = val;
      extcommon();
    };
    $scope.skulistshangpin = function (item) {

      // if (item.skunum == 0) {
      //     return;
      // }
      $scope.shiFouGuanLianFlag = 1;
      // 当前用户id
      $scope.nowOpeUserId = item.id;
      $scope.curGuest = item;
      console.log(item)
      $scope.guanlianitem = item;
      $scope.guanlian = true;
      $scope.isskulist = true;
      // item.listflag = 2;
      extcommon(item);
    }
    //关联商品变体获取
    $scope.getguanlianva = function (item, index) {
      var postUrl, postData;
      if ($scope.isskulist) {
        postUrl = "app/rebate/getassigndetaill";
        postData = { "data": "{'productId': '" + item.productId + "','userId': '" + $scope.nowOpeUserId + "'}" };
      }
      console.log(index)
      erp.postFun(postUrl, postData, function (n) {
        var obj = JSON.parse(n.data.result)
        console.log(obj)
        angular.forEach(obj.list, function (data) {
          data.flag = false;
          if ($scope.isskulist) {
            data.SELLDISCOUNT = data.discountPriceRate;
            data.FREIGHTDISCOUNT = data.discountShopRate;
            data.LOGISTICS = data.shopMethod;
          }
          data.discountPrice = cacuDiscount(data.SELLPRICE, data.SELLDISCOUNT);
          // data.shipCostDiscount = cacuDiscount(data.erpdeltPrice, data.FREIGHTDISCOUNT);
          data.COSTPRICE = erp.REM2USD(data.COSTPRICE);
          var profitRatePrice = erp.cacuProfitRate(data.discountPrice, data.COSTPRICE);
          var profitRateShip = erp.cacuProfitRate(100 - data.FREIGHTDISCOUNT, $scope.shipDefaultProfitRate);
          data.profitRate = erp.cacuAverage(profitRatePrice, profitRateShip);

          if (data.erpdeltPrice) {
            data.shipCostDiscount = cacuDiscount(data.erpdeltPrice, data.FREIGHTDISCOUNT);
            data.amount = erp.cacuAmount(data.SELLPRICE, data.erpdeltPrice);
            data.amountDiscount = erp.cacuAmount(data.discountPrice, data.shipCostDiscount)
          } else {
            data.shipCostDiscount = '';
            data.amount = data.SELLPRICE;
            data.amountDiscount = data.discountPrice;
          }

        });
        $scope.excellist[index].vlist = obj.list;
      }, err)
    }
    //关联商品编辑
    $scope.isInGuanEdit = false;
    $scope.shangpinedit = function (item, index1, e, index2) {
      console.log(index2, item);
      for (var i = 0; i < $scope.excellist.length; i++) {
        $scope.excellist[i].flag = false;
        if ($scope.excellist[i].vlist) {
          for (var j = 0; j < $scope.excellist[i].vlist.length; j++) {
            $scope.excellist[i].vlist[j].flag = false;
          }
        }
      }
      if ($scope.editProItem) {
        $scope.canceledit();
      }
      if (index2 >= 0) {
        $scope.editProItem = $scope.excellist[index1].vlist[index2];
        $scope.excellist[index1].vlist[index2].flag = true;
      } else {
        $scope.editProItem = $scope.excellist[index1];
        $scope.excellist[index1].flag = true;
      }
      $scope.bjVid = item.vid;//设置变体折扣 取变体id
      $scope.bjAccId = item.ACCID;//设置变体折扣
      console.log($scope.bjVid)
      // 记录原始值
      discountPriceTem = $scope.editProItem.discountPrice;
      SELLDISCOUNTtem = $scope.editProItem.SELLDISCOUNT;
      amountDiscountTem = $scope.editProItem.amountDiscount;
      profitRateTem = $scope.editProItem.profitRate;
      console.log($scope.editProItem, index1);
      $scope.sendData.discount = $scope.editProItem.SELLDISCOUNT;
    }
    $scope.canceledit = function (e) {
      $scope.editProItem.discountPrice = discountPriceTem;
      $scope.editProItem.SELLDISCOUNT = SELLDISCOUNTtem;
      $scope.editProItem.amountDiscount = amountDiscountTem;
      $scope.editProItem.profitRate = profitRateTem;
      $scope.editProItem = null;
      $scope.sendData.discount = 0;
    }
    //关联商品baocun
    $scope.baocunedit = function (item, index, e) {
      console.log(item)
      var zheKouAccid = item.ACCID;
      var zheKouPid = item.PID;
      var weiGuanLianPid = item.productId;
      var sellDis = $scope.sendData.discount || 0;
      if (String(sellDis).indexOf(".") > -1 || Number(sellDis) < 0 || Number(sellDis) > 100) {
        layer.msg(gjh16);
        return;
      }
      // 国家name   erpcountry   缩写   erpdecountryCode   价格    erpprice
      if ($scope.isskulist) {
        erp.postFun("app/rebate/modifyassignproductall", { "data": "{'productId': '" + item.productId + "','sku':'" + item.SKU + "','discountPriceRate':'" + sellDis + "','userId': '" + $scope.nowOpeUserId + "'}" }, son, err)
        return;
      }

      function son(n) {
        $scope.isInGuanEdit = false;
        var data = n.data;
        if (data.statusCode != 200) {
          layer.msg(gjh06);
          $scope.canceledit();
          return false;
        }
        console.log($scope.guanlianpagenum);
        $scope.excellist[index].SELLDISCOUNT = sellDis;
        $scope.excellist[index].discountPrice = cacuDiscount($scope.excellist[index].SELLPRICE, sellDis);
        var profitRatePrice = erp.cacuProfitRate($scope.excellist[index].discountPrice, item.COSTPRICE);
        var profitRateShip = erp.cacuProfitRate(100 - $scope.excellist[index].FREIGHTDISCOUNT, $scope.shipDefaultProfitRate);
        $scope.excellist[index].profitRate = erp.cacuAverage(profitRatePrice, profitRateShip);
        $scope.excellist[index].amountDiscount = erp.cacuAmount($scope.excellist[index].discountPrice, $scope.excellist[index].shipCostDiscount);
        $scope.sendData.discount = 0;
        $scope.editProItem = null;
        $scope.excellist[index].flag = false;
        console.log($scope.excellist[index], index);
        if (data.statusCode == 200) {
          var upZheKouJson = {};
          if ($scope.shiFouGuanLianFlag == 1) {//未关联
            upZheKouJson.accId = $scope.nowOpeUserId;
            upZheKouJson.pid = weiGuanLianPid;
          } else if ($scope.shiFouGuanLianFlag == 2) {//已关联
            upZheKouJson.accId = zheKouAccid;
            upZheKouJson.pid = zheKouPid;
          }
          upZheKouJson.vid = '';
          erp.postFun('cj/locProduct/upZheKouInfo', JSON.stringify(upZheKouJson), function (data) {
            console.log(data)
          }, function (data) {
            console.log(data)
          })
        }
      }
    }
    //关联变体baocun
    $scope.baocunedit2 = function (item, index2, e, index1) {
      var sellDis = $scope.sendData.discount || 0;
      if ($scope.isskulist) {
        erp.postFun("app/rebate/modifyassignproduct", { "data": "{'id': '" + item.ID + "','discountPriceRate':'" + sellDis + "','userId': '" + $scope.nowOpeUserId + "'}" }, son, err);
        return;
      }

      function son(n) {
        $scope.isInGuanEdit = false;
        var data = n.data;
        if (data.statusCode != 200) {
          layer.msg(gjh06);
          return false;
        }
        $scope.excellist[index1].vlist[index2].SELLDISCOUNT = sellDis;
        $scope.excellist[index1].vlist[index2].discountPrice = cacuDiscount(item.SELLPRICE, sellDis);
        var profitRatePrice = erp.cacuProfitRate($scope.excellist[index1].vlist[index2].discountPrice, item.COSTPRICE);
        // var profitRateShip = erp.cacuProfitRate(100-shipDis,$scope.shipDefaultProfitRate);
        var profitRateShip = erp.cacuProfitRate(100 - $scope.excellist[index1].vlist[index2].FREIGHTDISCOUNT, $scope.shipDefaultProfitRate);
        $scope.excellist[index1].vlist[index2].profitRate = erp.cacuAverage(profitRatePrice, profitRateShip);
        $scope.excellist[index1].vlist[index2].amountDiscount = erp.cacuAmount($scope.excellist[index1].vlist[index2].discountPrice, $scope.excellist[index1].vlist[index2].shipCostDiscount);
        $scope.sendData.discount = 0;
        $scope.editProItem = null;

        var upZheKouJson = {};
        if ($scope.shiFouGuanLianFlag == 1) {//未关联
          upZheKouJson.accId = $scope.nowOpeUserId;
          upZheKouJson.vid = $scope.bjVid;
        } else if ($scope.shiFouGuanLianFlag == 2) {//已关联
          upZheKouJson.accId = $scope.bjAccId;
          upZheKouJson.vid = $scope.bjVid;
        }
        upZheKouJson.pid = '';
        erp.postFun('cj/locProduct/upZheKouInfo', JSON.stringify(upZheKouJson), function (data) {
          console.log(data)
        }, function (data) {
          console.log(data)
        })
      }
    }
    $scope.closeTan = function () {
      $scope.guanlian = false;
      $scope.isInGuanEdit = false;
      $scope.excellist = [];
      $scope.isskulist = false;
      $scope.searchinfoTan = '';
      $scope.curGuest = null;
      $scope.tanTotalNum = 0;
      $('.tanchuang-page').jqPaginator('destroy');
      $scope.closeSetWuliu();
    }

    function settleTanList(obj) {
      console.log(obj);
      if ($scope.isskulist) {
        for (var i = 0; i < obj.list.length; i++) {
          obj.list[i].flag = false;
          obj.list[i].down = false;
          // obj.list[i].logisticsInfoId = String(obj.list[i].logisticsInfoId);
          if ($scope.isskulist) {
            obj.list[i].SELLDISCOUNT = obj.list[i].discountPriceRate;
            obj.list[i].FREIGHTDISCOUNT = obj.list[i].discountShopRate;
            obj.list[i].LOGISTICS = obj.list[i].shopMethod;
          }

          obj.list[i].discountPrice = cacuDiscount(obj.list[i].SELLPRICE, obj.list[i].SELLDISCOUNT);
          obj.list[i].COSTPRICE = erp.REM2USD(obj.list[i].COSTPRICE);
          var profitRatePrice = erp.cacuProfitRate(obj.list[i].discountPrice, obj.list[i].COSTPRICE);
          var profitRateShip = erp.cacuProfitRate(100 - obj.list[i].FREIGHTDISCOUNT, $scope.shipDefaultProfitRate);
          obj.list[i].profitRate = erp.cacuAverage(profitRatePrice, profitRateShip);

          if (obj.list[i].erpdeltPrice) {
            obj.list[i].shipCostDiscount = cacuDiscount(obj.list[i].erpdeltPrice, obj.list[i].FREIGHTDISCOUNT);
            obj.list[i].amount = erp.cacuAmount(obj.list[i].SELLPRICE, obj.list[i].erpdeltPrice);
            obj.list[i].amountDiscount = erp.cacuAmount(obj.list[i].discountPrice, obj.list[i].shipCostDiscount)
          } else {
            obj.list[i].shipCostDiscount = '';
            obj.list[i].amount = obj.list[i].SELLPRICE;
            obj.list[i].amountDiscount = obj.list[i].discountPrice;
          }
        }
      }
      console.log(obj.list)
      $scope.excellist = obj.list;
    }

    $scope.searchinfoTan = '';
    $scope.searchtanlistTan = function () {
      extcommon($scope.guanlianitem);
    }
    $scope.enterSearchTan = function (e) {
      if (e.keyCode == 13) {
        $scope.searchtanlistTan();
      }
    }

    function settleSendDataTan() {
      var sendDataObj = {};
      var postUrl;
      var sendData = {};

      sendData.data = {};
      sendData.data.pageSize = $scope.tanchuangpagesize;
      sendData.data.pageNum = $scope.tanchuangpagenum;
      sendData.data.userId = $scope.guanlianitem.id || $scope.guanlianitem.ID;
      sendData.data.shopId = $scope.shopId;
      if ($scope.isskulist) {
        postUrl = "app/rebate/getassignproduct";
        sendData.data.inputStr = $scope.searchinfoTan;
      }
      sendData.data = JSON.stringify(sendData.data);
      sendData = JSON.stringify(sendData);

      sendDataObj.postUrl = postUrl;
      sendDataObj.sendData = sendData;

      return sendDataObj;

    }

    function extcommon() {
      // "app/rebate/getassignproduct"
      $scope.tanchuangpagenum = '1';
      var sendDataObj = settleSendDataTan();
      // erp.load();
      erp.loadPercent($('.erp-load-box'), 628);
      $scope.excellist = [];
      console.log(sendDataObj)
      erp.postFun(sendDataObj.postUrl, sendDataObj.sendData, function (data) {
        // erp.closeLoad();
        erp.closeLoadPercent($('.erp-load-box'));
        console.log(data.data);
        if (data.data.statusCode != 200) {
          erp.addNodataPic($('.erp-load-box'), 570, 55);
          layer.msg(gjh28);
          return;
        }
        if (!data.data.result) {
          erp.addNodataPic($('.erp-load-box'), 570, 55);
          $scope.tanTotalNum = 0;
          return;
        }
        var obj = JSON.parse(data.data.result)
        if (obj.count == 0) {
          erp.addNodataPic($('.erp-load-box'), 570, 55);
          $scope.tanTotalNum = 0;
          return;
        }
        erp.removeNodataPic($('.erp-load-box'));
        $scope.tanTotalNum = obj.count;
        // console.log(obj);
        settleTanList(obj);
        $('.tanchuang-page').jqPaginator({
          totalCounts: obj.count * 1,
          pageSize: $scope.tanchuangpagesize * 1,
          visiblePages: 5,
          currentPage: $scope.tanchuangpagenum * 1,
          activeClass: 'current',
          first: '<a class="prev" href="javascript:void(0);">&lt;&lt;<\/a>',
          prev: '<a class="prev" href="javascript:void(0);">&lt;<\/a>',
          next: '<a class="next" href="javascript:void(0);">&gt;<\/a>',
          last: '<a class="prev" href="javascript:void(0);">&gt;&gt;<\/a>',
          page: '<a href="javascript:void(0);">{{page}}<\/a><\/li>',
          onPageChange: function (n, type) {
            if (type == 'init') return;
            $scope.tanchuangpagenum = n + '';
            var sendDataObj = settleSendDataTan();
            $scope.excellist = [];
            // erp.load();
            erp.loadPercent($('.erp-load-box'), 628);
            erp.postFun(sendDataObj.postUrl, sendDataObj.sendData, function (data) {
              // erp.closeLoad();
              erp.closeLoadPercent($('.erp-load-box'));
              var obj = JSON.parse(data.data.result)
              settleTanList(obj);
            }, err)
          }
        });

      }, err);

    }

    function err () {

    }

  }
})(angular);