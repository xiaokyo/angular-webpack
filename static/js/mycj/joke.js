(function () {
  var app = angular.module('erp-joke', []);
  app.controller('joke-control', ['$scope', 'erp', '$location', function ($scope, erp, $location) {
    var bs = new Base64();
    var logiName = localStorage.getItem('erploginName') ? bs.decode(localStorage.getItem('erploginName')) : '';
    //客户页面
    $scope.search = '';
    $scope.pageSize = '20';
    $scope.pageNum = '1';
    $scope.pageNumarr = [10, 20, 30, 50];
    $scope.totalNum = 0;
    $scope.dataList = [];
    $scope.editFlag = false;
    $scope.removeFlag = false;

    function getList() {
      var data = {
        page: $scope.pageNum,
        limit: $scope.pageSize
      }
      erp.postFun('tool/joke/queryAllJoke', data, function (res) {
        if (res.data.statusCode == 200) {
          $scope.dataList = res.data.result.list;
          $scope.totalNum = res.data.result.count || 0;
          $scope.totalpage = function () {
            return Math.ceil($scope.totalNum / $scope.pageSize)
          }
          pageFun();
        }
      }, function (err) {

      }, {layer: true})
    }

    getList();
    //
    $scope.addData = function () {
      $scope.addFlag = true;
      $scope.addTXt = '';
    };
    $scope.addY = function () {
      if (!$scope.addTXt) {
        layer.msg('请输入内容')
      } else {
        var data = {
          content: $scope.addTXt,
        }
        erp.postFun('tool/joke/insertJoke', data, function (res) {
          if (res.data.statusCode == 200) {
            layer.msg('新增成功');
            $scope.addFlag = false;
            getList();
          }
        }, function (err) {

        }, {layer: true})
      }
    }
    //
    $scope.editItem = function (item) {
      $scope.editFlag = true;
      $scope.editTXt = item.CONTENT;
      $scope.editY = function () {
        if (!$scope.editTXt) {
          layer.msg('请输入内容')
        } else {
          var data = {
            id: item.ID,
            content: $scope.editTXt,
          }
          erp.postFun('tool/joke/updateJoke', data, function (res) {
            if (res.data.statusCode == 200) {
              layer.msg('编辑成功');
              $scope.editFlag = false;
              getList();
            }
          }, function (err) {

          }, {layer: true})
        }
      }
    };
    //
    $scope.removeItem = function (item) {
      $scope.removeFlag = true;
      $scope.removeY = function () {
        var data = {
          id: item.ID,
        }
        erp.postFun('tool/joke/deleteJoke', data, function (res) {
          if (res.data.statusCode == 200) {
            layer.msg('删除成功');
            $scope.removeFlag = false;
            getList();
          }
        }, function (err) {

        }, {layer: true})
      }
    };

    //分页
    function pageFun() {
      $(".pagegroup").jqPaginator({
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
          }
          $scope.pageNum = n + '';
          getList();
        }
      });
    }

    $scope.pagechange = function (pagesize) {
      $scope.pageNum = '1';
      getList();
    }
    $scope.pageNumchange = function () {
      console.log($scope.pageNum % 1)
      $scope.pageNum = $(".goyema").val() - 0;
      if ($scope.pageNum < 1 || $scope.pageNum > $scope.totalpage()) {
        layer.msg('错误页码');
        $scope.pageNum = '1'
      } else {
        getList();
      }
    }
    //搜索客户
    $scope.searchList = function () {
      $scope.pageNum = '1';
      getList();
    }
    //按下enter搜索
    $scope.enterSearch = function (event) {
      if (event.keyCode === 13 || event.keyCode === 108) {
        $scope.pageNum = '1';
        getList();
      }
    }
  }])
})()
