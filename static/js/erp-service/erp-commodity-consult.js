(function () {
  var app = angular.module('erp-service');
  app.controller('commodityConsultCtrl', ['$scope', 'erp', '$routeParams', function($scope, erp, $routeParams) {
    $scope.whichPage = $routeParams.status || '1';
    console.log("路由参数======>", $scope.whichPage);
    $scope.state = $scope.whichPage; // 待回复1 已回复2 已删除3
    $scope.model = false;
    $scope.title = '待回复';
    $scope.revert = ''; // 文本内容
    $scope.pageNum = 1;
    $scope.pageSize = 30;
    $scope.search = ''; // 搜索
    $scope.deal_name = ''; // 处理人
    $scope.data = {
      revert: ''
    };
    $scope.productList = [];
    $scope.revertList = [];
    $scope.dealnames = [];
    $scope.erpordTnum = 0;      //分页总条数
    $scope.userId = '';  // 用户id
    $scope.productId = '';  // 商品id
    // 回复弹框
    $scope.modelShow = function (item, title) {
      $scope.model = true;
      $scope.title = title;
      $scope.userId = item.user_id;
      $scope.productId = item.productId;
      revertFun(item);
    }
    // 咨询回复列表数据
    function productFun() {
      let data = {
        pageNum: String($scope.pageNum),
        pageSize: String($scope.pageSize),
        state: $scope.state,
        search: $scope.search,
        deal_name: $scope.deal_name
      }
      $scope.productList = [];
      $scope.dealnames = [];
      erp.load();
      erp.postFun('erp/consulting/getConsulting', JSON.stringify(data), function (res) {
        erp.closeLoad();
        if (res.data.statusCode == '200') {
          $scope.productList = res.data.result;
          $scope.dealnames = res.data.result.dealnames;
          $scope.erpordTnum = $scope.productList.total;
          for (let i = 0; i < res.data.result.list.length; i++) {
            let id = res.data.result.list[i].user_id;
            $scope.productList.list[i].commodityId = id.slice(1, id.indexOf('}'))
          }
          dealpage();
        }
      })
    };
    productFun();
    // 回复数据
    function revertFun(item) {
      let data = {
        productId: item.productId,
        consulting_id: item.consulting_id
      }
      let name = item.user_name;
      $scope.revertList = [];
      erp.load();
      erp.postFun('erp/consulting/getConsultinginfo', JSON.stringify(data), function (res) {
        erp.closeLoad();
        if (res.data.statusCode == '200') {
          $scope.revertList.push(res.data.result[0]);
          $scope.revertList[0].imageName = $scope.revertList[0].user_name.slice(0, 1).toUpperCase();
          if (res.data.result[0].replycount > 0) {
            $scope.revertList = $scope.revertList.concat(res.data.result[0].reply);
            for (let i = 1; i < $scope.revertList.length; i++) {
              if ($scope.revertList[i].state < 3) {
                if ($scope.revertList[i].user_name == 'CJ') {
                  $scope.revertList[i].user_name = $scope.revertList[i].user_name + ' 回复' + name;
                } else {
                  if ($scope.revertList[i].state > 1) {
                    $scope.revertList[i].user_name = $scope.revertList[i].user_name + '回复 CJ';
                  }
                }
                // 没有图像，首字母大写
                $scope.revertList[i].imageName = $scope.revertList[i].user_name.slice(0, 1).toUpperCase();
              }
            }
          }
        }
      })
    };
    // 导航切换
    $scope.navTab = function (state) {
      $scope.whichPage = state;
      $scope.state = state;
      $scope.pageNum = 1;
      productFun();
    };
    // 查询
    $scope.querey = function () {
      productFun();
    };
    // 删除
    $scope.del = function (item) {
      layer.confirm('确认删除本条咨询？', {
        title: false,
        closeBtn: 0,
				btn : ['确认','取消']//按钮
			}, function(index) {
        layer.close(index);
        let data = {
          superiorid: item.superiorid,
          state: item.state,
          source: item.source
        }
        if (item.superiorid == 0) {
          data.type = 1;
          data.consulting_id = item.consulting_id;
        } else {
          data.type = 2;
          data.consulting_id = item.reply_id;
        }
        erp.postFun('erp/consulting/delectConsulting', JSON.stringify(data), function (res) {
          if (res.data.statusCode == '200') {
            layer.msg('删除成功');
            $scope.model = false;
            productFun();
          }
        });
			});
    }
    // 关闭
    $scope.cancel = function () {
      $scope.model = false;
      $scope.data.revert  = '';
    };
    // 回复
    let flag = true;
    $scope.reply = function () {
      if (!$scope.data.revert) {
        layer.msg('回复内容不能为空')
        return;
      }
      if (getByteLen($scope.data.revert) > 500) {
        layer.msg('每次咨询内容最多为500个英文字母或者250个中文汉字，字数过多建议分成多条咨询进行提交')
        return;
      }
      if (flag) {
        let item = $scope.revertList.slice(-1)[0];
        let data = {
          content: $scope.data.revert,
          state: 2,
          consulting_id: item.consulting_id,
          type: 2,
          sku: item.sku,
          product_name: item.product_name,
          product_ename: item.product_ename,
          source: 2,
          superiorid: item.consulting_id
        }
        flag = false;
        if (!item.reply_id) {
          data.superiorid = item.consulting_id;
        } else {
          data.superiorid = item.reply_id;
        }
        erp.postFun('erp/consulting/insertConsulting', JSON.stringify(data), function (res) {
          if (res.data.statusCode == '200') {
            $scope.model = false;
            flag = true;
            layer.msg('回复成功');
            productFun();
            goMessage();
            $scope.data.revert  = '';
          }
        });
      }
      
    };
    // 通知消息
    function goMessage() {
      $scope.data.revert = $scope.data.revert.replace("\n", "<br>");
      erp.postFun('app/notification/sendnotification', {
        'data': "{'templateTitle':'" + 'Product Consultation html:product-detail.html?id=' + $scope.productId + "','relationType':'" + 1 + "','relationId':'" + $scope.userId + "','info':'" + $scope.data.revert + "','status':'1','date':'" + undefined + "'}",
        'html': $scope.data.revert
      }, function (data) {});
    }
    //处理分页
		function dealpage() {
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
					productFun()
				}
			});
		};
    //分页选择框的切换
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
			});
		});
    //跳页的查询
		$scope.gopageFun = function () {
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
    // 输入文本长度
    function getByteLen(val) {
      var len = 0;
      for (var i = 0; i < val.length; i++) {
        var a = val.charAt(i);
        if (a.match(/[^\x00-\xff]/ig) != null) {
          len += 2;
        }
        else {
          len += 1;
        }
      }
      return len;
    }
  }]);
})()