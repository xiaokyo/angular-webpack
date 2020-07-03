;(function () {
  const app = angular.module('error-1-14', []);
  
  app.controller('errRefundCtrl', ['$scope', 'erp', '$q', function ($scope, erp, $q) {
    const api = {
      list: 'procurement/getOrderRefundByPage',//post { pageSize, pageNum, createName, beginDate, endDate, orderId, type } type 0 标识1688非API 1标识1688API 2标识淘宝3标识天猫 4.下线采购。 4 个 tab  就是  '2,3'  '4'  '0'  '1'
      itemDetail: 'procurement/getOrderDetailByOrderId',// post { orderId: '', type: '1' } type 1 线下
      offlineItemList: 'procurement/order/queryOutlineProduct',// post { orderId: '', storageId: '1', store: ''} 
      onlineItemList: 'procurement/order/queryOnlineProduct',// post { orderId: '', storageId: '1', store: '' } 
    }
    $scope.retPurchaseType = retPurchaseType;
    $scope.handleSearch = getList;

    init()

    function init() {
      initTabModule()
      initFilterArea()
      initPageModule()
      initListModule()
      initDetailModule()
    }
    
    function initTabModule() {
      $scope.tabArr = ['淘宝/天猫', '线下采购', '1688非API', '1688API']
      $scope.tabIndex = 0;
      $scope.switchTab = switchTab;
      function switchTab(i) {
        if ($scope.tabIndex === i) return;
        initFilterArea()
        $scope.tabIndex = i;
        getList()
      }
    }

    function initFilterArea() {
      $scope.params = {
        createName: '',//创建人
        orderId: ''//订单号
      }
    }
    


    function initListModule() {
      $scope.list = []
      getList()
      
    }

    function getList() {
      const { pageSize, pageNum } = $scope.pageInfo;
      const { createName, orderId } = $scope.params;
      const beginDate = $('#startTime').val()
      const endDate = $('#endTime').val();
      
      const typeObj = { // 
        0: '2,3', // 2 淘宝  3 天猫
        1: "'4'",// 线下
        2: '0',//1688 非api
        3: '1',// 1688api
      }
      const type = typeObj[$scope.tabIndex];
      const url = api.list;
      const params = { pageSize, pageNum, createName, beginDate, endDate, orderId, type }
      erp.mypost(url, params).then(({list, total}) => {
        $scope.list = list.map(item => {
          item.waybill = transfromWaybill(item.zhuiZongHao);
          return item;
        });
        console.log("TCL: getList -> $scope.list", $scope.list)
        $scope.pageInfo.totalNum = total;
        initPage()
      })
    }


    function initPageModule() {
      $scope.pageInfo = {
        pageNum: '1',
        pageSize: '10',
        totalNum: 0,
      };
      initPageChange()
    }
    

    /* page 区域 start */
    function initPage() {
      const { totalNum = 0, pageSize, pageNum } = $scope.pageInfo;
      const pages = Math.ceil(totalNum / pageSize);
      $scope.$broadcast('page-data', {
        pageSize: pageSize,//每页条数
        pageNum: pageNum,//页码
        totalNum: pages,//总页数
        totalCounts: totalNum,//数据总条数
        pageList: ['5','10']//条数选择列表，例：['10','50','100']
      })
    }
    function initPageChange() {
      $scope.$on('pagedata-fa', function (_, {pageNum, pageSize}) {// 分页onchange
        $scope.pageInfo.pageNum = pageNum;
        $scope.pageInfo.pageSize = pageSize;
        getList()
      })
      initPageChange = function() {}
    }
    /* page 区域 end */

    /* 详情 区域 end */
    function initDetailModule() {
      $scope.onlineDetailShow = false;      
      $scope.onlineDetailList = [];
      $scope.onlineDetail = {}
      $scope.offlineDetailShow = false;
      $scope.offlineDetailList = []
      $scope.offlineDetail = {} 

      $scope.showDetail = showDetail;
      $scope.hideDetail = hideDetail;

      function showDetail({orderId}) {
        $scope[$scope.tabIndex === 1 ? 'offlineDetailShow' : 'onlineDetailShow'] = true;
        orderId && getItemDetail(orderId)
      }

      function hideDetail() {
        $scope[$scope.tabIndex === 1 ? 'offlineDetailShow' : 'onlineDetailShow'] = false;
      }

      function getItemDetail(orderId) {
        const url = api.itemDetail;
        const type = $scope.tabIndex == 1 ? '1' : '2';// type=1为线下 ,type=2 为其他详情页面
        const params = { orderId, type };// { orderId: ''} 
        erp.mypost(url, params).then(({orderInfo = {}}) => {
          console.log("TCL: orderInfo", orderInfo)
          const { store } = orderInfo;
          // orderInfo.logisticsList = transfromLogistics(orderInfo. )
          console.log("TCL: getItemDetail -> orderInfo.logisticsList", orderInfo.logisticsList)
          const myWarehouse = retWarehouseObj(store)
          myWarehouse && (orderInfo.myWarehouse = myWarehouse.label);
          $scope[$scope.tabIndex === 1 ? 'offlineDetail' : 'onlineDetail'] = orderInfo;
          getItemList(orderId, store)
          
        })
      }
      
      function getItemList(orderId, store) {
        if (!store) return;
        const url = $scope.tabIndex == 1 ? api.offlineItemList : api.onlineItemList;// 1 线下采购 其他 为 线上 
        const warehouse = retWarehouseObj(store)
        if (!warehouse) return;
        const storageId = warehouse.id;
        const params = { orderId, store, storageId };// post {store: 0, storageId: '', orderId: ''} store 仓库标识 storageId 仓库id
        // const params = {store: '0', storageId: '{6709CCD7-0DC7-43B1-B310-17AB499E9B0A}', orderId: '200227X8965660'}
        erp.mypost(url, params).then((list) => {
          console.log("TCL: getItemList -> list", list)
          $scope[$scope.tabIndex === 1 ? 'offlineDetailList' : 'onlineDetailList'] = list;
          
        })
      }
      
      
    }
    /* 详情 区域 end */
    function transfromLogistics(obj) {//物流转化
      if (!obj) return [];
      obj = JsonPares(obj);
      let arr = [];
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          const val = obj[key];
          arr.push([key, val]);
        }
      }
      return arr;
    }
    function transfromWaybill(obj) {
      if (!obj) return [];
      obj = JsonPares(obj);
      let arr = [];
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          const val = obj[key];
          arr.push(`${val}: ${key}`);
        }
      }
      return arr;
    }
    function JsonPares(val) {//基于 全局 JSON parse重写 基础上 
      const newVal = JSON.parse(val);
      if (val === null) return val;
      if (typeof newVal !== 'object') return val;
      if (newVal.error) return val;
      return newVal;
    }
    function retWarehouseObj(store, key='value') {//仓库列表 查找某一项项
      const warehouseList = window.warehousePurList.map(({value, label, id})=>({value, label, id:id[0]}))
      return warehouseList.find(item => item[key] == store);
    }
    function retPurchaseType(key) {// 线下采购类型
      if (!key) return '';
      const payTypeObj = {
        1: '预付订金后发货',
        2: '先付款后发货',
        3: '先发货后付款',
      }
      return payTypeObj[key];
    }
    function retTab() {
      
    }
  }])
})();