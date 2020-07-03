~function () {
	var app = angular.module('purchase-app');
    app.controller('purchaseSignCtrl', ['$scope', 'erp', '$routeParams', '$timeout', function ($scope, erp, $routeParams, $timeout) {
		$scope.isNewFlag = $routeParams.new;
		$scope.yiChangStu = 0;
		$scope.btnVal = "有物流";
		let thisItem,thisIndex;//当前操作的item对象
		$scope.filterObj = {//查询条件对象
			searchType:'0',
			searchVal:'',
			day:''
		}
		$('#c-data-time').val('2020-05-07');
		$scope.params = {//列表请求参数
			pageNum:'1',
			pageSize:'50',
			beginDate:$('#c-data-time').val(),
			endDate:$('#cdatatime2').val(),
			data:{
				anWuLiuFen: "y",
				biantiSku: "",
				caigouren: "",
				fuKuanRen: "",
				gongHuoGongSi: "",
				zhuiZongHao: "",
				status: "2",
				store:'0',
				procurementType:'',
				yiChangZhuangTai: 0
			}
		}
        $scope.searchList=[
            {name:'1688订单号',val:'0',data:'orderId'},
            {name:'创建人',val:'1',data:'caigouren'},
            {name:'付款人',val:'2',data:'fuKuanRen'},
            {name:'供货公司',val:'3',data:'gongHuoGongSi'},
            {name:'追踪号',val:'4',data:'zhuiZongHao'},
            {name:'变体SKU',val:'5',data:'biantiSku'},
        ]
        $scope.statusList = [
            {name:'全部',val:''},
            {name:'待签收',val:'2'},
            {name:'已签收',val:'3'},
            {name:'部分签收',val:'4'},
        ];
        $scope.purchaseList = [
            {name:'全部',val:''},
            {name:'1688非API',val:'0'},
            {name:'1688API',val:'1'},
            {name:'淘宝',val:'2'},
            {name:'天猫',val:'3'},
            {name:'线下',val:'4'},
        ]
		$scope.storeList = erp.getWarehouseType();
        $scope.storeTypeList = [
            {name:'全部',val:''},
            {name:'直发区',val:'2'},
            {name:'代发区',val:'3'},
            {name:'次品区',val:'4'},
		];
		$scope.statusObj = {
			show:false,
			name:'',
			val:'',
			status:''
		}
		$scope.dayArr = [
			{name:'前日',val:2},
			{name:'昨日',val:1},
			{name:'今日',val:0},
		]
		/* 修改到货包裹数 */
		$scope.packageNumObj = {
			show:false,
			val:'',
		}
		/* 修改订单号 */
		$scope.orderNumObj = {
			show:false,
			val:'',
		}
		/* 增加物流单号 */
		$scope.logisticsObj = {
			show:false,
			trankName:'',
			trankNum:''
		}
		//滚动事件
		let signBox  = document.getElementById('signBox');
		let tableBox  = document.getElementById('tableBox');
		signBox.onscroll = function(event) {
			tableBox.scrollLeft = event.target.scrollLeft;
		};
		tableBox.onscroll = function(event) {
			signBox.scrollLeft = event.target.scrollLeft;
		};
		//获取搜索参数
		let searchTypeData = ()=>{
			$scope.searchList.forEach(item=>{
				$scope.params.data[item.data]='';
				if(item.val==$scope.filterObj.searchType){
					$scope.params.data[item.data]=$scope.filterObj.searchVal;
				}
			})
		}
		//拿到搜索列表
		function getListFun() {
			erp.load();
			searchTypeData();
			erp.postFun('procurement/order/queryOrderSignList', JSON.stringify($scope.params), function ({data}) {
				let obj = data.data;
				layer.closeAll('loading');
				if (obj.list) {
					$scope.orderList = obj.list;
					$scope.totalNum = Math.ceil(obj.total/$scope.params.pageSize);
					$scope.orderList.forEach(function(item,i){
						item.showhover=false;
						item.clickshow=false;
						item.zhuiZongHao = item.zhuiZongHao?JSON.parse(item.zhuiZongHao):'';
						item.yiQianShouZhuiZongHao = item.yiQianShouZhuiZongHao?JSON.parse(item.yiQianShouZhuiZongHao):'';
						item.allNum=0;
						item.products.forEach(childItem=>{
							item.allNum += +childItem.shuLiang;
						})
					})
					$scope.pageData = {
						pageSize: $scope.params.pageSize, //每页条数
						pageNum: $scope.params.pageNum, //页码
						totalNum: obj.total, //总页数
						totalCounts: $scope.totalNum, //数据总条数
						pageList: ['20', '50', '100'] //条数选择列表
					}
				} else {
					layer.msg('网络错误')
				}
			}, function (data) {
				layer.closeAll('loading');
			})
			
		}
		getListFun();
		
		$scope.$on('pagedata-fa', function(_,{pageNum,pageSize}) { // 分页onchange
			$scope.params.pageNum = pageNum;
			$scope.params.pageSize = pageSize;
			getListFun();
		})
		let that = this;
		$scope.LookLog = function (list,type, ev) {
			console.log(list)
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
		$scope.timeClickFun = (e,val)=>{
			$scope.params.data.ri=val;
			getListFun();
		}
		//全选
		$scope.checkAllFun = ()=>{
			$scope.orderList.forEach(item=>{
				item.check = $scope.checkAllFlag;
            });
            cziIndex = $scope.checkAllFlag ? $scope.orderList.length : 0;
		}
		/* 单选处理 */
		$scope.checkFun = function (event) {
            event.stopPropagation()
            cziIndex = 0;
			$scope.orderList.forEach(item=>{
                if(item.check){
                    cziIndex++;
                }
            })
            $scope.checkAllFlag = (cziIndex==$scope.orderList.length);
		}
		/* 点击显示 */
		$scope.clickshowFun = (item)=>{
			item.clickshow=!item.clickshow;
			// $scope.zddlist.showhover=false;
		}
		/* 查找 */
		$scope.searchFun =()=>{
			getListFun();
		}
		//获取当前参数
		let getItem = (e,item,index)=>{
			thisItem = item;
			thisIndex = index;
			e.stopPropagation();
		}
		//改变签收状态
		$scope.showStatusConfirm = (e,item,index)=>{
			getItem(e,item,index);
			$scope.statusList.forEach(oitem=>{
				if(oitem.val==item.status){
					//默认选中不是当前的签收状态，目前最多为三种状态2、3、4
					let ostatus = (+oitem.val+1>4)?2:(+oitem.val+1);
					$scope.statusObj = {
						show:true,
						name:oitem.name,
						val:oitem.val,
						status:ostatus+''
					}
				}
			})
		}
		$scope.signChange = ()=>{
			let params = {
				id:thisItem.id,
				status:$scope.statusObj.status
			}
			layer.load(2);
			erp.postFun('procurement/order/updateQianShouStatus',params, function ({data}) {
				layer.closeAll();
				if(data.success){
					$scope.orderList[thisIndex].status=$scope.statusObj.status;
					$scope.statusObj.show=false;
				}else{
					layer.msg(data.message);
				}
			})
		}
		/* 所有查询列表的方法 */
		$scope.changeStatus = ()=>{
			getListFun();
		}
		/* 显示到货包裹数弹框 */
		$scope.showPackageConfirm = (e,item,index)=>{
			getItem(e,item,index);
			$scope.packageNumObj = { show:true, val:'', }
		}
		/* 改变包裹数量 */
		$scope.changePackageNum =()=>{
			if(!$scope.packageNumObj.val) return layer.msg('请输入包裹数量');
			let params = {
				id:thisItem.id,
				packageNum:+$scope.packageNumObj.val
			}
			layer.load(2);
			erp.postFun('procurement/order/packageNum', params, function ({data}) {
				layer.closeAll();
				if(data.success){
					$scope.orderList[thisIndex].packageNum=$scope.packageNumObj.val;
					$scope.packageNumObj.show=false;
				}else{
					layer.msg(data.message);
				}
			})
		}

		/* 显示采购订单号弹框 */
		$scope.showOrderConfirm = (e,item,index)=>{
			getItem(e,item,index);
			$scope.orderNumObj = { show:true, val:'', }
		}
		/* 改变订单号 */
		$scope.changeOrderNum =()=>{
			if(!$scope.orderNumObj.val) return layer.msg('请输入订单号');
			let params = {
				xinDingDanHao:$scope.orderNumObj.val,
				jiuDingDanHao:thisItem.orderId
			}
			layer.load(2);
			erp.postFun('procurement/order/xiuGaiDingDanHao', JSON.stringify(params), function ({data}) {
				layer.closeAll();
				if(data.success){
					$scope.orderList[thisIndex].orderId=$scope.orderNumObj.val;
					$scope.orderNumObj.show=false;
				}else{
					layer.msg(data.message);
				}
			})
		}
		/* 显示增加物流单号弹框 */
		$scope.showLogisticsConfirm = (e,item,index)=>{
			getItem(e,item,index);
			$scope.logisticsObj = { show:true, trankName:'', trankNum:'' }
		}
		/* 增加物流单号 */
		$scope.changeLogistics=()=>{
			if(!$scope.logisticsObj.trankName){
				return layer.msg('请输入物流名称')
			} else if(!$scope.logisticsObj.trankNum){
				return layer.msg('请输入追踪号')
			}
			let otrankName = $scope.logisticsObj.trankName;
			let otrankNum = $scope.logisticsObj.trankNum;
			let params = {
				id:thisItem.id,
				trankName:otrankName,
				trankNum:otrankNum
			}
			layer.load(2);
			erp.postFun('procurement/order/addTrankNum', JSON.stringify(params), function ({data}) {
				layer.closeAll();
				if(data.success){
					let ozhuizong = $scope.orderList[thisIndex].zhuiZongHao;
					let oneZhuizong = {};
					ozhuizong ? (ozhuizong[otrankNum]=otrankName):(oneZhuizong[otrankNum]=otrankName);
					$scope.orderList[thisIndex].zhuiZongHao = ozhuizong ? ozhuizong : oneZhuizong;
					$scope.logisticsObj.show=false;
				}else{
					layer.msg(data.message);
				}
			})
		}
	}])
}();
