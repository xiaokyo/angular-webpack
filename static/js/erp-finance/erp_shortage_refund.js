(function () {
	const app = angular.module('shortage-refund', []);

	/** 模拟数据 以后删除掉 */
	const refundList = [
		{
			id: '191102311704480310', parentId: 'CJ1911063117043674', payTime: '2019-11-26 00:48:30', salesman: 'Andy Chou',
			product: [
				{ sku: 'CJ1911063117043674-Purple', quantity: 123, weight: 100, price: 12 }
			]
		}
	]

	app.controller('shortageRefundCtrl', ['$scope', 'erp', '$routeParams', 'utils', function ($scope, erp, $routeParams, utils) {
		console.log('shortageRefundCtrl')
		/** modal */
		$scope.refundType = {
			pending: { key: 1, name: '待退款' },
			refunded: { key: 2, name: '已退款' },
			rejected: { key: 3, name: '已拒绝' }
		}
		$scope.refundHandle = {
			1: '分开发货',
			2: '缺货商品替换',
			3: '缺货商品退款',
			4: '全部商品退款'
		}
		/**参数 */
		$scope.currentRefundType = $scope.refundType.pending.key                          //当前tab
		$scope.refundList = []          //退款列表
		$scope.showFlag = false                                                           //退款弹窗显示隐藏flag
		$scope.searchApplicant = ''                                                       //搜索 - 申请人
		$scope.caigouId = ''                                                              //搜索 - 采购订单号
		$scope.pageNum = '1'                                                              //分页 - 当前页
		$scope.pageSize = '20'                                                            //分页 - 每页显示条数
		$scope.confirmFlag = false                                                        //退款confirm确认弹窗 flag

		/** 方法 */
		getListFn()
		function getListFn() {
			const params = {
				pageNum: +$scope.pageNum, pageSize: +$scope.pageSize,
				orderId: $scope.caigouId,
				createName: $scope.searchApplicant,
				moneyStatus: +$scope.currentRefundType
			}
			erp.mypost('processOrder/Stockout/getRefundList', params).then(res => {
				const { list, total } = res
				$scope.totalNum = total
				$scope.refundList = list.map(item => {
					item.isDrop = false
					return item
				})
				initPage()
			})
		}
		$scope.searchfn = () => {
			$scope.pageNum = '1'
			getListFn()
		}
		$scope.changeTabType = key => {  //顶部tab切换
			$scope.currentRefundType = key
			$scope.searchfn()
		}
		$scope.dropDownFn = id => {  //点击 drop 按钮展示订单商品详情
			$scope.refundList = $scope.refundList.map(item => {
				if (item.id === id) item.isDrop = !item.isDrop
				return item
			})
			console.log($scope.refundList)
			// $scope.$apply()
		}
		$scope.openRefund = item => {  //打开退款弹窗
			$scope.showFlag = true
			$scope.refundItem = {
				id: item.id,
				orderId: item.orderId,
				userId: item.customerId,
				consultMoney: item.negotiateRefundAmount,
				realityMoney: null,
				suggestRefundAmount:item.suggestRefundAmount
			}
		}
		$scope.openConfirm = () => {
			if (!$scope.refundItem.realityMoney) {
				layer.msg('请输入实际退款金额')
				return
			}
			$scope.confirmFlag = true
		}
		$scope.confirmRefundFn = () => { //确认退款
			const { id, orderId, userId, realityMoney } = $scope.refundItem
			const params = {
				id, orderId, userId, actualRefundAmount: realityMoney
			}
			erp.mypost('processOrder/Stockout/refundMoneyToBlance', params).then(res => {
				if(res) {
					$scope.confirmFlag = false
					$scope.showFlag = false
					layer.msg('退款成功')
					getListFn()
				} else {
					layer.msg('退款失败')
				}
			})
		}
		$scope.resetSearch = () => {  //清空搜索条件
			$scope.searchApplicant = ''
			$scope.caigouId = ''
		}

		// 拒绝
		$scope.rejectItem = function(item){
			const { id, orderId } = item
			layer.confirm('是否拒绝此条记录?', {
				title:'提示'	
			},function(){
				const load = layer.load(0)
				erp.postFun('processOrder/Stockout/refusedToRefund', { id, orderId }, function(res){
					layer.close(load)
					if(res.data.code != 200) return layer.msg(res.data.message || '网络错误')
					layer.msg('操作成功')
					getListFn()
				})

			})
		}

		/* page 区域 start */
		function initPage() {
			const pages = Math.ceil($scope.totalNum / $scope.pageSize);
			$scope.$broadcast('page-data', {
				pageSize: $scope.pageSize,//每页条数
				pageNum: $scope.pageNum,//页码
				totalNum: pages,//总页数
				totalCounts: $scope.totalNum,//数据总条数
				pageList: ['10', '20'],//条数选择列表，例：['10','50','100']
			})
		}
		initPageChange()
		function initPageChange() {
			$scope.$on('pagedata-fa', function (_, { pageNum, pageSize }) {// 分页onchange
				$scope.pageNum = pageNum;
				$scope.pageSize = pageSize;
				getListFn()
			})
		}
		/* page 区域 end */
	}])
})()