; (function () {
  const app = angular.module('offline_payment-1-31', []);
  app.controller('paymentOfflinePurchaseCtrl', ['$scope', 'erp', '$q', '$timeout', 'merchan', function ($scope, erp, $q, $timeout,merchan) {
    const api = {
      list: 'procurement/caigouPayment/list',// post {caigouPaymentType: '1 待打款 2 已打款 3 已拒绝', pageNum: '', pageSize: '', caigouOrderid: '产品订单号', caigouStaff: '申请人'}
      detail: 'caigou/procurementOrder/queryOrderInfo',//打款 已打款 已拒绝详情 post { orderId: '', onlineType }
      itemList_old: 'caigou/procurementOrder/queryOutlineProduct',// 打款 已打款 已拒绝列表 post {store: '', storageId: '', orderId: ''}
      itemList: 'procurement/order/queryOutlineProduct',// 打款 已打款 已拒绝列表 post {store: '', storageId: '', orderId: ''}
      refuse: 'procurement/caigouPayment/update',// post {id: '', caigouPaymentType: '3', denialReason: '拒绝原因'}
      pay: 'procurement/caigouPayment/pay',// post {id: '列表项 id', caigouPaymentType: '2', actualPayAmount: '实际支付金额', actualPayType: '支付类型', actualPayDate: '支付时间', actualPayProof: '支付凭证'}
      exportExcel: 'procurement/caigouPayment/export',// post {caigouOrderid: '', caigouStaff: '', caigouPaymentType: ''} 打款状态 （1-待打款 ，2-已打款 ， 3-已拒绝）
    }
    
    $scope.retPayType = retPayType;
    $scope.retPurchaseType = retPurchaseType;
    $scope.retPayName = retPayName;
    $scope.payMethodList = erp.retPayMethodList();//{ payType:'1', payName:'支付宝', payObject:'涂宏名', payBank:'', payAccount:'15000616778' }
    $scope.handleOssImg = erp.handleOssImg;
    $scope.handleSearch = function(){ $scope.pageInfo.pageNum = '1'; getList()};
    $scope.handleEnter = handleEnter;
    $scope.exportExcel = exportExcel;

    function handleEnter(ev) {
      if (ev.keyCode === 13 ) {
        ev.target.blur()
        $scope.handleSearch()
      }
    }

    function exportExcel() {
      const url = api.exportExcel;
      const caigouPaymentType = $scope.tabIndex + 1;
      const {caigouStaff, caigouOrderid} = $scope.filterParams;
      const params = {caigouStaff, caigouOrderid, caigouPaymentType}
      console.log("exportExcel -> params", params)
      erp.postFun(url, params, function({data: blob}) {
        try {
          // cjUtils.exportFile(blob, `test.xls`)
          handleBlobToDownloadExcel(blob, 'text')
        } catch (err) {
          layer.msg('导出失败')
          console.log("exportExcel -> err", err)
        }
      }, function() {
        layer.msg('请求失败')
      }, {responseType: 'blob', layer: true})
    }

    const dateDom = document.getElementById('time');
    init()
    function init() {
      initFilterArea()
      initTabModule()
      initPageModule()
      initListModule()
      initBoxModule()
      initDetailModule()
      initPaymentModule()
    }
    

    function initFilterArea() {
      $scope.filterParams = {
        caigouStaff: '',
        caigouOrderid: '',
      }
    }

    function initTabModule() {
      $scope.filterParams = {
        caigouStaff: '',
        caigouOrderid: '',
      }
      $scope.tabArr = ['待打款', '已打款', '已拒绝']
      $scope.tabIndex = 0;
      $scope.switchTab = switchTab;
      function switchTab(i) {
        if ($scope.tabIndex === i) return;
        initFilterArea()
        $scope.tabIndex = i;
        getList()
      }
    }

    function initBoxModule() {//初始化盒子弹框操作
      /** 操作拒绝界面 start */
      $scope.showRefuseBox = showRefuseBox;
      $scope.hideRefuseBox = initRefuseBox;
      $scope.refuse = refuse;
      initRefuseBox()
      function initRefuseBox() {
        $scope.refuseBox = { show: false, reason: '', id: '' }
      }
      function showRefuseBox ({id}) {
        $scope.refuseBox = { show: true, reason: '', id }
      }
      function refuse() {
        const url = api.refuse;//{id: '', caigouPaymentType: '3', denialReason: '拒绝原因'}
        const { id, reason: denialReason } = $scope.refuseBox;
        console.log("refuse -> $scope.refuseBox", $scope.refuseBox)
        if (!id) return myMsg('id is not found');
        if (!denialReason) return myMsg('请输入拒绝理由');
        erp.mypost(url, {id, denialReason, caigouPaymentType: '3'}).then(res => {
          console.log("refuse -> res", res)
          initRefuseBox()
          getList()
        })
      }
      /** 操作拒绝界面 end */
      
      /** 查看拒绝理由 start */
      initReasonBox()
      $scope.showReasonBox = checkReason;
      $scope.hideReasonBox = initReasonBox;
      function initReasonBox() {
        $scope.reasonBox = { show: false, reason: '' }
      }
      function checkReason({denialReason: reason}) {
        $scope.reasonBox = { show: true, reason }
      }
      /** 查看拒绝理由 end */
    }

    function initPageModule() {
      $scope.pageInfo = {
        pageNum: '1',
        pageSize: '10',
        totalNum: 0,
      };
      initPageChange()
    }

    function initListModule() {
      $scope.list = [];
      getList()
    }
    function getList() {
      const { pageSize, pageNum } = $scope.pageInfo; 
      const {caigouOrderid, caigouStaff } = $scope.filterParams;
      const url = api.list;
      const caigouPaymentType = $scope.tabIndex + 1 + '';
      erp.mypost(url, {caigouPaymentType, caigouStaff, caigouOrderid, pageSize, pageNum}).then(({list, total}) => {
        console.log("getList -> list", total, list)
        $scope.list = list.map(item => {
          item.time = item.applicationDate ? item.applicationDate.slice(0, 10): '';
          return item;
        })
        $scope.pageInfo.totalNum = total;
        initPage()
      })
      
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
        pageList: ['5', '10']//条数选择列表，例：['10','50','100']
      })
    }
    function initPageChange() {
      $scope.$on('pagedata-fa', function (_, { pageNum, pageSize }) {// 分页onchange
        $scope.pageInfo.pageNum = pageNum;
        $scope.pageInfo.pageSize = pageSize;
        getList()
      })
      initPageChange = function() {}
    }
    /* page 区域 end */


    /* 详情 区域 start */
    function initDetailModule() {
      initPayedDetail()
      initRefusedDetail()
      $scope.showDetail = function(item) {
        $scope.certPic = []
        const tabIndex = $scope.tabIndex;
        tabIndex === 1 && showPayedDetail(item)
        tabIndex === 2 && showRefusedDetail(item)
      }
      $scope.hidePayedDetail = initPayedDetail;
      $scope.hideRefusedDetail = initRefusedDetail;
      function showPayedDetail({caigouOrderid: orderId, actualPayAmount, actualPayDate, actualPayProof, caigouType, payType, actualPayType, actualPayObject, actualPayAccount}) { // caigouType 1,2,3 决定 采购类型 显示详情 类型  payType 1,2,3 决定 本次支付类型 定金  全款 尾款
        if (!orderId) return layer.msg('orderId 不存在')
        $scope.payedDetailShow = true;
        console.log("TCL: showPayedDetail -> $scope.tabIndex", $scope.tabIndex)
        const url = api.detail;
        const onlineType = '2';
        erp.mypost(url, {orderId, onlineType}).then(({list: info}) => {
          const {store} = info || {};
          if (!store) layer.msg('store is not found');
          const warehouse = retWarehouseObj(store) || {}
          info.myWarehouse = warehouse.label;
          info.storageId = warehouse.id;
          info.myPurchaseType = retPurchaseType(caigouType)
          $scope.payedDetailInfo = {...info, actualPayAmount, actualPayDate, actualPayProof, caigouType, payType, actualPayType, actualPayObject, actualPayAccount };
          getItemList($scope.payedDetailInfo)
          setCertPic($scope.payedDetailInfo)
        })
      }
      function showRefusedDetail({caigouOrderid: orderId, actualPayType, caigouType, payType, denialReason: refuseReason}) {
        if (!orderId) return layer.msg('orderId 不存在')
        $scope.refusedDetailShow = true;
        const url = api.detail;
        const onlineType = '2';
        erp.mypost(url, {orderId, onlineType}).then(({list: info}) => {
          const {store} = info || {};
          if (!store) layer.msg('store is not found');
          const warehouse = retWarehouseObj(store) || {}
          info.myWarehouse = warehouse.label;
          info.storageId = warehouse.id;
          info.myPurchaseType = retPurchaseType(caigouType)
          $scope.refusedDetailInfo = {...info, actualPayType, payType, caigouType, refuseReason};
          getItemList($scope.refusedDetailInfo)
          setCertPic($scope.refusedDetailInfo)
        })
      }
      function getItemList({orderId, store, storageId}) {
        if (!storageId) return layer.msg('storageId is not found');
        const url = api.itemList;
        const params = { orderId, store, storageId };// post {store: 0, storageId: '', orderId: ''} store 仓库标识 storageId 仓库id
        erp.mypost(url, params).then((list) => {
          const tabIndex = $scope.tabIndex;
          tabIndex === 1 && ($scope.payedDetailList = list)
          tabIndex === 2 && ($scope.refusedDetailList = list)
        })
      }
      function initPayedDetail() {
        $scope.payedDetailShow = false;
        $scope.payedDetailInfo = {}
        $scope.payedDetailList = []
      }
      function initRefusedDetail() {
        $scope.refusedDetailShow = false;
        $scope.refusedDetailInfo = {}
        $scope.refusedDetailList = []
      }
      
    }
    /* 详情 区域 end */


    function initPaymentModule() {
      /** 操作打款界面 start */
      $scope.showPayBox = showPayBox;
      $scope.hidePayBox = initPayBox;
      $scope.pay = pay;
      initPayBox()
      function initPayBox() {
        $scope.selectedIndex = '0';
        $scope.payBox = { show: false, payType: 0, money: '', img: '' };// payType 1 : '定金', 2: '全款', 3: '尾款',
        $scope.payBoxList = [];
        $scope.payBoxInfo = {};
      }
      function showPayBox({payType, caigouOrderid: orderId, caigouType, payAmount, id: itemId}) {// payType 1 : '定金', 2: '全款', 3: '尾款',
        
        const url = api.detail;
        const onlineType = '2';
        erp.mypost(url, {orderId, onlineType}).then(({list: info}) => {
          const {store} = info || {};
          if (!store) return layer.msg('仓库字段 不存在');//store is not found
          const warehouse = retWarehouseObj(store) || {}
          info.myWarehouse = warehouse.label;
          info.storageId = warehouse.id;
          info.myPurchaseType = retPurchaseType(caigouType)
          $scope.payBox.money = payAmount || 0;
          $scope.payBoxInfo = {...info, payAmount, payType, itemId, caigouType};
          setCertPic($scope.payBoxInfo)
          getItemList()
          console.log("showPayBox -> $scope.payBoxInfo", $scope.payBoxInfo)
        })
        function getItemList() {
          const {orderId, store, storageId} = $scope.payBoxInfo;
          if (!store || !storageId) return layer.msg('store or storageId is not found');
          const url = api.itemList;
          const params = { orderId, store, storageId };// post {store: 0, storageId: '', orderId: ''} store 仓库标识 storageId 仓库id
          erp.mypost(url, params).then((list) => {
            console.log("getItemList -> list", list)
            $scope.payBoxList = list;
            $scope.payBox = { show: true, payType };
          })
        }
      }
      function pay() {//{id: '列表项 id', caigouPaymentType: '2', actualPayAmount: '实际支付金额', actualPayType: '支付类型', actualPayObject: '', actualPayAccount: '', actualPayDate: '支付时间', actualPayProof: '支付凭证'}
        
        const selectedIndex = $scope.selectedIndex;
        const selectItem = $scope.payMethodList[selectedIndex];
        const {payType: actualPayType, payObject: actualPayObject, payAccount: actualPayAccount} = selectItem;
        const url = api.pay;
        const actualPayDate = dateDom.value;
        const { itemId: id, payAmount } = $scope.payBoxInfo;
        const {money, img: actualPayProof} = $scope.payBox;
        const actualPayAmount = money || payAmount || 0;
        const params = {id, caigouPaymentType: '2', actualPayAmount, actualPayType, actualPayObject, actualPayAccount, actualPayDate, actualPayProof}
        console.log("pay -> params", params)
        if (!actualPayProof) return layer.msg('请上传支付凭证')
        if (!actualPayDate) return layer.msg('请选择支付时间')
        // return 
        erp.mypost(url, params).then(bol => {// {data: boolean} 支付 失败/成功
          if (!bol) return layer.msg('支付失败')
          initPayBox()
          getList()
          layer.msg('支付成功')
        })
      }
      /** 操作打款界面 end */
      $scope.uploadImg = uploadImg;

      // 上传组件的回调
      function uploadFilesCallback({ pics }) {
        console.log('uploadFilesCallback', pics)
        $scope.payBox.img = pics[0]
     }
     $scope.uploadFilesCallback = uploadFilesCallback
    }

    /** common fn area */
    function uploadImg() {
      cjUtils.readLocalFile({}).then(res => {
      console.log("TCL: uploadImg -> res", res)
        res.FileArr.forEach(({ file }) => {// output url for preview by base64=> json.base64
          console.log('uploadImg --------->  ', file);
          const { type, size } = file;
          if (/(png|jpe?g)$/.test(type) === false) return myMsg('上传文件仅支持jpg或png格式');
          if (Math.ceil(size / (1024 * 1024) > 10)) return myMsg('上传文件不能超过10m');
          erp.load()
          const isOnline = window.environment.includes('production');
          const ossUrl = isOnline ? 'https://app.cjdropshipping.com/app/oss/policy' : 'http://erp.test.com/app/oss/policy';
          cjUtils.uploadFileToOSS({ file, signatureURL: ossUrl })
            .then(url => {//async url for saving =>
              $timeout(function () { $scope.payBox.img = url; }, 0)
              myMsg('图片上传成功')
              erp.closeLoad();
            })
            .catch(err => {
              console.log('uploadImg err => ', err)
              $timeout(function () { $scope.payBox.img = ''; }, 0)
              myMsg('图片上传失败')
              erp.closeLoad();
            })
        })
      })
    }

    // 采购凭证
    $scope.certPic = []
    function setCertPic(orderInfo){
      $scope.certPic = []
      const proofImg = orderInfo.proofImg
      if(!proofImg) return
      const certPic = proofImg.split(',')
      $scope.certPic = certPic
    }

    $scope.previewPic = function (src) {// 预览凭证
			merchan.previewPicTwo(src);
		}

    function myMsg(str) {
      str && layer.msg(str)
    }

    function retWarehouseObj(store, key='value') {//仓库列表 查找某一项项
      const warehouseList = window.warehousePurList.map(({value, label, id})=>({value, label, id:id[0]}))
      return warehouseList.find(item => item[key] == store);
    }
    function retPayType(key,item) {// 本次支付类型
      if (!key) return '';
      const purchaseTypeObj = {
        1: '订金',
        2: '全款',
        3: '尾款',
        4: '批次付款'
      }
      let pici = ''
      if(item && key == 4) pici = '（第' + item.batchNo + '批）'
      return purchaseTypeObj[key] + pici;
    }
    function retPurchaseType(key) {// 线下采购类型
      if (!key) return '';
      const payTypeObj = {
        1: '预付订金',
        2: '先付款后发货',
        3: '先发货后付款',
        4: '先付尾款后发货',
        5: '分批付款发货'
      }
      return payTypeObj[key];
    }
    function retPayName(key) {//后端 字段约定 
      const obj = {
        1: '支付宝',
        2: '微信',
        3: '银联',
      }
      return obj[key];
    }
    function handleBlobToDownloadExcel(data, filename) {// data blob对象
      const blob = new Blob([data])
      let a = document.createElement('a');
      a.download = `${filename}.xls`;
      a.href = URL.createObjectURL(blob);
      a.click();
      URL.revokeObjectURL(a.href);
      a = null;
    }
  }])
}())

