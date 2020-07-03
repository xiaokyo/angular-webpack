;(function () {
  const app = angular.module('error-1-16', []);
  const api = {
    list: 'procurement/getDingdanYiChangByPage',//post {pageSize, pageNum, createName, beginDate, endDate, orderId, type}
    detail: 'caigou/procurementOrder/queryOrderInfo',//post {onlineType: '2', orderId: ''}
    offlineItemList: 'procurement/order/queryOutlineProduct',// post { orderId: '', storageId: '1', store: ''} 
    onlineItemList: 'procurement/order/queryOnlineProduct',// post { orderId: '', storageId: '1', store: '' } 
    apply: 'procurement/applyDingdanXianxia',//post {id: '', orderId: '', gongHuoGongSi: '', store: '', caiGouLiuYan: '', thisPayMoney: '本次付款金额', bank: '', branchBank: '', accountName: '', bankAccount: '', shouHuoDiZhi: '', zhuiZongHao: ''}
    addressList: 'procurement/caigouAliaddress/list',//post {pageNum:'', pageSize: ''}
  }
  const warehouseList = window.warehousePurList.map(({value, label, id})=>({value, label, id:id[0]}))
  const markList = [// 统一采购标记
    { value: 'zhengChang', label: '正常' },
    { value: 'jiaJi', label: '加急' },
    { value: 'vip', label: 'Vip' },
    { value: 'zhiFa', label: '直发' },
    { value: 'zuZhuang', label: '组装' },
    { value: 'buRuKu', label: '不入库' },
    { value: 'usaZhiFa', label: '美国仓直发' },
    { value: 'xianXiaZu', label: '线下组' },
    { value: 'gaiBiao', label: '改标' },
  ];
  app.controller('errRefuseToPayCtrl', ['$scope', 'erp', '$q', function ($scope, erp, $q) {
    init()
    const typeList = [//线下采购类型 1-预付定金 2-先付款后发货 3-先发货后付款
      {label: '全部', value: ''},
      {label: '预付定金', value: '1'},
      {label: '先付款后发货', value: '2'},
      {label: '先发货后付款', value: '3'},
      {label: '先付尾款后发货', value: '4'},
      {label: '分批付款发货', value: '5'},
    ]
    $scope.typeList = typeList;
    $scope.handleSearch = handleSearch;
    $scope.handleEnter = handleEnter;
    $scope.retPurchaseType = retPurchaseType;
    $scope.warehouseList = warehouseList;
    $scope.markList = markList;

    function handleEnter(ev) {
      if (ev.keyCode === 13 ) {
        ev.target.blur()
        getList()
      }
    }

    function handleSearch() {
      $scope.params.startTime = $('#startTime').val()
      $scope.params.endTime = $('#endTime').val()
      getList()
    }

    function init() {
      initTabModule()
      initFilterArea()
      initPageModule()
      initApplyModule()
      initBoxModule()
      initAddressList()
    }

    function initTabModule() {
      $scope.tabArr = ['线下采购']
      $scope.tabIndex = 0;
      $scope.switchTab = switchTab;
      function switchTab(i) {
        if ($scope.tabIndex === i) return;
        $scope.tabIndex = i;
      }
    }

    function initFilterArea() {
      $scope.params = {
        startTime: '',
        endTime: '',
        orderId: '',
        createName: '',
        type: ''
      }
    }

    function initAddressList() {//先获取 需要使用的 地址列表  然后获取 主列表数据
      $scope.addressList = [];
      const url = api.addressList;
      erp.mypost(url, {pageNum: '1', pageSize: 100}).then(({list: addressList}) => {
        console.log("getAddressList -> addressList", addressList)
        $scope.addressList = addressList.map(({addressId, addressCodeText, address, townName, mobile }) => {
          return {value: addressId + '', label: `${addressCodeText} ${townName} ${address} ${mobile}`}
        });
        initListModule()// 先拿到地址 在拿主列表 点击详情后的地址 可控
      })
    }

    function initListModule() {
      $scope.list = []
      getList()
    }

    function getList() {
      const { pageSize, pageNum } = $scope.pageInfo;
      const { createName, startTime: beginDate, endTime: endDate, orderId, type} = $scope.params;
      const url = api.list;
      const params = { pageSize, pageNum, createName, beginDate, endDate, orderId, type }
      erp.mypost(url, params).then(({list, total}) => {
        $scope.list = list;
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
    

    function initApplyModule() {
      initInfo()
      function initInfo() {
        $scope.applyInfo = {} 
        $scope.applyList = [];
        $scope.applyShow = false;
      }
      $scope.showApplyInfoBox = showApplyInfoBox;
      $scope.hideApplyInfoBox = initInfo;
      $scope.submitApply = submitApply;
      function showApplyInfoBox({orderId, reason}) {
        orderId && getDetail(orderId, reason)
      }

      function getDetail(orderId, reason) {// 获取 详情 取到store 作为下方列表的参数 
        const url = api.detail;
        const params = { onlineType: '2', orderId };//post {onlineType: '2', orderId: '',}
        erp.mypost(url, params).then(({list: info}) => {
          console.log("TCL: getDetail -> info", info)
          const { store } = info;
          const warehouse = retWarehouseObj(store)
          const logisticsList = transfromLogistics(info.zhuiZongHao)
          console.log("getDetail -> logisticsList", logisticsList)
          info.logisticsList = logisticsList.length > 0 ? logisticsList : [{key: '', val: ''}]
          initLogisticsListModule()
          warehouse && (info.myWarehouse = warehouse.label);
          info.reason = reason;
          info.addressId = info.addressId + '';
          info.acceptType = info.acceptType + '';
          info.thisPayMoney = '0';
          $scope.applyInfo = info;
          getItemList(orderId, store)
        })
      }
      

      function getItemList(orderId, store) {
        if (!store) return;
        const url = api.offlineItemList;
        const warehouse = retWarehouseObj(store)
        if (!warehouse) return;
        const storageId = warehouse.id;
        const params = { orderId, store, storageId };// post {store: 0, storageId: '', orderId: ''} store 仓库标识 storageId 仓库id
        // const params = {store: '0', storageId: '{6709CCD7-0DC7-43B1-B310-17AB499E9B0A}', orderId: '200227X8965660'}
        erp.mypost(url, params).then((list) => {
          console.log("getItemList -> list", list)
          $scope.applyList = list;
          $scope.applyShow = true;
        })
      }

      function submitApply() {
        const {id, orderId, gongHuoGongSi, store, caiGouLiuYan, signRemark, thisPayMoney, frontMoney, restMoney, bank, branchBank, accountName, bankAccount, logisticsList, addressId, acceptType, payType } = $scope.applyInfo;
         
        if (payType == 1) {
          if (!frontMoney || frontMoney == 0) return layer.msg('请输入本次支付订金')
          if (!restMoney || restMoney == 0) return layer.msg('请输入剩余尾款')
        } else {
          if (!thisPayMoney || thisPayMoney == 0) return layer.msg('请输入本次支付金额')
        }
        
        let zhuiZongHao = {};
        logisticsList.forEach(({key, val}) => {
          zhuiZongHao[key] = val;
        })
        zhuiZongHao = JSON.stringify(zhuiZongHao)
        const params = {id, orderId, gongHuoGongSi, store, caiGouLiuYan, signRemark, thisPayMoney, frontMoney, restMoney, bank, branchBank, accountName, bankAccount, addressId, zhuiZongHao, acceptType, }
        console.log("params", params)
        // return 
        
        const url = api.apply;
        erp.mypost(url, params).then(() => {
          initInfo()
          getList()
        })
      }

      function initLogisticsListModule() {
        $scope.addLogistics = addLogistics;
        $scope.delLogistics = delLogistics;
        function addLogistics() {
          const list = $scope.applyInfo.logisticsList;
          const {val, key} = list[list.length - 1]
          if (!val || !key) return layer.msg('请填写完上一条再新增')
          $scope.applyInfo.logisticsList.push({key:'', val: ''})
        }
        function delLogistics(i) {
          $scope.applyInfo.logisticsList.splice(i, 1)
        }
      }
    }

    function initBoxModule() {
      /** 查看拒绝理由 start */
      initReasonBox()
      $scope.showReasonBox = checkReason;
      $scope.hideReasonBox = initReasonBox;
      function initReasonBox() {
        $scope.reasonBox = { show: false, reason: '' }
      }
      function checkReason({reason}) {
        $scope.reasonBox = { show: true, reason }
      }
      /** 查看拒绝理由 end */
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

    /**公共方法区域 */

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
        1: '预付订金',
        2: '先付款后发货',
        3: '先发货后付款',
      }
      return payTypeObj[key];
    }
    function transfromLogistics(obj) {//追踪号 物流转化
      if (!obj) return [];
      obj = JsonPares(obj);
      let arr = [];
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          const val = obj[key];
          arr.push({key, val});
        }
      }
      return arr;
    }
  }])
})();