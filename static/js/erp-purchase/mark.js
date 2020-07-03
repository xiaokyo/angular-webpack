; (function () {
    const app = angular.module('purchase-app');
    app.controller('purchaseMarkCtrl', ['$scope', 'erp', '$q', function ($scope, erp, $q) {
        $scope.currentIndex=0;
        $scope.href = location.origin;
        $scope.tabList = [
            { title: '分标', checked: true }, 
            { title: '质检', checked: false }
        ];
        $scope.queryType='orderId';
        $scope.typeList = [
            {label: '采购订单号', value: 'orderId'},
            {label: '供货公司', value: 'gongHuoGongSi'},
            {label: '物流追踪号/入仓编号', value: 'zhuiZongHao'},
            {label: '变体SKU', value: 'cjSku'},
            {label: '商品名称', value: 'productName'}
        ]
        $scope.statusList = [
            {name:'全部',val:''},
            {name:'待分标',val:'1'},
            {name:'已分标',val:'2'}
        ]
        $scope.purchaseList = [
            { name: '全部', val: '' },
            { name: '1688非API', val: '0' },
            { name: '1688API', val: '1' },
            { name: '淘宝', val: '2' },
            { name: '天猫', val: '3' },
            { name: '线下', val: '4' }
        ]
        $scope.pageInfo = {
            pageNum: '1',
            pageSize: '10',
            total: 0
        }
        $scope.storeList = erp.getWarehouseType();
        $scope.filterObj = {
            procurementType: '',
            store: '',
            productProcessStatus:''
        }
        $scope.switchTab =(tab, index)=>{
            if (index == 1) location.href="#/erppurchase/management"
        }

        /* 搜索 start */
        $scope.handleSearch =(ev)=> {//搜索 列表  扫描运单号获取 列表
            $scope.pageInfo.pageNum='1';
            if (!ev) return getDistributingList()
            if (ev.keyCode !== 13) return;
            ev.target.blur()//主动失去焦点
            getDistributingList()
        }
        /* 搜索 end */
        function getDistributingList() {
            const { pageNum, pageSize } = $scope.pageInfo;
            const beginDate = $("#startTime").val();
            const endDate = $("#endTime").val();
            const key = $scope.queryType;
            const val = $scope.distributingQuery;
            const params = {
                pageNum, pageSize, beginDate, endDate,
                data: {
                    [key]: val,// 动态搜索内容
                    productProcessStatus: $scope.filterObj.productProcessStatus,  // 1：未分标，2：已分标
                    store:$scope.filterObj.store,
                    procurementType:$scope.filterObj.procurementType,
                    status: '3',// 固定值
                }
            }
            erp.mypost('procurement/dealWith/divide', params).then(({ list, total }) => {
                $scope.distributingList = list.map(item => {
                    let { yiQianShouZhuiZongHao = {}, zhuiZongHao } = item;
                    yiQianShouZhuiZongHao = JsonPares(yiQianShouZhuiZongHao)
                    item.zhuiZongHao = zhuiZongHao ? JSON.parse(zhuiZongHao):'';
                    const receivedTimeArr = [];
                    for (const key in yiQianShouZhuiZongHao) {
                        if (yiQianShouZhuiZongHao.hasOwnProperty(key)) {
                            const val = erp.handleTimestampToString(yiQianShouZhuiZongHao[key].time);
                            receivedTimeArr.push(`${val}`)
                        }
                    }
                    item.receivedTimeArr = receivedTimeArr;
                    item.receiveNum = 0;//到货数量
                    item.shulinag = 0;//预计到货数量（采购数量）
                    item.products = item.products.map(subItem => {
                        const { shuLiang=0, qualifiedNum, moreNum, lackNum, defectiveNum,receiveNun=0 } = subItem;
                        subItem.distributingCount = shuLiang - qualifiedNum - moreNum - lackNum - defectiveNum;
                        item.receiveNum += +receiveNun;
                        item.shulinag += +shuLiang;
                        return subItem;
                    })
                    item.numberList = zhuiZongHao?retEntriesString(zhuiZongHao):''
                    return item;
                });
                console.log($scope.distributingList)
                $scope.pageData = {
                    pageSize,//每页条数
                    pageNum,//页码
                    totalCounts: total,//数据总条数
                    pageList: ['5', '10']//条数选择列表，例：['10','50','100']
                }
            })
        }
        getDistributingList();
        $scope.$on('pagedata-fa', function (_, { pageNum, pageSize }) {// 分页onchange
            $scope.pageInfo.pageNum = pageNum;
            $scope.pageInfo.pageSize = pageSize;
            getDistributingList();
        });
		let that = this;
        $scope.lookLog = function (list,type, ev) {
			console.log(list)
			$scope.isLookLog = true;
			that.list = list;
			that.type = type;
			ev.stopPropagation()
		};
		$scope.$on('log-to-father', function (d, flag) {
			if (d && flag) {
				$scope.isLookLog = false;
			}
		});
        $scope.showStatusConfirm = (e,item,index)=>{
            e.stopPropagation();
            $scope.statusObj = {
                show:true,
                id:item.id,
                orderId:item.orderId,
                status:'1',
                index
            }
        }
        $scope.statusChange = ()=>{
            let params = {
                ids:[$scope.statusObj.id],
                orderIds:[$scope.statusObj.orderId],
                status:$scope.statusObj.status
            }
            layer.load(2);
            erp.postFun('procurement/dealWith/divideChange', params,({data}) => {
                layer.closeAll();
                if(data.code==200){
                    $scope.distributingList[$scope.statusObj.index].status=1;
                    $scope.statusObj.show=false;
                }else{
                    layer.msg(data.message);
                }
                
            })
        }
        function JsonPares(val) {//基于 全局 JSON parse重写 基础上 
            const newVal = JSON.parse(val);
            if (val === null) return val;
            if (typeof newVal !== 'object') return val;
            if (newVal.error) return val;
            return newVal;
        };
        function retEntriesString(obj) {
            const arr = [];
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    const val = obj[key];
                    arr.push(`${val}: ${key}`)
                }
            }
            return arr;
        }
    }]).filter('statusFil',function(){
        return function(val) {
            let name;
            if(!val) return '';
            switch(+val){
              case 1:
                name='待分标';
                break;
              case 2:
                name='已分标';
                break;
              case 3:
                name='已质检';
                break;
              }
              return name;
            }
    })
}());
