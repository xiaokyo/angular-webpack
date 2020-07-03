~(function(){
    var app = angular.module('purchase-app');
    app.controller('purchasecloseListCtrl', ['$scope', 'erp', '$routeParams', '$timeout', function ($scope, erp, $routeParams, $timeout) {
        $scope.listParam = {
            pageNum:"1",
            pageSize:"50",
            beginDate:"",
            endDate:"",
            data:{
                biantiSku:"",
                caigouren:"",
                fuKuanRen:"",
                gongHuoGongSi:"",
                zhuiZongHao:"",
                status:"10",
                yiChangZhuangTai:0,
                orderId:'',
                anWuLiuFen:''
            }
        }
        $scope.searchType ='orderId';
        const searchListType = ['orderId','biantiSku','caigouren','fuKuanRen','gongHuoGongSi','zhuiZongHao']
        function getList(){
            searchListType.forEach(item=>{
                $scope.listParam.data[item]='';
            })
            $scope.listParam.data[$scope.searchType] = $scope.searchVal;
            erp.postFun('procurement/order/queryOrderSignList', $scope.listParam, function ({data}) {
                const res = data.data;
                if(res.list.length>0){
                    $scope.orderList = res.list.map(item=>{
                        item.zhuiZongHao = JSON.parse(item.zhuiZongHao);
                        return item;
                    });
                    $scope.pageData={
                        pageSize: $scope.listParam.pageSize.toString(),
                        pageNum: $scope.listParam.pageNum.toString(),
                        totalCounts: res.total,
                        pageList: ["10", "20", "50"],
                    }
                }
            })
        }
        getList();
        $scope.$on("pagedata-fa", function (d, data) {
            $scope.listParam.pageNum = data.pageNum;
            $scope.listParam.pageSize = data.pageSize;
            getList();
        });
		$scope.timeClickFun = function (ev, stu) {
            $('.time-click').removeClass('time-act');
            if(ev)$(ev.target).addClass('time-act');
			$scope.listParam.pageNum = '1';
			getList();
        }
        $scope.searchFun = ()=>{
            getList();
        }
        /* 添加到待处理订单 881305698802418614*/
		$scope.addWaitOrder = (item,index,e)=>{
			const param = {
				orderId:item.orderId
			}
			erp.postFun('procurement/caigouDingdan/closeOrderSubmit', param, function ({data}) {
				if(data.code==200){
                    layer.msg('提交成功');
                    $scope.orderList.splice(index,1);
				}
			})
        }
        let that = this;
		$scope.LookLog = function (list,type, ev) {
			$scope.isLookLog = true;
			that.list = list;
			that.type = type;
			ev.stopPropagation()
		}
		$scope.$on('log-to-father', function (d, flag) {
			if (d && flag) {
				$scope.isLookLog = false;
			}
		})
    }])
})()