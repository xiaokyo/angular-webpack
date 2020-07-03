(function (angular) {
  angular.module('manage').component('paging', {
    templateUrl: 'static/components/paging/paing.html',
    controller: pagMerChandiseCtrl,
    bindings: {
      podarray: '=',
      showdetail: '=',
      no: '=',
      onLog: '&',
      showWorkOrder: '&',
      username: '='
    }
  });
  function pagMerChandiseCtrl($scope, erp, fun) {
    //处理分页
		$scope.dealpage = () => {
			if ($scope.erpordTnum <= 0) {
				layer.closeAll("loading")
				return;
			}
			$("#c-pages-fun").jqPaginator({
				totalCounts: $scope.erpordTnum,//设置分页的总条目数
				pageSize: $scope.pageSize-0,//设置每一页的条目数
				visiblePages: 5,//显示多少页
				currentPage: $scope.pageNum * 1,
				activeClass: 'active',
				prev: '<a class="prev" href="javascript:void(0);">&lt;<\/a>',
				next: '<a class="next" href="javascript:void(0);">&gt;<\/a>',
				page: '<a href="javascript:void(0);">{{page}}<\/a>',
				first: '<a class="prev" href="javascript:void(0);">&lt&lt;<\/a>',
				last: '<a class="prev" href="javascript:void(0);">&gt&gt;<\/a>',
				onPageChange: function (n, type) {
					if (type == 'init') {
						layer.closeAll("loading")
						return;
					}
					$scope.pageNum = n;
					fun()
				}
			});
		};
    //分页选择框的切换
    $scope.changePag = () => {
      $('#page-sel').change(function () {
        erp.load();
        var showList = $(this).val() - 0;
        $scope.pageSize = showList;
        if ($scope.erpordTnum < 1) {
          erp.closeLoad();
          return;
        }
        $("#c-pages-fun").jqPaginator({
          totalCounts: $scope.erpordTnum,//设置分页的总条目数
          pageSize: showList,//设置每一页的条目数
          visiblePages: 5,//显示多少页
          currentPage: $scope.pageNum * 1,
          activeClass: 'active',
          prev: '<a class="prev" href="javascript:void(0);">&lt;<\/a>',
          next: '<a class="next" href="javascript:void(0);">&gt;<\/a>',
          page: '<a href="javascript:void(0);">{{page}}<\/a>',
          first: '<a class="prev" href="javascript:void(0);">&lt&lt;<\/a>',
          last: '<a class="prev" href="javascript:void(0);">&gt&gt;<\/a>',
          onPageChange: function () {
            productFun();
          }
        })
      })
    };
		
    //跳页的查询
		$scope.gopageFun = () => {
      let pageNum = $('#inp-num').val()-0;
      var countN = Math.ceil($scope.erpordTnum / $scope.pageSize);
			erp.load();
			if (!pageNum || pageNum<1) {
				layer.closeAll("loading")
				layer.msg('跳转页数不能为空!');
				return;
			}
			if (pageNum > countN) {
				layer.closeAll("loading")
				layer.msg('选择的页数大于总页数.');
				return;
			}
			productFun();
    };
  }
})(angular)