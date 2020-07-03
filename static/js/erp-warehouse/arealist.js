;
(function() {
  let app = angular.module('warehouse-app');
  app.controller('arealistCtrl', ['$scope', "erp", '$location', function($scope, erp, $location) {
    console.log('arealistCtrl')
    $scope.isadmin = erp.isAdminLogin();

    


    $scope.pageNum = 1
    $scope.pageSize = '20'
    $scope.areaNameCn = ''
    $scope.areaNameEn = ''
    $scope.countryCode = ''
    
    $scope.addWareFlag = false
    $scope.deleteWareFlag  = false
    $scope.editWareFlag  = false
    

    // 区域仓库设置信息,仓库列表
    function getWarehouseList(item) {
      erp.postFun('warehouseBuildWeb/management/getStorageInfoByAreaId', {
        areaId: $scope.wareId
      },(res)=> {
        // console.log(res);
        const data =  res.data;
        if (data.code != 200) {
          return layer.msg(data.message);
        }

        $scope.warehouseList = data.data;
        console.log("仓库列表=>", $scope.warehouseList);
        $scope.warehouseList.map(e => {
          e.check = item.warehouseSet.includes(e.id)
        });
      })
    }

    // 获取国家简码
    function getAreaCode() {
      erp.postFun('warehouseBuildWeb/management/getCountry', {}, (res) => {
        // console.log(res);
        const data = res.data;
        if (data.code != 200) {
          return layer.msg(data.message);
        }
        $scope.areaCodeList = data.data;
        $scope.countryCode = $scope.areaCodeList[0].id;
        console.log($scope.areaCodeList);
      })
    }
    getAreaCode();

    function getareaList() {
      let data = {
        pageNum: $scope.pageNum,
        pageSize: $scope.pageSize,
      }
      erp.postFun('warehouseBuildWeb/management/getArea', data, function(data) {
        layer.closeAll('loading')
        // console.log(data)
        if (data.data.code != 200) {
          layer.msg('获取列表错误');
          return;
        }
       
        $scope.areaList = data.data.data.list;
        console.log("表格数据=>", $scope.areaList);
        $scope.totalNum = data.data.data.total;
        pageFun1();
      })
    }

    getareaList();

      //分页
      function pageFun1() {
        $(".pagegroup1").jqPaginator({
          totalCounts: $scope.totalNum || 1,
          pageSize: $scope.pageSize * 1,
          visiblePages: 5,
          currentPage: $scope.pageNum * 1,
          activeClass: 'current',
          first: '<a class="prev" href="javascript:void(0);">&lt;&lt;<\/a>',
          prev: '<a class="prev" href="javascript:void(0);">&lt;<\/a>',
          next: '<a class="next" href="javascript:void(0);">&gt;<\/a>',
          last: '<a class="next" href="javascript:void(0);">&gt;&gt;<\/a>',
          page: '<a href="javascript:void(0);">{{page}}<\/a>',
          onPageChange: function (n, type) {
            if (type == 'init') {
              return;
            };
            erp.load();
            $scope.pageNum = n;
            console.log($scope.pageNum,typeof $scope.pageNum)
            getareaList()
          }
        });
      }
      $scope.toPage1 = function () {
        var pageNum = Number($scope.pageNum);
        var pageNumtotal = Number($scope.totalNum);
        var pageSize1 = Number($scope.pageSize);
        var totalPage =  Math.ceil(pageNumtotal / pageSize1);
        if (!pageNum) {
          layer.msg('请输入页码');
          return;
        }
        if (pageNum > totalPage) {
          layer.msg('总计' + totalPage + '页，所输入数字应小于' + totalPage);
          $scope.pageNum1 = 1;
          return;
        }
        getareaList();
      };
      $scope.pagechange = function(pageSize){
          console.log($scope.pageSize)
          console.log(pageSize)
          $scope.pageNum = 1;
          getareaList()
      }



    // 删除
    $scope.deleteOneWare = function(item) {
      // console.log(item);
      $scope.deleteWareFlag = true;
      $scope.wareId = item.id;
      $scope.deleteWareName = item.areaCn;
    };


    $scope.goDeleteWare = function() {
      erp.load();
      erp.postFun('warehouseBuildWeb/management/delectArea', {
        id: $scope.wareId
      }, function(data) {
        erp.closeLoad();
        console.log(data);
        if (data.data.code != 200) {
            return layer.msg(data.data.message);
        } else {
          layer.msg('操作成功');
          $scope.deleteWareFlag = false;
          getareaList();
        }
      });
    }
  
    // 新增
    $scope.addWareFun = () => {
      $scope.addWareFlag = true;
      // $scope.sort = $scope.totalNum+1
    }

    // 新增提交
    $scope.sureAdd = function(){
      let data = {
        "areaCn":$scope.areaNameCn,
        "areaEn":$scope.areaNameEn,
        "countryCode": $scope.countryCode,
        "sort": $scope.sort,
        "inventoryControl": $scope.areaControl
      }
      // console.log(data);
      if ($scope.areaNameCn && $scope.areaNameEn && $scope.sort) {
        erp.postFun('warehouseBuildWeb/management/insertArea', data, function(data) {
          if (data.data.code == 200) {
            layer.msg('添加成功');
            $scope.cancelDetailWare()
            getareaList()
          }
          else{
            return layer.msg(data.data.message);
          }
        })
      }else{
        layer.msg('输入框不能为空')
      }
    }


    // 关闭
    $scope.cancelDetailWare = function(){
      $scope.addWareFlag = false;
      $scope.areaNameCn = ''
      $scope.areaNameEn = ''
      $scope.sort = ''
      $scope.editWareFlag  = false
      $scope.warehouseList = []
    }
    
    // 编辑
    $scope.editOneWare = function(item){
      // console.log(item);
      $scope.editWareFlag  = true;
      $scope.areaCn = item.areaCn;
      $scope.areaEn = item.areaEn;
      $scope.countryCode = item.countryCode;
      $scope.editSort = item.sort;
      $scope.areaControl = item.inventoryControl.toString();
      $scope.wareId = item.id;
      getWarehouseList(item);
    }

    // 编辑提交
    $scope.sureEdit = function(){
      const warehouseSet = [];
      $scope.warehouseList.filter(item => {
        return item.check == true
      }).map(item => {
        warehouseSet.push(
          item.id
        )
      })
      // console.log(warehouseSet);
      // if (warehouseSet.length <= 0) return layer.msg("区域仓库设置不能为空");
      let data = {
        "areaCn":$scope.areaCn,
        "areaEn":$scope.areaEn,
        "id": $scope.wareId,
        "countryCode": $scope.countryCode,
        "sort": $scope.editSort,
        "inventoryControl": $scope.areaControl,
        "warehouseSet": warehouseSet.join()
      }
      // console.log(data);
      if ($scope.areaCn && $scope.areaEn && $scope.editSort) {
        erp.postFun('warehouseBuildWeb/management/updateArea', data, function(data) {
          if (data.data.code == 200) {
            layer.msg('修改成功');
            $scope.cancelDetailWare()
            getareaList()
          }
          else{
            return layer.msg(data.data.message);
          }
        })
      }else{
        layer.msg('输入框不能为空')
      }
    }

  }])
}());