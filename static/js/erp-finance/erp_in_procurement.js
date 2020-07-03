(function () {
	const app = angular.module('internal-procurement', []);

	app.controller('interProcurementCtrl', ['$scope', 'erp', '$routeParams', 'utils', function ($scope, erp, $routeParams, utils) {
		console.log('interProcurementCtrl')
		/** modal */
		$scope.procurementModal = {  //采购状态
			pending: { key: 1, name: '待打款' },
			pay: { key: 2, name: '已付款' },
			refunded: { key: 3, name: '已拒绝' }
		}
		$scope.optionsTypeModal = {   //列表操作字典
			dakuan: { key: 1, name: '打款' },
			look: { key: 2, name: '查看' },
			refund: { key: 3, name: '查看' }
		}
		$scope.payTypeModal = {   //支付类型
			1: { name: '先付款后发货', type: 1, },
			2: { name: '先发货后付款', type: 2, },
			3: { name: '预付订金', type: 3 }
		}
		$scope.currentPayTypeModal = {  //本次支付类型
			1: { name: '定金', type: 1, },
			2: { name: '尾款', type: 2, },
			3: { name: '全款', type: 3, },
		}
		$scope.caigouModal = {  //采购类型
			'1': '淘宝',
			'2': '天猫',
			'3': '1688',
			'4': "线下"
		}
		$scope.shoukuanModal = {
			'1': '银行卡',
			'2': '支付宝'
		}
		/**参数 */
		$scope.currentType = $scope.procurementModal.pending.key    //当前 tab
		$scope.pageNum = '1'                                        //分页 - 当前页
		$scope.pageSize = '20'                                      //分页 - 每页显示的最大数量
		$scope.totalNum = 0                                         //分页 - 总条数
		$scope.searchByBuyer = ''                                   //搜索 - 采购人
		$scope.searchByOderId = ''                                  //搜索 - 订单号
		$scope.caigouList = []                                      //列表数据源
		$scope.refundReasonFlag = false                             //拒绝原因浏览弹窗 显示隐藏flag     
		$scope.refundFlag = false                                   //拒绝操作弹窗 显示隐藏flag
		$scope.isOptions = false                                    //是否展示 订单详情页面
		$scope.optionsItem = {}                                     //订单详情页面的操作 item
		$scope.previewFlag = false
		$scope.caigouType = ''// 1 淘宝  2 天猫  3 1688  4 线下

		/** 方法 */
		$scope.changeTabType = key => {  //顶部tab切换
			$scope.currentType = key
			getListFn()
		}
		getListFn()

		//获取列表数据
		function getListFn() {
			const params = {
				pageNum: +$scope.pageNum,
				pageSize: +$scope.pageSize,
				data: {
					status: $scope.currentType,
					buyer: $scope.searchByBuyer || '',
					orderId: $scope.searchByOderId || '',
					type: $scope.caigouType || ''
				}
			}
			ajaxOptFn({
				url: 'procurement/internal/getFinancialMoneyList', params,
				successFn: res => {
					const { total, list } = res
					console.log(list)
					$scope.caigouList = list
					$scope.totalNum = total
					initPage()
				}
			})
		}
		//查询
		$scope.searchFn = () => {
			$scope.pageNum = '1'
			getListFn()
		}
		//采购人搜索回调
		$scope.purchasePersonCallback = function ({ id, loginName }) {
			console.log('purchasePersonCallback', id, loginName)
			$scope.searchByBuyer = id
			getListFn()
			// $scope.personalizedIdentity = 2
			// $scope.loginName = undefined
			// if(id == 'POD') $scope.personalizedIdentity = 1
			// if(loginName) {
			// 	$scope.personalizedIdentity = 0
			// 	$scope.loginName = loginName
			// }
			// getPageList()
		}

		$scope.lookReasonFun = reason => {  //查看拒绝原因
			$scope.refundReason = reason || ''
			$scope.refundReasonFlag = true
		}
		$scope.refundFn = item => {  //拒绝 - 打开弹窗
			$scope.refundFlag = true
			$scope.refundItem = {
				id: item.id,
				remark: ''                                //拒绝操作弹窗 - text-area 输入内容
			}
		}
		$scope.confirmRefund = () => {  //拒绝 - 确认拒绝
			console.log($scope.refundItem)
			ajaxOptFn({
				url: 'procurement/internal/refusePlay', params: $scope.refundItem,
				successFn: res => {
					layer.msg('拒绝打款成功')
					$scope.refundFlag = false
					getListFn()
				}
			})
		}
		$scope.openOptions = (type, item) => {
			//获取内部采购详情
			ajaxOptFn({
				url: `procurement/internal/getInternalProcurementDetails?orderId=${item.orderId}`, params: null,
				successFn: res => {
					// const { caigouInternalProcurement, CaigouInternalProcurementProduct, CaigouInternalProcurementLogistics } = res
					res.caigouInternalProcurement.purchasingDocuments = res.caigouInternalProcurement.purchasingDocuments.split(',')
					res.depositPaymentCertificate = res.depositPaymentCertificate ? res.depositPaymentCertificate.split(',') : []
					res.fullProof = res.fullProof ? res.fullProof.split(',') : []
					$scope.optionsItem = {
						type: $scope.optionsTypeModal[type].key,                //操作类型 1： 打款， 2：查看, 3: 拒绝查看
						id: item.id,                                            //打款id
						options: res,                                           //存放传进来需要展示的订单详情参数
						currentPayType: +item.moneyType + 1,                           //本次支付类型
						imgArr: [],                                             //上传支付凭证的图片数组 
						count: null,                                            //当处于定金-尾款支付时需填写的实际支付尾款金额
					}
					console.log($scope.optionsItem)
					$scope.isOptions = true
				}
			})
		}
		$scope.goBackFn = () => { //返回至列表
			$scope.isOptions = false
		}
		$scope.uploadCallback = res => { //上传凭证
			console.log(res)
			const { pics } = res
			$scope.optionsItem.imgArr = pics
		}
		$scope.submitFn = () => {  //打款 - 提交
			const { imgArr, currentPayType, count } = $scope.optionsItem
			if (imgArr.length === 0) {
				layer.msg('请上传凭证')
				return
			}
			if (currentPayType === 2 && !count) {
				layer.msg('请输入实际支付尾款金额')
				return
			}
			$scope.confirmflag = true
		}
		$scope.confrimSubmitFn = () => {  //确认
			const { imgArr, currentPayType, id, options, count } = $scope.optionsItem
			let params = {
				id,
				moneyCertificates: imgArr.join(','),
				actualPayment: currentPayType === 1  //定金-拿取预付定金金额
					? options.caigouInternalProcurement.deposit
					: currentPayType === 2  //尾款 - 获取实际尾款input的value值， 全款 - 获取共需支付金额
						? count : options.caigouInternalProcurement.totalPay
			}
			console.log(params)
			ajaxOptFn({
				url: 'procurement/internal/internalMoney', params,
				successFn: res => {
					console.log(res)
					layer.msg('打款成功')
					$scope.confirmflag = false
					$scope.isOptions = false
					getListFn()
				}
			})
		}

		/** 公用 */
		function ajaxOptFn({ url, params, successFn, errFn = () => layer.msg('系统错误') }) {
			erp.load()
			erp.postFun(url, params, ({ data: result }) => {
				const { code, data } = result
				erp.closeLoad()
				if (code === 200) {
					successFn(data)
				} else {
					errFn()
				}
			}, _ => {
				erp.closeLoad()
				layer.msg('系统错误')
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