/**
 * 页面集成 待打款 已打款 已拒绝
 * const payInfo = {
    '供货公司': '123',
    '收货仓库': '123',
    '线下采购方式': '123',
    '本次支付类型': '123',
    '本次支付金额': '123',
    '采购员': '123',
    '质检员': '3',
    '收款银行': '123',
    '收款银行支行': '123',
    '收款账户名称': '123',
    '银行账号': '123',
  }
  const payList = {
    '图片': '123',
    'SKU': '123',
    '今日订单统计数量': '123',
    '可用库存数量': '123',
    '建议采购数量': '123',
    '搜品价格(¥)': '123',
    '采购数量': '123',
    '到货数量': '3',
    '次品数量': '3',
  }

  const payedInfo = {
    '供货公司': '123',
    '收货仓库': '123',
    '线下采购方式': '123',
    '本次支付类型': '123',
    '本次支付金额': '123',
    '剩余尾款(¥)': '1',
    '采购员': '123',
    '质检员': '3',
    '收款银行': '123',
    '收款银行支行': '123',
    '收款账户名称': '123',
    '银行账号': '123',
  }
  const payedList = {
    '图片': '123',
    'SKU': '123',
    '今日订单统计数量': '123',
    '可用库存数量': '123',
    '建议采购数量': '123',
    '搜品价格(¥)': '123',
    '采购数量': '123',
    '到货数量': '3',
    '次品数量': '3',
  }
  const refusedInfo = {
    '供货公司': '123',
    '收货仓库': '123',
    '线下采购方式': '123',
    '本次支付类型': '123',
    '本次支付金额': '123',
    '剩余尾款(¥)': '1',
    '采购员': '123',
    '质检员': '3',
    '收款银行': '123',
    '收款银行支行': '123',
    '收款账户名称': '123',
    '银行账号': '123',
  }
  const refusedList = {
    '图片': '123',
    'SKU': '123',
    '今日订单统计数量': '123',
    '可用库存数量': '123',
    '建议采购数量': '123',
    '搜品价格(¥)': '123',
    '采购数量': '123',
    '到货数量': '3',
    '次品数量': '3',
  }
 */