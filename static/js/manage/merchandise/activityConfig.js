(function() {
  var app = angular.module('merchandise');

  // app.directive('imageonload', function() {
  //   return {
  //     restrict: 'A',
  //     link: function(scope, element, attrs) {
  //       element.bind('load', function() {
  //         //call the function that was passed
  //         scope.$apply(attrs.imageonload);
  //       });
  //     }
  //   };
  // })

  app.filter('stateFil', function() {
    return function(state) {
      if (state === 1) {
        return "未开始";
      } else if (state === 2) {
        return "进行中";
      } else if (state === 3) {
        return "已结束";
      } else if (state === 4) {
        return "手动关闭";
      }
    }
  })

  app.controller('activityConfigCtrl', [
    '$scope',
    '$window',
    '$location',
    '$compile',
    '$routeParams',
    '$timeout',
    '$http',
    'erp',
    'merchan',
    '$sce',
    function(
      $scope,
      $window,
      $location,
      $compile,
      $routeParams,
      $timeout,
      $http,
      erp,
      merchan,
      $sce
    ) {
      console.log("activityConfigCtrl");
      var bs = new Base64();
      $scope.loginName = localStorage.getItem('erploginName') ? bs.decode(localStorage.getItem('erploginName')) : '';
      $scope.isAdminLogin = erp.isAdminLogin();
      console.log('admin', $scope.isAdminLogin);
      $scope.userId = localStorage.getItem('erpuserId') == null ? '' : bs.decode(localStorage.getItem('erpuserId'));
      $scope.userName = localStorage.getItem('erpname') == null ? '' : bs.decode(localStorage.getItem('erpname'));
      $scope.token = localStorage.getItem('erptoken') == null ? '' : bs.decode(localStorage.getItem('erptoken'));

      $scope.pageNum = 1
      $scope.pageSize = '20'
      $scope.checkAllFlag = false;//全选
      $scope.showStatus = '0'; //显示状态：不传或0查全部;1未开始;2进行中;3已过期
      $scope.searchKey = ''; //搜索关键字
      $scope.stateFilStyle = [
        {"color": "#ffab33"},
        {"color": "green"},
        {"color": "#c5c5c5"},
        {"color": "red"},
      ]

      function initConfirmBox ({title='确认', cb}) {
        $scope.confirmBox = {
          hasShow: true,
          ok() {
            cb && cb()
            this.hasShow = false;
          },
          cancel() {
            this.hasShow = false;
          },
          title,
        }
      }

      // 获取活动列表
      function getActivityList() {
        let data = {
          pageNum: $scope.pageNum,
          pageSize: $scope.pageSize,
          state: $scope.showStatus,
          category: $scope.searchKey
        }
        erp.load();
        erp.postFun('cj/activity/getActivityPage', data, res => {
          layer.closeAll('loading')
          // console.log(res);
          const data = res.data;
          if (data.statusCode != 200) {
            return layer.msg(data.message);
          }
          $scope.activityList = data.result.rows;
          console.log("活动列表=>", $scope.activityList);
          $scope.totalNum = data.result.total;
          pageFun(erp, $scope);
        })
      }
      getActivityList();

      // 分页相关============================================================================== start
      function pageFun(erp, $scope) {
        $("#pagination").jqPaginator({
          totalCounts: $scope.totalNum || 1,
          pageSize: $scope.pageSize * 1,
          currentPage: $scope.pageNum * 1,
          // visiblePages: 5,
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
            // erp.load();
            $scope.pageNum = n;
            console.log($scope.pageNum, typeof $scope.pageNum);
            getActivityList();
          }
        });
      }
      $scope.changePageSize = function() {
        $scope.pageNum = '1';
        getActivityList();
      }
      $scope.toSpecifiedPage = function() {
        let totalPage = Math.ceil($scope.totalNum / $scope.pageSize);
        if (!(/(^[1-9]\d*$)/.test($scope.pageNum)) || $scope.pageNum > totalPage) {
          layer.msg("请输入正确页码");
          $scope.pageNum = '1';
          return;
        }
        getActivityList();
      }
      // 分页相关============================================================================== end

      // // 全选
      // $scope.checkAll = () => {
      //   $scope.checkAllFlag = !$scope.checkAllFlag;
      //   $scope.activityList = $scope.activityList.map(item => {
      //     item.checked = $scope.checkAllFlag
      //     return item
      //   })
      // }
      // // 单选
      // $scope.checkOne = (item) => {
      //   console.log(item);
      //   item.checked = !item.checked;
      //   const len = $scope.activityList.filter(item => item.checked).length;
      //   $scope.checkAllFlag = len === $scope.activityList.length;
      // }

      // 切换显示状态
      $scope.statusChange = () => {
        $scope.pageNum = '1';
        getActivityList();
      }
      // 搜索
      $scope.searchRun = () => {
        getActivityList();
      }
      // 编辑
      $scope.activityEdit = (id) => {
        // console.log(item);
        $location.path('/merchandise/activityEdit').search({id});
      }
      // 新增
      $scope.newAdd = () => {
        $location.path('/merchandise/activityEdit');
      }

      //商品管理
      $scope.activityGoodsManage = (id) => {
        $location.path('/merchandise/activityGoodsManage').search({id});
      }


      function con(res) {
        console.log(res);
        const data = res.data;
        if (data.statusCode != 200) {
          return layer.msg(data.message);
        }
        layer.msg(data.message);
        getActivityList();
      }
	
	    // 下架
	    $scope.unshelve = (item) => {
		    initConfirmBox({
			    title: '确认下架 ?',
			    cb: function () {
				    erp.postFun('cj/activity/xiaJia', { id: item.id }, res => con(res))
			    }
		    })
	    }
	    // 删除
	    $scope.delete = (item) => {
		    initConfirmBox({
			    title: '确认删除 ?',
			    cb: function () {
				    erp.postFun('cj/activity/deleteActivityV2', { id: item.id }, res => con(res))
			    }
		    })
	    }
	
	    // 预览
	    $scope.handlePreview = item => {
		    if (document.domain.includes('cjdropshipping')) {
					window.open(`https://app.cjdropshipping.com/boards.html?id=${item.id}`)
		    }else {
			    window.open(`http://app.test.com/boards.html?id=${item.id}`)
		    }
	    }
	
    }
  ]);
})();
