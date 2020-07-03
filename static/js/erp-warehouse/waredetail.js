;
(function() {
  var app = angular.module('warehouse-app');
  function setAllChiToUnactive(arr, tag) {
    for (var i = 0; i < arr.length; i++) {
        arr[i].active = false;
        if (arr[i][tag] && arr[i][tag].length > 0) {
            setAllChiToUnactive(arr[i][tag], tag);
        }
    }
  }

  app.controller('waredetailCtrl', ['$scope', "erp", '$location', '$routeParams', '$timeout', function($scope, erp, $location, $routeParams, $timeout) {
    console.log('waredetailCtrl');

    $scope.wareId = $routeParams.id;
    console.log($scope.wareId);
    $scope.index1 = '00';

    function getRootNode(param, success) {
      layer.load(2);
      erp.postFun('warehouseBuildWeb/management/getStorageLocation', param, function(res) {
        layer.closeAll('loading');
        console.log(res);
        const {code, data} = res.data;
        if (code != 200) return layer.msg('获取仓库类目失败 ')
        if (data.root) return success(data.root);
        success(data)
      });
    }

    function getRootNodeInit() {
      getRootNode({
        rank: "1",
        codeId: $scope.wareId
      }, function(result) {
        result.open = false;
        result.active = true;
        result.codeType = '仓';
        $scope.folder = result;
        $scope.brunchItem = result;
        $scope.rootPaCodeId = $scope.brunchItem.pCodeId;
        getList(erp, $scope);
      });
    }
    getRootNodeInit();

    $scope.search = function() {
      getList(erp, $scope);
    }
    $scope.enterSearch = function(e) {
      if (e.keyCode == 13) {
        getList(erp, $scope);
      }
    }

    $scope.searchStr = '';
    $scope.pageSize = '12';
    $scope.pageNum = '1';
    $scope.totalNum = 0;
    $scope.totalPageNum = 0;
    //erp.postFun("app/storage/orderBuyList", {"data":"{'pageNum':'1','pageSize':'5'}"}, bb, err);
    // 获取列表
    function getList(erp, $scope) {
      var sendJson = {};
      sendJson.pageSize = $scope.pageNum;
      sendJson.pageNum = $scope.pageSize;
      sendJson.searchParam = $scope.searchStr;
      sendJson.rootPaCodeId = $scope.rootPaCodeId;
      sendJson.codeId = $scope.brunchItem.codeid + '';
      $('.erp-load-tbody').show();
      erp.loadPercent($('.erp-load-box'), 500);
      $scope.brunchList = [];
      erp.postFun("warehouseBuildWeb/management/getNodeInfoList", JSON.stringify(sendJson), function(data) {
        $('.erp-load-tbody').hide();
        erp.closeLoadPercent($('.erp-load-box'));
        console.log(data);
        $scope.brunchList = data.data.data.list;
        $scope.totalNum = data.data.data.totalNum;
        $scope.totalPageNum = Math.ceil($scope.totalNum / $scope.pageSize);
        if ($scope.totalNum == 0) {
          erp.addNodataPic($('.erp-load-box'), 500);
          return;
        };
        erp.removeNodataPic($('.erp-load-box'));
        $scope.$broadcast('page-data', {
            showSelect:false,
            showGo:false,
            pageSize: $scope.pageSize,
            pageNum: $scope.pageNum,
            totalNum: $scope.totalPageNum,
            totalCounts: $scope.totalNum,
            pageList: ['12', '50', '100']
        });
      });
    }
    $scope.$on('pagedata-fa', function (d, data) {
        $scope.pageNum = data.pageNum;
        $scope.pageSize = data.pageSize;
        getList(erp, $scope);
    })

    // 一键建仓
    $scope.wareDetailData = {
      areaNum:'',
      rowNum:'',
      tierNum:'',
      boxNum:'',
      codeId:''
    }
    $scope.addDetailWare = ()=>{
      console.log($scope.wareDetailData)
      if(!$scope.wareDetailData.areaNum){
          return layer.msg('请输入分区数');
      }else if($scope.wareDetailData.areaNum==0||$scope.wareDetailData.areaNum>5){
          return layer.msg('请输入1-5个分区数');
      }else if(!$scope.wareDetailData.rowNum){
          return layer.msg('请输入每个区域排数');
      }else if($scope.wareDetailData.rowNum==0||$scope.wareDetailData.rowNum>100){
          return layer.msg('请输入1-100个区域排数');
      }else if(!$scope.wareDetailData.tierNum){
          return layer.msg('请输入每排层数');
      }else if($scope.wareDetailData.tierNum==0||$scope.wareDetailData.tierNum>10){
          return layer.msg('请输入1-10个区域排数');
      }else if(!$scope.wareDetailData.boxNum){
          return layer.msg('请输入每层框数');
      }else if($scope.wareDetailData.boxNum==0||$scope.wareDetailData.boxNum>50){
          return layer.msg('请输入1-50个层框数');
      }

      $scope.wareDetailData.codeId = $scope.brunchItem.codeid

      erp.load();
      erp.postFun('warehouseBuildWeb/management/oneKeyStorage', $scope.wareDetailData,  (data) =>{
          erp.closeLoad();
          if (data.data.code != 200) {
              layer.msg(data.data.message);
          } else {
              $scope.onekeyStorageFlag=false;
              getRootNodeInit();
              getList()
          }
      });
  }

    $scope.addBrunch = function() {
      $scope.addBrunchFlag = true;
      $scope.opeBrunchType = '新增分支';
      if ($scope.brunchItem.childrens && $scope.brunchItem.childrens.length > 0) {
        $scope.addBrunchType = true;
        $scope.brunchType = $scope.brunchItem.childrens[0].codeType;
      } else {
        $scope.addBrunchType = false;
        $scope.brunchType = '';
      }
      console.log($scope.brunchItem);
    }
    $scope.cancelAddBrunch = function() {
      $scope.addBrunchFlag = false;
      $scope.editBrunchFlag = false;
      $scope.brunchName = $scope.brunchCode = $scope.brunchType = $scope.brunchCode = $scope.brunchStatus = $scope.remarkInfo = $scope.brunchAddress = '';
      $scope.editBrunchItem = null;
    }
    $scope.editOneBrunch = function(item, index1) {
      console.log(item.codeType);
      if (item.codeType) {
        $scope.brunchType = item.codeType;
        $scope.addBrunchType = true;

      } else {
        $scope.addBrunchType = false;
        $scope.brunchType = '';
      }
      console.log($scope.brunchType);
      $scope.editBrunchFlag = true;
      $scope.opeBrunchType = '编辑分支';
      $scope.editBrunchItem = item;
      $scope.editBrunchItem.index = index1;
      console.log($scope.editBrunchItem);
      $scope.brunchName = item.codeName;
      $scope.remarkInfo = item.remark;
      $scope.brunchAddress = item.horizontalFlag;
    }
    $scope.deleteOneBrunch = function(item, index1) {
      $scope.deleteBrunchFlag = true;
      $scope.deleteBrunchItem = item;
      $scope.deleteBrunchItem.index = index1;
    }
    $scope.goDeleteBrunch = function() {
      erp.postFun('warehouseBuildWeb/management/delChildTreeNode', JSON.stringify({
        codeId: $scope.deleteBrunchItem.codeid + ''
      }), function(data) {
        console.log(data);
        if (data.data.code != 200) {
          layer.msg(data.data.message);
          return;
        }
        $scope.brunchItem.childrens.splice(erp.findIndexByKey($scope.brunchItem.childrens, 'id', $scope.deleteBrunchItem.id), 1);
        $scope.brunchList.splice($scope.deleteBrunchItem.index, 1);
        $scope.deleteBrunchFlag = false;
        $scope.deleteBrunchItem = null;
      });
    }
    $scope.goAddOneBrunch = function() {
      if (!$scope.brunchType && !$scope.brunchTypeInp) {
        layer.msg('请输入层级名称');
        return;
      }
      if (!$scope.brunchName) {
        layer.msg('请输入名称');
        return;
      }
      let sendJson = {
        rootPaCodeId: $scope.rootPaCodeId,
        codeName: $scope.brunchName,
        codeType: $scope.brunchType || $scope.brunchTypeInp,
        remark: $scope.remarkInfo,
        horizontalFlag: $scope.brunchAddress
      }
      // return console.log(sendJson);

      var sendUrl;
      if ($scope.editBrunchItem) {
        sendJson.codeId = $scope.editBrunchItem.pCodeId
        sendUrl = 'warehouseBuildWeb/management/editChildTreeNode';
      } else {
        sendJson.codeId = $scope.brunchItem.codeid;
        sendUrl = 'warehouseBuildWeb/management/addChildTreeNode';
      }
      layer.load(2);
      erp.postFun(sendUrl, JSON.stringify(sendJson), function(data) {
        layer.closeAll('loading');
        if (data.data.code != 200) {
          if (data.data.code == 402 || data.data.code == 810) {
            layer.msg(data.data.message);
          } else {
            layer.msg('操作失败');
          }
        } else {
          layer.msg('操作成功');
          if ($scope.addBrunchFlag) {
            getList(erp, $scope);
            if (!$scope.brunchItem.childrens) {
              $scope.brunchItem.childrens = [];
            }
            $scope.brunchItem.childrens.push(data.data.result);
          }
          if ($scope.editBrunchFlag) {
            $scope.brunchItem.childrens[erp.findIndexByKey($scope.brunchItem.childrens, 'id', $scope.editBrunchItem.id)] = data.data.result;
            $scope.brunchList[$scope.editBrunchItem.index] = data.data.result;
          }
          $scope.addBrunchFlag = false;
          $scope.editBrunchFlag = false;
          $scope.editBrunchItem = null;
          $scope.brunchName = $scope.brunchCode = $scope.brunchType = $scope.brunchStatus = $scope.remarkInfo = $scope.brunchAddress = '';
        }
      });
    }
    $scope.pointOne = function(item) {
      $scope.pageNum = '1';
      $scope.brunchItem = item;
      getList(erp, $scope);
      $scope.folder.active = false;
      setAllChiToUnactive($scope.folder.childrens, 'childrens');
      item.active = true;
    }
    $scope.switchList = function(item, flag) {
      // console.log(item, flag);
      if (flag) { // 展开
        if (item.childrens && item.childrens.length > 0) {
          item.open = flag;
        } else { // 获取当前节点
          getRootNode({
            rank: item.sequence * 1 + 1 + '',
            codeId: item.codeid + ''
          }, function(result) {
            item.childrens = result;
            item.open = flag;
          })
        }
      } else { // 收起
        item.open = flag;
      }
    }

    $scope.editPositionType = () => {
      $scope.positionTypeShow = true;
      $scope.positionType = $scope.brunchItem.positionType;
    }
    $scope.cancelPositionType = () => {
      $scope.positionTypeShow = false;
    }
    $scope.goPositionType = () => {
      if (!$scope.positionType) return layer.msg('请选择仓位类型');
      layer.load(2);
      erp.postFun('warehouseBuildWeb/management/updatePositionTypeByCodeId', {
        positionType: $scope.positionType,
        codeId: $scope.brunchItem.codeid
      }, res =>{
        layer.closeAll('loading');
        console.log(res);
        const {data} = res;
        if (data.code != 200) return layer.msg('修改失败');
        layer.msg('修改成功');
        $scope.positionTypeShow = false;
        refreshLocationType();
        $timeout(() => {
          getRootNodeInit();
        }, 3000)
      })
    }

    // 刷新库位缓存
    function refreshLocationType() {
      erp.postFun('storehouse/WarehousInfo/refreshLocationType',{},res=>{})
    }
    
  }]);
})();