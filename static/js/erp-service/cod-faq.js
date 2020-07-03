(function () {
	var app = angular.module('erp-service')
	app.controller('codFaqCtrl', ['$scope', 'erp', 'utils', function ($scope, erp, utils) {
		console.log('codFaqCtrl')
		var base64 = new Base64();
		const loginName = localStorage.getItem('erploginName') ? base64.decode(localStorage.getItem('erploginName')) : '';
		/** model */
		$scope.witchType = [
			// { key: 1, name: '供应商' },
			{ key: 2, name: 'COD' },
			{ key: 11, name: '供应商-中' },
			{ key: 12, name: '供应商-英' },
			{ key: 13, name: '供应商-泰' },
		]
		
		/** 参数 */
		$scope.pageNum = '1'                     //分页 - 当前页
		$scope.pageSize = '20'                   //分页 - 每页显示几条
		$scope.questionList = []                 //问题列表
		$scope.showFlag = false                  //新增/编辑弹窗
		$scope.showFlag2 = false				 //查看
		$scope.totalCounts = 0                   //总条数
		$scope.modelItem = {
			title: '',
			witchType: "" ,
			orderNumber:'',
			id:''
		}

		/** 富文本 */
		var E = window.wangEditor;
		var editor = new E('#wang');
		editor.customConfig.menus = [
			'head',  // 标题
			'bold',  // 粗体
			'fontSize',  // 字号
			'fontName',  // 字体
			'italic',  // 斜体
			'underline',  // 下划线
			'strikeThrough',  // 删除线
			'foreColor',  // 文字颜色
			'backColor',  // 背景颜色
			'link',  // 插入链接
			'image',  // 插入图片
		]
		editor.customConfig.uploadImgServer = 'https://erp.cjdropshipping.com/app/ajax/upload';
		editor.customConfig.uploadFileName = 'file';
		// 将 timeout 时间改为 30s
		editor.customConfig.uploadImgTimeout = 30000;
		editor.customConfig.uploadImgHooks = {
			customInsert: function (insertImg, result, editor) {
				var imgList = JSON.parse(result.result);
				for (var i = 0; i < imgList.length; i++) {
					imgList[i] = 'https://' + imgList[i];
				}
				if (imgList.length > 0) {
					insertImg(imgList);
				}
			}
		}
		editor.create();

		/** 功能 */
		//获取faq列表
		getList()
		function getList() {
			erp.load()
			const parmas={
				pageNum:$scope.pageNum,
				pageSize:$scope.pageSize,
				data:{
					type:'',
					title:$scope.searchInput
				}
			}
			erp.postFun('cod/faq/list', parmas, function(res){
				erp.closeLoad()
				const { data }=res
				if(data.code==200){
					$scope.questionList = data.data.list
					$scope.totalCounts = data.data.total
					pageFun()
				}else{
					layer.msg(data.message)
				}
				console.log(res)
			}, function(){
				erp.closeLoad()
			});
		}
		//搜索
		$scope.search = () => {
			$scope.pageNum = '1'
			getList()
		}
		function clear(){
			$scope.modelItem = {
				title: "" ,
				type: "" ,
				orderNumber: "" 
			}
		}

		//打开新增 / 编辑
		$scope.addFn = (item) => {
			clear()
			$scope.editTag = item ? true : false;
			$scope.modelItem = {
				title: item ? item.title : '',
				type: item ? item.type : "" ,
				orderNumber: item ? item.orderNumber : '',
				id:item ? item.strId : ''
			}
			editor.txt.html(item ? item.context : '')
			$scope.showFlag = true
		}
		$scope.showInfo = function(item){
			$scope.showFlag2 = true
			$scope.modelItem = {
				title: item.title ,
				type: item.type ,
				orderNumber: item.orderNumber 
			}
			$('.context').html(item.context)
		}
		function removeWordXml(text){
			var html = text;
			html = html.replace(/<\/?SPANYES[^>]*>/gi, "");//  Remove  all  SPAN  t
			html = html.replace(/<(\w[^>]*)  lang=([^|>]*)([^>]*)/gi, "<$1$3");//  Remove  Lang  attributes
			html = html.replace(/<\\?\?xml[^>]*>/gi, "");//  Remove  XML  elements  and  declarations
			html = html.replace(/<\/?\w+:[^>]*>/gi, "");//  Remove  Tags  with  XML  namespace  declarations:  <o:p></o:p>
			html = html.replace(/&nbsp;/, "");//  Replace  the  &nbsp;
			html = html.replace(/\n(\n)*( )*(\n)*\n/gi, '\n');
			return html;
		  }
		//确认新增 / 编辑
		$scope.sureAdd = () => {
			const { title, type, orderNumber, id } = $scope.modelItem
			let context = editor.txt.html()
			context=removeWordXml(context)
			console.log(context)
			if (!editor.txt.text()) {
				layer.msg('请输入问题')
			} else if (!type) {
				layer.msg('请输入类型')
			} else if (!orderNumber) {
				layer.msg('请输入排序')
			} else if (!context) {
				layer.msg("请输入回答")
			} else {
				const url = $scope.editTag ? 'cod/faq/edit':'cod/faq/add'
				erp.postFun(url, {
					title, 
					type,
					orderNumber,
					context,
					id
				}, function(res){
					erp.closeLoad()
					const { data }=res
					if(data.code==200){
						console.log(res)
						$scope.showFlag = false
						$scope.pageNum = '1'
						getList()
						layer.msg("操作成功")
					}else{
						layer.msg(data.message)
					}
					console.log(res)
				}, function(){
					erp.closeLoad()
				});				
			}
		}
		//打开确认弹窗
		$scope.confirmFn = (id) => {
			$scope.confirmFlag = true
			$scope.deleId = id
		}
		//删除
		$scope.deleteFn=()=>{
			erp.postFun('cod/faq/delete', {
				id:$scope.deleId
			}, function(res){
				erp.closeLoad()
				const { data }=res
				console.log(data)
				if(data.code==200){
					$scope.confirmFlag = false
					$scope.pageNum = '1'
					getList()
					layer.msg("删除成功")
				}else{
					layer.msg(data.message)
				}
			}, function(){
				erp.closeLoad()
			});		
		}
		
		//更换每页多少条数据
		$scope.pagechange = function (pagesize) {
			$scope.pageNum = '1';
			getList();
		}
		//手动输入页码GO跳转
		$scope.pagenumchange = function () {
			var pagenum = Number($scope.pageNum)
			var totalpage = Math.ceil($scope.totalCounts / $scope.pageSize);
			if (pagenum > totalpage) {
				layer.msg('错误页码')
				$scope.pageNum = '1';
			} else {
				getList();
			}
		}

		function pageFun() {
			$(`.pagegroup`).jqPaginator({
				totalCounts: $scope.totalCounts || 1,
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
					$scope.pageNum = n
					getList()
				}
			});
		}
		$scope.changeType = (status) => {
			let str = "--"
			$scope.witchType.forEach(item=>{
				if(item.key==status){
					str=item.name
				}
			})
			return str
		}

	}])
})()