;(function() {
  const app = angular.module('warehouse_management', []);
  app.controller('warehouseManagementCtrl', ['$scope', 'erp', '$q', function ($scope, erp, $q) {
    $scope.queryType='orderId';
    $scope.href = location.origin;
    $scope.statusList = [
        {name:'全部',val:''},
        {name:'待质检',val:'2'},
        {name:'已质检',val:'3'}
    ]
    //'0-1688非API,1-1688API,2-淘宝,3-天猫,4-线下
    $scope.purchaseList = [
        { name: '全部', val: '' },
        { name: '1688非API', val: '0' },
        { name: '1688API', val: '1' },
        { name: '淘宝', val: '2' },
        { name: '天猫', val: '3' },
        { name: '线下', val: '4' }
    ]
    $scope.typeList = [
      {label: '采购订单号', value: 'orderId'},
      {label: '供货公司', value: 'gongHuoGongSi'},
      {label: '变体SKU', value: 'cjSku'},
      {label: '商品名称', value: 'productName'},
      {label: '批次号', value: 'batchNum'}
    ]
    $scope.storeList = erp.getWarehouseType();
    $scope.pageInfo = {
        pageNum: '1',
        pageSize: '10',
        total: 0
    }
    $scope.filterObj={
      productProcessStatus:'',
      procurementType:'',
      store:''
    }
    $scope.tabList = [{ title: '分标', checked: false }, { title: '质检', checked: true }];

    $scope.switchTab = (tab, index)=>{
      if(index==0) location.href = "#/erppurchase/mark";
    }

    function getList() {
      const { pageNum, pageSize} = $scope.pageInfo;
      const beginDate = $("#startTime").val();
      const endDate =$("#endTime").val();
      const key = $scope.queryType;
      const val = $scope.searchVal;
      const params = {
        pageNum, pageSize, beginDate, endDate,
        data: {
          [key]: val,// 动态搜索内容
          productProcessStatus: $scope.filterObj.productProcessStatus,  // 2：待质检，3：已质检
          store:$scope.filterObj.store,
          procurementType:$scope.filterObj.procurementType,
          status: '3',// 固定值
        }
      }
      erp.mypost('procurement/dealWith/inspection', params).then(({list, total}) => {
        $scope.inspectedList = list;
        let totalCounts = total;
        $scope.pageData={
          pageSize,pageNum,totalCounts,//每页条数,页码,数据总条数
          pageList: ['5','10']//条数选择列表，例：['10','50','100']4
        }
      })
    }
    getList();
    $scope.handleSearch = ()=>{
      getList();
    }
    $scope.$on('pagedata-fa', function (_, {pageNum, pageSize}) {// 分页onchange
      $scope.pageInfo.pageNum = pageNum;
      $scope.pageInfo.pageSize = pageSize;
      getList()
    })
    $scope.showStatusConfirm = (e,item,index)=>{
      e.stopPropagation();
      let {status,zjBatchNum,orderId}=item;
      $scope.statusObj = {
          show:true,
          id:item.zjId,
          orderId,
          status,
          zjBatchNum,
          index
      }
  }
  $scope.statusChange = ()=>{
      let params = {
          ids:[$scope.statusObj.id],
          orderIds:[$scope.statusObj.orderId],
          status:$scope.statusObj.status,
          batchNum:[$scope.statusObj.zjBatchNum]
      }
      layer.load(2);
      erp.postFun('procurement/dealWith/inspectionChange', params,({data}) => {
          layer.closeAll();
          if(data.code==200){
              $scope.statusObj.show=false;
              getList();
          }else{
              layer.msg(data.message);
          }
          
      })
  }
  }]).filter('statusFilter',function(){
      return function(val) {
        let name;
        if(!val) return '';
        switch(+val){
          case 2:
            name='待质检';
            break;
          case 3:
            name='已质检';
            break;
          }
          return name;
        }
    })
}())