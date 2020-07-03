;
(function() {
  let app = angular.module('warehouse-app');
  app.controller('areacountrylistCtrl', ['$scope', "erp", '$location', function($scope, erp, $location) {
    console.log('areacountrylistCtrl')
    $scope.isadmin = erp.isAdminLogin();

    $scope.pageNum = 1;
    $scope.pageSize = '20';
    $scope.countryCode = ''

    function getareaList() {
      let data = {
        pageNum: $scope.pageNum,
        pageSize: $scope.pageSize,
      }
      erp.postFun('warehouseBuildWeb/management/getRegionalCountryArea', data, function(data) {
        console.log(data)
        layer.closeAll('loading')
        if (data.data.code != 200) {
          layer.msg('获取列表错误');
          return;
        }

        $scope.areaList = data.data.data.list;
        $scope.totalNum = data.data.data.total;
        pageFun1()
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
        onPageChange: function(n, type) {
          if (type == 'init') {
            return;
          };
          erp.load();
          $scope.pageNum = n;
          console.log($scope.pageNum, typeof $scope.pageNum)
          getareaList()
        }
      });
    }
    $scope.toPage1 = function() {
      var pageNum = Number($scope.pageNum);
      var pageNumtotal = Number($scope.totalNum);
      var pageSize1 = Number($scope.pageSize);
      var totalPage = Math.ceil(pageNumtotal / pageSize1);
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
    $scope.pagechange = function(pageSize) {
      console.log($scope.pageSize)
      console.log(pageSize)
      $scope.pageNum = 1;
      getareaList()
    }

    // $scope.areaNameCn = ''
    // $scope.areaNameEn = ''
    // $scope.countryCode = ''

    $scope.addWareFlag = false
    $scope.deleteWareFlag = false
    $scope.editWareFlag = false

    // 删除
    $scope.deleteOneWare = function(item) {
      $scope.deleteWareFlag = true;
      $scope.deleteWareId = item.id;
      $scope.deleteWareName = item.areaCn;
    };

    // 确认删除
    $scope.goDeleteWare = function() {
      erp.load();
      erp.postFun('warehouseBuildWeb/management/delectRegionalCountryArea', JSON.stringify({
        id: $scope.deleteWareId
      }), function(data) {
        erp.closeLoad();
        console.log(data);
        if (data.data.code != 200) {

          if (data.data.code == 206) {
            layer.msg('需超级管理员权限');
          } else {
            layer.msg('操作失败');
          }
        } else {
          layer.msg('删除成功');
          $scope.deleteWareFlag = false;
          getareaList();
        }
      });
    }

    // 请求国家简码列表及区域名称列表
    function getList() {
      erp.postFun('warehouseBuildWeb/management/getCountry', {}, function(data) {
        if (data.data.code == 200) {
          $scope.countryCodes = data.data.data;
          // console.log("国家简码列表=>", $scope.countryCodes);
        } else {
          layer.msg('国家列表获取失败');
        }
      })
      erp.postFun('warehouseBuildWeb/management/getArea', {}, function(data) {
        if (data.data.code == 200) {
          $scope.areasId = data.data.data.list;
          // console.log("区域名称列表=>", $scope.areasId);
        } else {
          layer.msg('区域列表获取失败');
        }
      })
    }

    // 新增
    $scope.addWareFun = () => {
      $scope.addWareFlag = true;
      $scope.areaId = '';
      $scope.isDefault = '';
      getList();
    }

    // 确认新增
    $scope.sureAdd = function() {
      let data = {
        "areaId": $scope.areaId,
        "countryCode": $scope.countryCode,
        "isDefault": $scope.isDefault
      }

      if ($scope.areaId && $scope.countryCode) {
        erp.postFun('warehouseBuildWeb/management/insertRegionalCountryArea', data, function(data) {
          if (data.data.code == 200) {
            layer.msg('添加成功');
            $scope.cancelDetailWare();
            getareaList();
          } else {
            layer.msg('添加失败');
          }
        })
      } else {
        layer.msg('输入框不能为空');
      }
    }


    // 关闭
    $scope.cancelDetailWare = function() {
      $scope.addWareFlag = false;
      $scope.areaNameCn = ''
      $scope.areaNameEn = ''
      $scope.countryCode = ''
      $scope.editWareFlag = false
    }

    // 编辑
    $scope.editOneWare = function(item) {
      console.log(item)
      $scope.editWareFlag = true
      $scope.deleteWareId = item.id; // 关联id
      $scope.areaId = item.areaId.toString(); // 区域-id
      $scope.countryCode = item.countryCode; // 国家-缩码
      $scope.isDefault = item.isDefault.toString(); // 是否默认
      getList()
    }

    // 编辑确认提交
    $scope.sureEdit = function() {
      let data = {
        "id": $scope.deleteWareId,
        "areaId": $scope.areaId,
        "countryCode": $scope.countryCode,
        "isDefault": $scope.isDefault
      }
      if ($scope.areaId && $scope.countryCode) {
        erp.postFun('warehouseBuildWeb/management/updateRegionalCountryArea', data, function(data) {
          if (data.data.code == 200) {
            layer.msg('修改成功');
            $scope.cancelDetailWare()
            getareaList()
          } else {
            layer.msg('修改失败')
          }
        })
      } else {
        layer.msg('输入框不能为空')
      }
    }
    $scope.areaChange = function(item) {
      console.log(item)
      $scope.isDefault = item
      // $scope.areaId = item.areaCn
      // $scope.areaId = item.id
      $('.areaList').css('display', 'none')
    }
    $scope.checkArea = function() {
      $('.areaList').css('display', 'block')
    }

  }])
}());