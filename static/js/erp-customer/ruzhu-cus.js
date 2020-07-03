(function() {
  var app = angular.module('ruzhu-cus-app', ['service'])
  app.controller('ruZhuCusListCtrl', ['$scope', 'erp', '$location', function($scope, erp, $location) {
    console.log('入驻客户 ruzhucusList')
    $scope.appHref = erp.getSupplierAppUrl();
    $scope.pageSize = '50';
    $scope.pageNum = 1;
    $scope.dataList = [];



    function initTryOut() {
      // 套餐试用的相关参数初始化
      $scope.showOpenTryOut = false; // 开启试用弹窗显示
      $scope.showStopTryOut = false; // 停止试用弹窗显示
      $scope.showExtend = false; // 是否展示延长试用天数
      $scope.tryOutList = []; // 试用套餐列表
      $scope.tryOutDay = 10; // 试用天数
      $scope.selectedTryPack = ''; // 选择的试用套餐
      $scope.extendDay = 10; // 延长试用的天数
      $scope.selectedUser = {}; // 选择的用户 
      $scope.accountType = "" // 账户类型
      $scope.seachVal = ""
    }

    initTryOut()

    function getListFun() {
      let upJson = {};
      upJson.pageNum = $scope.pageNum;
      upJson.pageSize = $scope.pageSize - 0;
      upJson.status = 1;
      upJson.userName = $scope.seachVal;
      if($scope.accountType){
        upJson.accountType = Number($scope.accountType)
      }
      erp.postFun('supplier/user/userInfo/listPages', JSON.stringify(upJson), function(data) {
        console.log(data);
        let resData = data.data;
        if (resData.code == 200) {
          $scope.dataList = resData.data.list;
          $scope.totalNum = resData.data.total;
          $scope.resPageNum = resData.data.pageNum;
          $scope.resPageSize = resData.data.pageSize;
          pageFun()
        } else {
          layer.msg(resData.error)
        }
      }, function(data) {
        console.log(data)
      }, {
        layer: true
      })
    }
    getListFun()
    $scope.searchInput = function() {
      $scope.pageNum = 1;
      getListFun();
    }
    $scope.keyUpFun = function(ev) {
      if (ev.keyCode == 13) {
        $scope.pageNum = 1;
        getListFun();
      }
    }
    $scope.chanPageSize = function() {
      $scope.pageNum = 1;
      getListFun();
    }
    $scope.gopageFun = function() {
      var countPage = Math.ceil($scope.totalNum / ($scope.pageSize - 0));
      if (!$scope.pageNum || $scope.pageNum < 1 || $scope.pageNum > countPage) {
        layer.msg('无效页码');
        return;
      }
      getListFun();
    }
    $scope.goToCj = function(item) {
      console.log(item);
      var toUrl = window.open();
      erp.postFun('supplier/user/userInfo/erpGetSupplierSuperPass', {
        "id": item.supplierId
      }, function(data) {
        console.log(data);
        if (data.data.code == 200) {
          var cjUrl = $scope.appHref + '/zh/login?username=' + encodeURIComponent(item.userName) + '&tempassword=' + encodeURIComponent(data.data.data);
          toUrl.location.href = cjUrl;
        }
      })
    }

    function pageFun() {
      if (!$scope.totalNum) {
        return
      }
      $(".pagegroup1").jqPaginator({
        totalCounts: $scope.totalNum,
        pageSize: $scope.pageSize * 1,
        visiblePages: 5,
        currentPage: $scope.pageNum * 1,
        activeClass: 'current',
        first: '<a class="prev" href="javascript:void(0);">&lt;&lt;<\/a>',
        prev: '<a class="prev" href="javascript:void(0);">&lt;<\/a>',
        next: '<a class="next" href="javascript:void(0);">&gt;<\/a>',
        last: '<a class="next" href="javascript:void(0);">&gt;&gt;<\/a>',
        page: '<a href="javascript:void(0);">{{page}}<\/a>',
        onPageChange: function(n, type) {
          if (type == 'init') {
            return;
          };
          erp.load();
          $scope.pageNum = n;
          getListFun()
        }
      });
    }
    $scope.detailFun = function(item) {
      $location.path('/erpcustomer/ruzhucusList/detail').search({
        'id': item.id,
        'type': 'tongGuo'
      })
    }

    // 套餐试用的相关函数

    $scope.tryOutPackage = function(item) {
      $scope.selectedUser = item;
      const param = {
        "supplierId": item.supplierId
      }
      erp.postFun('erpSupplierPlan/usedPlanList', param, function(res) {
        const result = res.data
        if (result.code == 200) {
          $scope.tryOutList = result.data;
          $scope.showOpenTryOut = true;
          return;
        }
        layer.msg('获取套餐列表失败');
      })
    }

    $scope.$watch('tryOutDay', function(newValue, oldValue) {
      if (newValue > 1000) {
        $scope.tryOutDay = oldValue
        layer.msg('一次最多申请1000天');
      }
      if (newValue < 0) {
        $scope.tryOutDay = oldValue
        layer.msg('请输入正整数');
      }
      if (parseInt(newValue, 10) !== newValue && newValue) {
        $scope.tryOutDay = oldValue
        layer.msg('请输入正整数');
      }
    });


    // 确认开启试用套餐
    $scope.confirmOpen = function() {
      if (!$scope.selectedTryPack) {
        layer.msg('请选择试用套餐');
        return;
      }
      if (!$scope.tryOutDay) {
        layer.msg('请输入试用天数');
        return;
      }
      const sendData = {};
      sendData.trialDays = $scope.tryOutDay
      sendData.supplierId = $scope.selectedUser.supplierId
      sendData.planId = $scope.selectedTryPack
      layer.load(2)
      erp.postFun('supplierPlanInfo/erp/applyTrialPlanNew', JSON.stringify(sendData), function(res) {
        layer.closeAll('loading')
        $scope.showOpenTryOut = false;
        if (res.data && res.data.code == 200) {
          getListFun()
          layer.msg('试用套餐成功');
          return;
        }
        layer.msg('请求失败请重试');
      })
    }


    $scope.confirmStop = function() {
      const sendData = {};
      sendData.supplierId = $scope.selectedUser.supplierId
      layer.load(2)
      erp.postFun('supplierPlanInfo/erp/terminationTrialPlan', JSON.stringify(sendData), function(res) {
        layer.closeAll('loading')
        $scope.showExtend = false
        $scope.showStopTryOut = false;
        $scope.extendDay = 10;
        if (res.data && res.data.code == 200) {
          layer.msg('终止成功');
          getListFun()
          return;
        }
        layer.msg('请求失败请重试');
      })
    }

    // 延长天数的输入值监听（观察者模式）
    $scope.$watch('extendDay', function(newValue, oldValue) {
      if (newValue > 1000) {
        $scope.extendDay = oldValue
        layer.msg('一次最多延长1000天');
      }
      if (newValue < 0) {
        $scope.extendDay = oldValue
        layer.msg('请输入正整数');
      }
      if (parseInt(newValue, 10) !== newValue && newValue) {
        $scope.extendDay = oldValue
        layer.msg('请输入正整数');
      }
    });


    $scope.stopTryOut = function(item) {
      $scope.selectedUser = item;
      $scope.showStopTryOut = true;
    }

    $scope.conformExtend = function() {
      if (!$scope.extendDay) {
        layer.msg('请输入试用天数');
        return;
      }
      const sendData = {};
      sendData.trialDays = $scope.extendDay
      sendData.supplierId = $scope.selectedUser.supplierId
      layer.load(2)
      erp.postFun('supplierPlanInfo/erp/extendTrialPlan', JSON.stringify(sendData), function(res) {
        layer.closeAll('loading')
        $scope.showExtend = false
        $scope.showStopTryOut = false;
        $scope.extendDay = 10;
        if (res.data && res.data.code == 200) {
          layer.msg('延长试用成功');
          getListFun()
          return;
        }
        layer.msg('请求失败请重试');
      })
    }

    $scope.cancelExtend = function() {
      $scope.showExtend = false
      $scope.extendDay = 10;
    }

    $scope.cancelStop = function() {
      initTryOut()
    }

    $scope.cancelOpen = function() {
      initTryOut()
    }


  }])
  app.controller('ruZhuCusListDetailCtrl', ['$scope', 'erp', '$location', function($scope, erp, $location) {
    console.log('入驻客户详情 ruzhucuschecklist')
    var bs = new Base64()
    $scope.erpLoginName = bs.decode(localStorage.getItem('erploginName') == undefined ? '' : localStorage.getItem('erploginName'));
    let csObj = $location.search()
    $scope.detailType = csObj.type;
    $scope.appHref = erp.getAppUrl();
    console.log($scope.detailType)
    console.log(csObj)
    $scope.checkCusFun = function(stuNum) {
      if (stuNum === 1) {
        $scope.passFlag = true;
      } else {
        $scope.refuseFlag = true;
      }
    }
    let upJson = {};
    upJson.id = csObj.id;
    erp.postFun('supplier/user/userInfo/detail', JSON.stringify(upJson), function(data) {
      console.log(data)
      let resData = data.data;
      if (resData.code == 200) {
        $scope.userDetailObj = data.data.data;
        $scope.storeLink = $scope.appHref + '/list-detail.html?from=all&fromType=all&store=1&storeId=' + data.data.data.shopId;
      } else {
        layer.msg(resData.error)
      }
    }, function(data) {
      console.log(data)
    }, {
      layer: true
    })
    $scope.sureJuJueFun = function() {
      if (!$scope.reasonVal) {
        layer.msg('请输入拒绝原因')
        return
      }
      if ($scope.reasonVal.length > 200) {
        layer.msg('原因不能大于200个字符')
        return
      }
      let upJson = {}
      upJson.id = csObj.id;
      upJson.auditBy = $scope.erpLoginName;
      upJson.status = 9;
      upJson.reason = $scope.reasonVal;
      erp.postFun('supplier/user/userInfo/auditSupplier', JSON.stringify(upJson), function(data) {
        let resData = data.data;
        if (resData.code == 200) {
          $scope.refuseFlag = false;
          location.href = "#/erpcustomer/ruzhucuschecklist"
        } else {
          layer.msg(resData.error)
        }
      }, function(data) {

      }, {
        layer: true
      })
    }
    $scope.surePassCheckFun = function() {
      let upJson = {}
      upJson.id = csObj.id;
      upJson.auditBy = $scope.erpLoginName;
      upJson.status = 1;
      erp.postFun('supplier/user/userInfo/auditSupplier', JSON.stringify(upJson), function(data) {
        let resData = data.data;
        if (resData.code == 200) {
          $scope.passFlag = false;
          location.href = "#/erpcustomer/ruzhucuschecklist"
        } else {
          layer.msg(resData.error)
        }
      }, function(data) {

      }, {
        layer: true
      })
    }
    $scope.showBigImg = function(imgLink) {
      $scope.bigImgFlag = true;
      $scope.bigImgLink = imgLink;
    }
  }])
  app.controller('ruZhuCusListCheckCtrl', ['$scope', 'erp', '$location', function($scope, erp, $location) {
    console.log('入驻客户审核 erpcustomer/ruzhucuschecklist')
    var bs = new Base64()
    var erpLoginName = bs.decode(localStorage.getItem('erploginName') == undefined ? '' : localStorage.getItem('erploginName'));
    $scope.pageSize = '50';
    $scope.pageNum = 1;
    $scope.dataList = [];
    $scope.accountType = ""
     $scope.seachVal = ""

    function getListFun() {
      let upJson = {};
      upJson.pageNum = $scope.pageNum;
      upJson.pageSize = $scope.pageSize - 0;
      upJson.status = 0;
      upJson.userName = $scope.seachVal;
      if($scope.accountType){
        upJson.accountType = Number($scope.accountType)
      }
      erp.postFun('supplier/user/userInfo/listPages', JSON.stringify(upJson), function(data) {
        console.log(data);
        let resData = data.data;
        console.log(resData)
        if (resData.code == 200) {
          $scope.dataList = resData.data.list;
          $scope.totalNum = resData.data.total;
          $scope.resPageNum = resData.data.pageNum;
          $scope.resPageSize = resData.data.pageSize;
          pageFun()
        } else {
          layer.msg(resData.error)
        }
      }, function(data) {
        console.log(data)
      }, {
        layer: true
      })
    }
    getListFun()
    $scope.searchInput = function() {
      $scope.pageNum = 1;
      getListFun();
    }
    $scope.keyUpFun = function(ev) {
      if (ev.keyCode == 13) {
        $scope.pageNum = 1;
        getListFun();
      }
    }
    $scope.chanPageSize = function() {
      $scope.pageNum = 1;
      getListFun();
    }
    $scope.gopageFun = function() {
      var countPage = Math.ceil($scope.totalNum / ($scope.pageSize - 0));
      if (!$scope.pageNum || $scope.pageNum < 1 || $scope.pageNum > countPage) {
        layer.msg('无效页码');
        return;
      }
      getListFun();
    }
    $scope.checkCusFun = function(item, stuNum) {
      if (stuNum === 1) {
        $scope.passFlag = true;
      } else {
        $scope.refuseFlag = true;
      }
      $scope.itemId = item.id;
    }
    $scope.sureJuJueFun = function() {
      if (!$scope.reasonVal) {
        layer.msg('请输入拒绝原因')
        return
      }
      if ($scope.reasonVal.length > 200) {
        layer.msg('原因不能大于200个字符')
        return
      }
      let upJson = {}
      upJson.id = $scope.itemId;
      upJson.auditBy = erpLoginName;
      upJson.status = 9;
      upJson.reason = $scope.reasonVal;
      erp.postFun('supplier/user/userInfo/auditSupplier', JSON.stringify(upJson), function(data) {
        let resData = data.data;
        if (resData.code == 200) {
          $scope.refuseFlag = false;
          $scope.reasonVal = '';
          getListFun();
        } else {
          layer.msg(resData.error)
        }
      }, function(data) {

      }, {
        layer: true
      })
    }

    // 确认通过审核 增加入驻供应商默认发货仓库
    $scope.areaList = []
    $scope.wareHouseId = 1
    erp.postFun('warehouseBuildWeb/management/getCountryByAreaId',null, function(data) {
      let resData = data.data;
      if(resData.code == 200){
        $scope.areaList = resData.data;
      }else{
        layer.msg(resData.error)
      }
    })
    $scope.virtualed = "0"
    $scope.surePassCheckFun = function() {
      let upJson = {}
      upJson.areaId = $scope.wareHouseId
      $scope.areaList.map((item)=>{
        if(item.areaId==upJson.areaId){
          upJson.areaName = item.areaCn
          upJson.countryCode = item.countryCode
        }
      })
      upJson.id = $scope.itemId;
      upJson.auditBy = erpLoginName;
      upJson.status = 1;
      erp.postFun('supplier/user/userInfo/auditSupplier', JSON.stringify(upJson), function(data) {
        let resData = data.data;
        if (resData.code == 200) {
          $scope.passFlag = false;
          getListFun();
        } else {
          layer.msg(resData.error)
        }
      })
    }


    function pageFun() {
      if (!$scope.totalNum) {
        return
      }
      $(".pagegroup1").jqPaginator({
        totalCounts: $scope.totalNum,
        pageSize: $scope.pageSize * 1,
        visiblePages: 5,
        currentPage: $scope.pageNum * 1,
        activeClass: 'current',
        first: '<a class="prev" href="javascript:void(0);">&lt;&lt;<\/a>',
        prev: '<a class="prev" href="javascript:void(0);">&lt;<\/a>',
        next: '<a class="next" href="javascript:void(0);">&gt;<\/a>',
        last: '<a class="next" href="javascript:void(0);">&gt;&gt;<\/a>',
        page: '<a href="javascript:void(0);">{{page}}<\/a>',
        onPageChange: function(n, type) {
          if (type == 'init') {
            return;
          };
          erp.load();
          $scope.pageNum = n;
          getListFun()
        }
      });
    }
    $scope.detailFun = function(item) {
      $location.path('/erpcustomer/ruzhucusList/detail').search({
        'id': item.id,
        'type': 'check'
      })
    }
  }])
  app.controller('ruZhuCusListWtgCtrl', ['$scope', 'erp', '$location', function($scope, erp, $location) {
    console.log('入驻客户未通过 ruzhucuswtglist')
    $scope.pageSize = '50';
    $scope.pageNum = 1;
    $scope.dataList = [];
    $scope.accountType = ""
    $scope.seachVal = ""

    function getListFun() {
      let upJson = {};
      upJson.pageNum = $scope.pageNum;
      upJson.pageSize = $scope.pageSize - 0;
      upJson.status = 9;
      upJson.userName = $scope.seachVal;
      if($scope.accountType){
        upJson.accountType = Number($scope.accountType)
      }
      erp.postFun('supplier/user/userInfo/listPages', JSON.stringify(upJson), function(data) {
        console.log(data);
        let resData = data.data;
        if (resData.code == 200) {
          $scope.dataList = resData.data.list;
          $scope.totalNum = resData.data.total;
          $scope.resPageNum = resData.data.pageNum;
          $scope.resPageSize = resData.data.pageSize;
          pageFun()
        } else {
          layer.msg(resData.error)
        }
      }, function(data) {
        console.log(data)
      }, {
        layer: true
      })
    }
    getListFun()
    $scope.searchInput = function() {
      $scope.pageNum = 1;
      getListFun();
    }
    $scope.keyUpFun = function(ev) {
      if (ev.keyCode == 13) {
        $scope.pageNum = 1;
        getListFun();
      }
    }
    $scope.chanPageSize = function() {
      $scope.pageNum = 1;
      getListFun();
    }
    $scope.gopageFun = function() {
      var countPage = Math.ceil($scope.totalNum / ($scope.pageSize - 0));
      if (!$scope.pageNum || $scope.pageNum < 1 || $scope.pageNum > countPage) {
        layer.msg('无效页码');
        return;
      }
      getListFun();
    }

    function pageFun() {
      if (!$scope.totalNum) {
        return
      }
      $(".pagegroup1").jqPaginator({
        totalCounts: $scope.totalNum,
        pageSize: $scope.pageSize * 1,
        visiblePages: 5,
        currentPage: $scope.pageNum * 1,
        activeClass: 'current',
        first: '<a class="prev" href="javascript:void(0);">&lt;&lt;<\/a>',
        prev: '<a class="prev" href="javascript:void(0);">&lt;<\/a>',
        next: '<a class="next" href="javascript:void(0);">&gt;<\/a>',
        last: '<a class="next" href="javascript:void(0);">&gt;&gt;<\/a>',
        page: '<a href="javascript:void(0);">{{page}}<\/a>',
        onPageChange: function(n, type) {
          if (type == 'init') {
            return;
          };
          erp.load();
          $scope.pageNum = n;
          getListFun()
        }
      });
    }
    $scope.detailFun = function(item) {
      $location.path('/erpcustomer/ruzhucusList/detail').search({
        'id': item.id,
        'type': 'wtg'
      })
    }
  }])
  app.controller('ruZhuCusBaoGuoQqCtrl', ['$scope', 'erp', '$location', function($scope, erp, $location) {
    console.log('入驻客户包裹请求 ruzhubgysList')
    $scope.changeStrogeFun = function() {
      console.log($scope.selStroge)
    }
    $scope.pageNum = 1;
    $scope.pageSize = '50';
    $scope.typeStu = 1;
    $scope.gysId = '';

    function getListFun() {
      if (!$scope.selStroge) {
        layer.msg('仓库获取失败,请刷新页面')
        return
      }
      let upJson = {};
      upJson.pageNum = $scope.pageNum;
      upJson.pageSize = $scope.pageSize - 0;
      upJson.generationOriginParaId = $scope.selStroge;
      upJson.logisticsStatus = $scope.typeStu;
      upJson.companyName = $scope.seachVal;
      upJson.supplierId = $scope.gysId;
      erp.postFun('supplier/logistics/package/list', JSON.stringify(upJson), function(data) {
        console.log(data);
        let resData = data.data;
        console.log(resData)
        if (resData.code == 200) {
          $scope.dataList = resData.data.list;
          $scope.totalNum = resData.data.total;
          $scope.resPageNum = resData.data.pageNum;
          $scope.resPageSize = resData.data.pageSize;
          pageFun()
        } else {
          layer.msg(resData.error)
        }
      }, function(data) {
        console.log(data)
      }, {
        layer: true
      })
    }
    // getStrogeFun($scope,erp,getListFun)


    $scope.strogeList = erp
      .getStorage()
      .map(_ => ({
        id: _.dataId,
        storageName: _.dataName
      }));
    console.log($scope.storageList)
    $scope.selStroge = $scope.strogeList[0].id;

    // getListFun()
    $scope.changeStrogeFun = function() {
      $scope.pageNum = 1;
      getListFun();
    }
    $scope.selGysFun = function() {
      $scope.pageNum = 1;
      getListFun();
    }
    $scope.searchInput = function() {
      $scope.pageNum = 1;
      getListFun();
    }
    $scope.keyUpFun = function(ev) {
      if (ev.keyCode == 13) {
        $scope.pageNum = 1;
        getListFun();
      }
    }
    $scope.typeStuFun = function(num) {
      $scope.typeStu = num;
      getListFun();
    }
    $scope.chanPageSize = function() {
      $scope.pageNum = 1;
      getListFun();
    }
    $scope.gopageFun = function() {
      var countPage = Math.ceil($scope.totalNum / ($scope.pageSize - 0));
      if (!$scope.pageNum || $scope.pageNum < 1 || $scope.pageNum > countPage) {
        layer.msg('无效页码');
        return;
      }
      getListFun();
    }

    function pageFun() {
      if (!$scope.totalNum) {
        return
      }
      $(".pagegroup1").jqPaginator({
        totalCounts: $scope.totalNum,
        pageSize: $scope.pageSize * 1,
        visiblePages: 5,
        currentPage: $scope.pageNum * 1,
        activeClass: 'current',
        first: '<a class="prev" href="javascript:void(0);">&lt;&lt;<\/a>',
        prev: '<a class="prev" href="javascript:void(0);">&lt;<\/a>',
        next: '<a class="next" href="javascript:void(0);">&gt;<\/a>',
        last: '<a class="next" href="javascript:void(0);">&gt;&gt;<\/a>',
        page: '<a href="javascript:void(0);">{{page}}<\/a>',
        onPageChange: function(n, type) {
          if (type == 'init') {
            return;
          };
          erp.load();
          $scope.pageNum = n;
          getListFun(erp, $scope)
        }
      });
    }
    gysListFun($scope, erp)
    let selectedNum = 0; //选中数
    $scope.checkItemFun = function(item) {
      console.log(item)
      item.checkFlag = item['checkFlag']
      if (item.checkFlag) {
        selectedNum++
      } else {
        selectedNum--;
      }
      if (selectedNum == $scope.dataList.length) {
        $scope.checkAllMark = true;
      } else {
        $scope.checkAllMark = false;
      }
      console.log($scope.checkAllMark, selectedNum, $scope.dataList.length)
    }
    $scope.checkAllFun = function(flag) {
      console.log(flag)
      $scope.checkAllMark = flag;
      if (flag) {
        selectedNum = $scope.dataList.length
        for (let i = 0; i < selectedNum; i++) {
          $scope.dataList[i]['checkFlag'] = true;
        }
      } else {
        selectedNum = 0;
        for (let i = 0, len = $scope.dataList.length; i < len; i++) {
          $scope.dataList[i]['checkFlag'] = false;
        }
      }
      console.log($scope.dataList)
    }
    $scope.toogleSpFun = function(item) {
      item['spFlag'] = !item['spFlag']
      console.log(item)
    }
    // $scope.toogleFun = function(item,ev){
    //     $(ev.target).toggleClass('.glyphicon glyphicon-triangle-top');
    //     item['spFlag'] = !item['spFlag']
    // }
    $scope.stopPropFun = function(ev) {
      ev.stopPropagation()
    }
  }])
  app.controller('ruZhuCusBaoGuoZhiFuCtrl', ['$scope', 'erp', '$location', function($scope, erp, $location) {
    console.log('入驻客户包裹支付 ruzhubgzhifuList')
    $scope.qtfyUnit = '$';
    $scope.yfUnit = '$';
    $scope.pageNum = 1;
    $scope.pageSize = '50';
    $scope.typeStu = 0;
    $scope.gysId = '';

    function getListFun() {
      if (!$scope.selStroge) {
        layer.msg('仓库获取失败,请刷新页面')
        return
      }
      let upJson = {};
      upJson.pageNum = $scope.pageNum;
      upJson.pageSize = $scope.pageSize - 0;
      upJson.generationOriginParaId = $scope.selStroge;
      upJson.configStatus = $scope.typeStu;
      upJson.companyName = $scope.seachVal;
      upJson.supplierId = $scope.gysId;
      erp.postFun('supplier/logistics/package/pay/list', JSON.stringify(upJson), function(data) {
        console.log(data);
        let resData = data.data;
        console.log(resData)
        if (resData.code == 200) {
          $scope.dataList = resData.data.list;
          $scope.totalNum = resData.data.total;
          console.log($scope.dataList)
          // 如果是新建仓库，没有仓库名，从仓库列表中匹配出仓库名字
          $scope.dataList.forEach(item => {
            if (!item.originName) {
              const store = $scope.strogeList.find(_ => _.id === item.originId);
              item.originName = store && store.storageName;
            }
            if (!item.generationOriginName) {
              const store = $scope.strogeList.find(_ => _.id === item.generationOriginId);
              item.generationOriginName = store && store.storageName;
            }
          });

          pageFun($scope, getListFun)
        } else {
          layer.msg(resData.error)
        }
      }, function(data) {
        console.log(data)
      }, {
        layer: true
      })
    }
    // getStrogeFun($scope,erp,getListFun)


    $scope.strogeList = erp.getStorage().map(_ => ({
      id: _.dataId,
      storageName: _.dataName
    }));
    $scope.selStroge = $scope.strogeList[0].id;

    gysListFun($scope, erp)
    getListFun();
    $scope.changeStrogeFun = function() {
      $scope.pageNum = 1;
      getListFun();
    }
    $scope.selGysFun = function() {
      $scope.pageNum = 1;
      getListFun();
    }
    $scope.searchInput = function() {
      $scope.pageNum = 1;
      getListFun();
    }
    $scope.keyUpFun = function(ev) {
      if (ev.keyCode == 13) {
        $scope.pageNum = 1;
        getListFun();
      }
    }
    $scope.typeStuFun = function(num) {
      $scope.typeStu = num;
      getListFun();
    }
    $scope.chanPageSize = function() {
      $scope.pageNum = 1;
      getListFun();
    }
    $scope.gopageFun = function() {
      var countPage = Math.ceil($scope.totalNum / ($scope.pageSize - 0));
      if (!$scope.pageNum || $scope.pageNum < 1 || $scope.pageNum > countPage) {
        layer.msg('无效页码');
        return;
      }
      getListFun();
    }

    $scope.delBaoGuoFun = function(item) {
      $scope.feiYongFlag = true;
      $scope.itemLogisticsId = item.logisticsId;
      $scope.logistPrice = item.freightAmount;
      $scope.qtPrice = item.freightAmountCurrency;
      $scope.remarkVal = '';
      $scope.qtfyUnit = '$';
      $scope.yfUnit = '$';
    }
    $scope.sureChangePrice = function() {
      if (!$scope.logistPrice) {
        layer.msg('请输入运费')
        return
      }
      if ($scope.remarkVal && $scope.remarkVal.length < 5) {
        layer.msg('备注不能少于五个字符')
        return
      }
      let upJson = {}
      upJson.freightAmount = $scope.logistPrice;
      upJson.otherAmount = $scope.qtPrice;
      upJson.logisticsId = $scope.itemLogisticsId;
      upJson.remark = $scope.remarkVal;
      if ($scope.qtPrice) {
        upJson.otherAmountCurrency = $scope.qtfyUnit;
      }
      upJson.freightAmountCurrency = $scope.yfUnit;
      erp.postFun('supplier/logistics/package/update', JSON.stringify(upJson), function(data) {
        console.log(data)
        let resData = data.data;
        console.log(resData)
        if (resData.code == 200) {
          $scope.feiYongFlag = false;
          getListFun();
        } else {
          layer.msg(resData.error)
        }
      })
    }
    $scope.clearNoNum = function() {
      //先把非数字的都替换掉，除了数字和.
      $scope.logistPrice = $scope.logistPrice.replace(/[^\d.]/g, "");
      //必须保证第一个为数字而不是.
      $scope.logistPrice = $scope.logistPrice.replace(/^\./g, "");
      //保证只有出现一个.而没有多个.
      $scope.logistPrice = $scope.logistPrice.replace(/\.{2,}/g, "");
      //保证.只出现一次，而不能出现两次以上
      $scope.logistPrice = $scope.logistPrice.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");

    }
    $scope.clearNoNum2 = function() {
      //先把非数字的都替换掉，除了数字和.
      $scope.qtPrice = $scope.qtPrice.replace(/[^\d.]/g, "");
      //必须保证第一个为数字而不是.
      $scope.qtPrice = $scope.qtPrice.replace(/^\./g, "");
      //保证只有出现一个.而没有多个.
      $scope.qtPrice = $scope.qtPrice.replace(/\.{2,}/g, "");
      //保证.只出现一次，而不能出现两次以上
      $scope.qtPrice = $scope.qtPrice.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");

    }
    $scope.toogleSpFun = function(item) {
      item['spFlag'] = !item['spFlag']
      console.log(item)
    }
    $scope.stopPropFun = function(ev) {
      ev.stopPropagation()
    }
  }])
  app.controller('ruZhuCusBaoGuoDqsCtrl', ['$scope', 'erp', '$location', function($scope, erp, $location) {
    console.log('供应商包裹签收 gysbgdqs')
    console.log($location.path())
    let locationHref = $location.path();
    if (locationHref.indexOf('gysbgdqs') != -1) {
      $scope.qsStuNum = 1;
      $scope.searchKey = 'productSku';
    } else if (locationHref.indexOf('gysbgyqs') != -1) {
      $scope.qsStuNum = 2;
      $scope.searchKey = 'productSku';
    } else if (locationHref.indexOf('gysbgycqs') != -1) {
      $scope.qsStuNum = 3;
      $scope.searchKey = 'logisticsNumber';
    }
    $scope.pageSize = '50';
    $scope.pageNum = 1;

    $scope.strogeList = erp
      .getStorage()
      .map(_ => ({
        id: _.dataId,
        storageName: _.dataName
      }));

    $scope.strogeTypeFun = function(id, ev) {
      console.log($(ev.target).hasClass('filter-btnact'))
      if ($(ev.target).hasClass('filter-btnact')) {
        $scope.typeStrogeId = undefined;
      } else {
        $scope.typeStrogeId = id;
      }
      $scope.pageNum = 1;
      getListFun();
    }
    $scope.ycTypeFun = function(stu, ev) {
      if ($(ev.target).hasClass('filter-btnact')) {
        $scope.delTypeStu = undefined;
      } else {
        $scope.delTypeStu = stu;
      }
      $scope.pageNum = 1;
      getListFun();
    }
    $scope.changeYcFun = function() {
      $scope.pageNum = 1;
      getListFun();
    }
    $scope.changeStrogeFun = function() {
      $scope.pageNum = 1;
      getListFun();
    }

    function getListFun() {
      let postUrl;
      let upJson = {};
      if ($scope.qsStuNum == 3) {
        postUrl = 'supplier/logistics/package/getPackageSignEx'
        upJson.badType = $scope.ycStu || undefined;
        upJson.dealStatus = $scope.delTypeStu;
        upJson.originId = $scope.selStrogeId;
        upJson.finishTime = $('#cdatatime2').val();
      } else {
        postUrl = 'supplier/logistics/package/receiving/list'
        upJson.logisticsStatus = $scope.qsStuNum;
        upJson.dayNumber = $scope.dayStu;
        upJson.generationOriginId = $scope.typeStrogeId;
        upJson.endTime = $('#cdatatime2').val();
      }
      upJson.pageNum = $scope.pageNum;
      upJson.pageSize = $scope.pageSize - 0;
      upJson.startTime = $('#c-data-time').val();
      upJson[$scope.searchKey] = $scope.seachVal;
      erp.postFun(postUrl, JSON.stringify(upJson), function(data) {
        console.log(data);
        let resData = data.data;
        if (resData.code == 200) {
          $scope.dataList = resData.data.list;
          $scope.totalNum = resData.data.total;
          // 如果是新建仓库，没有仓库名，从仓库列表中匹配出仓库名字
          $scope.dataList.forEach(item => {
            if (!item.originName) {
              const store = $scope.strogeList.find(_ => _.id === item.originId);
              item.originName = store && store.storageName;
            }
            if (!item.generationOriginName) {
              const store = $scope.strogeList.find(_ => _.id === item.generationOriginId);
              item.generationOriginName = store && store.storageName;
            }
          });

          pageFun()
        } else {
          layer.msg(resData.error)
        }
      }, function(data) {
        console.log(data)
      }, {
        layer: true
      })
    }
    getListFun()
    $scope.timeDayType = function(stu) {
      $scope.dayStu = stu;
      $scope.pageNum = 1;
      $('#c-data-time').val('')
      $('#cdatatime2').val('')
      getListFun();
    }
    $scope.searchInput = function() {
      if ($('#c-data-time').val() || $('#cdatatime2').val()) {
        $scope.dayStu = undefined
      }
      $scope.pageNum = 1;
      getListFun();
    }
    $scope.keyUpFun = function(ev) {
      if (ev.keyCode == 13) {
        if ($('#c-data-time').val() || $('#cdatatime2').val()) {
          $scope.dayStu = undefined
        }
        $scope.pageNum = 1;
        getListFun();
      }
    }
    $scope.chanPageSize = function() {
      $scope.pageNum = 1;
      getListFun();
    }
    $scope.gopageFun = function() {
      var countPage = Math.ceil($scope.totalNum / ($scope.pageSize - 0));
      if (!$scope.pageNum || $scope.pageNum < 1 || $scope.pageNum > countPage) {
        layer.msg('无效页码');
        return;
      }
      getListFun();
    }
    $scope.ycType = '1';
    $scope.openYcFun = function(spItem) {
      $scope.spId = spItem.id;
      if (spItem.logisticsStatus == 3) {
        erp.postFun('supplier/supplierPackageProduct/number/exception/detail', {
          id: spItem.id
        }, function(data) {
          console.log(data)
          let resData = data.data;
          if (resData.code == 200) {
            $scope.ycFlag = true;
            $scope.remarkVal = resData.data.badRemark;
            $scope.ycType = resData.data.badType + '';
            $scope.ycNum = resData.data.badNum;
          } else {
            layer.msg(resData.error)
          }
        }, function(data) {
          console.log(data)
        }, {
          layer: true
        })
      } else {
        $scope.ycFlag = true;
        $scope.remarkVal = '';
        $scope.ycType = '1';
        $scope.ycNum = '';
      }
    }
    $scope.sureYcFun = function() {
      if (!$scope.ycNum) {
        layer.msg('请输入异常数量')
        return
      }
      if (!$scope.remarkVal) {
        layer.msg('请输入备注')
        return
      }
      if ($scope.remarkVal.length > 200) {
        layer.msg('备注字段长度不能大于200')
        return
      }
      erp.postFun('supplier/supplierPackageProduct/number/exception/update', {
        badRemark: $scope.remarkVal,
        badType: $scope.ycType,
        id: $scope.spId,
        badNum: $scope.ycNum
      }, function(data) {
        console.log(data)
        let resData = data.data;
        if (resData.code == 200) {
          $scope.ycFlag = false;
          $scope.remarkVal = '';
          $scope.ycNum = '';
          getListFun();
        } else {
          layer.msg(resData.error)
        }
      }, function(data) {
        console.log(data)
      }, {
        layer: true
      })
    }
    $scope.queryWuLiuFun = function(item) {
      erp.postFun('supplier/logistics/package/getLogisticsByWaybillNumber', {
        "logisticsNumber": item.logisticsNumber,
        "logisticsCode": item.logisticsCode
      }, function(data) {
        console.log(data)
        if (data.data.code == 200) {
          $scope.wuLiuMesFlag = true;
          $scope.wlMsgList = data.data.data;
        } else {
          layer.msg(data.data.error)
        }
      })
    }
    // $scope.wuLiuMesFlag = true;
    function pageFun() {
      if (!$scope.totalNum) {
        return
      }
      $(".pagegroup1").jqPaginator({
        totalCounts: $scope.totalNum,
        pageSize: $scope.pageSize * 1,
        visiblePages: 5,
        currentPage: $scope.pageNum * 1,
        activeClass: 'current',
        first: '<a class="prev" href="javascript:void(0);">&lt;&lt;<\/a>',
        prev: '<a class="prev" href="javascript:void(0);">&lt;<\/a>',
        next: '<a class="next" href="javascript:void(0);">&gt;<\/a>',
        last: '<a class="next" href="javascript:void(0);">&gt;&gt;<\/a>',
        page: '<a href="javascript:void(0);">{{page}}<\/a>',
        onPageChange: function(n, type) {
          if (type == 'init') {
            return;
          };
          erp.load();
          $scope.pageNum = n;
          getListFun()
        }
      });
    }
    $scope.clFun = function(item) {
      $scope.ycClFlag = true;
      $scope.supplierVariantId = item.id;
    }
    $scope.sureClYcFun = function() {
      if (!$scope.ycclRemarkVal) {
        layer.msg('请输入处理方法')
        return
      }
      let upJson = {};
      upJson.dealRemark = $scope.ycclRemarkVal;
      upJson.dealStatus = 2;
      upJson.supplierVariantId = $scope.supplierVariantId;
      erp.postFun('supplier/supplierPackageProduct/packageProduct/deal', upJson, function(res) {
        console.log(res)
        let resData = res.data;
        if (resData.code == 200) {
          $scope.ycClFlag = false;
          $scope.ycclRemarkVal = '';
          getListFun()
        } else {
          layer.msg(resData.error)
        }
      }, function(res) {
        console.log(res)
      }, {
        layer: true
      })
    }
    $scope.wcFun = function(item) {
      $scope.passFlag = true;
      $scope.supplierVariantId = item.id;
    }
    $scope.surePassYcFun = function() {
      let upJson = {};
      upJson.dealRemark = $scope.ycclRemarkVal;
      upJson.dealStatus = 3;
      upJson.supplierVariantId = $scope.supplierVariantId;
      erp.postFun('supplier/supplierPackageProduct/packageProduct/deal', upJson, function(res) {
        console.log(res)
        let resData = res.data;
        if (resData.code == 200) {
          $scope.passFlag = false;
          getListFun()
        } else {
          layer.msg(resData.error)
        }
      }, function(res) {
        console.log(res)
      }, {
        layer: true
      })
    }
    $scope.clearNoNum = function() {
      //先把非数字的都替换掉，除了数字和.
      $scope.ycNum = $scope.ycNum.replace(/[^\d]/g, "");
      console.log($scope.ycNum)
    }
    $scope.detailFun = function(item) {
      $location.path('/erpcustomer/ruzhucusList/detail').search({
        'id': item.id,
        'type': 'wtg'
      })
    }
    $('.table-box').on('click', '.sp-tr', function() {
      console.log('35749573489346=========', $(this).hasClass('sptr-clickact'))
      if ($(this).hasClass('sptr-clickact')) {
        $(this).removeClass('sptr-clickact')
        $(this).siblings('.bt-tr').hide()
      } else {
        $(this).addClass('sptr-clickact')
        $(this).siblings('.bt-tr').show()
      }
    })
    $('.table').on('mouseenter', '.qs-tbody', function() {
      if ($(this).children('.sp-tr').hasClass('sptr-clickact')) {
        return
      }
      $(this).children('.bt-tr').show();
      $('.table .sp-tr').removeClass('sptr-act');
      $(this).children('.sp-tr').addClass('sptr-act');
    })

    $('.table').on('mouseleave', '.qs-tbody', function() {
      if ($(this).children('.sp-tr').hasClass('sptr-clickact')) {
        return
      }
      $(this).children('.bt-tr').hide();
      $('.table .sp-tr').removeClass('sptr-act');
    })
    // $('.table').on('mouseenter', '.bt-tr', function () {
    //     $(this).show();
    // })
    // $('.table').on('mouseleave', '.bt-tr', function () {
    //     // $(this).hide();
    //     $('.table .sp-tr').removeClass('sptr-act');
    //     if ($(this).siblings('.sp-tr').hasClass('sptr-clickact')) {
    //         $(this).show();
    //     } else {
    //         $(this).hide();
    //     }
    // })
  }])

  function gysListFun($scope, erp) {
    erp.postFun('supplier/logistics/package/findCompanyList', {}, function(data) {
      // console.log(data)
      let resData = data.data;
      // console.log(resData)
      if (resData.code == 200) {
        $scope.gysList = resData.data;
      } else {
        layer.msg(resData.error)
      }
    })
  }
  // function getStrogeFun($scope,erp,getListFun){
  //     erp.getFun('supplier/logistics/package/findHouseList',function(data){
  //         // console.log(data)
  //         let resData = data.data;
  //         // console.log(resData)
  //         if(resData.code == 200){
  //             $scope.strogeList = resData.data;
  //             $scope.selStroge = $scope.strogeList[0].id;
  //             getListFun();
  //         }else{
  //             layer.msg(resData.error)
  //         }
  //     },function(){
  //         layer.msg('获取仓库失败，请刷新重试')
  //     })
  // }
  function pageFun($scope, getListFun) {
    if (!$scope.totalNum) {
      return
    }
    $(".pagegroup1").jqPaginator({
      totalCounts: $scope.totalNum,
      pageSize: $scope.pageSize * 1,
      visiblePages: 5,
      currentPage: $scope.pageNum * 1,
      activeClass: 'current',
      first: '<a class="prev" href="javascript:void(0);">&lt;&lt;<\/a>',
      prev: '<a class="prev" href="javascript:void(0);">&lt;<\/a>',
      next: '<a class="next" href="javascript:void(0);">&gt;<\/a>',
      last: '<a class="next" href="javascript:void(0);">&gt;&gt;<\/a>',
      page: '<a href="javascript:void(0);">{{page}}<\/a>',
      onPageChange: function(n, type) {
        if (type == 'init') {
          return;
        };
        erp.load();
        $scope.pageNum = n;
        getListFun(erp, $scope)
      }
    });
  }
})()