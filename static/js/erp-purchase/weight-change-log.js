/**
 * 2019-12-7  复制老代码 进行修改 ----xiaoy
 */

(function () {
	var app = angular.module('weight-change-log', []);
	//erp采购订单
	app.controller('weightChangeLogCtrl', ['$scope', 'erp', '$routeParams', '$timeout', function ($scope, erp, $routeParams, $timeout) {
		console.log('重量修改记录')
		// docs: http://192.168.5.143:4999/web/#/25?page_id=444
		const url = {
			'list_old': 'caigou/procurementProduct/getChangWeightList',
			list: 'procurement/dealWith/getChangWeightList',// 
			'update': 'procurement/dealWith/updateProductWeight'
		}
		const def_page = {
			pageSize: '10',//每页条数
			pageNum: '1',//页码
			totalNum: 1,//总页数
			totalCounts: 0,//数据总条数
			pageList:['10','20', '50', '100']//条数选择列表，例：['10','50','100']
		}
		
		$scope.searchVal = '';
		$scope.searchType = 'cjSku';
		$scope.status = 1;
		$scope.changesList = [];
		$('.pur-tuihuo').eq(0).addClass('pur-chuli-act');

		
		$(window).scroll(function () {
			var before = $(window).scrollTop();
			if (before > 60) {
				$('.tit-box').css({
					"position": "fixed",
					"top": 0
				})
			} else {
				$('.tit-box').css({
					"position": "static",
					"top": 0
				})
			}
		});
		
		
		$('.c-seach-inp').keypress(function (ev) {
			if (ev.keyCode == 13) {
				$scope.searchFun()
			}
		})
		$scope.searchFun = function() {
			// 搜索时重置页码
			def_page.pageNum = '1'
			getWeightChanges()
		};
		

		// 获取重量修改记录
		function getWeightChanges() {
			// layer.load()
			const params = getParams()
			console.log('获取重量修改记录=>> params:', params)
			erp.mypost(url.list, params).then(({list, total, pageSize, pageNum}) => {
				$scope.changesList = list;
				$scope.changesList.forEach(item=>{
					item.originPackWeight = item.packWeight;
					let {newWeight,weight}=item;
					if(item.weight && newWeight!=weight){//实际重量大于系统重量时
						let addWeight = +newWeight-(+weight);
						item.packWeight=+item.packWeight+addWeight;
					}
				})
				def_page.totalCounts = total;
				$timeout(function() {
					pageSet({
						pageSize: pageSize + '',
						pageNum: pageNum +'',
						totalNum: Math.ceil(total/pageSize) + '',
						totalCounts: total + '',
					})
				})
			})
		}
		// 请求参数 汇总
		function getParams() {
			const params = {}
			params.status = $scope.status;
			params.pageNum = def_page.pageNum;
			params.pageSize = def_page.pageSize;
			if ($scope.searchVal) {
				params[$scope.searchType] = $scope.searchVal
			}
			return params;
		}
		// 分页处理
		function pageSet(page) {
			$scope.$broadcast('page-data', Object.assign(def_page, page))
		}
		$scope.$on('pagedata-fa', function (d, data) {// 分页onchange
			def_page.pageNum = data.pageNum
			def_page.pageSize = data.pageSize;
			getWeightChanges()
		})

		//获取单条数据
		const changeItem = (item)=>{
			let {id,cjSku,variantId,productId,nameEn,newWeight,weight,packWeight,originPackWeight}=item;
			if(packWeight<=originPackWeight){
				if(item.weight && (+newWeight>+weight)){//实际重量大于系统重量时
					let addWeight = newWeight+0-weight+0;
					item.packWeight=item.packWeight+0+addWeight;
				}
			}
			let param = {
				id,weight,nameEn,originPackWeight,
				cjsku:cjSku,
				realWeight:newWeight,
				cjstanproductid:variantId,
				cjproductid:productId,
				packageWeight:packWeight
			}
			$scope.productWeightList.push(param);
		}
		//获取批量数据
		const changeList = ()=>{
			$scope.checkList.forEach(item=>{
				let {id,cjSku,variantId,productId,nameEn,newWeight,weight,packWeight,originPackWeight}=item;
				let param = {
					id,weight,nameEn,originPackWeight,
					cjsku:cjSku,
					realWeight:newWeight,
					cjstanproductid:variantId,
					cjproductid:productId,
					packageWeight:packWeight
				}
				$scope.productWeightList.push(param);
			})
		}
		// 修改重量&确认操作
		$scope.onChangeOk = function (status,item) {
			if(item=='one' && !item.packWeight) return layer.msg("请输入商品包装重量");
			layer.confirm('确认操作?', {icon: 3, title:'提示'}, function(index){
				$scope.productWeightList = [];
				if(item){
					changeItem(item)
				}else{
					changeList();
				}
				erp.postFun(url.update, {
					productWeightList:$scope.productWeightList,
					status
				},function(data) {
					if (data.data.code != '200') return;
					layer.close(index);
					getWeightChanges()
				},function(err) {
					layer.close(index);
					console.error(err)
				})
			});
		}
		
		// getWeightChanges()
		$scope.$watch('status', function() {
			getWeightChanges()
		})
		window.document.title = '商品重量异常记录';
		//选择操作
		//获取操作列表
		$scope.checkList=[];
		const getCheckList = ()=>{
			$scope.checkList = $scope.changesList.filter(item=>{
				if(item.check){
					let {newWeight,weight,packWeight,originPackWeight}=item;
					if(packWeight<=originPackWeight){
						if(item.weight && (+newWeight>+weight)){//实际重量大于系统重量时
							let addWeight = +newWeight-(+weight);
							item.packWeight=+item.originPackWeight+addWeight;
						}
					}
					return item;
				} 
			})
		}
		//选择全部
		$scope.checkAllFun = ()=>{
			$scope.changesList.forEach(item=>{
				item.check=$scope.checkAllFlag;
				
			})
			getCheckList();
		}
		//选择当前
		$scope.checkFun = ()=>{
			getCheckList();
			$scope.checkAllFlag = $scope.changesList.length==$scope.checkList.length;
		}
		//批量修改
		$scope.changeListFun = (status)=>{
			if($scope.checkList.length==0) return layer.msg('请选择列表');
			let isError=false;
			$scope.checkList.forEach(item=>{
				item.active=false;
				if(!item.packWeight){
					item.active=true;
					isError=true;
				}
			})
			if(isError) return layer.msg("请填写商品包装后重量");
			$scope.onChangeOk(status,'');
		}
		$scope.changePackWeight = (item)=>{
			if(item.packWeight<item.originPackWeight){
				item.active=true;
				layer.msg('当前重量小于商品包装重量，请重新修改');
			}else{
				item.active=false;
			}
		}
	}])
})()

