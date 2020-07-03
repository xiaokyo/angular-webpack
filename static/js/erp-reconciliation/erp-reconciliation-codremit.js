(function () {
	// 监听页面大小变化 以及 顶部tab元素变化
  function observeScroll(){
		let topTabEle = document.getElementById('top-tab')
    , tabLeft = topTabEle.offsetLeft
    , observer = new MutationObserver(ev => {
      // 这里写监听代码
      let height

      setTimeout(() => {
        height = topTabEle.offsetHeight
        document.getElementById('content-wrap').style.marginTop = `${height}px`
      }, 500);
    })

    observer.observe(topTabEle, { childList: true, subtree: true });

    window.onresize = function () {
      let height = topTabEle.offsetHeight

      document.getElementById('content-wrap').style.marginTop = `${height}px`
    }

    window.onscroll = function () {
      let scrollTop = document.documentElement.scrollLeft || document.body.scrollLeft;
      // console.log("滚动距离" + scrollTop, '===',topTabEle.offsetLeft , topTabEle.style.left); 
      topTabEle.style.left = `${tabLeft - scrollTop}px`;
    }
  }

  // 物流打款单
  app.controller('CodWaybillRemitCtrl', ['$scope', 'erp', '$routeParams', 'utils', '$location', function ($scope, erp, $routeParams, utils, $location) {
    $scope.pageNum = 1; // 分页 
    $scope.pageSize = 5; // 分页 每页展示几条
    $scope.currentPage = 1; // 当前页
    $scope.pagenumarr = ['5', '20', '30', '50', '100']; // 设置每页展示几条
    $scope.startDate = ''; // 搜索 - 开始日期
    $scope.endDate = ''; // 搜索 - 结束日期
    $scope.logisticsCompanyName = ''; // 物流公司名称
    $scope.status = ''; // 打款状态
    $scope.remitImgUrl = ''; // 当前操作凭证图片url
    $scope.remitId = ''; // 当前操作id
    $scope.remitModalVisible = false;
    $scope.logisticsCompanyArr = [];

    observeScroll();
    
    getList(); // 初始化列表数据

    // 获取物流
    (function () {
			erp.postFun("erp/logistics/reconciliation/logisticsCompanyNameList", {}, res => {
				if (res.data.code === '200') {
					$scope.logisticsCompanyArr = res.data.data || []
				} else {
					layer.msg(res.data.message)
				}
			}, error => {
				console.log(error)
			})
		})()

    // 分页触发
    $scope.$on('pagedata-fa', function(d, data) {
      $scope.pageNum = parseInt(data.pageNum);
      $scope.pageSize = parseInt(data.pageSize);
      getList();
    });

    // 打款单列表
    function getList() {
      let rqData = {
        page: $scope.pageNum,
        size: $scope.pageSize
      };
      $scope.logisticsCompanyName && (rqData.logisticsCompanyName = $scope.logisticsCompanyName);
      $scope.status && (rqData.status = parseInt($scope.status));
      $scope.startDate && (rqData.createTimeStart = $scope.startDate);
      $scope.endDate && (rqData.createTimeEnd = $scope.endDate);
      erp.postFun("erp/remitRecord/list", rqData, function (data) {
        if(data.data.code == 200){
          const {list, total} = data.data.data;
          $scope.dataList = list.map(item => {
						item.createTime = utils.changeTime(item.createTime, false)
						return item
					});
          $scope.$broadcast('page-data', {
            pageSize: $scope.pageSize.toString(),
            pageNum: $scope.pageNum,
            // totalNum: result.page,
            totalCounts: total,
            pageList: $scope.pagenumarr
          });
        }else{
          layer.msg('操作错误，请稍后再试');
        }
      }, function (err) { 
        layer.msg('操作错误，请稍后再试');
      }, { layer: true })
    }

    $scope.searchFun = () => {
      $scope.pageNum = 1;
      getList();
    }

    // 财务打款弹窗
		$scope.remitModal = (item) => {
      $scope.remitModalVisible = !$scope.remitModalVisible;
      if(item){
        $scope.remitId = item.id;
        $scope.remitImgUrl = item.status == 2 ? item.paymentVoucher : '';
        $scope.$broadcast('uploadImgParam',{imgUrl:$scope.remitImgUrl});
        console.log($scope.remitId,$scope.remitImgUrl);
      }
    }
    
    $scope.$on('uploadImgResult', function(enevt, data) {
      $scope.remitImgUrl = data;
    })

    // 财务打款确认
    $scope.confirmRemit = () => {
      if(!$scope.remitImgUrl){
        layer.msg('请先上传凭证！');
        return false;
      }
      let rqData = {
        id: $scope.remitId,
        paymentVoucher: $scope.remitImgUrl
      };
      erp.postFun("erp/remitRecord/update", rqData, function (data) {
        if(data.data.code == 200){
          $scope.remitModalVisible = !$scope.remitModalVisible;
          layer.msg('操作成功');
          getList();
        }else if(data.data.code == 401){
          layer.msg('凭证已存在！');
        }else{
          layer.msg('操作错误，请稍后再试');
        }
      }, function (err) { 
        layer.msg('操作错误，请稍后再试');
      }, { layer: true })
    }

    $scope.showDetail = (batchNumber, logisticsCompanyName) => {
      if(!batchNumber || !logisticsCompanyName){
        layer.msg('批次号或物流名称不存在、无法查看详情！');
        return false;
      }
      window.location.href = `manage.html#/Reconciliation/logisticsStatementDetails/${batchNumber}/${logisticsCompanyName}//2`;//2表示详情不可修改
    }

  }])

  // 代收费用打款单
  app.controller('CodBusinessAmountCtrl', ['$scope', 'erp', '$routeParams', 'utils', '$location', function ($scope, erp, $routeParams, utils, $location) {
    $scope.pageNum = 1; // 分页 
    $scope.pageSize = 20; // 分页 每页展示几条
    $scope.currentPage = 1; // 当前页
    $scope.pagenumarr = ['5', '20', '30', '50', '100']; // 设置每页展示几条
    $scope.startDate = ''; // 搜索 - 开始日期
    $scope.endDate = ''; // 搜索 - 结束日期
    $scope.codCustomerName = ''; // 商家名称
    
    observeScroll();
    getList(); // 初始化列表数据

    // 分页触发
    $scope.$on('pagedata-fa', function(d, data) {
      $scope.pageNum = parseInt(data.pageNum);
      $scope.pageSize = parseInt(data.pageSize);
      getList();
    });

    // 代收费用列表
    function getList() {
      let rqData = {
        pageNo: $scope.pageNum,
        pageSize: $scope.pageSize
      };
      $scope.codCustomerName && (rqData.codCustomerName = $scope.codCustomerName);
      $scope.startDate && (rqData.startCreateTime = $scope.startDate);
      $scope.endDate && (rqData.endCreateTime = $scope.endDate);
      erp.postFun("erp/codCustomerRemitRecord/remitRecordPage", rqData, function (data) {
        if(data.data.statusCode == 200){
          const {list, total} = data.data.result;
          $scope.dataList = list.map(item => {
						item.createTime = utils.changeTime(item.createTime, false)
						return item
					});
          $scope.$broadcast('page-data', {
            pageSize: $scope.pageSize.toString(),
            pageNum: $scope.pageNum,
            // totalNum: result.page,
            totalCounts: total,
            pageList: $scope.pagenumarr
          });
        }else{
          layer.msg('操作错误，请稍后再试');
        }
      }, function (err) { 
        layer.msg('操作错误，请稍后再试')
      }, { layer: true })
    }

    // 搜索
    $scope.searchFun = () => {
      $scope.pageNum = 1;
      getList();
    }

    // 导出
    $scope.export = () => {
      
    }

    // 结算
    $scope.finalToCod = (id) => {
      layer.confirm('确认后，则该对账单中的金额将会显示在客户cod可提现金额中，并且客户可进行提现操作', { title: '是否确认要对该对账单进行结算?' }, function (index) {
        //do something
        console.log(1111,id)
        let rqData = {
          id
        };
        erp.postFun("erp/codCustomerRemitRecord/financialMoney", rqData, function (data) {
          if(data.data.statusCode == 200){
            layer.msg('操作成功');
          }else{
            layer.msg(data.data.message);
          }
        }, function (err) { 
          layer.msg('操作错误，请稍后再试')
        }, { layer: true })
        // layer.close(index);
      });
    }

    // 查看详情
    $scope.showDetail = (batchNumber) => {
      if(!batchNumber){
        layer.msg('批次号不存在、无法查看详情！');
        return false;
      }
      window.location.href = `manage.html#/Reconciliation/BillCollectionList?batchNumber=${batchNumber}&statusPage=3`;
    }

    // 下载明细
    $scope.handleDowloadDetail = item => {
      console.log(item);
      const load = layer.load(0)
      erp.loadDown({
        url: 'erp/reconciliation/exportCodChargesDetailVOList',
        params: [item.batchNumber],
        callback: function () {
          layer.close(load)
        },
      })
    }
    
  }])
})()